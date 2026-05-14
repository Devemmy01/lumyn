import { Metadata } from "next";
import Link from "next/link";
import { FilterQuery } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import AdminSearch from "@/components/admin/AdminSearch";
import AdminFilter from "@/components/admin/AdminFilter";
import AdminPagination from "@/components/admin/AdminPagination";

export const metadata: Metadata = {
  title: "Posts | Admin",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminPostsPage({ searchParams }: PageProps) {
  await dbConnect();

  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page as string) || 1;
  const query = (resolvedParams.q as string) || "";
  const statusFilter = (resolvedParams.status as string) || "";
  const limit = 10;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: FilterQuery<IPost> = {};
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { slug: { $regex: query, $options: "i" } },
    ];
  }
  if (statusFilter === "published") {
    filter.published = true;
  } else if (statusFilter === "draft") {
    filter.published = false;
  }

  // Fetch from DB
  const [posts, total] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .select("title slug published upvotes createdAt")
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Parse URL search parameters for the pagination component
  const queryParams = new URLSearchParams();
  if (query) queryParams.set("q", query);
  if (statusFilter) queryParams.set("status", statusFilter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold tracking-tighter text-white uppercase">
          Posts
        </h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center px-4 py-2 border border-[#222] rounded-xl text-sm font-bold tracking-widest uppercase text-white bg-[#0a0a0a] hover:bg-[#111] hover:border-[#7c6cf6] transition-all"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Post
        </Link>
      </div>

      <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl shadow-soft overflow-hidden">
        <div className="p-6 border-b border-[#222] flex flex-col sm:flex-row justify-between items-start sm:items-center bg-[#050505] gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <AdminSearch placeholder="Search title or slug..." />
            <AdminFilter 
              paramName="status" 
              defaultLabel="All Status"
              options={[
                { label: "Published", value: "published" },
                { label: "Draft", value: "draft" }
              ]} 
            />
          </div>
          <div className="text-xs font-semibold text-neutral-500 uppercase tracking-widest whitespace-nowrap">
            Total posts: {total}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] bg-[#050505]">
                <th className="px-6 py-4 text-xs font-bold tracking-widest uppercase text-neutral-500">Title</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest uppercase text-neutral-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest uppercase text-neutral-500">Upvotes</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest uppercase text-neutral-500">Created</th>
                <th className="px-6 py-4 text-xs font-bold tracking-widest uppercase text-neutral-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-sm">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-neutral-600 uppercase tracking-widest text-sm font-semibold">
                    {query || statusFilter ? "No posts found matching filters." : "No posts yet. Create your first one!"}
                  </td>
                </tr>
              ) : (
                posts.map((post: IPost) => (
                  <tr key={post._id.toString()} className="hover:bg-[#111] transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold tracking-wide text-white">{post.title}</div>
                      <div className="text-xs font-medium text-neutral-500 mt-1 tracking-wider">/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 border text-xs font-bold uppercase tracking-wider rounded-md ${post.published ? 'bg-[#7c6cf6]/10 text-[#7c6cf6] border-[#7c6cf6]/30' : 'bg-neutral-900 text-neutral-400 border-[#222]'}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-400 font-bold">
                      {post.upvotes}
                    </td>
                    <td className="px-6 py-4 text-neutral-400 font-semibold tracking-wide">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/posts/${post._id}`}
                        className="text-[#7c6cf6] hover:text-white font-bold uppercase tracking-widest text-xs transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-[#222]">
          {posts.length === 0 ? (
            <div className="px-6 py-12 text-center text-neutral-600 uppercase tracking-widest text-sm font-semibold">
              {query || statusFilter ? "No posts found matching filters." : "No posts yet. Create your first one!"}
            </div>
          ) : (
            posts.map((post: IPost) => (
              <div key={post._id.toString()} className="p-6 hover:bg-[#111] transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-bold tracking-wide text-white pr-4">{post.title}</div>
                  <span className={`inline-flex items-center px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider rounded whitespace-nowrap ${post.published ? 'bg-[#7c6cf6]/10 text-[#7c6cf6] border-[#7c6cf6]/30' : 'bg-neutral-900 text-neutral-400 border-[#222]'}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="text-xs font-medium text-neutral-500 mb-3 tracking-wider">/{post.slug}</div>
                <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-neutral-500 mt-4 pt-4 border-t border-[#222]">
                   <div className="flex gap-4">
                    <span>Upvotes: <span className="font-bold text-white">{post.upvotes}</span></span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                   </div>
                   <Link
                      href={`/admin/posts/${post._id}`}
                      className="text-[#7c6cf6] font-bold uppercase tracking-widest px-4 py-2 bg-[#7c6cf6]/10 border border-[#7c6cf6]/30 rounded-lg"
                    >
                      Edit
                    </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 0 && (
          <div className="p-6 border-t border-[#222] bg-[#050505]">
            <AdminPagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl="/admin/posts"
              queryParams={queryParams}
            />
          </div>
        )}
      </div>
    </div>
  );
}
