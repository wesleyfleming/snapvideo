# Resto Copilot

A white-label restoration copilot that classic-parts retailers embed on their own site: it fuses the vehicle's factory manuals, YouTube how-tos, and forum knowledge into cited, step-by-step answers — and every answer resolves the needed parts to *that retailer's* in-stock SKUs with add-to-cart links.

**The pitch to a retailer:** your customers' repair questions currently get answered on ih8mud and YouTube, and the parts get bought wherever. Put the answers on your domain, ending in your cart.

## Product

- **Primary track:** B2B white-label, sold to classic-parts retailers (design partner target: CruiserCorps). Tenant's number is **assisted revenue**.
- **Consumer/Shop tiers:** Free / Owner ($12/mo) / Shop ($39/mo) on the house tenant — self-serve, doubles as demand reconnaissance for new B2B verticals.
- **Proving-ground vertical:** Toyota Land Cruiser (1974 FJ40 first). Vertical 2: Mopar.

Full details in [docs/spec-v0.2.4.md](docs/spec-v0.2.4.md) — the current product spec, including the canonical variant table, frame decoding, the Living Manual annotation layer, source policy, and interactive-diagram scope.

## Stack

Next.js (App Router) + Vercel + Supabase (Postgres/pgvector/Storage/Auth/RLS) + Stripe + Claude API + Inngest + Apify. Sibling B2B product to CiteLayer in the portfolio; same patterns as ScriptHooks.

## Build phases

- [ ] **Phase 0 — Scaffold.** Next.js + Supabase, `tenants` table, tenant_id threading + RLS from the first migration. FJ40 seeded, two tenants render with different themes.
- [ ] **Phase 1 — Manuals MVP.** Page-image citations + C0 diagram-legibility pipeline (300-DPI renders, scan cleanup, Enhanced toggle).
- [ ] **Phase 2 — YouTube.** Timestamped citations.
- [ ] **Phase 3 — Forums/blogs.** Apify crawl + index dashboard. *(v0.1 knuckle test passes minus parts.)*
- [ ] **Phase 3.5 — Consumer soft launch.** Stripe billing (Free/Owner), affiliate links, landing page, vehicle waitlist.
- [ ] **Phase 4 — Catalog + fitment + parts resolution.** Shopify sync, fitment normalization to the `variants` table, frame-number decoding, supersession/NLA handling.
- [ ] **Phase 5 — Tenant layer.** Theming, embed widget, hosted subdomain, answer policy engine, /admin. *(Acceptance test v2 passes except attribution.)*
- [ ] **Phase 6 — Analytics + escalation.** Event pipeline, dashboard, lead capture, cart-click attribution.
- [ ] **Phase 7 — SEO Q&A pages.** Living Manual procedures → published guides with schema markup.
- [ ] **Phase 8 — Commercial hardening.** Stripe invoicing, onboarding runbook, ih8mud/blog outreach, contracts.

## Acceptance test v2 (the commercial core loop)

On the CruiserCorps-branded instance, a shopper asks *"How do I change the knuckles on my FJ?"* The answer must include: (1) FSM procedure steps with cited page images, (2) ≥1 timestamped YouTube link, (3) ≥1 ih8mud thread, (4) a parts card resolving to CruiserCorps' actual in-stock knuckle rebuild kit SKU with a working add-to-cart link, (5) zero generated competitor purchase links, and (6) the session + cart click visible in the tenant's assisted-revenue dashboard.
