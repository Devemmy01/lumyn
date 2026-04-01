import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import readingTime from "reading-time";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    const data = await req.json();

    // Calculate reading time
    if (data.content) {
      const stats = readingTime(data.content);
      data.readingTime = Math.ceil(stats.minutes);
    }

    const post = await Post.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    return NextResponse.json(post);
  } catch (error: unknown) {
    const err = error as { code?: number; message?: string };
    if (err.code === 11000) {
      return NextResponse.json({ error: "Slug already exists" }, { status: 400 });
    }
    return NextResponse.json({ error: err.message ?? "Unknown error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { id } = await params;
    
    const post = await Post.findByIdAndDelete(id);
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
