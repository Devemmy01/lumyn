import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import BlogCard from "@/components/BlogCard";
import SectionWrapper from "@/components/SectionWrapper";
import JournalPagination from "@/components/JournalPagination";
import JournalTagsFilter from "@/components/JournalTagsFilter";
import InteriorHero from "@/components/InteriorHero";
import { buildMetadata, buildWebPageJsonLd, serializeJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

/** Thin listing pages (1-2 posts) aren't worth indexing. */
const MIN_POSTS_TO_INDEX = 3;

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

function tagLabel(slug: string) {
  return slug.replace(/-/g, " ");
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number.parseInt(String(pageParam ?? "1"), 10) || 1);
  const label = tagLabel(slug);

  await dbConnect();
  const count = await Post.countDocuments({ published: true, tags: slug });

  return buildMetadata({
    title: `${label} Articles${page > 1 ? ` | Page ${page}` : ""}`,
    description: `Essays and guides tagged "${label}" from the Lumyn journal — software engineering, product strategy, and building useful digital products.`,
    path: `/journal/tag/${slug}${page > 1 ? `?page=${page}` : ""}`,
    noIndex: count < MIN_POSTS_TO_INDEX,
  });
}

export default async function JournalTagPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const page = parseInt(resolvedSearchParams.page as string) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  await dbConnect();

  const filter = { published: true, tags: slug };
  const [posts, totalCount, allTags] = await Promise.all([
    Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Post.countDocuments(filter),
    Post.distinct("tags", { published: true }),
  ]);

  if (totalCount === 0 && page === 1) {
    notFound();
  }

  const totalPages = Math.ceil(totalCount / limit);
  const label = tagLabel(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      buildWebPageJsonLd({
        path: `/journal/tag/${slug}`,
        name: `${label} Articles`,
        description: `Essays tagged "${label}" from the Lumyn journal.`,
        pageType: "CollectionPage",
      }),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <InteriorHero
        eyebrow="Journal"
        title={label}
        accent="articles."
        description={`Essays and guides tagged "${label}."`}
        signals={["Product thinking", "Engineering", "Learning"]}
        note="Lumyn journal"
      />

      <SectionWrapper background="default">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_300px] lg:gap-16">
          {/* Posts column */}
          <div>
            <Link href="/journal" className="text-sage font-medium mb-8 inline-block hover:underline">
              ← All articles
            </Link>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {posts.map((post: IPost, i: number) => (
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

            <JournalPagination
              currentPage={page}
              totalPages={totalPages}
              queryParams={new URLSearchParams()}
              basePath={`/journal/tag/${slug}`}
            />
          </div>

          {/* Sidebar */}
          <aside className="h-fit space-y-5 lg:sticky lg:top-32" aria-label="Journal sidebar">
            <JournalTagsFilter allTags={allTags as string[]} currentTag={slug} />
          </aside>
        </div>
      </SectionWrapper>
    </>
  );
}
