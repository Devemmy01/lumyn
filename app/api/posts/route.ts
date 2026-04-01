import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Post from "@/models/Post";

export async function GET() {
  try {
    await connectDB();

    const posts = await Post.find({ published: true })
      .select("title slug excerpt tags coverImage readingTime createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: posts }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/posts]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
