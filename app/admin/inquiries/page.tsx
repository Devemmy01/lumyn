import { Metadata } from "next";
import { FilterQuery } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Contact, { IContact } from "@/models/Contact";
import AdminSearch from "@/components/admin/AdminSearch";
import AdminPagination from "@/components/admin/AdminPagination";

export const metadata: Metadata = {
  title: "Inquiries | Admin",
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function InquiriesPage({ searchParams }: PageProps) {
  await dbConnect();

  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page as string) || 1;
  const query = (resolvedParams.q as string) || "";
  const limit = 10;
  const skip = (page - 1) * limit;

  // Build filter
  const filter: FilterQuery<IContact> = {};
  if (query) {
    filter.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
      { message: { $regex: query, $options: "i" } },
    ];
  }

  // Fetch from DB
  const [inquiries, total] = (await Promise.all([
    Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Contact.countDocuments(filter),
  ])) as [IContact[], number];

  const totalPages = Math.ceil(total / limit);

  // Parse URL search parameters for the pagination component
  const queryParams = new URLSearchParams();
  if (query) queryParams.set("q", query);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
          Inquiries
        </h1>
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 rounded-t-lg">
          <div className="w-full sm:max-w-md">
            <AdminSearch placeholder="Search name, email or message..." />
          </div>
          <div className="text-xs sm:text-sm text-gray-500 font-medium">
            Total inquiries: <span className="text-charcoal">{total}</span>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-gray-50/50">
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Sender</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    {query ? "No inquiries found matching your search." : "No inquiries yet."}
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry: IContact) => (
                  <tr key={inquiry._id.toString()} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 align-top">
                      <div className="font-medium text-gray-900">{inquiry.name}</div>
                      <div className="text-xs text-gray-500 mt-1">{inquiry.email}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="text-gray-700 whitespace-pre-wrap line-clamp-3 max-w-xl">
                        {inquiry.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap align-top">
                      {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {inquiries.length === 0 ? (
            <div className="px-4 py-12 text-center text-gray-500 text-sm">
              {query ? "No inquiries found matching your search." : "No inquiries yet."}
            </div>
          ) : (
            inquiries.map((inquiry: IContact) => (
              <div key={inquiry._id.toString()} className="p-4 bg-white active:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-gray-900 text-base">{inquiry.name}</div>
                    <div className="text-xs text-sage font-medium">{inquiry.email}</div>
                  </div>
                  <div className="text-[10px] font-medium text-gray-400 whitespace-nowrap bg-gray-100 px-2 py-0.5 rounded-full">
                    {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="bg-ivory-200/50 p-3 rounded-xl border border-stone/10">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {inquiry.message}
                  </p>
                </div>
                <div className="mt-3 text-[10px] text-gray-400 flex justify-end">
                  {new Date(inquiry.createdAt).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
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
              baseUrl="/admin/inquiries"
              queryParams={queryParams}
            />
          </div>
        )}
      </div>
    </div>
  );
}
