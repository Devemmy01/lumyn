import connectDB from "@/lib/mongodb";
import AcademyStudent from "@/models/AcademyStudent";

export const XP_REWARDS = {
  lesson: 50,
  quiz: 100,
  assignment: 150,
  module: 300,
  finalProject: 350,
  certificate: 500,
} as const;

export type AcademyXpReason = keyof typeof XP_REWARDS;

export const XP_PER_LEVEL = 500;

export function levelForXp(xpTotal: number) {
  return Math.floor(Math.max(0, xpTotal) / XP_PER_LEVEL) + 1;
}

export function xpIntoCurrentLevel(xpTotal: number) {
  return Math.max(0, xpTotal) % XP_PER_LEVEL;
}

export type AcademyBadgeId =
  | "streak_7"
  | "streak_30"
  | "first_certificate"
  | "first_course_completed"
  | "quiz_perfectionist"
  | "polyglot";

export const ACADEMY_BADGES: Record<AcademyBadgeId, { name: string; description: string }> = {
  streak_7: { name: "Week Streak", description: "Learned 7 days in a row." },
  streak_30: { name: "Month Streak", description: "Learned 30 days in a row." },
  first_certificate: { name: "First Certificate", description: "Unlocked your first certificate." },
  first_course_completed: { name: "Course Complete", description: "Completed your first course." },
  quiz_perfectionist: { name: "Perfectionist", description: "Scored 100% on a module quiz." },
  polyglot: { name: "Polyglot", description: "Enrolled in courses across 2 or more languages." },
};

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

function daysBetween(laterKey: string, earlierKey: string) {
  const diff = Date.parse(`${laterKey}T00:00:00Z`) - Date.parse(`${earlierKey}T00:00:00Z`);
  return Math.round(diff / 86_400_000);
}

/** Awards XP for a single activity transition. Safe to call with amount 0 (no-op). */
export async function awardXp(studentUid: string, reason: AcademyXpReason) {
  const amount = XP_REWARDS[reason];
  if (!amount) return null;
  await connectDB();
  return AcademyStudent.findOneAndUpdate(
    { firebaseUid: studentUid },
    { $inc: { "gamification.xpTotal": amount } },
    { new: true, runValidators: true },
  );
}

/**
 * Marks today as an active learning day and updates the streak. A no-op if
 * today was already recorded. Streak days are UTC calendar days. Returns
 * whether the streak actually advanced today and whether that advance newly
 * earned a streak badge (as opposed to maintaining an already-earned one),
 * so callers can decide whether to surface a celebration to the student.
 */
export async function recordActivity(studentUid: string) {
  await connectDB();
  const student = await AcademyStudent.findOne({ firebaseUid: studentUid });
  if (!student) {
    return { student: null, streakIncreased: false, streakCurrent: 0, newBadgeId: null as AcademyBadgeId | null };
  }

  const today = dateKey(new Date());
  const activeDates = student.gamification?.activeDates ?? [];
  if (activeDates.includes(today)) {
    return {
      student,
      streakIncreased: false,
      streakCurrent: student.gamification?.streakCurrent ?? 0,
      newBadgeId: null as AcademyBadgeId | null,
    };
  }

  const lastActive = activeDates[activeDates.length - 1];
  const isConsecutive = Boolean(lastActive) && daysBetween(today, lastActive) === 1;
  const nextCurrent = isConsecutive ? (student.gamification?.streakCurrent ?? 0) + 1 : 1;
  const nextLongest = Math.max(student.gamification?.streakLongest ?? 0, nextCurrent);

  student.gamification.activeDates = [...activeDates, today].slice(-400);
  student.gamification.streakCurrent = nextCurrent;
  student.gamification.streakLongest = nextLongest;
  student.markModified("gamification");
  await student.save();

  let newBadgeId: AcademyBadgeId | null = null;
  if (nextCurrent >= 30) {
    if ((await awardBadge(studentUid, "streak_30")).awarded) newBadgeId = "streak_30";
  } else if (nextCurrent >= 7) {
    if ((await awardBadge(studentUid, "streak_7")).awarded) newBadgeId = "streak_7";
  }

  return { student, streakIncreased: true, streakCurrent: nextCurrent, newBadgeId };
}

/**
 * Awards a badge if the student doesn't already have it. Returns whether the
 * badge was newly awarded by this call, so callers can decide whether to
 * surface a badge celebration to the student (repeat awards are a no-op).
 */
export async function awardBadge(studentUid: string, badgeId: AcademyBadgeId, contextSlug?: string) {
  await connectDB();
  const student = await AcademyStudent.findOne({ firebaseUid: studentUid });
  if (!student) return { student: null, awarded: false };
  const alreadyEarned = (student.gamification?.badges ?? []).some((badge) => badge.badgeId === badgeId);
  if (alreadyEarned) return { student, awarded: false };

  student.gamification.badges.push({ badgeId, earnedAt: new Date().toISOString(), contextSlug });
  student.markModified("gamification");
  await student.save();
  return { student, awarded: true };
}
