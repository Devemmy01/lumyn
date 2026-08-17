import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import {
  academyLanguages,
  academyLevelLabels,
  SUPPORTED_ACADEMY_LEVELS,
  ensureInSystemFinalProject,
  ensureModulePractice,
  ensureModuleQuizQuestions,
  type AcademyLanguageId,
  type AcademyLevel,
  type GeneratedCourse,
} from "@/lib/academy";
import { attachYouTubeVideos } from "@/lib/youtube";
import connectDB from "@/lib/mongodb";
import AcademyCatalogCourse from "@/models/AcademyCatalogCourse";
import { pythonBeginnerCourse } from "./content/python/beginner";
import { pythonIntermediateCourse } from "./content/python/intermediate";
import { pythonAdvancedCourse } from "./content/python/advanced";

const GENERATION_LABEL = "hand-authored";

// Hand-authored course content, keyed by "<language>-<level>" slug. Add an
// entry here as each new track is written; combinations without an entry
// are simply skipped (and remain "coming soon" in the catalog).
const CONTENT_REGISTRY: Partial<Record<string, GeneratedCourse>> = {
  "python-beginner": pythonBeginnerCourse,
  "python-intermediate": pythonIntermediateCourse,
  "python-advanced": pythonAdvancedCourse,
};

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) continue;
    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
}

function parseArgs() {
  const args = new Map<string, string>();
  for (const arg of process.argv.slice(2)) {
    const match = arg.match(/^--([a-zA-Z-]+)(?:=(.*))?$/);
    if (match) args.set(match[1], match[2] ?? "true");
  }
  return args;
}

function slugFor(language: AcademyLanguageId, level: AcademyLevel) {
  return `${language}-${level}`;
}

/**
 * Applies the same content-quality guards the old AI-generation pipeline
 * used (in-system-only project work, non-vague practice text, deduped
 * technical quiz questions) and stamps placeholder completionStatus values
 * — those are always overwritten per-student at hydration time
 * (lib/academy-catalog.ts) and are never read directly off catalog content.
 */
function normalizeCourse(course: GeneratedCourse): GeneratedCourse {
  const withFinalProject = ensureInSystemFinalProject(course);
  return {
    ...withFinalProject,
    modules: withFinalProject.modules.map((module, moduleIndex) => {
      const lessons = module.lessons.map((lesson, lessonIndex) => ({
        ...lesson,
        completionStatus:
          moduleIndex === 0 && lessonIndex === 0 ? ("in_progress" as const) : ("not_started" as const),
      }));
      const practice = ensureModulePractice({ ...module, lessons });
      const questions = ensureModuleQuizQuestions({ ...module, lessons });
      return {
        ...module,
        ...practice,
        lessons,
        quiz: { title: module.quiz.title, questions },
        completionStatus: moduleIndex === 0 ? ("in_progress" as const) : ("locked" as const),
      };
    }),
  };
}

async function seedOne(slug: string, language: AcademyLanguageId, languageLabel: string, level: AcademyLevel) {
  const content = CONTENT_REGISTRY[slug];
  const levelLabel = academyLevelLabels[level];
  if (!content) {
    console.log(`  · no hand-authored content yet for ${languageLabel} / ${levelLabel} (${slug}), skipping`);
    return;
  }

  console.log(`\n▶ Seeding ${languageLabel} / ${levelLabel} (${slug})`);
  const normalized = normalizeCourse(content);

  console.log("  · enriching lessons with YouTube videos...");
  await attachYouTubeVideos(normalized, { force: true });

  const existing = await AcademyCatalogCourse.findOne({ slug });
  const contentVersion = existing ? existing.contentVersion + 1 : 1;

  await AcademyCatalogCourse.findOneAndUpdate(
    { slug },
    {
      $set: {
        slug,
        language,
        level,
        content: normalized,
        contentVersion,
        generationModel: GENERATION_LABEL,
        generatedAt: new Date(),
        status: "draft",
      },
      $setOnInsert: { order: 0, enrollmentCount: existing ? undefined : 0 },
    },
    { upsert: true, new: true },
  );

  console.log(
    `  ✓ Saved "${normalized.courseTitle}" as draft (v${contentVersion}, ${normalized.modules.length} modules).`,
  );
}

async function main() {
  loadEnvLocal();

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set. Add it to .env.local before running this script.");
  }

  const args = parseArgs();
  const languageArg = args.get("language");
  const levelArg = args.get("level") as AcademyLevel | undefined;

  const languages = languageArg
    ? academyLanguages.filter((entry) => entry.id === languageArg)
    : academyLanguages.filter((entry) => entry.available);
  if (!languages.length) {
    throw new Error(`No matching language found for --language=${languageArg ?? ""}.`);
  }

  const levels = levelArg ? [levelArg] : SUPPORTED_ACADEMY_LEVELS;
  for (const level of levels) {
    if (!SUPPORTED_ACADEMY_LEVELS.includes(level)) {
      throw new Error(`Unknown level "${level}". Expected one of: ${SUPPORTED_ACADEMY_LEVELS.join(", ")}.`);
    }
  }

  console.log("Connecting to MongoDB...");
  await connectDB();
  console.log("✓ Connected");

  for (const language of languages) {
    for (const level of levels) {
      await seedOne(slugFor(language.id, level), language.id, language.label, level);
    }
  }

  console.log("\n✅ Catalog seeding complete. Review and publish drafts from /admin/academy.");
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((error) => {
  console.error("\n❌ Catalog seeding failed:", error);
  process.exit(1);
});
