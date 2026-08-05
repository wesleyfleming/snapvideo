# Resto Copilot — Product Spec v0.2.4 (White-Label Primary + Consumer/Shop Tiers)

**Supersedes:** v0.1 (consumer-first). This version restructures the product around a B2B white-label track sold to classic-parts retailers. The consumer FJ40 instance survives as the internal demo/dogfood tenant. Addendum A (v0.2.1) adds consumer/shop tiers; Addendum B (v0.2.2) adds the canonical variant table, frame decoding, supersession/NLA handling, the Living Manual, and source policy. Addendum C (v0.2.3) scopes interactive diagrams; v0.2.4 adds C0 (diagram legibility) into Phase 1.
**Owner:** Wes Fleming
**Stack:** Next.js (App Router) + Vercel + Supabase (Postgres/pgvector/Storage/Auth/RLS) + Stripe + Claude API + Inngest + Apify. Same patterns as ScriptHooks/CiteLayer — this reads as a sibling B2B product to CiteLayer in the portfolio.
**Proving-ground vertical:** Toyota Land Cruiser (1974 FJ40 first). **Vertical 2:** Mopar.

---

## 1. One-liner

A white-label restoration copilot that parts retailers embed on their own site: it fuses the vehicle's factory manuals, YouTube how-tos, and forum knowledge into cited, step-by-step answers — and every answer resolves the needed parts to *that retailer's* in-stock SKUs with add-to-cart links.

**The pitch to a retailer:** your customers' repair questions currently get answered on ih8mud and YouTube, and the parts get bought wherever. Put the answers on your domain, ending in your cart.

## 2. Two customers, one acceptance test

- **The tenant** (buyer): a classic-parts retailer — CruiserCorps, City Racer, Cruiser Outfitters in vertical 1; Classic Industries, YearOne in vertical 2. Buyer persona: owner/GM or ecommerce lead. They care about assisted revenue, support deflection, and SEO.
- **The end shopper** (user): the restorer at the workbench. Identical to v0.1's user — they just meet the product on the retailer's site.

**Acceptance test v2 (defines "done" for the commercial core loop):**

> On the CruiserCorps-branded instance, a shopper asks: *"How do I change the knuckles on my FJ?"*
>
> The answer must include: (1) correct FSM procedure steps with cited page images, (2) ≥1 timestamped YouTube link, (3) ≥1 ih8mud thread, (4) a parts card resolving to **CruiserCorps' actual in-stock knuckle rebuild kit SKU** with a working add-to-cart link, (5) **zero generated competitor purchase links**, and (6) the session + cart click visible in the tenant's assisted-revenue dashboard.

## 3. Product principles (v0.2 deltas in bold)

1. Cited or it doesn't ship. Torque specs and capacities require a manual-page citation or are omitted — **stricter under a retailer's brand (liability)**.
2. Diagrams are first-class: cited FSM page images in a lightbox, not figure cropping.
3. Link out, don't rehost — **but purchase links are tenant-only by policy (§9)**.
4. Vehicle-scoped retrieval, always.
5. **Three-tier corpus (§6): tenant content, shared vehicle web corpus, private user manuals.**
6. **The tenant's number is assisted revenue.** Every design decision should be traceable to "did this help sell a part or renew the contract."

## 4. Business model & GTM

**Motion:** design-partner-led, principal-sold — the same warm B2B motion as Third Coast.

1. **Design partner: CruiserCorps** (existing vendor relationship — warm intro). Offer: free or heavily discounted 6-month pilot in exchange for catalog feed access, a public case study, and rights to publish assisted-revenue numbers.
2. **Vertical density:** 2–3 more Land Cruiser ecosystem retailers. Competitors can all be customers — each gets their own instance, catalog, and policy. **Key economics: the FJ40/Land Cruiser web corpus is built once and sold N times per vertical.** Margin compounds with vertical density; this is why we expand vertical-by-vertical, not scattershot.
3. **Vertical 2: Mopar** (Classic Industries or YearOne) — proves the seed-pack generator makes new-vertical onboarding a week, not a quarter.

