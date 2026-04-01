import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const { id } = await params;
    
    // Increment the upvotes field by 1
    const post = await Post.findByIdAndUpdate(
      id,
      { $inc: { upvotes: 1 } },
      { new: true }
    );
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    return NextResponse.json({ upvotes: post.upvotes });
  } catch (error: any) {
    return NextResponse.json({ error: "Could not record upvote" }, { status: 500 });
  }
}
