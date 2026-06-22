import { lumynEmailLayout, sendLumynEmail } from "@/lib/resend";

type AcademyEmailEvent =
  | "welcome"
  | "course_generated"
  | "assignment_reminder"
  | "quiz_completion"
  | "certificate_issued"
  | "mentorship_application_received"
  | "mentorship_payment_confirmation"
  | "admin_notification";

const copy: Record<AcademyEmailEvent, { subject: string; title: string; intro: string }> = {
  welcome: {
    subject: "Welcome to Lumyn Academy",
    title: "Welcome to Lumyn Academy",
    intro: "Your student account is ready. You can now continue into your academy dashboard.",
  },
  course_generated: {
    subject: "Your Lumyn Academy course is ready",
    title: "Your learning path is ready",
    intro: "Your AI-generated course has been created and saved to your dashboard.",
  },
  assignment_reminder: {
    subject: "Lumyn Academy assignment reminder",
    title: "You have an assignment waiting",
    intro: "A practical assignment is ready for review inside your learning path.",
  },
  quiz_completion: {
    subject: "Lumyn Academy quiz completed",
    title: "Quiz progress recorded",
    intro: "Your quiz completion has been saved to your learning dashboard.",
  },
  certificate_issued: {
    subject: "Your Lumyn Academy certificate is ready",
    title: "Certificate issued",
    intro: "Your course completion has been approved and your certificate is ready.",
  },
  mentorship_application_received: {
    subject: "Mentorship application received",
    title: "Your mentorship application is in",
    intro: "Lumyn has received your mentorship application and will review it for the next available cohort.",
  },
  mentorship_payment_confirmation: {
    subject: "Mentorship payment confirmed",
    title: "Mentorship access confirmed",
    intro: "Your guided mentorship plan is active. Your roadmap and session details will follow.",
  },
  admin_notification: {
    subject: "New Lumyn Academy activity",
    title: "Academy admin notification",
    intro: "There is new activity inside Lumyn Academy that needs admin review.",
  },
};

export async function sendAcademyEmail({
  event,
  to,
  details,
  ctaHref,
}: {
  event: AcademyEmailEvent;
  to: string | string[];
  details?: string;
  ctaHref?: string;
}) {
  const item = copy[event];

  return sendLumynEmail({
    to,
    subject: item.subject,
    html: lumynEmailLayout({
      title: item.title,
      intro: item.intro,
      body: details ? `<p>${details}</p>` : "<p>Open your dashboard to continue.</p>",
      ctaLabel: "Open Academy",
      ctaHref: ctaHref ?? `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio"}/academy/dashboard`,
    }),
    text: `${item.intro}\n\n${details ?? "Open your dashboard to continue."}`,
  });
}

export async function notifyAcademyAdmin(details: string) {
  const adminEmail = process.env.LUMYN_ADMIN_EMAIL;

  if (!adminEmail) {
    return { skipped: true, reason: "LUMYN_ADMIN_EMAIL is not configured" };
  }

  return sendAcademyEmail({
    event: "admin_notification",
    to: adminEmail,
    details,
    ctaHref: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio"}/admin/academy`,
  });
}
