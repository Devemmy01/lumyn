import type { Metadata } from "next";
import SectionWrapper from "@/components/SectionWrapper";
import ResendForm from "@/components/store/ResendForm";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    title: "Resend my download links",
    description: "Get fresh download links for a Lumyn field guide you already purchased.",
    path: "/guides/resend",
    noIndex: true,
  });
}

export default function ResendPage() {
  return (
    <SectionWrapper background="default" size="lg">
      <div className="mx-auto max-w-md">
        <p className="label-sm mb-3">Lost your links?</p>
        <h1 className="heading-sm mb-4">Resend my downloads</h1>
        <p className="body-sm mb-8">
          Enter the email you paid with and, if we have orders on file, we&apos;ll send fresh download
          links.
        </p>
        <ResendForm />
      </div>
    </SectionWrapper>
  );
}
