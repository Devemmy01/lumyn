import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

/** Stamps the buyer's email into the footer of every page so a leaked copy
 * traces back to whoever bought it. Server-side only — never touches the
 * client bundle. If stamping fails for any reason (a malformed source PDF,
 * for example) the caller should fall back to serving the original bytes
 * rather than blocking a paying customer's download. */
export async function stampPdfFooter(bytes: Uint8Array, email: string): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(bytes);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const label = `Licensed to ${email} — please don't redistribute.`;

  for (const page of pdfDoc.getPages()) {
    page.drawText(label, {
      x: 28,
      y: 16,
      size: 7,
      font,
      color: rgb(0.55, 0.55, 0.55),
      opacity: 0.8,
    });
  }

  return pdfDoc.save();
}