**Pricing hypothesis (validate with design partner):** $2,500 setup/onboarding + monthly tiers: $299 (1 vehicle line, widget only) / $599 (multi-line + SEO pages) / $999 (full: dashboard, lead capture, custom domain). Optional assisted-revenue % model as an alternative for skeptical tenants. Stripe invoicing; no self-serve until ≥5 tenants.

**Tenant-side KPIs (dashboard = renewal engine):** assisted revenue, parts-card CTR, answer rate vs. "couldn't answer," questions volume, top questions, unanswered-question gaps, SEO page traffic, captured leads.

## 5. Architecture overview

```
Next.js on Vercel
 ├─ Shopper surfaces
 │   ├─ Hosted instance: copilot.{tenant}.com (CNAME) or {tenant}.restocopilot.app
 │   └─ Embed widget: <script> → iframe, postMessage context
 │       (current product SKU, selected vehicle), tenant theme tokens
 ├─ Tenant admin: /admin — catalog sync status, fitment review queue,
 │   answer policy, analytics dashboard, SEO page approvals, leads
 ├─ Internal ops: /ops — tenants, vehicles, seed packs, corpus health
 └─ Inngest jobs: ingestion (manuals/YouTube/forums), catalog sync,
     fitment normalization, SEO page generation, analytics rollups

Supabase: Postgres + pgvector + FTS, Storage, Auth.
RLS on tenant_id everywhere. Shared vehicle web corpus has tenant_id NULL.

External: Claude API (answers, vision OCR, fitment normalization, seed packs),
Voyage/OpenAI embeddings, YouTube Data API, Apify, Shopify Admin API +
webhooks (BigCommerce/CSV as fallback), Stripe (B2B invoicing).
```

**Multi-tenancy rule from day one:** `tenant_id` on every relevant row even while single-tenant. Cheap now, a rewrite later.

## 6. Three-tier corpus & rights

- **Tier A — Tenant content** (`tenant_id` set): their catalog, their install guides/PDFs/videos they own, their FAQ. Rank-boostable via policy. Tenants may only seed content they have rights to — **a tenant cannot seed copyrighted factory manuals for all users**.
- **Tier B — Shared vehicle web corpus** (`tenant_id` NULL): YouTube transcripts, forum threads, blogs. Built once per vehicle, served to every tenant in the vertical. Attribution + link-out always; snippet-length excerpts.
- **Tier C — Private user manuals** (`owner_user_id` set): the shopper's own uploaded FSM, personal-library model, never shared. Optional feature tenants can toggle.
- **Commercial crawl posture:** under a commercial banner, "polite crawling" upgrades to "get blessing." **Before commercial launch: contact ih8mud admins** — position as traffic-sending (every answer links threads), explore partnership. Same for major blogs. YouTube via official API only. This is a launch gate, not a nice-to-have.
- Mechanical-advice liability: per-tenant configurable disclaimer rendered on every answer; safety-critical guardrails (§8); tenant contract includes standard disclaimer language.

## 7. Data model (v0.2 additions to the v0.1 schema)

```sql
tenants          (id, name, slug, domain, theme jsonb, plan, status,
                  platform enum('shopify','bigcommerce','csv'), platform_creds)
tenant_vehicles  (tenant_id, vehicle_id, enabled)

catalog_products (id, tenant_id, external_id, sku, title, description,
                  price, in_stock, product_url, cart_url, image_url,
                  raw jsonb, synced_at)
fitments         (id, catalog_product_id, vehicle_id,
                  year_start, year_end, month_start, month_end,
                  constraints text[],          -- ['drum brakes','w/o A/C']
                  position, confidence numeric, needs_review bool,
                  source enum('claude','tenant_review','metafield'))

answer_policies  (tenant_id, suppress_competitor_purchase_links bool default true,
                  pinned_source_ids uuid[], boosted_kinds text[],
                  disclaimer_md, escalation_email, persona jsonb,
                  restricted_topics text[])

qa_pages         (id, tenant_id, vehicle_id, slug, question, answer_md,
                  cited_chunk_ids uuid[], product_ids uuid[],
                  status enum('draft','approved','published'), published_at)

analytics_events (id, tenant_id, session_id, kind enum('question','answer',
                  'source_click','part_click','cart_click','escalation',
                  'lead_captured','order_attributed'), payload jsonb, ts)
leads            (id, tenant_id, session_id, question, contact, status)
```

