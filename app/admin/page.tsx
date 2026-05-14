import { Metadata } from "next";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import Post from "@/models/Post";
import Subscriber from "@/models/Subscriber";
import Contact, { IContactDocument } from "@/models/Contact";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
};

export default async function AdminDashboard() {
  await dbConnect();

  const [postsCount, subscribersCount, inquiriesCount, recentInquiries] = (await Promise.all([
    Post.countDocuments(),
    Subscriber.countDocuments(),
    Contact.countDocuments(),
    Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
  ])) as unknown as [number, number, number, IContactDocument[]];

  const stats = [
    { label: "Total Posts", value: postsCount, href: "/admin/posts" },
    { label: "Subscribers", value: subscribersCount, href: "/admin/subscribers" },
    { label: "Inquiries", value: inquiriesCount, href: "/admin/inquiries" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tighter text-white">Dashboard</h1>
        <p className="text-neutral-500 mt-2">Welcome back to your CMS dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-[#0a0a0a] p-6 border border-[#222] rounded-2xl shadow-sm hover:border-[#7c6cf6] hover:bg-[#111] transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[#7c6cf6] opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-10 pointer-events-none" />
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-widest relative z-10">{stat.label}</p>
            <p className="text-5xl font-bold mt-4 text-white group-hover:text-[#7c6cf6] transition-colors tracking-tighter relative z-10">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl overflow-hidden shadow-soft">
          <div className="p-6 border-b border-[#222] flex justify-between items-center bg-[#050505]">
            <h2 className="font-semibold text-white tracking-wide uppercase text-sm">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-xs font-bold uppercase tracking-widest text-[#7c6cf6] hover:text-white transition-colors">View all</Link>
          </div>
          <div className="divide-y divide-[#222]">
            {recentInquiries.length === 0 ? (
              <div className="p-12 text-center text-neutral-600">No inquiries yet.</div>
            ) : (
              recentInquiries.map((inquiry: IContactDocument) => (
                <div key={inquiry._id.toString()} className="p-6 hover:bg-[#111] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-white">{inquiry.name}</span>
                    <span className="text-xs text-neutral-600 font-medium">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 line-clamp-2 italic tracking-wide">"{inquiry.message}"</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-[#0a0a0a] border border-[#222] rounded-2xl shadow-soft p-6">
            <h2 className="font-semibold text-white mb-6 uppercase tracking-wide text-sm">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <Link
                href="/admin/posts/new"
                className="flex items-center gap-4 p-4 border border-[#222] rounded-xl hover:border-[#7c6cf6] hover:bg-[#111] transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#ffffff] text-[#000000] flex items-center justify-center font-bold text-xl group-hover:bg-[#7c6cf6] group-hover:text-white transition-colors">
                  +
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white tracking-wide">Write New Post</div>
                  <div className="text-xs text-neutral-500 mt-1">Draft or publish a new article</div>
                </div>
              </Link>
              <Link
                href="https://lumynhq.studio"
                target="_blank"
                className="flex items-center gap-4 p-4 border border-[#222] rounded-xl hover:border-[#7c6cf6] hover:bg-[#111] transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-[#7c6cf6]/10 text-[#7c6cf6] flex items-center justify-center group-hover:bg-[#7c6cf6] group-hover:text-white transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-bold text-white tracking-wide">View Live Site</div>
                  <div className="text-xs text-neutral-500 mt-1">Open your public website</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
