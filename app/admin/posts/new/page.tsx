import { Metadata } from "next";
import PostEditor from "@/components/admin/PostEditor";

export const metadata: Metadata = {
  title: "Create Post | Admin",
  description: "Create and publish a new blog post in the Lumyn admin panel.",
};

export default function NewPostPage() {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden mt-5 py-10 md:py-32">
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="relative max-w-5xl">
          <p className="label-sm mb-5 animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>
            Admin
          </p>
          <h1
            className="heading-display mb-6 text-balance animate-fade-up opacity-0 max-w-5xl"
            style={{ animationDelay: "100ms", animationFillMode: "forwards", color: "var(--text-primary)" }}
          >
            Create New Post
          </h1>
          <p
            className="body-lg max-w-2xl animate-fade-up opacity-0"
            style={{ animationDelay: "200ms", animationFillMode: "forwards", color: "var(--text-secondary)" }}
          >
            Draft, edit, and publish journal posts with the same clean rhythm as the public site.
          </p>
        </div>
      </section>

      <PostEditor />
    </div>
  );
}
