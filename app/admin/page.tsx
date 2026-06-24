import type { Metadata } from "next";
import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import AcademyCourse from "@/models/AcademyCourse";
import AcademyStudent from "@/models/AcademyStudent";
import Contact from "@/models/Contact";
import Post from "@/models/Post";
import Subscriber from "@/models/Subscriber";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard | Admin",
};

type RecentInquiry = {
  _id: { toString(): string };
  name?: string;
  email?: string;
  message?: string;
  createdAt?: Date;
};

type RecentPost = {
  _id: { toString(): string };
  title?: string;
  published?: boolean;
  createdAt?: Date;
};

async function getDashboardSnapshot() {
  const fallback = {
    postsCount: 0,
    publishedCount: 0,
    subscribersCount: 0,
    inquiriesCount: 0,
    academyStudentsCount: 0,
    academyCoursesCount: 0,
    recentInquiries: [] as RecentInquiry[],
    recentPosts: [] as RecentPost[],
    healthy: false,
  };

  try {
    await dbConnect();
    const results = await Promise.allSettled([
      Post.countDocuments(),
      Post.countDocuments({ published: true }),
      Subscriber.countDocuments(),
      Contact.countDocuments(),
      AcademyStudent.countDocuments(),
      AcademyCourse.countDocuments(),
      Contact.find().sort({ createdAt: -1 }).limit(5).lean(),
      Post.find().select("title published createdAt").sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const value = <T,>(index: number, defaultValue: T): T =>
      results[index].status === "fulfilled"
        ? (results[index] as PromiseFulfilledResult<T>).value
        : defaultValue;

    return {
      postsCount: value(0, 0),
      publishedCount: value(1, 0),
      subscribersCount: value(2, 0),
      inquiriesCount: value(3, 0),
      academyStudentsCount: value(4, 0),
      academyCoursesCount: value(5, 0),
      recentInquiries: value<RecentInquiry[]>(6, []),
      recentPosts: value<RecentPost[]>(7, []),
      healthy: results.every((result) => result.status === "fulfilled"),
    };
  } catch (error) {
    console.error("[admin dashboard] Unable to load dashboard snapshot", error);
    return fallback;
  }
}

export default async function AdminDashboard() {
  const data = await getDashboardSnapshot();
  const today = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

  const stats = [
    { label: "Journal posts", value: data.postsCount, detail: `${data.publishedCount} published`, href: "/admin/posts", accent: "violet" },
    { label: "Subscribers", value: data.subscribersCount, detail: "newsletter audience", href: "/admin/subscribers", accent: "cyan" },
    { label: "Inquiries", value: data.inquiriesCount, detail: "project conversations", href: "/admin/inquiries", accent: "amber" },
    { label: "Academy students", value: data.academyStudentsCount, detail: `${data.academyCoursesCount} generated courses`, href: "/admin/academy", accent: "emerald" },
  ];

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-[#12101c] via-[#0c0b10] to-[#09090c] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#7c6cf6]/20 blur-[100px]" />
        <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-end">
          <div>
            <div className="mb-5 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              <span className={data.healthy ? "h-2 w-2 rounded-full bg-emerald-400" : "h-2 w-2 rounded-full bg-amber-400"} />
              {data.healthy ? "Systems connected" : "Some data is unavailable"}
              <span className="text-white/15">•</span>
              {today}
            </div>
            <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
              Your studio, at a glance.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/40 sm:text-base">
              Publish ideas, manage incoming conversations, and keep Academy operations moving from one workspace.
            </p>
          </div>
          <Link href="/admin/posts/new" className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#7c6cf6] px-5 text-sm font-bold text-white shadow-[0_16px_40px_rgba(124,108,246,0.25)] transition hover:bg-[#6e5ee7]">
            <span className="text-lg leading-none">+</span>
            New journal post
          </Link>
        </div>
      </section>

      {!data.healthy && (
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.07] px-5 py-4 text-sm text-amber-100/80" role="status">
          The dashboard loaded with partial data. Refresh in a moment; individual tools remain available from the sidebar.
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Workspace metrics">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-white/[0.04]">
            <div className="flex items-start justify-between">
              <span className={`h-2.5 w-2.5 rounded-full ${accentColor(stat.accent)}`} />
              <span className="text-sm text-white/20 transition group-hover:translate-x-0.5 group-hover:text-white/50">→</span>
            </div>
            <p className="mt-7 text-4xl font-semibold tracking-[-0.05em] text-white">{stat.value}</p>
            <p className="mt-2 text-sm font-semibold text-white/70">{stat.label}</p>
            <p className="mt-1 text-xs text-white/30">{stat.detail}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <DashboardPanel title="Recent inquiries" action={{ label: "View all", href: "/admin/inquiries" }}>
          {data.recentInquiries.length ? (
            <div className="divide-y divide-white/[0.06]">
              {data.recentInquiries.map((inquiry) => (
                <div key={inquiry._id.toString()} className="group px-5 py-4 transition hover:bg-white/[0.018] sm:px-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">{inquiry.name || "Unknown sender"}</p>
                      <p className="mt-1 truncate text-xs text-[#9d92ff]">{inquiry.email || "No email"}</p>
                    </div>
                    <time className="shrink-0 text-[11px] text-white/25">
                      {inquiry.createdAt ? new Date(inquiry.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                    </time>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/35">{inquiry.message || "No message"}</p>
                </div>
              ))}
            </div>
          ) : <EmptyState message="No inquiries yet." />}
        </DashboardPanel>

        <DashboardPanel title="Latest posts" action={{ label: "Manage posts", href: "/admin/posts" }}>
          {data.recentPosts.length ? (
            <div className="divide-y divide-white/[0.06]">
              {data.recentPosts.map((post) => (
                <Link key={post._id.toString()} href={`/admin/posts/${post._id}`} className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-white/[0.018] sm:px-6">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">{post.title || "Untitled post"}</p>
                    <p className="mt-1 text-xs text-white/25">{post.createdAt ? new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "No date"}</p>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${post.published ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border-white/10 bg-white/[0.04] text-white/35"}`}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </Link>
              ))}
            </div>
          ) : <EmptyState message="No posts yet." />}
        </DashboardPanel>
      </section>

      <section>
        <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/25">Quick actions</p>
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { title: "Manage Academy", description: "Students, access, and mentorship", href: "/admin/academy" },
            { title: "Review subscribers", description: "Search and clean the audience list", href: "/admin/subscribers" },
            { title: "Open email inbox", description: "Review incoming agent mail", href: "/admin/inbox" },
          ].map((action) => (
            <Link key={action.href} href={action.href} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 transition hover:border-[#7c6cf6]/30 hover:bg-[#7c6cf6]/[0.05]">
              <p className="text-sm font-semibold text-white">{action.title}</p>
              <p className="mt-1.5 text-xs text-white/30">{action.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function accentColor(accent: string) {
  return {
    violet: "bg-[#8d7fff] shadow-[0_0_16px_rgba(141,127,255,0.55)]",
    cyan: "bg-cyan-400 shadow-[0_0_16px_rgba(34,211,238,0.45)]",
    amber: "bg-amber-400 shadow-[0_0_16px_rgba(251,191,36,0.45)]",
    emerald: "bg-emerald-400 shadow-[0_0_16px_rgba(52,211,153,0.45)]",
  }[accent] ?? "bg-white";
}

function DashboardPanel({ title, action, children }: { title: string; action: { label: string; href: string }; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02]">
      <div className="flex h-16 items-center justify-between border-b border-white/[0.07] px-5 sm:px-6">
        <h2 className="text-sm font-semibold text-white">{title}</h2>
        <Link href={action.href} className="text-xs font-semibold text-[#9e93ff] transition hover:text-white">{action.label} →</Link>
      </div>
      {children}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return <p className="px-6 py-12 text-center text-sm text-white/25">{message}</p>;
}
