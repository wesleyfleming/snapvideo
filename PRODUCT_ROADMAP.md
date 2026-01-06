# SnapVideo Product Roadmap
**Vision:** Build "Superside for Video" - Subscription-based video production with AI-powered brand intelligence

**Last Updated:** January 6, 2026

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [Market Positioning](#market-positioning)
3. [Product Strategy](#product-strategy)
4. [Technical Architecture](#technical-architecture)
5. [Pricing Model](#pricing-model)
6. [Phase 1: MVP (Months 1-3)](#phase-1-mvp)
7. [Phase 2: Optimization (Months 4-6)](#phase-2-optimization)
8. [Phase 3: Scale (Months 7-12)](#phase-3-scale)
9. [Future Products](#future-products)
10. [Success Metrics](#success-metrics)

---

## Executive Summary

### Vision
SnapVideo is a subscription-based video production service that combines:
- **Offshore production efficiency** (already in place)
- **AI-powered brand intelligence** (AirOps + ScriptHooks)
- **Superside-style workflow** (flat subscription, unlimited requests, fast turnaround)

### Target Customer
- **Primary:** B2B marketers, creative directors (marketing teams, agencies)
- **Secondary:** UGC creators, individual content creators

### Differentiation vs. Competition

| Competitor | Price | Quality | Speed | Brand Intelligence |
|------------|-------|---------|-------|-------------------|
| **Fiverr** | $300-800/video | Inconsistent | 7-14 days | ❌ None |
| **Agencies** | $5K-15K/video | High | 3-4 weeks | Manual |
| **SnapVideo** | $2,500-3,333/video* | High + Consistent | 5 days | ✅ AI-powered |

*Via subscription model

### Core Value Proposition
> "Get agency-quality videos at Fiverr-like prices, with AI that learns your brand voice and gets smarter with every video."

---

## Market Positioning

### The Problem We Solve

**For B2B Marketers:**
- ❌ Agencies are too expensive ($5K-15K per video)
- ❌ Fiverr is inconsistent (different freelancer every time)
- ❌ In-house is slow (bottlenecked on 1-2 video editors)
- ❌ No one learns their brand voice (start from scratch every video)

**For UGC Creators:**
- ❌ Can't afford agencies for every video
- ❌ Fiverr quality varies wildly
- ❌ Need consistent editor who understands their channel

### Our Solution

**Subscription-based video production with AI brand intelligence:**
1. **Flat monthly price** - No per-project quotes
2. **Unlimited requests** - Queue managed by complexity
3. **Dedicated team** - Same editors who learn your brand
4. **AI-powered scripts** - ScriptHooks generates video structure with hooks/gaps
5. **Brand voice learning** - AirOps ensures consistent messaging
6. **Performance tracking** - See what videos work, optimize future content

---

## Product Strategy

### Product Ecosystem (3 Products Over Time)

```
Phase 1 (Months 1-12)
└─ SnapVideo Full Service
   Subscription video production
   $2,500-$25,000/month

Phase 2 (Months 13-18)
└─ SnapVideo Studio
   AI tooling for teams with in-house editors
   $299-$1,199/month

Phase 3 (Months 19-24)
└─ ScriptHooks API
   Developer access for custom integrations
   $99-$499/month
```

**This roadmap focuses on Phase 1: SnapVideo Full Service**

---

## Technical Architecture

### Core Platform Stack

**Frontend:**
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

**Backend:**
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **API:** Next.js API routes + Supabase Edge Functions
- **File Storage:** Supabase Storage or AWS S3

**Integrations:**
- **ScriptHooks API:** Video script generation (hooks, structure, b-roll)
- **AirOps API:** Brand voice management + performance analytics
- **Frame.io API:** Video review and feedback
- **Stripe:** Subscription billing + credit management

---

### System Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│        CLIENT PORTAL (Next.js)                  │
│  - Request videos                               │
│  - Track status                                 │
│  - Review videos (Frame.io embedded)            │
│  - View analytics                               │
└─────────────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────┐
│      SNAPVIDEO BACKEND (Supabase)               │
│  - Project management                           │
│  - Credit tracking                              │
│  - User authentication                          │
│  - File storage                                 │
└─────────────────────────────────────────────────┘
         │              │              │
    ┌────┴────┐    ┌────┴────┐   ┌────┴────┐
    ▼         ▼    ▼         ▼   ▼         ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│AirOps  │ │Script  │ │Frame.io│ │ Stripe │
│        │ │Hooks   │ │        │ │        │
└────────┘ └────────┘ └────────┘ └────────┘
    │           │
    ▼           ▼
Brand Voice   Script
Learning    Generation
```

---

### Data Model

**Key Database Tables:**

```sql
-- Clients
clients
├─ id (uuid)
├─ name (text)
├─ airops_profile_id (text)
├─ subscription_tier (enum)
├─ credits_balance (integer)
└─ created_at (timestamp)

-- Projects
projects
├─ id (uuid)
├─ client_id (uuid → clients)
├─ brief (text)
├─ video_type (enum: simple|standard|complex)
├─ status (enum: brief|script|production|review|delivered)
├─ credits_cost (integer)
├─ script_id (text) -- from ScriptHooks
├─ brand_alignment_score (integer) -- from AirOps
└─ created_at (timestamp)

-- Videos (Delivered)
videos
├─ id (uuid)
├─ project_id (uuid → projects)
├─ file_url (text)
├─ formats (jsonb) -- [{type: '16:9', url: '...'}, ...]
├─ airops_tracking_id (text)
└─ delivered_at (timestamp)

-- Performance Analytics (synced from AirOps)
video_performance
├─ id (uuid)
├─ video_id (uuid → videos)
├─ platform (text) -- youtube, linkedin, etc.
├─ views (integer)
├─ engagement_rate (decimal)
├─ avg_watch_time (integer)
└─ synced_at (timestamp)

-- Brand Assets
brand_assets
├─ id (uuid)
├─ client_id (uuid → clients)
├─ type (enum: logo|font|color|video|script)
├─ file_url (text)
└─ metadata (jsonb)
```

---

### Workflow Automation

**Video Production Pipeline:**

```
1. CLIENT SUBMITS REQUEST
   ↓ (Client Portal)

2. AIROPS: FETCH BRAND VOICE
   ↓ (API call to AirOps.getBrandProfile())

3. SCRIPTHOOKS: GENERATE SCRIPT
   ↓ (API call with brand context)
   - Hook (0-3s)
   - Curiosity gaps
   - Retention structure
   - B-roll suggestions

4. AIROPS: VALIDATE BRAND ALIGNMENT
   ↓ (API call to AirOps.validateContent())
   - Score: 0-100%
   - Flag off-brand language

5. CLIENT APPROVES SCRIPT
   ↓ (In portal)

6. PRODUCTION (Offshore Team)
   ↓ (Assigned via PM dashboard)
   - Editor creates rough cut
   - Motion graphics specialist
   - Final polish

7. FRAME.IO: REVIEW
   ↓ (Auto-create project)
   - Client leaves feedback
   - Track revision rounds

8. DELIVERY
   ↓ (Upload to portal + Supabase Storage)
   - All formats exported
   - SRT captions included

9. AIROPS: START TRACKING
   ↓ (Optional: if client connects accounts)
   - Monitor YouTube, LinkedIn, etc.
   - Sync performance metrics
```

---

## Pricing Model

### Target Economics
- **Target Gross Margin:** 40% (labor only, before overhead)
- **Current Labor Costs:**
  - 30s motion ad: $1,500
  - 2min demo: $2,000
- **With Optimizations (templates, automation, offshore):**
  - Simple cutdown: $300-500
  - Standard ad: $600-900
  - Complex demo: $900-1,200

### Credit System

**How Credits Work:**
- Clients subscribe to monthly tier (includes credits)
- Different video types cost different credits
- Unused credits roll over 1 month
- Overage credits available for purchase

**Credit Pricing:**

| Video Type | Complexity | Labor Cost (Optimized) | Credits Required | Implied Price |
|------------|-----------|----------------------|------------------|---------------|
| **Simple** | Social cutdown (15-30s), repurpose existing footage | $400 | 20 credits | ~$1,000 |
| **Standard** | Product demo (30-60s), voiceover, motion graphics | $700 | 35 credits | ~$1,750 |
| **Complex** | Brand promo (90s+), full production, custom animation | $1,100 | 55 credits | ~$2,750 |
| **Rush** | 2-day delivery (+50% cost) | +50% | +50% credits | +50% |

**Add-ons (Flat Fee):**
- Professional voiceover: +10 credits ($500)
- Filming/production day: +30 credits ($1,500)
- Original music composition: +10 credits ($500)

---

### Subscription Tiers

| Tier | Monthly Price | Credits Included | Example Usage | Target Customer |
|------|---------------|------------------|---------------|-----------------|
| **Creator** | $2,500 | 60 credits | 3 Simple OR 1.5 Standard | Solo creators, small startups |
| **Startup** | $5,000 | 120 credits | 6 Simple OR 3 Standard OR 2 Complex | Growing businesses, 1-2 person marketing teams |
| **Growth** | $10,000 | 250 credits | 12 Simple OR 7 Standard OR 4-5 Complex | Established companies, active marketing teams |
| **Enterprise** | $25,000+ | 650+ credits | Custom volume, dedicated team | Agencies, large marketing departments |

**Overage Pricing:**
- Creator tier: $50/credit
- Startup tier: $45/credit
- Growth tier: $42/credit
- Enterprise: $40/credit (or custom)

---

### Pricing vs. Competition

**Scenario: Client needs 4 videos/month (mix of ads + demos)**

| Provider | Cost | What You Get |
|----------|------|--------------|
| **Fiverr** | $3,200 | 4 random freelancers, inconsistent quality, 3 revisions each, no strategy |
| **Agency** | $24,000-40,000 | High quality, slow (3-4 weeks), custom quotes, meetings |
| **SnapVideo Growth** | $10,000 | 250 credits (4 Standard + extras OR 3 Complex + Simple), 5-day turnaround, AI intelligence, unlimited revisions (managed) |

**Value Prop:** Save 50-75% vs. agency, get 3X better quality than Fiverr

---

## Phase 1: MVP (Months 1-3)

**Goal:** Launch beta with 5-10 Third Coast Films clients, validate subscription model, prove 40% margins

---

### Month 1: Core Portal + Authentication

**Sprint 1 Deliverables:**

#### Client Portal (Frontend)
- [ ] **Dashboard**
  - Credit balance display (real-time)
  - Active projects list (status: Script → Production → Review → Delivered)
  - Completed videos archive
  - Quick actions (Request Video, View Analytics)

- [ ] **Request Video Form**
  - Video type dropdown (Simple/Standard/Complex)
  - Length selector (15s, 30s, 60s, 90s+)
  - Format checkboxes (16:9, 9:16, 1:1, All)
  - Brief text field (rich text editor)
  - Asset upload (drag-and-drop, multiple files)
  - Credit calculator (shows cost as they select options)
  - Rush option (+50% credits)
  - Submit button

- [ ] **Project Status Page**
  - Timeline view (Brief → Script → Production → Review → Delivered)
  - Current status indicator
  - Script preview (when ready)
  - Frame.io embed (when in review)
  - Download links (when delivered)

- [ ] **Brand Hub**
  - Logos library
  - Color palette
  - Typography/fonts
  - Past videos archive
  - Script library (all approved scripts)
  - Upload new assets

#### Internal PM Dashboard
- [ ] **All Projects View (Kanban)**
  - Columns: Briefed, Script, Production, Review, Delivered
  - Drag-and-drop to update status
  - Color-coded by client
  - Filter by client, video type, priority

- [ ] **Project Detail Page**
  - Full brief display
  - Client assets (logos, footage, etc.)
  - Script (editable before client approval)
  - Assign editor dropdown
  - Assign producer dropdown
  - Review rounds counter
  - Notes section (internal only)

- [ ] **Client Management**
  - List all clients
  - Credit balance per client
  - Subscription tier
  - Usage statistics (credits used this month)
  - Add/edit client

#### Authentication & User Management
- [ ] Supabase Auth setup
- [ ] Email/password login
- [ ] Password reset flow
- [ ] Role-based access (client vs. admin)
- [ ] Client invitation system (PM invites new clients)

#### Database Schema
- [ ] Set up Supabase project
- [ ] Create tables (clients, projects, videos, brand_assets)
- [ ] Set up Row Level Security (RLS) policies
- [ ] Seed data for testing

**Tech Stack:**
- Next.js 14 (App Router)
- Tailwind CSS + shadcn/ui components
- Supabase (PostgreSQL + Auth)

**Deliverable:** Working portal where clients can request videos, PMs can manage queue

---

### Month 2: AI Integrations + Workflow

**Sprint 2 Deliverables:**

#### ScriptHooks Integration
- [ ] **API Setup**
  - Create ScriptHooks API account/keys
  - Build API wrapper (Next.js API route)
  - Handle rate limits, errors

- [ ] **Script Generation Workflow**
  - When project status = "Brief" → auto-trigger script generation
  - Pass client brief + brand context to ScriptHooks
  - Store script in database
  - Update project status to "Script"
  - Send notification to client (script ready for review)

- [ ] **Script Approval Flow**
  - Client sees script in portal
  - Approve button → moves to Production
  - Request revision button → PM gets notification
  - Track revision count

#### AirOps Integration
- [ ] **Brand Profile Setup**
  - PM creates brand profile in AirOps (manual for MVP)
  - Input: Tone, vocabulary, messaging pillars, audience
  - Store airops_profile_id in clients table

- [ ] **Brand Voice Validation**
  - After ScriptHooks generates script
  - Send script to AirOps.validateContent()
  - Get brand alignment score (0-100)
  - Flag off-brand language
  - Display score to PM (decide if client-ready)

- [ ] **Learning Loop**
  - When client approves script → send to AirOps as "good example"
  - When client rejects → send feedback to AirOps
  - Brand profile improves over time

#### Frame.io Integration
- [ ] **API Setup**
  - Frame.io account + API keys
  - Create API wrapper

- [ ] **Auto-Create Review Projects**
  - When video enters "Review" status
  - Auto-create Frame.io project
  - Upload video file
  - Invite client as collaborator
  - Store Frame.io project link in database

- [ ] **Review Management**
  - Track review rounds (increment on each revision)
  - Flag when approaching limit (e.g., 3 rounds included)
  - Sync comments from Frame.io to SnapVideo dashboard

#### Notifications
- [ ] Email notifications (SendGrid or Resend)
  - Project status changes
  - Script ready for review
  - Video ready for review
  - Video delivered
- [ ] Optional: Slack integration (per-client channel)

**Deliverable:** End-to-end workflow from brief → AI script → production → review

---

### Month 3: Billing + Polish + Beta Launch

**Sprint 3 Deliverables:**

#### Stripe Integration
- [ ] **Subscription Setup**
  - Create Stripe products (Creator, Startup, Growth, Enterprise)
  - Price tiers ($2,500, $5,000, $10,000, $25,000)
  - Recurring billing

- [ ] **Credit System**
  - Credits table in database
  - Credit transactions (earned from subscription, spent on videos)
  - Balance calculation
  - Low balance warnings

- [ ] **Overage Billing**
  - Track overage credits used
  - Auto-charge at end of month
  - Invoice generation

- [ ] **Customer Portal**
  - Stripe-hosted billing portal
  - Update payment method
  - View invoices
  - Cancel/pause subscription

#### File Management
- [ ] **Asset Upload**
  - Supabase Storage buckets (per client)
  - Organize by project
  - Preview thumbnails

- [ ] **Video Delivery**
  - Upload final videos (all formats)
  - Generate download links (expiring or permanent)
  - ZIP all formats for easy download
  - Embed video player in portal

- [ ] **Storage Optimization**
  - Compress uploads
  - Clean up old files (archive after 90 days)

#### Polish & UX
- [ ] **Onboarding Flow**
  - First-time client wizard
  - Fill out brand profile
  - Upload initial assets
  - Request first video

- [ ] **Help Center**
  - FAQ page
  - How credits work
  - Video request guidelines
  - Contact support

- [ ] **Analytics Placeholder**
  - Show basic metrics (projects completed, credits used)
  - Full analytics in Phase 2

**Beta Launch:**
- [ ] Migrate 5 Third Coast Films clients to beta
- [ ] Onboarding sessions (1:1 calls)
- [ ] Collect feedback
- [ ] Fix bugs
- [ ] Monitor usage patterns

**Deliverable:** Production-ready platform with paying beta customers

---

## Phase 2: Optimization (Months 4-6)

**Goal:** Optimize workflows to hit 40% margins, scale to 15-20 clients, add performance analytics

---

### Month 4: Operational Efficiency

#### Templates & Playbooks
- [ ] **After Effects Templates**
  - Product demo template
  - Social ad template (3 versions: 16:9, 9:16, 1:1)
  - Testimonial template
  - Brand-customizable (colors, fonts, logos)

- [ ] **Video Playbooks**
  - Step-by-step guide for each video type
  - Time estimates per task
  - Quality checklists
  - Train offshore team on playbooks

- [ ] **Brand Style Guides**
  - Document existing client brand guidelines
  - Create visual reference sheets
  - Store in Brand Hub

**Expected Impact:** 20-30% time savings on standard videos

#### Workflow Automation
- [ ] **Automated Captioning**
  - Integrate Rev.ai or Descript
  - Auto-generate SRT files
  - Editor reviews/edits captions (not manual creation)

- [ ] **Automated Asset Organization**
  - When client uploads files → auto-tag by type
  - Logo detection (AI)
  - Auto-create project folders
  - Notify editor when assets ready

- [ ] **Multi-Format Export Automation**
  - One master file → auto-generate 16:9, 9:16, 1:1
  - Use AWS MediaConvert or Encoding.com
  - Cuts export time from 2 hours → 15 mins

**Expected Impact:** 15-25% time savings across all videos

---

### Month 5: Team Scaling

#### Hire Specialists
- [ ] **Rough Cut Editor** ($25-30/hr)
  - First pass edits, sequencing
  - Junior offshore talent
  - Train on templates

- [ ] **Motion Graphics Specialist** ($40-50/hr)
  - After Effects animations
  - Mid-level offshore or US-based
  - Focus only on motion work

- [ ] **QC/Finisher** (You or senior editor)
  - Final review, color, sound polish
  - Client-facing quality check

**Assembly Line Workflow:**
```
Brief → Script (AI) → Rough Cut (Junior) → Motion (Specialist) → Finish (Senior) → Deliver
```

**Expected Impact:** 25-35% cost reduction via specialization

#### Expand Offshore Team
- [ ] Hire 2nd offshore editor (Philippines/Eastern Europe)
- [ ] Document training process
- [ ] Build QC checklists
- [ ] Weekly review sessions

**Expected Impact:** 2X capacity without 2X cost

---

### Month 6: Analytics & Intelligence

#### Performance Tracking (AirOps)
- [ ] **Video Tracking Setup**
  - Add metadata to all delivered videos
  - Optional: Client connects YouTube/LinkedIn accounts (OAuth)
  - AirOps monitors published videos

- [ ] **Analytics Dashboard (Client Portal)**
  - "Video Performance" tab
  - Shows: Where published, views, engagement, watch time
  - Per-video breakdown
  - Platform comparison (YouTube vs LinkedIn)

- [ ] **Insights Generation**
  - AirOps analyzes what videos perform best
  - Suggestions: "Your 60s videos get 2x engagement"
  - Feed insights back to future script generation

#### Brand Intelligence Improvements
- [ ] **Auto-Save Preferences**
  - After each project, extract learnings:
    - Music style preference
    - Pacing (fast vs slow edits)
    - Visual style (minimal vs bold)
    - Voiceover tone
  - Store in AirOps brand profile

- [ ] **Quick Request Templates**
  - "Make it like [previous video]" option
  - Pre-fill brief based on past project
  - One-click request for repeat videos

**Expected Impact:** Faster script approval, higher client satisfaction

---

## Phase 3: Scale (Months 7-12)

**Goal:** Scale to 25-30 clients, validate unit economics, prepare for Phase 2 (SnapVideo Studio)

---

### Months 7-9: Growth & Refinement

#### Client Acquisition
- [ ] **Marketing Site Optimization**
  - Add case studies (beta client testimonials)
  - Before/after examples
  - ROI calculator
  - Clear pricing page

- [ ] **Sales Process**
  - Automated demo videos
  - Self-serve sign-up (Creator tier)
  - Sales calls for Growth+ tiers
  - Onboarding automation

- [ ] **Referral Program**
  - Existing clients get 1 month free for referral
  - Referred client gets 10% off first month

#### Operational Excellence
- [ ] **Metrics Tracking**
  - Average time per video type
  - Cost per video type
  - Credit utilization per tier
  - Revision rounds average
  - Client satisfaction (NPS)

- [ ] **Process Optimization**
  - Identify bottlenecks
  - Refine handoffs between specialists
  - Target: <4 hours per standard ad (down from 10)

- [ ] **Quality Assurance**
  - Pre-delivery checklist
  - Client satisfaction surveys
  - Track revision reasons

**Goal:** 20-25 clients, 40% margins sustained

---

### Months 10-12: Platform Maturity

#### Advanced Features
- [ ] **Multi-User Accounts**
  - Client teams (multiple logins per company)
  - Role-based permissions (requester vs approver)
  - Comment/collaboration within portal

- [ ] **Project Templates**
  - Save common video types as templates
  - One-click duplicate past successful projects
  - "Monthly newsletter video" template auto-fills brief

- [ ] **Bulk Operations**
  - Request multiple videos at once
  - Batch upload assets
  - Bulk approve scripts

#### Admin Tools
- [ ] **Revenue Dashboard**
  - MRR (Monthly Recurring Revenue)
  - Churn rate
  - Credit utilization trends
  - Customer LTV

- [ ] **Editor Workload Management**
  - See hours per editor
  - Balance workload
  - Flag overallocation

- [ ] **Automated Reporting**
  - Weekly client digests (what's in queue, what's delivered)
  - Monthly performance reports (video analytics)
  - Quarterly business reviews (for Enterprise clients)

**Goal:** 25-30 clients, processes ready for 50+

---

## Future Products

### SnapVideo Studio (SaaS - Months 13-18)

**What It Is:**
- Standalone software for teams with in-house editors
- Same AI tools (ScriptHooks + AirOps) without the production service
- Target: Agencies, in-house creative teams, freelancers

**Features:**
- Brand voice management (AirOps)
- Script generation (ScriptHooks)
- Performance analytics dashboard
- Frame.io integration
- Multi-client management

**Pricing:**
- Solo: $299/month (1 brand, 50 scripts)
- Team: $599/month (5 brands, 200 scripts)
- Agency: $1,199/month (20 brands, unlimited scripts)

**Why This Works:**
- Extract value from AI tooling we've already built
- Lower touch (software vs service)
- Upsell path: Studio users who grow → upgrade to Full Service

---

### ScriptHooks API (Developer Product - Months 19-24)

**What It Is:**
- Direct API access to ScriptHooks script generation
- For developers building video tools
- Embed video intelligence into other platforms

**Pricing:**
- Developer: $99/month (1,000 API calls)
- Pro: $299/month (10,000 API calls)
- Enterprise: $999/month (unlimited calls)

**Use Cases:**
- Video editing software (add AI script generation)
- Social media tools (auto-generate video captions)
- Marketing automation (brief → script → auto-produce)

---

## Success Metrics

### Phase 1 (Months 1-3) - MVP
- ✅ 5-10 beta clients onboarded
- ✅ $50K-100K MRR
- ✅ 5-day average turnaround time
- ✅ 90%+ script approval rate (minimal revisions)
- ✅ 40% gross margin on labor

### Phase 2 (Months 4-6) - Optimization
- ✅ 15-20 paying clients
- ✅ $150K-200K MRR
- ✅ <4 hours per standard video (down from 10)
- ✅ 40% sustained gross margin
- ✅ <5% monthly churn

### Phase 3 (Months 7-12) - Scale
- ✅ 25-30 clients
- ✅ $250K-300K MRR
- ✅ 85+ NPS score
- ✅ 2-3 revision rounds average (down from 4-5)
- ✅ 40-45% gross margin

### Financial Targets (Year 1)

| Month | Clients | MRR | Labor Cost | Gross Profit | Margin |
|-------|---------|-----|------------|--------------|--------|
| 3 | 8 | $80,000 | $52,000 | $28,000 | 35% |
| 6 | 18 | $180,000 | $115,000 | $65,000 | 36% |
| 12 | 28 | $280,000 | $165,000 | $115,000 | 41% |

**Year 1 ARR:** ~$2.5M
**Year 1 Profit:** ~$900K (after labor + overhead)

---

## Key Risks & Mitigations

### Risk 1: Margins Don't Hit 40%
**Mitigation:**
- Track cost per video weekly
- Implement templates/automation aggressively (Month 4-6)
- Adjust pricing if needed (raise prices 10-15%)

### Risk 2: Client Churn (Subscription Fatigue)
**Mitigation:**
- Performance analytics show ROI
- Brand intelligence = switching cost
- Pause option (1-2 months) instead of cancel
- Regular check-ins, proactive support

### Risk 3: AI Tooling Costs Higher Than Expected
**Mitigation:**
- Negotiate volume discounts with AirOps/ScriptHooks
- Pass through costs if needed (add to pricing)
- Build proprietary AI layer (long-term)

### Risk 4: Can't Scale Offshore Team Fast Enough
**Mitigation:**
- Hire 2-3 editors ahead of demand
- Build training pipeline (junior → mid → senior)
- Partner with offshore agencies for overflow

---

## Next Steps

1. **Week 1-2: Technical Setup**
   - Set up Next.js + Supabase boilerplate
   - Create database schema
   - Design wireframes for client portal

2. **Week 3-4: Build Sprint 1 (Core Portal)**
   - Client dashboard
   - Request form with credit calculator
   - PM dashboard (kanban view)

3. **Month 2: AI Integrations**
   - Connect ScriptHooks + AirOps APIs
   - Build script generation workflow
   - Test with 1-2 pilot clients

4. **Month 3: Polish + Beta Launch**
   - Stripe integration
   - Onboard 5-10 beta clients
   - Collect feedback, iterate

---

## Document Control

**Owner:** Wesley Fleming (Founder)

**Contributors:**
- Engineering team (TBD)
- Product manager (TBD)

**Review Cadence:** Monthly roadmap review, quarterly strategic planning

**Version History:**
- v1.0 - January 6, 2026 - Initial roadmap

---

## Appendix

### Resources
- [SnapVideo Website](https://snapvideo-custom.vercel.app)
- ScriptHooks Documentation (link TBD)
- AirOps API Docs (link TBD)
- Frame.io API Docs: https://developer.frame.io

### Competitor Research
- Fiverr (pricing, quality benchmarks)
- Superside (workflow inspiration)
- Descript (AI video tools)
- Motion (template marketplace)

---

**End of Product Roadmap**
