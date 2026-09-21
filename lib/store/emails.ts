import { sendLumynEmail, lumynEmailLayout } from "@/lib/resend";
import { absoluteUrl } from "@/lib/seo";
import { getProduct } from "@/lib/store/products";
import { formatNaira } from "@/lib/store/format";
import type { IOrderDocument } from "@/models/Order";
import type { IEntitlementDocument } from "@/models/Entitlement";

export async function sendStoreReceiptEmail({
  order,
  entitlements,
}: {
  order: IOrderDocument;
  entitlements: IEntitlementDocument[];
}) {
  const downloadPageUrl = absoluteUrl(`/guides/download/${order.reference}`);
  const titles = entitlements
    .map((entitlement) => getProduct(entitlement.productSlug)?.title ?? entitlement.productSlug)
    .map((title) => `<li style="margin:6px 0;">${title}</li>`)
    .join("");

  const html = lumynEmailLayout({
    title: "Your guide is ready",
    intro: `Thanks for your order. Here's your receipt and your download links.`,
    body: `
      <p style="margin:0 0 6px;">Order reference: <strong>${order.reference}</strong></p>
      <p style="margin:0 0 18px;">Amount paid: <strong>${formatNaira(order.amountKobo)}</strong></p>
      <p style="margin:0 0 8px;">Included:</p>
      <ul style="margin:0 0 18px;padding-left:20px;">${titles}</ul>
      <p style="margin:0;">Links are valid for a limited time with a download cap per file. If they expire, use the resend form on the store to get fresh ones.</p>
    `,
    ctaLabel: "View your downloads",
    ctaHref: downloadPageUrl,
  });

  await sendLumynEmail({
    to: order.email,
    subject: "Your Lumyn field guide — receipt and downloads",
    html,
    text: `Thanks for your order (${order.reference}). Amount paid: ${formatNaira(order.amountKobo)}. Download your files: ${downloadPageUrl}`,
  });
}

export async function sendStoreResendEmail({
  email,
  references,
}: {
  email: string;
  references: string[];
}) {
  const links = references
    .map((reference) => absoluteUrl(`/guides/download/${reference}`))
    .map((url) => `<li style="margin:6px 0;"><a href="${url}" style="color:#b5a7ff;">${url}</a></li>`)
    .join("");

  const html = lumynEmailLayout({
    title: "Your download links",
    intro: "Here are fresh links to every guide on file for this email address.",
    body: `<ul style="margin:0;padding-left:20px;">${links}</ul>`,
  });

  await sendLumynEmail({
    to: email,
    subject: "Your Lumyn field guide download links",
    html,
    text: `Your download links:\n${references.map((r) => absoluteUrl(`/guides/download/${r}`)).join("\n")}`,
  });
}
