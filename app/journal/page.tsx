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

export const metadata: Metadata = {
  title: "Journal",
  description:
    "Essays on calm technology, digital minimalism, focus tools, and intentional software. Thinking out loud from the Lumyn.",
  keywords: [
    "calm technology essays",
    "digital minimalism blog",
    "focus tools",
    "information overload solutions",
    "intentional technology",
    "calm productivity",
  ],
  openGraph: {
    title: "Journal | Lumyn",
    description: "Essays on calm technology, digital minimalism, and intentional software.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Lumyn Journal",
  description: "Essays on calm technology, digital minimalism, and intentional software.",
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
      <section className="relative overflow-hidden bg-ivory py-28 md:py-36">
        <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" aria-hidden="true" />
        <div className="container-mid relative">
          <p className="label-sm mb-5 animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>Journal</p>
          <h1
            className="heading-display text-charcoal mb-6 text-balance animate-fade-up opacity-0 max-w-3xl"
            style={{ animationDelay: "100ms", animationFillMode: "forwards" }}
          >
            Thinking Out Loud
          </h1>
          <p
            className="body-lg text-charcoal-muted max-w-xl animate-fade-up opacity-0"
            style={{ animationDelay: "200ms", animationFillMode: "forwards" }}
          >
            Essays on calm technology, digital minimalism, focus, and the philosophy behind the tools we build.
          </p>
        </div>
      </section>

      <SectionWrapper background="default">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16">
          
          {/* Posts Column */}
          <div>
            {!posts.length && (
              <div className="py-12 border border-stone/40 border-dashed rounded-2xl text-center">
                <p className="text-charcoal-muted">No posts found matching your criteria.</p>
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
              <div className={featured ? "border-t border-stone/60 pt-10" : ""}>
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
            <div className="card-flat">
              <h2 className="font-semibold text-charcoal text-sm mb-4 tracking-tight">
                Search
              </h2>
              <JournalSearch />
            </div>

            {/* Tags */}
            <div className="card-flat">
              <h2 className="font-semibold text-charcoal text-sm mb-4 tracking-tight flex items-center justify-between">
                Browse by Topic
                {tag && (
                  <Link href={`/journal${query ? `?q=${query}` : ''}`} className="text-xs text-sage font-medium hover:underline">
                    Clear Tag
                  </Link>
                )}
              </h2>
              <div className="flex flex-wrap gap-2">
                {allTags.sort().map((t) => {
                  const isActive = tag === t;
                  const tagParams = new URLSearchParams(queryParams.toString());
                  if (isActive) tagParams.delete("tag");
                  else tagParams.set("tag", t);
                  tagParams.delete("page");
                  
                  return (
                    <Link 
                      key={t} 
                      href={`/journal?${tagParams.toString()}`}
                      className={`tag transition-colors hover:bg-sage hover:text-white ${
                        isActive ? "bg-sage text-white" : "bg-stone/20 text-charcoal-muted"
                      }`}
                    >
                      {t.replace(/-/g, " ")}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Subscribe box */}
            <div className="rounded-2xl bg-charcoal p-6">
              <h2 className="font-semibold text-ivory text-sm mb-2 tracking-tight">
                Subscribe
              </h2>
              <p className="text-ivory/60 text-xs leading-relaxed mb-4">
                Occasional essays. No noise.
              </p>
              <SubscribeForm />
            </div>
          </aside>
        </div>
      </SectionWrapper>
    </>
  );
}