v0.1 tables (`vehicles`, `sources`, `manual_pages`, `chunks`, `parts`, `conversations`, `jobs`) carry over; `chunks` gains nullable `tenant_id`.

```sql
-- v0.2.2 additions (see Addendum B)
variants        (id, vehicle_id, market text default 'US',   -- US-only seeded in v1
                 model_code,                                  -- e.g. 'FJ40-KC'
                 month_start, month_end,                      -- EPC production window
                 engine, trans, body, notes,
                 source enum('epc','manual','curated'))
-- garage gains:            frame_no, build_month (decoded), variant_id
-- parts + catalog_products gain: availability enum('in_stock','oos','discontinued'),
--                                superseded_by (self-reference)
-- chunks gain:             variant_tags text[]   -- retrieval contamination guard

annotations     (id, vehicle_id, source_id, page_start, page_end,     -- Living Manual
                 kind enum('correction','substitution','tip','warning','nla_swap'),
                 body_md, cited_chunk_ids uuid[],
                 status enum('proposed','approved','rejected'),
                 created_by enum('batch','tenant','ops'))
```

## 8. Ingestion & answering (carried from v0.1, with deltas)

Pipelines for manuals (page renders + text/vision-OCR + page-cited chunks), YouTube (captions, timestamped chunks), and forums/blogs (Apify, quality weighting) are unchanged from v0.1 §7. Seed-pack generator is unchanged and is now also the **new-vertical onboarding tool**.

**Retrieval deltas:** hybrid pgvector+FTS with RRF, filtered by vehicle — now also merges Tier A tenant chunks with policy-driven rank boosts for pinned sources.

**Prompt contract deltas:** persona/tone from tenant policy; disclaimer appended; restricted topics refused with escalation offer; torque/capacity claims manual-cited or omitted; forum-sourced specs flagged "community-reported." Output remains markdown + `[S{n}]` markers + trailing JSON (`parts_mentioned[]`, `cited_chunk_ids[]`, `confidence`).

**Low-confidence path:** if retrieval confidence is low or sources don't cover it → honest "not in sources" + **escalation card** ("Ask the {tenant} team") → captures contact → `leads` row → tenant email. Unanswered questions are tenant sales leads and corpus-gap telemetry at the same time.

## 9. Catalog sync, fitment normalization & parts resolution (the moat)

### 9.1 Catalog sync
Shopify Admin API (products, variants, metafields, tags, inventory) with webhooks for updates; BigCommerce/CSV fallback. Nightly full reconcile. Raw payloads stored for re-normalization.

### 9.2 Fitment normalization (Claude batch job)
Vintage retailers encode fitment in prose: *"Fits FJ40 FJ45 9/73–1/75, drum brake models only. FJ55 thru 7/80."* The pipeline: extract fitment signals from title/tags/description/metafields → Claude normalizes to structured `fitments` rows (series, year/month ranges, constraints, position) with a confidence score → `needs_review` queue below threshold. **v0.2.2:** the normalization target is the canonical `variants` table (Addendum B1) — fitment prose resolves to the model codes and month windows Toyota itself defined in the EPC, not ranges we invent.

