import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { authOptions } from "@/lib/auth";

import readingTime from "reading-time";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();

    // Calculate reading time
    if (data.content) {
      const stats = readingTime(data.content);
      data.readingTime = Math.ceil(stats.minutes);
    }

    // Basic slugification if missing
    if (!data.slug && data.title) {
      data.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    const post = await Post.create(data);
    return NextResponse.json(post, { status: 201 });
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    if (err.code === 11000) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 });
  }
}
