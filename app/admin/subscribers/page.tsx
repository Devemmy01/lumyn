import { Metadata } from "next";
import { FilterQuery } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Subscriber from "@/models/Subscriber";
import AdminSearch from "@/components/admin/AdminSearch";
import AdminPagination from "@/components/admin/AdminPagination";

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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Subscribers
        </h1>
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 rounded-t-lg">
          <div className="w-full sm:max-w-sm">
            <AdminSearch placeholder="Search emails..." />
          </div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium">
            Total count: <span className="text-charcoal">{total}</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-4 sm:px-6 py-4 text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider">Subscribed On</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {subscribers.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-gray-500">
                    {query ? "No subscribers found matching your search." : "No subscribers yet."}
                  </td>
                </tr>
              ) : (
                subscribers.map((sub: { _id: { toString(): string }; email: string; createdAt: Date }) => (
                  <tr key={sub._id.toString()} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4 font-medium text-gray-900 break-all">{sub.email}</td>
                    <td className="px-4 sm:px-6 py-4 text-gray-500 whitespace-nowrap">
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
          <div className="p-4 border-t">
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
