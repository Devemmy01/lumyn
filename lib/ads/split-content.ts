/** Splits article HTML after the Nth top-level block element (paragraph,
 * heading, list, quote, etc.) so an ad slot can be inserted between the
 * returned halves. Not a full HTML parser — a regex-based split on closing
 * block tags, which is enough for TipTap-generated article HTML. Returns
 * null if the content doesn't have that many blocks (e.g. a short post),
 * so the caller can skip the insertion rather than force it. */
export function splitAfterBlock(
  html: string,
  blockIndex: number,
): { before: string; after: string } | null {
  const blockClosePattern = /<\/(p|h1|h2|h3|h4|h5|h6|ul|ol|blockquote|pre|table|figure)>/gi;
  let match: RegExpExecArray | null;
  let count = 0;

  while ((match = blockClosePattern.exec(html)) !== null) {
    count += 1;
    if (count === blockIndex) {
      const splitAt = match.index + match[0].length;
      return { before: html.slice(0, splitAt), after: html.slice(splitAt) };
    }
  }

  return null;
}
