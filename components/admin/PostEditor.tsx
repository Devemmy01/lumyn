"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { type ISerializedPost } from "@/models/Post";

interface PostEditorProps {
  post?: ISerializedPost;
}

export default function PostEditor({ post }: PostEditorProps) {
  const router = useRouter();
  const editorFileRef = useRef<HTMLInputElement>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    excerpt: post?.excerpt || "",
    tags: post?.tags?.join(", ") || "",
    coverImage: post?.coverImage || "",
    published: post?.published || false,
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight,
      Subscript,
      Superscript,
      Placeholder.configure({
        placeholder: "Write something thoughtful...",
      }),
    ],
    content: post?.content || "",
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none min-h-[400px] p-4",
      },
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const generateSlug = () => {
    setFormData((prev) => ({
      ...prev,
      slug: prev.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
    }));
  };

  const handleEditorFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        editor.chain().focus().setImage({ src: base64 }).run();
      };
      reader.readAsDataURL(file);
    }
    // Clear the input so the same file can be selected again
    e.target.value = "";
  };

  const handleCoverFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setFormData((prev) => ({ ...prev, coverImage: base64 }));
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const addImage = () => {
    editorFileRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      if (!editor) throw new Error("Editor not initialized");
      
      const content = editor.getHTML();
      
      const tagsArray = formData.tags
        .split(",")
        .map((t: string) => t.trim())
        .filter((t: string) => t.length > 0);

      const payload = { ...formData, content, tags: tagsArray };

      const url = post ? `/api/admin/posts/${post._id}` : "/api/admin/posts";
      const method = post ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save post");
      }

      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/admin/posts/${post?._id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) throw new Error("Failed to delete");
      
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-20">
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-lg font-semibold text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-[#7c6cf6] focus:border-[#7c6cf6]"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post Title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <div className="overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-sm">
              {editor && (
                <div className="flex flex-wrap items-center gap-1 border-b border-gray-300 bg-gray-50 p-2 sm:p-3">
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => editor.chain().focus().undo().run()} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-200 hover:text-black" title="Undo">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 14L4 9l5-5" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" /></svg>
                    </button>
                    <button type="button" onClick={() => editor.chain().focus().redo().run()} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-200 hover:text-black" title="Redo">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14l5-5-5-5" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" /></svg>
                    </button>
                  </div>
                  
                  <div className="hidden h-6 w-px bg-gray-300 sm:block" />

                  <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-bold transition ${editor.isActive("bold") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Bold">B</button>
                  <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm italic transition ${editor.isActive("italic") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Italic">I</button>
                  <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm underline transition ${editor.isActive("underline") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Underline">U</button>
                  <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm line-through transition ${editor.isActive("strike") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Strike">S</button>
                  
                  <div className="h-6 w-px bg-gray-300" />

                  <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-bold transition ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Heading 2">H2</button>
                  <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-bold transition ${editor.isActive("heading", { level: 3 }) ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Heading 3">H3</button>

                  <div className="h-6 w-px bg-gray-300" />

                  <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Align Left"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 10H3M21 6H3M21 14H3M17 18H3" /></svg></button>
                  <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Align Center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10H6M21 6H3M21 14H3M18 18H6" /></svg></button>
                  <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Align Right"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10H7M21 6H3M21 14H3M21 18H7" /></svg></button>
                  
                  <div className="h-6 w-px bg-gray-300" />

                  <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm transition ${editor.isActive("bulletList") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Bullet List">• List</button>
                  <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm transition ${editor.isActive("orderedList") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Ordered List">1. List</button>
                  <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm transition ${editor.isActive("blockquote") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Blockquote">Quote</button>
                  <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-sm transition ${editor.isActive("highlight") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Highlight"><span className="rounded bg-yellow-200 px-1">High</span></button>

                  <div className="h-6 w-px bg-gray-300" />

                  <button type="button" onClick={() => editor.chain().focus().toggleSubscript().run()} className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-xs transition ${editor.isActive("subscript") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Subscript">X<sub>2</sub></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleSuperscript().run()} className={`inline-flex h-9 items-center justify-center rounded-md px-3 text-xs transition ${editor.isActive("superscript") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200 hover:text-black"}`} title="Superscript">X<sup>2</sup></button>

                  <div className="h-6 w-px bg-gray-300" />

                  <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm text-gray-600 transition hover:bg-gray-200 hover:text-black" title="Horizontal Rule">HR</button>
                  <button type="button" onClick={addImage} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-600 transition hover:bg-gray-200 hover:text-black" title="Insert Image">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  </button>
                </div>
              )}
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 shadow-sm">
            <h3 className="font-medium text-gray-900 mb-4">Publishing</h3>
            
            <label className="flex items-center space-x-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="text-gray-900 font-medium">Published</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-black px-4 py-2.5 font-medium text-white transition hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : post ? "Update Post" : "Create Post"}
            </button>
            
            {post && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="mt-3 w-full rounded-xl border border-red-200 bg-white px-4 py-2 font-medium text-red-600 transition hover:bg-red-50 focus:outline-none"
              >
                Delete Post
              </button>
            )}
          </div>

          <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm md:p-6">
            <h3 className="font-medium text-gray-900">Metadata</h3>

            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-xs font-bold uppercase tracking-widest text-neutral-400">Slug</label>
                <button type="button" onClick={generateSlug} className="text-xs text-blue-600 hover:text-blue-800">Generate</button>
              </div>
              <input
                type="text"
                name="slug"
                required
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 sm:text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.slug}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
              <textarea
                name="excerpt"
                required
                rows={3}
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 sm:text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.excerpt}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                className="w-full rounded-xl border border-gray-300 bg-white px-3 py-2 sm:text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image (URL or Local)</label>
              <div className="flex flex-wrap gap-2">
                <input
                  type="text"
                  name="coverImage"
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-3 py-2 sm:text-sm text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="Paste URL or upload..."
                />
                <button
                  type="button"
                  onClick={() => coverFileRef.current?.click()}
                  className="rounded-xl border border-stone/30 bg-ivory-200 px-3 py-2 text-xs font-medium transition-colors hover:bg-ivory-300"
                >
                  Upload
                </button>
              </div>
              {formData.coverImage && (
                <div className="mt-2 text-xs text-sage font-medium flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  Image attached
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={editorFileRef}
        className="hidden"
        accept="image/*"
        onChange={handleEditorFileSelect}
      />
      <input
        type="file"
        ref={coverFileRef}
        className="hidden"
        accept="image/*"
        onChange={handleCoverFileSelect}
      />
    </form>
  );
}
