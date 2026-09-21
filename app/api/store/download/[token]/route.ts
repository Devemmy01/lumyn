import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Entitlement from "@/models/Entitlement";
import { downloadCap } from "@/lib/store/download-tokens";
import { findGuideFile, openGuideDownloadStream, guideFilename } from "@/lib/store/files";
import { stampPdfFooter } from "@/lib/store/watermark";
import { getProduct } from "@/lib/store/products";

async function streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  try {
    await connectDB();

    const entitlement = await Entitlement.findOne({ downloadToken: token });
    if (!entitlement) {
      return NextResponse.json({ error: "This download link isn't valid." }, { status: 404 });
    }

    if (entitlement.tokenExpiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "This download link has expired. Request a fresh one below." },
        { status: 410 },
      );
    }

    const cap = downloadCap();
    if (entitlement.downloadCount >= cap) {
      return NextResponse.json(
        { error: `This link has reached its ${cap}-download limit. Request a fresh one below.` },
        { status: 429 },
      );
    }

    const filename = guideFilename(entitlement.productSlug);
    const file = await findGuideFile(filename);
    if (!file) {
      console.error(`[store download] Guide file missing from storage: ${filename}`);
      return NextResponse.json({ error: "This file isn't available yet. Please contact support." }, { status: 503 });
    }

    const rawStream = await openGuideDownloadStream(file._id);
    const rawBytes = await streamToBuffer(rawStream);

    let bytes: Uint8Array = rawBytes;
    try {
      bytes = await stampPdfFooter(rawBytes, entitlement.email);
    } catch (error) {
      console.warn("[store download] Watermarking failed, serving original file", error);
    }

    entitlement.downloadCount += 1;
    entitlement.lastDownloadedAt = new Date();
    await entitlement.save();

    const product = getProduct(entitlement.productSlug);
    const downloadName = `${product?.title ?? entitlement.productSlug}.pdf`;

    return new NextResponse(new Blob([new Uint8Array(bytes)]), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${downloadName.replace(/"/g, "")}"`,
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  } catch (error) {
    console.error("[store download]", error);
    return NextResponse.json({ error: "Could not process this download." }, { status: 500 });
  }
}
