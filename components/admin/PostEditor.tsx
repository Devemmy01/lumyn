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
        className: "prose max-w-none focus:outline-none min-h-[400px] p-4",
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
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black text-lg font-semibold"
              value={formData.title}
              onChange={handleChange}
              placeholder="Post Title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <div className="bg-white border border-gray-300 rounded-md overflow-hidden">
              {editor && (
                <div className="border-b border-gray-300 bg-gray-50 flex flex-wrap items-center gap-0.5 p-1.5 sm:p-2">
                  {/* History */}
                  <div className="flex items-center mr-2">
                    <button type="button" onClick={() => editor.chain().focus().undo().run()} className="p-1.5 rounded hover:bg-gray-200" title="Undo"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 14L4 9l5-5" /><path d="M20 20v-7a4 4 0 0 0-4-4H4" /></svg></button>
                    <button type="button" onClick={() => editor.chain().focus().redo().run()} className="p-1.5 rounded hover:bg-gray-200" title="Redo"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 14l5-5-5-5" /><path d="M4 20v-7a4 4 0 0 1 4-4h12" /></svg></button>
                  </div>
                  
                  <div className="w-px h-6 bg-gray-300 mx-1 hidden sm:block" />

                  {/* Basic Formatting */}
                  <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded text-sm font-bold ${editor.isActive("bold") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200"}`} title="Bold">B</button>
                  <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded text-sm italic ${editor.isActive("italic") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200"}`} title="Italic">I</button>
                  <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={`p-2 rounded text-sm underline ${editor.isActive("underline") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200"}`} title="Underline">U</button>
                  <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded text-sm line-through ${editor.isActive("strike") ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200"}`} title="Strike">S</button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-1" />

                  {/* Headings */}
                  <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded text-sm font-bold ${editor.isActive("heading", { level: 2 }) ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200"}`} title="Heading 2">H2</button>
                  <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`p-2 rounded text-sm font-bold ${editor.isActive("heading", { level: 3 }) ? "bg-gray-200 text-black" : "text-gray-600 hover:bg-gray-200"}`} title="Heading 3">H3</button>

                  <div className="w-px h-6 bg-gray-300 mx-1" />

                  {/* Alignment */}
                  <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()} className={`p-2 rounded ${editor.isActive({ textAlign: "left" }) ? "bg-gray-200" : "hover:bg-gray-200"}`} title="Align Left"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 10H3M21 6H3M21 14H3M17 18H3" /></svg></button>
                  <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()} className={`p-2 rounded ${editor.isActive({ textAlign: "center" }) ? "bg-gray-200" : "hover:bg-gray-200"}`} title="Align Center"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 10H6M21 6H3M21 14H3M18 18H6" /></svg></button>
                  <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()} className={`p-2 rounded ${editor.isActive({ textAlign: "right" }) ? "bg-gray-200" : "hover:bg-gray-200"}`} title="Align Right"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10H7M21 6H3M21 14H3M21 18H7" /></svg></button>
                  
                  <div className="w-px h-6 bg-gray-300 mx-1" />

                  {/* Lists & More */}
                  <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`p-2 rounded text-sm ${editor.isActive("bulletList") ? "bg-gray-200" : "hover:bg-gray-200"}`} title="Bullet List">• List</button>
                  <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`p-2 rounded text-sm ${editor.isActive("orderedList") ? "bg-gray-200" : "hover:bg-gray-200"}`} title="Ordered List">1. List</button>
                  <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded text-sm ${editor.isActive("blockquote") ? "bg-gray-200" : "hover:bg-gray-200"}`} title="Blockquote">Quote</button>
                  <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={`p-2 rounded text-sm ${editor.isActive("highlight") ? "bg-gray-200" : "hover:bg-gray-200"}`} title="Highlight"><span className="bg-yellow-200 px-1">High</span></button>

                  <div className="w-px h-6 bg-gray-300 mx-1" />

                  {/* Sub/Sup */}
                  <button type="button" onClick={() => editor.chain().focus().toggleSubscript().run()} className={`p-2 rounded text-xs ${editor.isActive("subscript") ? "bg-gray-200" : "hover:bg-gray-200"}`} title="Subscript">X<sub>2</sub></button>
                  <button type="button" onClick={() => editor.chain().focus().toggleSuperscript().run()} className={`p-2 rounded text-xs ${editor.isActive("superscript") ? "bg-gray-200" : "hover:bg-gray-200"}`} title="Superscript">X<sup>2</sup></button>

                  <div className="w-px h-6 bg-gray-300 mx-1" />

                  {/* Insert */}
                  <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className="p-2 rounded text-sm hover:bg-gray-200" title="Horizontal Rule">— HR</button>
                  <button type="button" onClick={addImage} className="p-2 rounded hover:bg-gray-200" title="Insert Image">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                  </button>
                </div>
              )}
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
            <h3 className="font-medium text-gray-900 mb-4">Publishing</h3>
            
            <label className="flex items-center space-x-3 mb-6 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={formData.published}
                onChange={handleChange}
                className="h-5 w-5 text-black border-gray-300 rounded focus:ring-black"
              />
              <span className="text-gray-900 font-medium">Published</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-black text-white py-2.5 px-4 rounded-md font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 transition"
            >
              {isSubmitting ? "Saving..." : post ? "Update Post" : "Create Post"}
            </button>
            
            {post && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="w-full mt-3 bg-white text-red-600 border border-red-200 py-2 px-4 rounded-md font-medium hover:bg-red-50 focus:outline-none transition"
              >
                Delete Post
              </button>
            )}
          </div>

          <div className="bg-gray-50 p-4 md:p-6 rounded-lg border border-gray-100 space-y-4">
            <h3 className="font-medium text-gray-900">Metadata</h3>

            <div>
              <div className="flex justify-between mb-1">
                <label className="block text-sm font-medium text-gray-700">Slug</label>
                <button type="button" onClick={generateSlug} className="text-xs text-blue-600 hover:text-blue-800">Generate</button>
              </div>
              <input
                type="text"
                name="slug"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black sm:text-sm"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black sm:text-sm"
                value={formData.excerpt}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input
                type="text"
                name="tags"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black sm:text-sm"
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
                  className="flex-1 px-3 py-2 border border-stone/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-sage/20 focus:border-sage sm:text-sm"
                  value={formData.coverImage}
                  onChange={handleChange}
                  placeholder="Paste URL or upload..."
                />
                <button
                  type="button"
                  onClick={() => coverFileRef.current?.click()}
                  className="px-3 py-2 bg-ivory-200 border border-stone/30 rounded-xl text-xs font-medium hover:bg-ivory-300 transition-colors"
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
