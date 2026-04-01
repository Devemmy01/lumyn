import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dbConnect from "@/lib/mongodb";
import Post, { IPost } from "@/models/Post";
import SectionWrapper from "@/components/SectionWrapper";
import BlogCard from "@/components/BlogCard";
import UpvoteButton from "@/components/UpvoteButton";
import ShareButtons from "@/components/ShareButtons";
import { buildMetadata, buildArticleJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  await dbConnect();
  const { slug } = await params;
  const post = await Post.findOne({ slug, published: true }).lean();

  if (!post) {
    return { title: "Article Not Found" };
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/journal/${post.slug}`,
    type: "article",
    publishedAt: post.createdAt?.toISOString(),
  });
}

// NextJS dynamic params caching
export async function generateStaticParams() {
  try {
    await dbConnect();
    const posts = await Post.find({ published: true }).select("slug").lean();
    return posts.map((post) => ({ slug: post.slug }));
  } catch (error) {
    console.error("Statically generating params failed (DB connection error):", error);
    return [];
  }
}

export default async function JournalPostPage({ params }: PageProps) {
  await dbConnect();
  const { slug } = await params;
  
  const post = await Post.findOne({ slug, published: true }).lean();
  if (!post) notFound();

  // Fetch related posts (same tags, exclude self)
  const relatedPosts = await Post.find({
    published: true,
    _id: { $ne: post._id },
    tags: { $in: post.tags }
  })
    .sort({ createdAt: -1 })
    .limit(2)
    .lean();

  // If no related via tag, just get latest
  const finalRelated = relatedPosts.length > 0 
    ? relatedPosts 
    : await Post.find({ published: true, _id: { $ne: post._id } })
        .sort({ createdAt: -1 })
        .limit(2)
        .lean();


  // Use SEO lib helper for JSON-LD
  const jsonLd = buildArticleJsonLd({
    title: post.title,
    description: post.excerpt,
    slug: post.slug,
    publishedAt: post.createdAt?.toISOString() || new Date().toISOString(),
    tags: post.tags || [],
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ivory py-2 mt-5 md:py-12">
        <div className="absolute inset-0 bg-dots opacity-25 pointer-events-none" aria-hidden="true" />
        <div className="container-narrow relative">
          {/* Back */}
          <Link
            href="/journal"
            className="inline-flex items-center gap-2 text-charcoal-muted hover:text-charcoal
                       text-sm mb-10 transition-colors duration-200 group"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                 className="transition-transform duration-200 group-hover:-translate-x-1"
                 aria-hidden="true">
              <path d="M13 7H1M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back to Journal
          </Link>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6" aria-label="Article topics">
              {post.tags.map((tag: string) => (
                <span key={tag} className="tag">{tag.replace(/-/g, " ")}</span>
              ))}
            </div>
          )}

          <h1 className="heading-lg text-charcoal mb-6 text-balance animate-fade-up opacity-0"
              style={{ animationDelay: "100ms", animationFillMode: "forwards" }}>
            {post.title}
          </h1>

          <div className="flex items-center gap-2 md:gap-4 text-sm text-charcoal-muted/60">
            <span>Lumyn</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.createdAt?.toISOString()}>
              {new Date(post.createdAt || Date.now()).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric"
              })}
            </time>
            {post.readingTime && (
              <>
                <span aria-hidden="true">·</span>
                <span>{post.readingTime} min read</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <SectionWrapper background="default" container="narrow" size="sm">
        {post.coverImage && (
          <div className="mb-12 rounded-xl overflow-hidden bg-stone/20">
            <Image src={post.coverImage} alt={post.title} width={1200} height={630} className="w-full h-auto object-cover" />
          </div>
        )}
        <article
          className="prose prose-lumyn max-w-none text-charcoal-muted prose-headings:text-charcoal prose-a:text-sage prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl"
          aria-label="Article content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        
        <div className="mt-16 pt-8 border-t border-stone/60 flex flex-col sm:flex-row justify-between items-center gap-8">
          <UpvoteButton postId={post._id.toString()} initialUpvotes={post.upvotes || 0} />
          <ShareButtons title={post.title} slug={post.slug} />
        </div>
      </SectionWrapper>

      {/* Share + Tags */}
      <SectionWrapper background="tinted" container="narrow" size="sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6
                        border-t border-stone/60 pt-8">
          <div>
            <p className="text-xs text-charcoal-muted/60 mb-2 uppercase tracking-widest font-medium">
              Filed under
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <span key={tag} className="tag">{tag.replace(/-/g, " ")}</span>
              ))}
            </div>
          </div>

          <Link href="/journal" className="btn-ghost group shrink-0">
            More articles
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                 className="transition-transform duration-200 group-hover:translate-x-1"
                 aria-hidden="true">
              <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
                    strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </SectionWrapper>

      {/* Related */}
      {finalRelated.length > 0 && (
        <SectionWrapper background="default" size="sm">
          <div className="container-mid">
            <p className="label-sm mb-6">Continue Reading</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {finalRelated.map((related: IPost, i: number) => (
                <BlogCard
                  key={related._id.toString()}
                  title={related.title}
                  slug={related.slug}
                  excerpt={related.excerpt}
                  tags={related.tags}
                  readingTime={related.readingTime}
                  createdAt={related.createdAt || Date.now()}
                  index={i}
                />
              ))}
            </div>
          </div>
        </SectionWrapper>
      )}
    </>
  );
}
