import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import mongoose from "mongoose";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    await dbConnect();

    const { id } = await params;

    // Check if the id is a valid MongoDB ObjectId
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { slug: id }] }
      : { slug: id };

    // Search by either ID or slug, but check published true only for slug-based lookups
    // Actually, let's keep the original logic for published: true if it's for public retrieval.
    const post = await Post.findOne({ ...query, published: true }).lean();

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: post }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/posts/[id]]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch post" },
      { status: 500 }
    );
  }
}
