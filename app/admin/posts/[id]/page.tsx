import { Metadata } from "next";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import PostEditor from "@/components/admin/PostEditor";

export const metadata: Metadata = {
  title: "Edit Post | Admin",
  description: "Update and republish an existing Lumyn journal post.",
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
      <div className="space-y-10">
        <section className="relative overflow-hidden mt-5 py-24 md:py-32">
          <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" aria-hidden="true" />
          <div className="relative max-w-5xl">
            <p className="label-sm mb-5 animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>
              Admin
            </p>
            <h1
              className="heading-display mb-6 text-balance animate-fade-up opacity-0 max-w-5xl"
              style={{ animationDelay: "100ms", animationFillMode: "forwards", color: "var(--text-primary)" }}
            >
              Edit Post
            </h1>
            <p
              className="body-lg max-w-2xl animate-fade-up opacity-0"
              style={{ animationDelay: "200ms", animationFillMode: "forwards", color: "var(--text-secondary)" }}
            >
              Update the content, metadata, and publishing state for this article.
            </p>
          </div>
        </section>

        <PostEditor post={serializedPost} />
      </div>
    );
  } catch {
    notFound();
  }
}
