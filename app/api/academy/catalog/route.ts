import { NextResponse } from "next/server";
import { academyLanguages, SUPPORTED_ACADEMY_LEVELS } from "@/lib/academy";
import connectDB, { MongoConnectionUnavailableError } from "@/lib/mongodb";
import AcademyCatalogCourse from "@/models/AcademyCatalogCourse";

export async function GET() {
  try {
    await connectDB();
    const published = await AcademyCatalogCourse.find({ status: "published" })
      .sort({ order: 1, language: 1, level: 1 })
      .select("slug language level content.courseTitle content.courseDescription content.modules enrollmentCount")
      .lean();

    const publishedBySlug = new Map(published.map((course) => [`${course.language}:${course.level}`, course]));

    const catalog = academyLanguages.flatMap((language) =>
      SUPPORTED_ACADEMY_LEVELS.map((level) => {
        const course = publishedBySlug.get(`${language.id}:${level}`);
        return {
          slug: course?.slug ?? `${language.id}-${level}`,
          language: language.id,
          languageLabel: language.label,
          level,
          available: Boolean(course),
          courseTitle: course?.content?.courseTitle,
          courseDescription: course?.content?.courseDescription,
          moduleCount: course?.content?.modules?.length ?? 0,
          enrollmentCount: course?.enrollmentCount ?? 0,
        };
      }),
    );

    return NextResponse.json({ success: true, catalog });
  } catch (error) {
    if (error instanceof MongoConnectionUnavailableError) {
      return NextResponse.json({ success: false, error: error.message }, { status: 503 });
    }
    console.error("[GET /api/academy/catalog]", error);
    return NextResponse.json({ success: false, error: "Could not load the course catalog." }, { status: 500 });
  }
}
