import { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import PostEditor from "@/components/admin/PostEditor";

export const metadata: Metadata = {
  title: "Edit Post | Admin",
};

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await dbConnect();
  const { id } = await params;

  try {
    const post = await Post.findById(id).lean();
    
    if (!post) {
      notFound();
    }

    // Convert ObjectIds to strings before passing to client component
    const serializedPost = {
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt?.toISOString(),
      updatedAt: post.updatedAt?.toISOString(),
    };

    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tighter uppercase text-white">
            Edit Post
          </h1>
        </div>
        <PostEditor post={serializedPost} />
      </div>
    );
  } catch {
    notFound();
  }
}
