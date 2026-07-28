import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BlogCard from "@/components/BlogCard";
import Reveal from "@/components/Reveal";
import SpatialVisual from "@/components/SpatialVisuals";
import dbConnect from "@/lib/mongodb";
import { academyPositioning, mindFuelPositioning } from "@/lib/ecosystem";
import {
  SITE_URL,
  buildProductJsonLd,
  buildMetadata,
  buildWebPageJsonLd,
  serializeJsonLd,
} from "@/lib/seo";
import Post, { IPost } from "@/models/Post";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Product & Software Development Studio",
    description:
      "Lumyn designs and builds custom software, modern web applications, digital products, and practical learning experiences for founders, teams, and ambitious learners.",
    path: "/",
    keywords: [
      "product development studio",
      "custom software development studio",
      "web application development",
      "MVP development",
      "AI learning platform",
    ],
    imageAlt: "Lumyn product and software development studio",
  }),
  title: { absolute: "Lumyn — Product & Software Development Studio" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    buildWebPageJsonLd({
      path: "/",
      name: "Lumyn - Product & Software Development Studio",
      description:
        "Lumyn is an independent product studio building thoughtful digital products, applied AI experiences, modern web software, Lumyn Academy, and MindFuel.",
      keywords: [
        "product studio",
        "software product studio",
        "applied AI",
        "Lumyn Academy",
        "MindFuel",
      ],
    }),
    {
      "@type": "ItemList",
      "@id": `${SITE_URL}/#products`,
      name: "Lumyn products",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: { "@id": `${SITE_URL}/academy#softwareapplication` },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: { "@id": `${SITE_URL}/mindfuel#softwareapplication` },
        },
      ],
    },
    buildProductJsonLd({
      name: "Lumyn Academy",
      path: "/academy",
      description: academyPositioning,
      image: "/og-image.png",
      applicationCategory: "EducationalApplication",
    }),
    buildProductJsonLd({
      name: "MindFuel",
      path: "/mindfuel",
      description: mindFuelPositioning,
      image: "/mindfuel2.png",
      applicationCategory: "LifestyleApplication",
      sameAs: "https://www.mind-fuel.app",
    }),
  ],
};

const capabilities = [
  {
    number: "01",
    title: "Product strategy",
    copy: "Clear decisions before expensive code. We shape the product, the system, and the path to market.",
  },
  {
    number: "02",
    title: "Design systems",
    copy: "Interfaces that feel coherent at every size, with foundations your product can grow on.",
  },
  {
    number: "03",
    title: "Software engineering",
    copy: "Fast, durable web products built with modern technology and careful technical judgment.",
  },
  {
    number: "04",
    title: "AI experiences",
    copy: "Useful intelligence woven into real workflows—not AI added just to decorate a pitch.",
  },
];

const process = [
  ["01", "Understand", "Find the sharpest version of the problem."],
  ["02", "Shape", "Turn the signal into a focused product direction."],
  ["03", "Build", "Design and engineer the complete experience."],
  ["04", "Refine", "Learn from reality and make the product better."],
];

function ArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3 8h9.5M9 4.5 12.5 8 9 11.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function AcademyMark() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7c6cf6] text-sm font-bold tracking-[-0.03em] text-white shadow-[0_12px_30px_rgba(124,108,246,0.3)]">
      A
    </div>
  );
}