**Tenant-facing fitment review UI** in /admin: side-by-side raw text vs. parsed fitment, one-click approve/correct. Pitch this as a standalone value-add: *"We found 214 fitment ambiguities in your catalog."* Corrections feed back as few-shot examples per tenant. Normalized vintage fitment data does not exist as a clean dataset anywhere — accumulating it per vertical is the defensible asset.

### 9.3 Answer-time parts resolution
`parts_mentioned[]` → match against tenant catalog: OEM/alias exact match, then embedding similarity over product titles/descriptions, **filtered by fitment(vehicle, year, constraints)** → in-stock check → SKU cards: image, price, "Add to cart" (Shopify cart permalink `/cart/{variant_id}:{qty}` with tracking params) or product link. Not carried? Policy decides: hide, or show a generic description with no purchase link — never a generated competitor purchase link. (Forum threads cited for content may themselves mention competitors; we don't control third-party page contents and don't pretend to.)

## 10. Embed widget & theming

- `<script src=".../widget.js" data-tenant="cruisercorps">` → iframe for style isolation; theme tokens (colors, logo, font, corner radius) from `tenants.theme`.
- **Context injection via postMessage:** on a product page, the widget opens as *"Ask about this part"* pre-scoped to that SKU + its fitment vehicles; on generic pages, opens with vehicle picker (tenant's enabled lines).
- Hosted full-page instance at `copilot.{tenant}.com` for deep sessions and as the SEO pages' interactive layer.
- Mobile-first: workbench reality — big tap targets, pinch-zoom lightbox on FSM pages.

## 11. Analytics, attribution & SEO pages

**Attribution ladder:**
- v1: all outbound part/cart links carry `utm_source=copilot&cc_session={id}`; `cart_click` events logged. "Assisted carts" = sessions with cart clicks.
- v2: Shopify order webhook (or app pixel) matches orders containing copilot-clicked variants within a 7-day window → `order_attributed` events → true **assisted revenue** in dollars. This number is the renewal.

**Dashboard (tenant /admin):** assisted revenue & carts, parts CTR, questions volume, top questions, answer rate, unanswered gaps (ranked — doubles as corpus/catalog roadmap), SEO traffic, leads.

**SEO Q&A pages:** nightly job clusters frequent/high-value questions → generates static pages (answer + citations + product cards) → tenant approval queue → published under their domain (`/guides/...`) with FAQPage/HowTo schema + sitemap. This attacks the long-tail queries ("fj40 knuckle rebuild") currently owned by ih8mud and YouTube and lands them on the tenant's domain, one click from cart.

## 12. Build phases

**Phase 0 — Scaffold (revised).** v0.1 scaffold **plus `tenants` table and tenant_id threading + RLS from the first migration**. Seed two tenants: `third-coast-garage` (internal demo) and a placeholder design partner. FJ40 seeded.
*Exit:* signed-in user on the internal tenant sees the FJ40 garage; a second tenant renders with different theme tokens.

**Phases 1–3 — unchanged from v0.1.** Manuals MVP with page-image citations → YouTube timestamped citations → Apify forum/blog crawl + index dashboard. All built on the internal tenant, which **is the sales demo**. v0.2.4 addition: Phase 1's ingestion now includes the C0 legibility pipeline (300-DPI renders, scan cleanup, Enhanced toggle).
*Exit (cumulative):* v0.1 knuckle test passes minus parts.

**Phase 4 — Catalog + fitment + parts resolution.** Shopify sync, fitment normalization job + review UI (targeting the `variants` table), answer-time SKU resolution with cart permalinks, **frame-number capture + decoding in garage setup** (frame # → build month → variant), and availability/supersession handling on parts cards. Develop against a Shopify dev store seeded with real CruiserCorps-style products; swap in the design partner's feed when signed.
*Exit:* knuckle answer resolves to an in-stock rebuild-kit SKU with working add-to-cart; fitment review queue functional; garage accepts a frame number and decodes it to build month + variant; an NLA part surfaces its superseding replacement instead of dead-ending.

**Phase 5 — Tenant layer.** Theming, embed widget with product-page context, hosted subdomain, answer policy engine (suppression, pinned sources, disclaimer, persona), /admin shell.
*Exit:* the same corpus serves two differently-branded instances with different policies; widget runs on an external test page. **Acceptance test v2 (§2) passes end-to-end except attribution.**

**Phase 6 — Analytics + escalation.** Event pipeline, dashboard, lead capture, v1 attribution (cart clicks); Shopify order-webhook attribution if partner allows.
*Exit:* a demo session's question → answer → cart click appears in the dashboard within a minute; unanswered question produces a lead.

**Phase 7 — SEO Q&A pages.** Clustering job + approved Living Manual procedures (Addendum B5) feed generation, approval queue, publishing with schema markup.
*Exit:* 10 approved FJ40 guides live on the internal tenant's domain and indexed.

**Phase 8 — Commercial hardening.** Stripe invoicing, tenant onboarding runbook (seed pack → crawl → catalog sync → theme → launch, target <1 week wall-clock), ih8mud/blog outreach completed, contract + disclaimer templates.
*Exit:* design partner live in production; second-tenant onboarding executed from the runbook.

## 13. Costs & margins (rough)

Per-vertical web corpus: one-time low tens of dollars (OCR, embeddings, Apify) — **amortized across every tenant in the vertical**. Per-tenant: catalog normalization one-time (a 5–10K SKU catalog ≈ $20–60 of Claude batch), per-answer $0.01–0.03. At $299–999/mo tiers, COGS is noise; the real costs are onboarding labor (hence the runbook) and crawl relationship maintenance.

## 14. Risks & open questions

- **Design partner dependency:** if CruiserCorps passes, the pitch works on any Land Cruiser retailer — the demo tenant makes the pitch self-evident. Get the pilot conversation moving during Phase 2–3, not after Phase 5.
- **ih8mud posture** is now a launch gate (§6). Prepare the traffic-sending data before the outreach email.
- **Shopify concentration:** acceptable for v1; CSV fallback covers stragglers.
- **Fitment liability:** wrong-fitment purchases cause returns — surface confidence, keep the review queue tight, log fitment provenance on every SKU card.
- **Consumer & shop tiers:** no longer parked — see Addendum A. Soft-launches at Phase 3.5 on the house tenant; must stay self-serve so it never taxes the design-partner motion.
- Naming/domain: decide before Phase 5 (tenant-facing). Candidates: keep "Resto Copilot" as category descriptor; brand TBD.
- Attribution model choice (last-click vs. any-touch within window) — decide with design partner so the case-study number is credible.

---

## Addendum A — Consumer & Shop Tiers (v0.2.1)

### A1. Positioning: the YouTube time tax

YouTube is the incumbent learning channel for this entire audience — and it's a terrible retrieval interface. The answer to "how do I set knuckle bearing preload" is 90 seconds buried at minute 31 of a 45-minute video, somewhere in a playlist, across a dozen channels. The consumer one-liner:

> **The answer in 45 seconds, not 45 minutes.** Ask, get the steps + the factory diagram + the exact video moment + the parts.

We never compete with YouTube — we index it and deep-link into it (`&t=`). YouTube plays three roles at once: the incumbent behavior we ride, a corpus tier, and the acquisition channel (A4).

### A2. Segments & tiers

Three doors on one engine. Consumer = the house tenant + consumer Stripe billing + affiliate merchant links (v0.1 §10); the v0.2 policy engine already supports all of it.

| Tier | Price | Who | Gets |
|---|---|---|---|
| Free | $0 | curious owner | 1 vehicle, 10 questions/mo, web corpus, affiliate parts links |
| Owner | $12/mo | active restorer | unlimited questions, private manual upload (Tier C), saved job cards, photo diagnosis when it ships |
| Shop | $39/mo | independent resto shops, bike mechanics | 10+ vehicle garage, printable/shareable job sheets with parts lists, priority manual ingestion |

"Owners **and mechanics**": the Shop tier is the quiet prosumer wedge. A two-bay British-bike shop touches more vehicles per month than any single owner, needs zero catalog integration, and self-serves.

### A3. Vertical screen & sequencing

Per-vertical rule of thumb: **legendary forum + whale retailer → white-label door** (Land Cruiser/CruiserCorps; British cars/Moss Motors; Harley/J&P Cycles — dual-door, huge consumer audience *and* a whale). **Legendary forum + fragmented specialist retail → consumer door** (Norton — Andover Norton and Old Britts are beloved specialists, not whales; BSA; air-cooled VW via TheSamba; vintage tractors via Yesterday's Tractors; G503 military Jeeps; BMW airheads).

Bikes skew consumer regardless of retail structure: near-universal self-wrenching, thin factory manuals (a Norton workshop manual is a fraction of a 400-page FSM — corpus cost drops accordingly), and rabid single-marque communities.

### A4. Acquisition: dogfood the portfolio

The channel for this product is short-form video of the product answering real questions — screen-record "watch me ask my FJ40 anything," cut on the answer materializing with the FSM diagram and the timestamp jump. This is home turf twice over: filmmaker + ScriptHooks. Use ScriptHooks to generate the hooks and scripts; the demo-content engine is already built and owned. Every vertical launch is a content sprint, not an ad budget.

### A5. The recon flywheel (formalizes §4's expansion motion)

Consumer instance in a vertical → 90 days of demand telemetry (top questions, parts mentioned, unanswered gaps, session volume) → the B2B pitch to that vertical's retailer opens with *"here are the 4,000 questions your customers asked last quarter and the top 50 parts they mentioned."* Consumer isn't a second business competing for attention; it's paid reconnaissance that writes the white-label pitch deck. Every consumer vertical is a future B2B territory with the demand data pre-gathered.

### A6. Build impact (small, and earlier than expected)

- **Phase 3.5 — Consumer soft launch (new).** After Phase 3 the house tenant is already a working consumer product for the FJ40. Add: consumer Stripe billing (Free/Owner), affiliate merchant links, a landing page, and a **vehicle waitlist/voting page** ("what should we index next?") for demand signal + email capture.
  *Exit:* a stranger can sign up, ask the knuckle question, hit the question cap, and convert to Owner.
- Shop tier ships with Phase 5 (it reuses job cards + multi-vehicle garage, both already spec'd).
- New bike/tractor verticals onboard via the seed-pack generator (§7.4) as waitlist votes justify them — each is a weekend of corpus work, not a rebuild.
- Guardrail: consumer stays self-serve by design — zero sales labor — so the CruiserCorps design-partner conversation remains the priority motion during Phases 2–3.

---

## Addendum B — Variants, Living Manual & Source Policy (v0.2.2)

Consolidates the deltas surfaced by field specimens: a CruiserTeq NLA product page, the jp-carparts EPC catalog, a Belgian-hosted English factory manual, and an AI-search answer about FJ40 manuals.

### B1. Canonical variant table & market scoping

Retailer fitment strings are downstream copies of Toyota's own EPC variant breakpoints — the CruiserTeq master cylinder's 1/1975–9/1975 window is the EPC's FJ40-KC production window verbatim. So fitment normalization resolves *to* a finite, authoritative `variants` table (model code, production month window, engine/trans/body, market) rather than inventing ranges. This makes the normalization target small, knowable, and authoritative — and the accumulated variant + fitment dataset harder to replicate.

- **Seed US-market variants only in v1.** The USDM 40/55-series variant set for the early-to-mid '70s is a handful of rows, buildable in an afternoon. Non-US variants (JDM codes, Euro spec, AU trucks, diesel B/H engines, Bandeirante-class oddities) are rows added later — an expansion exercise, not a rearchitecture.
- **Steal the EPC's structure regardless of market:** fig taxonomy, month breakpoints, and frame numbering apply to US trucks too.
- **Retrieval contamination guard:** corpus chunks carry `variant_tags` so a US F-engine owner never receives diesel-BJ fuel-system advice.
- **US-first scopes variants, not source geography.** The crawler filters on what content *covers*, not where it's hosted — an English-language FSM scan on a .be community site is fully in-scope.

### B2. Frame-number decoding (promoted from v2 backlog to Phase 4)

On vintage Toyotas the frame number decodes to build month, and build month is the fitment key. Garage setup captures frame # → decoded `build_month` + matched `variant_id` → parts resolution filters on the exact variant instead of "1974-ish." This mirrors what retailers do by hand today ("email us with your full Model Code and Frame #") — which is also the sales pitch: the copilot automates their support inbox's hardest recurring question.

### B3. Availability & supersession

Parts and catalog products carry `availability` and `superseded_by`. Answer behavior: an NLA part is never a dead end — the copilot states the discontinuation and routes to the superseding SKU, the aftermarket equivalent, or (per tenant policy) an external NLA channel such as a Japan-sourcing broker for parts the tenant cannot supply at all. "That part's discontinued — here's the current replacement" is among the highest-value sentences the product can produce, and a tenant can't lose a sale to a competitor on a part nobody stocks.

### B4. EPC reference layer (no-crawl)

EPC mirrors (jp-carparts, Partsouq, Amayama) are the OEM-number source of truth but disallow crawlers, and their exploded diagrams are Toyota's copyrighted artwork. Treat them as a **reference layer**:

- OEM numbers enter the `parts` table via assisted curation during vertical setup plus the FSM's own parts references — never via crawling EPC mirrors.
- Parts cards carry a "view exploded diagram →" link-out to the relevant fig page. Robots.txt governs crawlers, not humans clicking links.
- The fig-number taxonomy (901 Standard Tool, 1101 Partial Engine Assembly, 1102 Short Block…) is imported **as data** — Toyota's own ontology becomes the parts-organization scheme, so answers can say "everything for this job lives in Fig 1102" the way a good parts-counter veteran would.

### B5. The Living Manual (overlay, never overwrite)

The FSM stays frozen ground truth. Editing it would break citation integrity, create liability, and produce a derivative work. Community knowledge attaches as a structured **annotation layer** instead:

- A post-Phase-3 batch job runs retrieval in reverse: for each manual section (e.g., "Front Axle — Knuckle Overhaul, pp. 214–221"), pull the best-matching forum/YouTube chunks and extract typed `annotations` — *correction* (spec revised in a later supplement), *substitution* (superseded seal design the community now runs), *tip* (unobtainable special tool → proven workaround), *warning*, *nla_swap*.
- Every annotation carries its citations (thread URL, video timestamp) and renders with a "community-reported" label; an ops/tenant review queue gates approval. Community voting is a later layer.
- Answers render **factory procedure and community notes side by side** — the FSM in one hand, fifty years of forum wisdom in the other, which is how the best mechanics already work.
- Approved annotated procedures are the Phase 7 SEO page inventory: the Living Manual **is** the content engine.

### B6. Manual source policy (the "gold standard" hierarchy)

1. **FSM — Tier 1 authority.** Torque specs, capacities, and procedures must cite the FSM; it is the only source that can anchor a spec. Community sources may annotate a spec, never establish one.
2. **Aftermarket commercial manuals (Haynes, Gregorys, Chilton).** Live commercial products: never seeded into the shared corpus, ingestible only as a user's own Tier C upload, and always supplementary — an aftermarket claim never overrides an FSM-cited spec. If a user asks where to download one free, the copilot answers plainly that no legitimate free copy exists and links purchase options.
3. **Community corpus.** Annotation and context layer (B5) — the richest source of practical wisdom, and never a primary source for a specification.

### B7. GTM convergence: CiteLayer

AI search answers about these vehicles currently cite forums and one or two incumbent retailers; most prospective tenants are invisible in AI answers about their own product category. Phase 7 / Living Manual pages are precisely the content that wins those citations — and CiteLayer measures the movement. The pitch becomes two numbers: **assisted revenue** on the tenant's site, **AI-answer visibility** off it. The sales deck opens with a live AI answer about the tenant's vehicles that fails to mention them.

---

## Addendum C — Interactive Diagrams (v0.2.3)

The exploded view is the mechanic's mental model of the vehicle. Interactivity is scoped as a four-rung ladder (C0–C3), because effort-per-rung varies by orders of magnitude. Field decision (v0.2.4): C0 ships first inside Phase 1; C1–C2 in scope on their original timing; C3 out.

### C0. Level 0 — Diagram legibility (IN SCOPE — inside Phase 1 ingestion)

The minimum revision: make 50-year-old scans readable on a phone.

- Render manual pages at ~300 DPI — diagram-heavy pages deserve the pixels, and storage is cheap.
- Non-generative cleanup pass in the ingestion job: deskew, despeckle, contrast/levels normalization (ImageMagick/OpenCV-class scan restoration).
- Optional **"Enhanced" toggle** in the lightbox using line-art super-resolution. Hard guardrail: enhancement is a viewing aid only — conservative upscaling, never inpainting or redrawing — and the untouched original stays one tap away and remains the citation object, so a cleaned image can never silently alter a spec.
- Pinch-zoom lightbox serves the full-resolution render so zoom stays crisp at the workbench.
- Stretch: vision-proposed "jump to figure" crop shortcuts on multi-figure pages — viewing shortcuts only, not extracted assets, so an imperfect crop costs nothing (the figure-extraction tar-pit warning from v0.1 §7.1 stands).

### C1. Level 1 — Shoppable hotspot diagrams (IN SCOPE — ship after Phase 5, before/alongside Phase 7)

Make static exploded views tappable: touch a callout number → part card (name, OEM #, availability, add-to-cart if the tenant carries it). The diagram becomes the parts-ordering UI — the highest-conversion surface in the product.

- **Eligible sources:** FSM exploded views (user-hosted, Tier C / demo tenant) and tenant-owned diagram art (Tier A — retailers already use exploded carb/axle illustrations on product pages). EPC artwork remains link-out only (B4).
- **Pipeline:** Claude vision batch pass per diagram page → detect callout numbers + parse the adjacent legend/parts table → emit hotspot bounding boxes + callout→part mapping → review queue for low-confidence hotspots → lightbox renders an SVG overlay.
- **Schema:** `diagram_hotspots (id, page_or_asset_id, callout_no, bbox, part_id nullable, label, confidence, status)`
- **Cost/effort:** cents per diagram; overlay UI + batch job are fully Claude-Code-buildable.
- **Exit criterion:** on the fuel-system spread, tapping the carburetor-assembly callout opens its part card and adds the tenant's carb kit to cart.
- Hotspotted pages also upgrade Phase 7 guide pages from static images to interactive embeds.

### C2. Level 2 — Real-capture 3D for hero jobs (marketing-grade, founder-producible)

Photogrammetry or Gaussian-splat capture of real assemblies (knuckle, carb, hub) during actual jobs → browser embed via `<model-viewer>`/three.js on Living Manual pages and the sales demo. Not per-SKU scalable — produce for the top ~10 jobs per vehicle. Production synergy: the founder is a DP with the donor truck, so the knuckle job is simultaneously the capture session and the A4 short-form launch content. Position as wow-layer, not core reference.

### C3. Level 3 — Generative/CAD 3D (EXPLICITLY OUT OF SCOPE)

No CAD source data exists for 1974 Toyota parts, and AI image-to-3D output is toy-grade — plausible-looking but mechanically wrong, in a product whose brand is accuracy. Revisit only if a tenant supplies genuine CAD. **Hard guardrail:** nothing rendered in 3D may ever be the citation basis for a spec or procedure — FSM pages remain the sole authority (B6).
