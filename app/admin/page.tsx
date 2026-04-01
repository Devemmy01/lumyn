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
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome back to your CMS dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition-shadow group"
          >
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
            <p className="text-4xl font-bold mt-2 text-gray-900 group-hover:text-sage transition-colors">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inquiries */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
            <h2 className="font-semibold text-gray-900">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-sm text-sage hover:underline">View all</Link>
          </div>
          <div className="divide-y">
            {recentInquiries.length === 0 ? (
              <div className="p-12 text-center text-gray-500">No inquiries yet.</div>
            ) : (
              recentInquiries.map((inquiry: IContactDocument) => (
                <div key={inquiry._id.toString()} className="p-6 hover:bg-gray-50/50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-900">{inquiry.name}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2 italic">"{inquiry.message}"</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h2 className="font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <Link
                href="/admin/posts/new"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold">
                  +
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">Write New Post</div>
                  <div className="text-xs text-gray-500">Draft or publish a new article</div>
                </div>
              </Link>
              <Link
                href="https://lumynhq.studio"
                target="_blank"
                className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-sage/10 text-sage flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-gray-900">View Live Site</div>
                  <div className="text-xs text-gray-500">Open your public website</div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
