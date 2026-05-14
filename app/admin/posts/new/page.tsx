import { Metadata } from "next";
import PostEditor from "@/components/admin/PostEditor";

export const metadata: Metadata = {
  title: "Create Post | Admin",
};

export default function NewPostPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tighter uppercase text-white">
          Create New Post
        </h1>
      </div>
      <PostEditor />
    </div>
  );
}
