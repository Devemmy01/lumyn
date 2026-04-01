import { Metadata } from "next";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
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
  const filter: any = {};
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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Posts
        </h1>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition"
        >
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Post
        </Link>
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-50/50 rounded-t-lg gap-4">
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
          <div className="text-sm text-gray-500 whitespace-nowrap">
            Total posts: {total}
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="px-6 py-4 text-sm font-medium text-gray-600">Title</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600">Upvotes</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600">Created</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                    {query || statusFilter ? "No posts found matching filters." : "No posts yet. Create your first one!"}
                  </td>
                </tr>
              ) : (
                posts.map((post: any) => (
                  <tr key={post._id.toString()} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{post.title}</div>
                      <div className="text-xs text-gray-500 mt-1">/{post.slug}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500 font-medium">
                      {post.upvotes}
                    </td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/posts/${post._id}`}
                        className="text-blue-600 hover:text-blue-900 font-medium text-sm transition"
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
        <div className="md:hidden divide-y">
          {posts.length === 0 ? (
            <div className="px-6 py-8 text-center text-gray-500 text-sm">
              {query || statusFilter ? "No posts found matching filters." : "No posts yet. Create your first one!"}
            </div>
          ) : (
            posts.map((post: any) => (
              <div key={post._id.toString()} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-gray-900 pr-4">{post.title}</div>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium whitespace-nowrap ${post.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-3">/{post.slug}</div>
                <div className="flex items-center justify-between text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
                   <div className="flex gap-4">
                    <span>Upvotes: <span className="font-medium text-gray-700">{post.upvotes}</span></span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                   </div>
                   <Link
                      href={`/admin/posts/${post._id}`}
                      className="text-blue-600 font-semibold px-3 py-1 bg-blue-50 rounded-md"
                    >
                      Edit
                    </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 0 && (
          <div className="p-4 border-t">
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
