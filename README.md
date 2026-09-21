# Lumyn

## Store, ads, and free tools

Three additions to the marketing site, alongside the existing journal/academy/marketplace:

- **`/guides`** — a small store selling three PDF field guides (individually or bundled) via Paystack. Product/price config: [lib/store/products.ts](lib/store/products.ts). Guide PDFs live in MongoDB GridFS, never in `/public`; download links are signed, expiring, and download-capped.
- **`/tools`** — three free calculators (invoice generator, send-money comparison, employer cost calculator), sharing [components/tools/ToolLayout.tsx](components/tools/ToolLayout.tsx).
- **Ad slots** — [components/ads/AdSlot.tsx](components/ads/AdSlot.tsx), config in [lib/ads/config.ts](lib/ads/config.ts). Structurally absent from every store page via [lib/ads/no-ads-zone.tsx](lib/ads/no-ads-zone.tsx) — never a prop that can be forgotten.

### Setup

Copy `.env.example` to `.env.local` and fill in the values — every var is commented. The store reuses `PAYSTACK_SECRET_KEY` (already required for the Academy marketplace); ad slots need nothing until you paste in real network tag templates from Adsterra/Monetag.

### Uploading a guide PDF

```bash
export MONGODB_URI=...
npm run store:upload -- --slug getting-paid --file ~/Desktop/getting-paid.pdf
```

Re-running for the same slug replaces the file. Placeholder PDFs are already uploaded for all three guides so the store is demoable today — replace them with the real guides before launch.

### Admin

No dashboard — orders are listed and entitlements re-issued via `/api/admin/store/orders` (GET to list, POST `{ action: "reissue", orderId }` to reissue), protected the same way as the rest of `/api/admin/*` (sign in at `/admin/login`).

### Tests

```bash
export MONGODB_URI=...
npm test
```

Runs against the real database in `MONGODB_URI` with test-prefixed, self-cleaning data — there's no mock DB in this project. Uses Node's built-in test runner (`node:test`), so there's no new test-framework dependency. Covers webhook signature verification, the full verify/fulfil flow (including the callback/webhook race), download token validation, bundle resolution, and the PAYE/employer-cost math.

### Known data that needs your input before launch

- **Guide cover images and sample extracts** — `/public/covers/` and `/public/samples/` currently render/serve generated placeholders. Drop real files in with the same names and they're picked up automatically, no code change.
- **Send-money provider fees** ([lib/tools/send-money/providers.ts](lib/tools/send-money/providers.ts)) — illustrative placeholder numbers, clearly marked. Verify each provider's real fee and rate margin before this goes live.
- **Employer cost tax constants** ([lib/tools/employer-cost/tax-constants.ts](lib/tools/employer-cost/tax-constants.ts)) — sourced from secondary reporting on the Nigeria Tax Act 2025, not the gazetted text. Verify against FIRS guidance.
- **Ad network tags** — `NEXT_PUBLIC_ADSTERRA_TAG_TEMPLATE` / `NEXT_PUBLIC_MONETAG_TAG_TEMPLATE` / `NEXT_PUBLIC_AD_SCRIPT_ORIGINS` are blank until you paste in real values from each network's dashboard; slots render an empty reserved box until then.
- **Payment policy copy** ([app/guides/payment-policy/page.tsx](app/guides/payment-policy/page.tsx)) — placeholder prose, ready to swap for the real policy.
