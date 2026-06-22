import type { Metadata } from "next";
import Link from "next/link";
import { FilterQuery } from "mongoose";
import dbConnect from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import BlogCard from "@/components/BlogCard";
import SectionWrapper from "@/components/SectionWrapper";
import JournalSearch from "@/components/JournalSearch";
import JournalPagination from "@/components/JournalPagination";
import SubscribeForm from "@/components/SubscribeForm";
import JournalTagsFilter from "@/components/JournalTagsFilter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Essays on software engineering, product strategy, and digital excellence. Thinking out loud from the Lumyn team.",
  keywords: [
    "software engineering blog",
    "product strategy",
    "digital excellence",
    "problem solving",
    "high-performance software",
    "product development",
  ],
  openGraph: {
    title: "Journal | Lumyn",
    description: "Essays on software engineering, product strategy, and digital excellence.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Lumyn Journal",
  description: "Essays on software engineering, product strategy, and digital excellence.",
  url: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio"}/journal`,
  publisher: {
    "@type": "Organization",
    name: "Lumyn",
    url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://lumynhq.studio",
  },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function JournalPage({ searchParams }: PageProps) {
  await dbConnect();
  
  const resolvedParams = await searchParams;
  const page = parseInt(resolvedParams.page as string) || 1;
  const query = (resolvedParams.q as string) || "";
  const tag = (resolvedParams.tag as string) || "";
  const limit = 6;
  const skip = (page - 1) * limit;

  // Build Filter
  const filter: FilterQuery<IPost> = { published: true };
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: "i" } },
      { slug: { $regex: query, $options: "i" } },
      { excerpt: { $regex: query, $options: "i" } }
    ];
  }
  if (tag) {
    filter.tags = tag;
  }

  // Fetch db data
  const [posts, totalCount, allTags] = await Promise.all([
    Post.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments(filter),
    Post.distinct("tags", { published: true })
  ]);

  const totalPages = Math.ceil(totalCount / limit);
  const featured = page === 1 && !query && !tag ? posts[0] : null;
  const rest = posts;

  // Parse query params for links/pagination
  const queryParams = new URLSearchParams();
  if (query) queryParams.set("q", query);
  if (tag) queryParams.set("tag", tag);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header */}
      <section className="relative overflow-hidden mt-5 py-28 md:py-36" style={{ backgroundColor: "var(--bg-secondary)" }}>
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="container-mid relative">
          <p className="label-sm mb-5 animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>Journal</p>
          <h1
            className="heading-display mb-6 text-balance animate-fade-up opacity-0 max-w-3xl"
            style={{ animationDelay: "100ms", animationFillMode: "forwards", color: "var(--text-primary)" }}
          >
            Thinking Out Loud
          </h1>
          <p
            className="body-lg max-w-xl animate-fade-up opacity-0"
            style={{ animationDelay: "200ms", animationFillMode: "forwards", color: "var(--text-secondary)" }}
          >
            Essays on software engineering, product strategy, and the method behind the tools we build.
          </p>
        </div>
      </section>

      <SectionWrapper background="default">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">
          
          {/* Posts Column */}
          <div>
            {!posts.length && (
              <div className="py-12 border border-dashed  text-center" style={{ borderColor: "var(--border-primary)", color: "var(--text-secondary)" }}>
                <p>No posts found matching your criteria.</p>
                {(query || tag) && (
                  <Link href="/journal" className="text-sage font-medium mt-4 inline-block hover:underline">
                    Clear filters
                  </Link>
                )}
              </div>
            )}

            {/* Featured */}
            {featured && (
              <div className="mb-10">
                <p className="label-sm mb-5">Featured</p>
                <BlogCard
                  title={featured.title}
                  slug={featured.slug}
                  excerpt={featured.excerpt}
                  tags={featured.tags}
                  readingTime={featured.readingTime}
                  createdAt={featured.createdAt}
                  variant="featured"
                />
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div className={featured ? "border-t pt-10" : ""} style={featured ? { borderColor: "var(--border-primary)" } : {}}>
                {featured && <p className="label-sm mb-6">All Articles</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {rest.map((post: IPost, i: number) => (
                    <BlogCard
                      key={post._id.toString()}
                      title={post.title}
                      slug={post.slug}
                      excerpt={post.excerpt}
                      tags={post.tags}
                      readingTime={post.readingTime}
                      createdAt={post.createdAt}
                      index={i}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Pagination Component */}
            <JournalPagination 
              currentPage={page} 
              totalPages={totalPages} 
              queryParams={queryParams} 
            />
          </div>

          {/* Sidebar */}
          <aside className="space-y-8" aria-label="Journal sidebar">
            {/* Search */}
            <div className="card-flat rounded-2xl p-6" style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--border-primary)",
              border: "1px solid var(--border-primary)"
            }}>
              <h2 className="font-semibold text-sm mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>
                Search
              </h2>
              <JournalSearch />
            </div>

            {/* Tags */}
            <JournalTagsFilter 
              allTags={allTags as string[]} 
              currentTag={tag}
              currentQuery={query}
            />

            {/* Subscribe box */}
            <div className="rounded-2xl p-6" style={{
              backgroundColor: "var(--bg-secondary)",
              borderColor: "var(--border-primary)",
              border: "1px solid var(--border-primary)"
            }}>
              <h2 className="font-semibold text-sm mb-2 tracking-tight" style={{ color: "var(--text-primary)" }}>
                Subscribe
              </h2>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--text-secondary)" }}>
                Occasional essays. No fluff.
              </p>
              <SubscribeForm />
            </div>
          </aside>
        </div>
      </SectionWrapper>
    </>
  );
}