function HeroProductCanvas() {
  return (
    <div className="dark-visual lumyn-noise relative mx-auto max-w-[1280px] overflow-hidden rounded-[1.75rem] border border-white/[0.12] bg-[#09090b] shadow-[0_45px_140px_rgba(0,0,0,0.48)] md:rounded-[2.5rem]">
      <div className="pointer-events-none absolute left-[12%] top-[-9rem] h-96 w-96 rounded-full bg-[#7c6cf6]/20 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-12rem] right-[-6rem] h-[30rem] w-[30rem] rounded-full bg-emerald-300/[0.07] blur-[130px]" />

      <div className="relative flex h-14 items-center justify-between border-b border-white/[0.08] px-5 md:h-16 md:px-7">
        <div className="flex items-center gap-5">
          <div className="flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-[#7c6cf6]" />
          </div>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35 sm:block">
            Lumyn / Product constellation
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.17em] text-white/40">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_16px_rgba(110,231,183,0.9)]" />
          Systems online
        </div>
      </div>

      <div className="relative grid min-h-[610px] md:grid-cols-[72px_1fr]">
        <aside className="hidden flex-col items-center justify-between border-r border-white/[0.08] py-7 md:flex">
          <div className="flex flex-col gap-5">
            {["01", "02", "03"].map((item, index) => (
              <span
                key={item}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-semibold ${
                  index === 0
                    ? "bg-[#7c6cf6] text-white shadow-[0_8px_24px_rgba(124,108,246,0.35)]"
                    : "border border-white/10 text-white/30"
                }`}
              >
                {item}
              </span>
            ))}
          </div>
          <span className="-rotate-90 whitespace-nowrap text-[9px] font-semibold uppercase tracking-[0.28em] text-white/20">
            Built by Lumyn
          </span>
        </aside>

        <div className="grid gap-3 p-3 sm:gap-4 sm:p-4 lg:grid-cols-[1.18fr_0.82fr] lg:p-5">
          <div className="grid gap-3 sm:gap-4 lg:grid-rows-[1.28fr_0.72fr]">
            <div className="relative flex min-h-[430px] flex-col justify-between overflow-hidden rounded-[1.35rem] border border-white/[0.09] bg-[#121217] p-6 sm:p-8 md:rounded-[1.75rem] md:p-10">
              <div className="lumyn-grid pointer-events-none absolute inset-0 opacity-30" />
              <div className="pointer-events-none absolute right-[-5rem] top-[-5rem] h-72 w-72 rounded-full bg-[#7c6cf6]/20 blur-[90px]" />

              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <AcademyMark />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      Lumyn Academy
                    </p>
                    <p className="mt-0.5 text-xs text-white/35">
                      Adaptive learning system
                    </p>
                  </div>
                </div>
                <span className="hidden rounded-full border border-[#a99ef9]/25 bg-[#7c6cf6]/10 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#bcb2ff] sm:block">
                  Flagship / 01
                </span>
              </div>

              <div className="relative my-10">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
                  Generated for your ambition
                </p>
                <h2 className="max-w-xl text-[clamp(2.4rem,5vw,4.65rem)] font-medium leading-[0.9] tracking-[-0.06em] text-white">
                  Learn what
                  <span className="block font-[Georgia] font-normal italic text-[#a99ef9]">
                    moves you forward.
                  </span>
                </h2>
              </div>

              <div className="relative">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.18em] text-white/30">
                      AI Product Engineer
                    </p>
                    <p className="mt-1 text-sm font-medium text-white/75">
                      Personal learning path
                    </p>
                  </div>
                  <p className="text-3xl font-medium tracking-[-0.05em] text-white">
                    68<span className="text-base text-white/30">%</span>
                  </p>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                  <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-[#7c6cf6] via-[#a99ef9] to-[#d5d0ff]" />
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[0.92fr_1.08fr] sm:gap-4">
              <div className="flex min-h-40 flex-col justify-between rounded-[1.35rem] bg-[#7c6cf6] p-6 text-white md:rounded-[1.75rem]">
                <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/55">
                  Our operating idea
                </p>
                <p className="max-w-xs text-2xl font-medium leading-[1.03] tracking-[-0.04em]">
                  Make the complex feel inevitable.
                </p>
              </div>
              <div className="flex min-h-40 flex-col justify-between rounded-[1.35rem] border border-white/[0.09] bg-white/[0.035] p-6 md:rounded-[1.75rem]">
                <div className="flex items-center justify-between text-[9px] font-semibold uppercase tracking-[0.18em] text-white/30">
                  <span>Studio signal</span>
                  <span>2026</span>
                </div>
                <div>
                  <div className="mb-3 flex h-12 items-end gap-1">
                    {[24, 40, 31, 54, 45, 67, 59, 82, 73, 92].map(
                      (height, index) => (
                        <span
                          key={`${height}-${index}`}
                          className="flex-1 rounded-sm bg-gradient-to-t from-[#7c6cf6]/25 to-[#a99ef9]"
                          style={{ height: `${height}%` }}
                        />
                      ),
                    )}
                  </div>
                  <p className="text-sm font-medium text-white/75">
                    Strategy → experience → shipped product
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:gap-4 lg:grid-rows-[1fr_auto]">
            <div className="group relative min-h-[410px] overflow-hidden">
              <Image
                src="/mindfuel2.png"
                alt="MindFuel reflection network interface"
                fill
                priority
                sizes="(max-width: 1024px) 94vw, 35vw"
                className="object-cover object-left-top "
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030a07] via-transparent to-black/20" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                    MindFuel / Product 02
                  </p>
                  <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-emerald-200">
                    Live
                  </span>
                </div>
                <p className="max-w-sm text-3xl font-medium leading-[1.02] tracking-[-0.045em] text-white">
                  A quieter place for louder thoughts.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                ["02", "Live products"],
                ["01", "Connected studio"],
              ].map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-[1.35rem] border border-white/[0.09] bg-white/[0.035] p-5 md:rounded-[1.75rem]"
                >
                  <p className="text-3xl font-medium tracking-[-0.05em] text-white">
                    {value}
                  </p>
                  <p className="mt-5 text-[9px] font-semibold uppercase tracking-[0.17em] text-white/30">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AcademyProductVisual() {
  const modules = [
    ["Product foundations", "Complete", "100%"],
    ["Working with AI models", "In progress", "68%"],
    ["Build and ship", "Up next", "22%"],
  ];

  return (
    <div className="dark-visual relative min-h-[500px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#0a0a0c] p-2 shadow-[0_30px_100px_rgba(0,0,0,0.32)] sm:rounded-[2rem] sm:p-6">
      <div className="lumyn-grid absolute inset-0 opacity-25" />
      <div className="absolute -right-28 -top-24 h-80 w-80 rounded-full bg-[#7c6cf6]/20 blur-[100px]" />

      <div className="relative rounded-[1.5rem] border border-white/10 bg-[#111116]/95 p-5 sm:p-7">
        <div className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AcademyMark />
            <div>
              <p className="text-sm font-semibold text-white">My learning path</p>
              <p className="text-xs text-white/35">AI Product Engineer</p>
            </div>
          </div>
          <span className="hidden rounded-full bg-emerald-400/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300 sm:inline-flex">
            On track
          </span>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
              Path progress
            </p>
            <div className="my-7 flex items-end gap-2">
              <p className="text-6xl font-medium tracking-[-0.06em] text-white">
                68
              </p>
              <p className="pb-2 text-lg text-white/35">%</p>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[68%] rounded-full bg-[#7c6cf6]" />
            </div>
            <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.035] p-4">
              <p className="text-xs text-white/35">Up next</p>
              <p className="mt-2 text-sm font-medium text-white/80">
                Build your first AI workflow
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {modules.map(([title, status, progress], index) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.035] p-4"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] ${
                      index === 0
                        ? "bg-emerald-400 text-black"
                        : index === 1
                          ? "bg-[#7c6cf6] text-white"
                          : "bg-white/10 text-white/40"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white/80">
                      {title}
                    </p>
                    <div className="mt-2 flex justify-between text-[10px] text-white/30">
                      <span>{status}</span>
                      <span>{progress}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap w-full gap-3">
        {["Astra tutor", "Build projects", "Earn certificates"].map((item) => (
          <div
            key={item}
            className="rounded-2xl w-full border border-white/10 bg-white/[0.035] px-3 py-4 text-center text-[11px] text-white/50"
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function MindFuelProductVisual() {
  return (
    <div className="dark-visual relative min-h-[500px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#080a0a] p-2 shadow-[0_30px_100px_rgba(0,0,0,0.32)] sm:rounded-[2rem] sm:p-6">
      <div className="absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-emerald-400/10 blur-[100px]" />
      <div className="lumyn-grid absolute inset-0 opacity-25" />

      <div className="relative grid min-h-[450px] gap-2 md:grid-cols-[0.76fr_1.24fr] md:gap-4">
        <div className="flex flex-col justify-between rounded-[1.25rem] border border-white/10 bg-[#101314] p-5 sm:rounded-[1.5rem]">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <Image
                src="/mindlogo.png"
                alt=""
                width={40}
                height={40}
                className="h-10 w-10 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm font-semibold text-white">MindFuel</p>
                <p className="text-xs text-white/35">Daily reflection</p>
              </div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30">
              Today&apos;s thought
            </p>
            <p className="mt-4 text-2xl font-medium leading-tight tracking-[-0.035em] text-white">
              What did life teach you when you slowed down?
            </p>
          </div>
          <div className="space-y-2">
            {["Perspective", "Growth", "Human"].map((tag) => (
              <div
                key={tag}
                className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3"
              >
                <span className="text-xs text-white/50">{tag}</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/70" />
              </div>
            ))}
          </div>
        </div>

        <div className="group relative min-h-[470px] overflow-hidden rounded-[1.25rem] border border-white/10 bg-[radial-gradient(circle_at_50%_38%,rgba(52,211,153,0.12),transparent_48%),linear-gradient(145deg,#111817,#050606)] sm:rounded-[1.5rem] md:min-h-[450px]">
          <Image
            src="/mindfuel2.png"
            alt="MindFuel mobile reflection experience"
            fill
            sizes="(max-width: 767px) 92vw, 42vw"
            className="object-contain object-center p-3 drop-shadow-[0_30px_45px_rgba(0,0,0,0.5)] transition duration-700 group-hover:scale-[1.025] sm:p-5"
          />
          <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-2 backdrop-blur-xl sm:right-5 sm:top-5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
            <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-white/65">
              Live mobile experience
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function HomePage() {
  let latestPosts: IPost[] = [];

  try {
    await dbConnect();
    latestPosts = (await Post.find({ published: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean()) as unknown as IPost[];
  } catch (error) {
    console.warn("Homepage rendered without latest journal posts.", error);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />

      <section className="relative overflow-hidden bg-[color:var(--bg-primary)] pb-20 pt-12 md:pb-28 md:pt-20 lg:pb-36">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[54rem] bg-[radial-gradient(circle_at_72%_0%,rgba(124,108,246,0.2),transparent_52%)]" />
        <div className="pointer-events-none absolute left-[-8rem] top-56 h-72 w-72 rounded-full bg-cyan-300/[0.06] blur-[100px]" />
        <div className="container-wide relative">
          <div className="border-b border-black/10 pb-10 dark:border-white/10 md:pb-14">
            <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between md:mb-16">
              <p className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-tertiary)]">
                <span className="h-2 w-2 rounded-full bg-[#7c6cf6] shadow-[0_0_18px_rgba(124,108,246,0.75)]" />
                Independent product studio
              </p>
              {/* <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[color:var(--text-tertiary)]">
                Lagos / Working worldwide
              </p> */}
            </div>

            <h1 className="max-w-[1320px] text-balance text-[clamp(3.8rem,9.35vw,9.25rem)] font-medium leading-[0.82] tracking-[-0.074em] text-[color:var(--text-primary)]">
              We make the complex
              <span className="block pl-[8vw] font-[Georgia] font-normal italic tracking-[-0.055em] text-[#8f7ff7] sm:pl-[13vw]">
                feel beautifully simple.
              </span>
            </h1>

            <div className="mt-11 grid gap-8 md:mt-16 md:grid-cols-12 md:items-end">
              <div className="md:col-span-5">
                <p className="max-w-md text-[10px] font-semibold uppercase leading-5 tracking-[0.13em] text-[color:var(--text-tertiary)]">
                  Product strategy · Experience design · Engineering · Applied AI
                </p>
              </div>
              <div className="md:col-span-7 lg:col-span-6 lg:col-start-7">
                <p className="max-w-2xl text-balance text-lg leading-8 text-[color:var(--text-secondary)] md:text-xl">
                  Lumyn turns ambitious ideas into clear digital products.
                </p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/contact"
                    className="group inline-flex min-h-14 items-center justify-between gap-8 rounded-full bg-[color:var(--text-primary)] px-6 text-sm font-semibold text-[color:var(--bg-primary)] transition hover:bg-[#7c6cf6] hover:text-white sm:min-w-[205px]"
                  >
                    Build with Lumyn
                    <span className="transition-transform group-hover:translate-x-1">
                      <ArrowIcon />
                    </span>
                  </Link>
                  <Link
                    href="#featured-products"
                    className="group inline-flex min-h-14 items-center justify-between gap-7 rounded-full border border-black/10 px-6 text-sm font-semibold transition hover:border-[#7c6cf6] dark:border-white/10 sm:min-w-[190px]"
                  >
                    Explore the work
                    <span className="text-[#7c6cf6] transition-transform group-hover:translate-y-0.5">
                      ↓
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-10 md:mt-14">
            <div className="pointer-events-none absolute -inset-x-10 top-20 h-[65%] rounded-full bg-[#7c6cf6]/10 blur-[100px]" />
            <HeroProductCanvas />
          </div>

          <Reveal
            delay={100}
            variant="fade"
            className="mt-7 grid grid-cols-2 border-y border-black/10 dark:border-white/10 sm:grid-cols-4"
          >
            {[
              ["01", "Studio practice"],
              ["02", "Products in market"],
              ["03", "Connected ecosystem"],
              ["∞", "Room to evolve"],
            ].map(([value, label]) => (
                <div
                  key={label}
                  className="flex items-center gap-4 border-black/10 px-4 py-5 odd:border-r dark:border-white/10 sm:border-r sm:px-6 sm:last:border-r-0"
                >
                  <span className="text-xl font-medium tracking-[-0.04em] text-[color:var(--text-primary)]">
                    {value}
                  </span>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.17em] text-[color:var(--text-tertiary)]">
                    {label}
                  </span>
                </div>
              ))}
          </Reveal>
        </div>
      </section>

      <section
        id="philosophy"
        className="border-y border-black/10 bg-[color:var(--bg-secondary)] py-20 dark:border-white/10 md:py-28 lg:py-36"
      >
        <div className="container-wide">
          <Reveal className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:gap-16">
            <div className="order-2 lg:order-1">
              <SpatialVisual variant="orbital" />
            </div>
            <div className="order-1 lg:order-2">
              <p className="label-sm">How we think</p>
              <h2 className="mt-6 max-w-4xl text-balance text-[clamp(2.7rem,5.8vw,5.8rem)] font-medium leading-[0.94] tracking-[-0.06em]">
                Technology should feel less like machinery,
                <span className="block font-[Georgia] font-normal italic text-[#8f7ff7]">
                  more like momentum.
                </span>
              </h2>
              <p className="mt-8 max-w-2xl text-lg leading-8 text-[color:var(--text-secondary)]">
                We connect strategy, design and engineering early—removing
                friction before it becomes expensive and making every detail
                earn its place.
              </p>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:mt-16">
            {capabilities.map((capability, index) => (
              <Reveal
                key={capability.title}
                delay={index * 70}
                variant="up"
              >
                <div
                  className={`group relative flex min-h-[220px] overflow-hidden rounded-[1.5rem] border p-6 transition duration-500 hover:-translate-y-1 md:min-h-[250px] md:p-8 ${
                    index === 1
                      ? "border-[#7c6cf6] bg-[#7c6cf6] text-white shadow-[0_28px_80px_rgba(124,108,246,0.2)]"
                      : index === 2
                        ? "dark-visual border-white/10 bg-[#0b0b0d] text-white shadow-[0_28px_80px_rgba(0,0,0,0.22)]"
                        : "border-black/10 bg-[color:var(--bg-primary)] hover:border-[#7c6cf6]/35 dark:border-white/10"
                  }`}
                >
                  {index === 1 && (
                    <div className="pointer-events-none absolute -right-12 -top-16 h-60 w-60 rounded-full border border-white/15" />
                  )}
                  {index === 2 && (
                    <div className="lumyn-grid pointer-events-none absolute inset-0 opacity-25" />
                  )}
                  <div className="relative flex w-full flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        index === 1 || index === 2
                          ? "text-white/50"
                          : "text-[color:var(--text-tertiary)]"
                      }`}
                    >
                      {capability.number}
                    </span>
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full border transition ${
                        index === 1 || index === 2
                          ? "border-white/20 text-white/70 group-hover:bg-white group-hover:text-[#17131f]"
                          : "border-black/10 text-[color:var(--text-tertiary)] group-hover:border-[#7c6cf6] group-hover:bg-[#7c6cf6] group-hover:text-white dark:border-white/10"
                      }`}
                    >
                      <ArrowIcon />
                    </span>
                  </div>
                  <div className="max-w-xl">
                    <h3 className="text-2xl font-medium tracking-[-0.04em] md:text-3xl">
                      {capability.title}
                    </h3>
                    <p
                      className={`mt-4 max-w-lg text-sm leading-6 ${
                        index === 1 || index === 2
                          ? "text-white/60"
                          : "text-[color:var(--text-secondary)]"
                      }`}
                    >
                      {capability.copy}
                    </p>
                  </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section
        id="featured-products"
        className="bg-[color:var(--bg-primary)] py-20 md:py-28 lg:py-36"
      >
        <div className="container-wide">
          <Reveal className="mb-12 flex flex-col gap-7 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-sm mb-5">Featured products</p>
              <h2 className="max-w-4xl text-balance text-[clamp(2.8rem,6vw,6.5rem)] font-medium leading-[0.94] tracking-[-0.055em]">
                Products with a point of view.
              </h2>
            </div>
            <p className="max-w-sm text-base leading-7 text-[color:var(--text-secondary)] md:text-right">
              Built inside Lumyn, shaped by the same belief that software should
              feel useful, calm, and alive.
            </p>
          </Reveal>

          <article
            id="academy"
            className="grid gap-0 overflow-hidden rounded-[2rem] border border-black/10 bg-[color:var(--bg-secondary)] dark:border-white/10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center lg:gap-10 lg:p-10"
          >
            <Reveal className="p-6 sm:p-8 lg:p-0">
              <div className="flex items-center gap-3">
                <AcademyMark />
                <div>
                  <p className="text-sm font-semibold">Lumyn Academy</p>
                  <p className="text-xs text-[color:var(--text-tertiary)]">
                    Flagship product · AI learning
                  </p>
                </div>
              </div>
              <h3 className="mt-9 text-balance text-[clamp(3rem,5vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.055em]">
                A learning path built for you.
              </h3>
              <p className="mt-7 max-w-lg text-lg leading-8 text-[color:var(--text-secondary)]">
                {academyPositioning}
              </p>
              <div className="my-8 flex flex-wrap gap-2">
                {["Generated paths", "Astra AI tutor", "Practical projects"].map(
                  (feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-black/10 px-4 py-2 text-xs text-[color:var(--text-secondary)] dark:border-white/10"
                    >
                      {feature}
                    </span>
                  ),
                )}
              </div>
              <Link href="/academy" className="btn-primary">
                Explore Academy
                <span className="ml-2">
                  <ArrowIcon />
                </span>
              </Link>
            </Reveal>

            <Reveal
              delay={110}
              variant="scale"
              className="px-2 pb-2 sm:px-5 sm:pb-5 lg:p-0"
            >
              <AcademyProductVisual />
            </Reveal>
          </article>

          <div className="h-5 md:h-8" />

          <article
            id="mindfuel"
            className="grid gap-0 overflow-hidden rounded-[2rem] border border-black/10 bg-[color:var(--bg-secondary)] dark:border-white/10 lg:grid-cols-[1.28fr_0.72fr] lg:items-center lg:gap-10 lg:p-10"
          >
            <Reveal
              delay={110}
              variant="scale"
              className="order-2 px-2 pb-2 sm:px-5 sm:pb-5 lg:order-1 lg:p-0"
            >
              <MindFuelProductVisual />
            </Reveal>

            <Reveal className="order-1 p-6 sm:p-8 lg:order-2 lg:p-0">
              <div className="flex items-center gap-3">
                <Image
                  src="/mindlogo.png"
                  alt=""
                  width={40}
                  height={40}
                  className="h-10 w-10 rounded-xl object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">MindFuel</p>
                  <p className="text-xs text-[color:var(--text-tertiary)]">
                    Live product · Reflection network
                  </p>
                </div>
              </div>
              <h3 className="mt-9 text-balance text-[clamp(3rem,5vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.055em]">
                Growth feels better together.
              </h3>
              <p className="mt-7 max-w-lg text-lg leading-8 text-[color:var(--text-secondary)]">
                {mindFuelPositioning}
              </p>
              <div className="my-8 flex flex-wrap gap-2">
                {["Document life", "Share perspective", "Grow together"].map(
                  (feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-black/10 px-4 py-2 text-xs text-[color:var(--text-secondary)] dark:border-white/10"
                    >
                      {feature}
                    </span>
                  ),
                )}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link href="https://www.mind-fuel.app" className="btn-primary">
                  Visit MindFuel
                  <span className="ml-2">
                    <ArrowIcon />
                  </span>
                </Link>
                <Link href="/mindfuel" className="btn-secondary">
                  Learn more
                </Link>
              </div>
            </Reveal>
          </article>
        </div>
      </section>

      <section
        id="process"
        className="border-y border-black/10 bg-[color:var(--bg-secondary)] py-20 dark:border-white/10 md:py-28 lg:py-32"
      >
        <div className="container-wide">
          <Reveal className="grid gap-7 md:grid-cols-[1fr_0.72fr] md:items-end lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <p className="label-sm">The Lumyn way</p>
              <h2 className="mt-5 max-w-lg text-[clamp(2.6rem,5vw,5rem)] font-medium leading-[0.96] tracking-[-0.055em]">
                One team,
                <span className="block font-[Georgia] font-normal italic text-[#8f7ff7]">
                  one clear rhythm.
                </span>
              </h2>
            </div>
            <div>
              <p className="max-w-lg text-base leading-7 text-[color:var(--text-secondary)] md:text-lg md:leading-8">
                No relay race between departments. One senior team stays close
                from the first sharp question through launch and the learning
                that comes after it.
              </p>
            </div>
          </Reveal>

          <Reveal
            variant="up"
            className="mt-12 overflow-hidden rounded-[2rem] border border-black/10 bg-[color:var(--bg-primary)] dark:border-white/10 md:mt-16"
          >
            <div className="grid lg:grid-cols-[0.86fr_1.14fr]">
              <div className="p-3 sm:p-4 lg:p-5">
                <SpatialVisual
                  variant="process"
                  className="h-full min-h-[430px] border-0 md:min-h-[500px]"
                />
              </div>
              <div className="border-t border-black/10 px-5 dark:border-white/10 sm:px-7 lg:border-l lg:border-t-0 lg:px-9">
                {process.map(([number, title, copy], index) => (
                  <div
                    key={title}
                    className="group grid gap-3 border-b border-black/10 py-7 last:border-b-0 dark:border-white/10 sm:grid-cols-[3rem_0.65fr_1fr] sm:items-center sm:gap-5 md:py-8"
                  >
                    <span className="text-[10px] font-semibold text-[#7c6cf6]">
                      {number}
                    </span>
                    <h3 className="text-2xl font-medium tracking-[-0.035em] transition-colors group-hover:text-[#7c6cf6]">
                      {title}
                    </h3>
                    <p className="max-w-sm text-sm leading-6 text-[color:var(--text-secondary)]">
                      {copy}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section
        id="journal"
        className="bg-[color:var(--bg-primary)] py-20 md:py-28"
      >
        <div className="container-wide">
          <Reveal className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="label-sm mb-5">From the journal</p>
              <h2 className="text-4xl font-medium tracking-[-0.045em] md:text-6xl">
                Thinking in public.
              </h2>
            </div>
            <Link href="/journal" className="btn-secondary shrink-0">
              Browse all notes
            </Link>
          </Reveal>

          {latestPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-3">
              {latestPosts.map((post, index) => (
                <Reveal
                  key={post.slug}
                  delay={index * 70}
                  variant="up"
                  className="flex h-full"
                >
                  <BlogCard
                    title={post.title}
                    slug={post.slug}
                    excerpt={post.excerpt}
                    tags={post.tags}
                    readingTime={post.readingTime}
                    createdAt={post.createdAt}
                    index={index}
                    variant={index === 0 ? "featured" : "default"}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal>
              <div className="flex flex-col gap-5 border-y border-black/10 py-8 text-[color:var(--text-secondary)] dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
                <p>New studio notes are being prepared.</p>
                <Link href="/journal" className="text-sm font-semibold text-[color:var(--text-primary)]">
                  Visit the journal →
                </Link>
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
