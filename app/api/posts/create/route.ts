import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function estimateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { title, excerpt, content, tags, coverImage, published } = body;

    if (!title || !excerpt || !content) {
      return NextResponse.json(
        { success: false, error: "title, excerpt, and content are required" },
        { status: 400 }
      );
    }

    const slug = slugify(title);
    const existing = await Post.findOne({ slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "A post with this title already exists" },
        { status: 409 }
      );
    }

    const readingTime = estimateReadingTime(content);

    const post = await Post.create({
      title,
      slug,
      excerpt,
      content,
      tags: tags ?? [],
      coverImage,
      published: published ?? false,
      readingTime,
    });

    return NextResponse.json({ success: true, data: post }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/posts/create]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create post" },
      { status: 500 }
    );
  }
}
