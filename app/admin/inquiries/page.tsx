import { Metadata } from "next";
import { FilterQuery } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Contact, { IContact } from "@/models/Contact";
import AdminSearch from "@/components/admin/AdminSearch";
import AdminPagination from "@/components/admin/AdminPagination";

export const dynamic = "force-dynamic";

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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter uppercase text-white">
          Inquiries
        </h1>
      </div>

      <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl shadow-soft overflow-hidden">
        <div className="p-6 border-b border-[#222] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-[#050505]">
          <div className="w-full sm:max-w-md">
            <AdminSearch placeholder="Search name, email or message..." />
          </div>
          <div className="text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-500">
            Total inquiries: <span className="text-white ml-2">{total}</span>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#222] bg-[#050505]">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Sender</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Message</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222] text-sm">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-neutral-600 uppercase tracking-widest text-sm font-semibold">
                    {query ? "No inquiries found matching your search." : "No inquiries yet."}
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry: IContact) => (
                  <tr key={inquiry._id.toString()} className="hover:bg-[#111] transition-colors">
                    <td className="px-6 py-4 align-top">
                      <div className="font-bold text-white tracking-wide">{inquiry.name}</div>
                      <div className="text-xs font-medium text-[#7c6cf6] mt-1 tracking-wider">{inquiry.email}</div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <p className="text-neutral-400 whitespace-pre-wrap line-clamp-3 max-w-xl font-medium tracking-wide">
                        {inquiry.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-neutral-500 font-semibold tracking-wider whitespace-nowrap align-top">
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
        <div className="md:hidden divide-y divide-[#222]">
          {inquiries.length === 0 ? (
            <div className="px-4 py-12 text-center text-neutral-600 uppercase tracking-widest font-semibold text-sm">
              {query ? "No inquiries found matching your search." : "No inquiries yet."}
            </div>
          ) : (
            inquiries.map((inquiry: IContact) => (
              <div key={inquiry._id.toString()} className="p-6 bg-[#0a0a0a] hover:bg-[#111] transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-bold text-white tracking-title text-base">{inquiry.name}</div>
                    <div className="text-xs text-[#7c6cf6] font-bold tracking-widest">{inquiry.email}</div>
                  </div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest whitespace-nowrap bg-neutral-900 border border-[#222] rounded px-2 py-1">
                    {new Date(inquiry.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>
                <div className="bg-[#050505] rounded-xl p-4 border border-[#222] mt-4">
                  <p className="text-sm text-neutral-400 font-medium whitespace-pre-wrap leading-relaxed tracking-wide">
                    {inquiry.message}
                  </p>
                </div>
                <div className="mt-4 text-[10px] uppercase tracking-widest font-bold text-neutral-600 flex justify-end">
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
          <div className="p-6 border-t border-[#222] bg-[#050505]">
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
