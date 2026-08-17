// ts-node (used to run scripts/*.ts) doesn't reliably pick up Next.js's
// RequestInit augmentation via next-env.d.ts's generated-file reference chain.
// Declare the `next` fetch-cache extension directly so lib/youtube.ts (written
// for the Next.js runtime) type-checks when imported from a plain script.
interface RequestInit {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
}
