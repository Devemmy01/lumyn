import { Metadata } from "next";
import { FilterQuery } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import AdminSearch from "@/components/admin/AdminSearch";
import AdminPagination from "@/components/admin/AdminPagination";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Subscribers | Admin",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SubscribersPage({ searchParams }: PageProps) {
  await dbConnect();

  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page as string) || 1;
  const query = (resolvedParams.q as string) || "";
  const limit = 10;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: FilterQuery<{ email: string; createdAt: Date }> = {};
  if (query) {
    filter.email = { $regex: query, $options: "i" };
  }

  // Fetch from DB
  const [subscribers, total] = await Promise.all([
    Subscriber.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Subscriber.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  // Parse URL search parameters for the pagination component
  const queryParams = new URLSearchParams();
  if (query) queryParams.set("q", query);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter uppercase text-white">
          Subscribers
        </h1>
      </div>

      <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl shadow-soft overflow-hidden">
        <div className="p-6 border-b border-[#222] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#050505]">
          <div className="w-full sm:max-w-sm">
            <AdminSearch placeholder="Search emails..." />
          </div>
          <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-500">
            Total count: <span className="text-white ml-2">{total}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] bg-[#050505]">
                <th className="px-4 sm:px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Email</th>
                <th className="px-4 sm:px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Subscribed On</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-sm">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-12 text-center text-neutral-600 uppercase tracking-widest text-sm font-semibold">
                    {query ? "No subscribers found matching your search." : "No subscribers yet."}
                  </td>
                </tr>
              ) : (
                subscribers.map((sub: { _id: { toString(): string }; email: string; createdAt: Date }) => (
                  <tr key={sub._id.toString()} className="hover:bg-[#111] transition-colors">
                    <td className="px-4 sm:px-6 py-4 font-bold text-white tracking-wide break-all">{sub.email}</td>
                    <td className="px-4 sm:px-6 py-4 text-neutral-500 font-semibold tracking-wider whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="p-6 border-t border-[#222] bg-[#050505]">
            <AdminPagination
              currentPage={page}
              totalPages={totalPages}
              baseUrl="/admin/subscribers"
              queryParams={queryParams}
            />
          </div>
        )}
      </div>
    </div>
  );
}
