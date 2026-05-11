# JobWise — UI Blueprint & Design System

---

## 1. bolt.dev

**Preview:** https://spark-talent-match-66.lovable.app/

---

### Brand Identity

- **Name:** JobWise
- **Tagline:** *"Hiring directly through your resume"*
- **Personality:** Modern, professional, intelligent, efficient, friendly
- **Visual style:** Tubik-inspired — soft pastel gradients, rounded geometry, 3D character illustration, floating UI cards, generous whitespace

---

### Color Palette (OKLCH, defined in `src/styles.css`)

#### Core Semantic Tokens — Light Theme

| Token | Value | Use |
|---|---|---|
| `--background` | `oklch(0.985 0.01 300)` | Soft off-white with violet hint — page background |
| `--foreground` | `oklch(0.18 0.03 280)` | Deep ink violet — body text |
| `--card` | `oklch(1 0 0)` | Pure white — surfaces |
| `--primary` | `oklch(0.18 0.03 280)` | Dark violet/near-black — primary buttons, headings |
| `--primary-foreground` | `oklch(0.985 0.01 300)` | Off-white on primary |
| `--secondary` | `oklch(0.96 0.02 320)` | Pale pink-lavender |
| `--muted` | `oklch(0.96 0.015 300)` | Light lilac — chips, subtle backgrounds |
| `--muted-foreground` | `oklch(0.5 0.03 280)` | Medium violet-gray — captions |
| `--accent` | `oklch(0.72 0.18 30)` | Warm coral-orange — CTAs, highlights |
| `--accent-foreground` | `oklch(1 0 0)` | White on accent |
| `--border / --input` | `oklch(0.92 0.015 300)` | Soft lilac border |
| `--ring` | `oklch(0.72 0.18 40)` | Orange focus ring |
| `--destructive` | `oklch(0.577 0.245 27.325)` | Red for errors |

#### Brand Colors

| Token | Approx Hex Feel | Use |
|---|---|---|
| `--brand-pink` `oklch(0.85 0.12 350)` | Soft rose pink | Hero accents, decorative blobs |
| `--brand-purple` `oklch(0.78 0.12 300)` | Dusty lavender | Backgrounds, secondary accents |
| `--brand-orange` `oklch(0.72 0.18 40)` | Warm coral | Primary accent, match-score badges |

#### Gradients

- `--gradient-hero`: pink → rose → lavender (135°) — hero section background
- `--gradient-accent`: coral → red-orange (135°) — CTA buttons, match badges, avatars
- `--gradient-card`: pink → purple pastel — feature/decorative cards

#### Shadows

- `--shadow-soft`: `0 10px 40px -10px oklch(0.5 0.1 300 / 0.2)` — floating cards
- `--shadow-glow`: `0 20px 60px -20px oklch(0.72 0.18 40 / 0.4)` — accent CTAs

---

### Typography

- **Font family:** System default sans (Tailwind default stack — Inter-like). Clean geometric sans, no serifs.

#### Hierarchy

| Element | Size | Style |
|---|---|---|
| Hero H1 | `text-5xl`–`text-7xl` | `font-bold`, tight tracking |
| Section H2 | `text-3xl`–`text-4xl` | `font-bold` |
| Card titles | `text-lg`–`text-xl` | `font-semibold` |
| Body | `text-sm`–`text-base` | `text-muted-foreground` for secondary |
| Micro labels / chips | `text-xs` | Often `font-medium` |

---

### Shape & Spacing Language

- **Radius scale:** Based on `--radius: 1rem` → `rounded-md` (12px), `rounded-lg` (16px), `rounded-2xl` (24px), `rounded-3xl` (28px), `rounded-full` for pills/avatars/search bars
- **Buttons & inputs:** Mostly `rounded-full` (pill style, Tubik-flavored)
- **Cards:** `rounded-2xl` with soft shadow on white background
- **Spacing:** Generous — sections use `py-16`–`py-24`, cards `p-5`–`p-8`, grid gaps `gap-4`–`gap-8`

---

### Component Library

- **shadcn/ui** (New York style) with Lucide icons
- **Customized:** Button (default + variants, plus pill rounding), Input, Card, Badge, Tabs, Dialog, Sonner toaster, Sidebar, etc.
- **Icons:** Lucide — Search, Mail, Bookmark, Sparkles, Target, Zap, Briefcase, etc.

---

### Page Architecture

#### Public
- `/` — Landing: Nav · Hero (gradient + 3D character + floating match cards + search) · Logo strip · Features (3 cards) · How It Works · Employers · Testimonials · CTA banner · Footer
- `/login`, `/signup` — Split layout with brand panel + form, role toggle (candidate/employer)

#### Candidate (`/dashboard/*`)
- `dashboard` — Jobs discovery + search + category filters + match score cards
- `dashboard/jobs/:jobId` — Job detail + match breakdown + One-Click Apply
- `dashboard/applications` — Status tracking
- `dashboard/profile` — Editor + skill tags + simulated resume analysis

#### Employer (`/employer/*`)
- `employer` — Overview, hiring stats, top matches
- `employer/jobs`, `employer/jobs/new` — Post a job
- `employer/candidates` — Talent browser, contact/save actions

---

### Signature UI Patterns

- Floating cards over hero with match %, resume score, category bars — drop-shadow + slight rotation
- **Match score chip:** Pill, white text on `--gradient-accent`, e.g. "92% match"
- **Avatar:** Circular with `--gradient-accent` fill + initials
- **Skill tags:** `rounded-full bg-muted px-2 py-0.5 text-xs`
- **Search bar:** Pill input with leading Search icon, ghost border
- **Section headers:** Small uppercase eyebrow label + large bold heading + muted subline

---

### Imagery

- **Hero illustration:** 3D cartoon professional on an orange beanbag (`src/assets/hero-character.png`) — playful, friendly, Tubik-inspired
- **Decorative blobs:** Behind hero/CTA using gradients with blur

---

### Motion

- **Hover:** Subtle scale / shadow lift on cards and buttons
- **Floating cards:** Gentle vertical float / parallax feel
- **Toasts** via Sonner for confirmations (apply, save, contact)

---

### Tech Stack

| Layer | Choice |
|---|---|
| Framework | TanStack Start v1 (React 19, Vite 7, file-based routing) |
| Styling | Tailwind v4 via `@import "tailwindcss"` in `src/styles.css`, semantic tokens in OKLCH |
| UI kit | shadcn/ui (New York) + Lucide icons + Sonner toasts |
| State | React context (`auth-context`) + localStorage, mock data only — no backend wired |

---
---

## 2. Emergent

> Preview: Not currently deployable

---

### Design Archetype

**"Neo-Tubik Expressive"** — a fusion of soft pastel optimism (HireMe/Quitey vibes) with confident dark "command-center" sections (LuckyJob influence), elevated by editorial serif typography and unexpected glassmorphism layering. Inspired by tubikstudio.com — bold, playful, emotionally honest, never generic.

---

### Brand Identity

#### Wordmark
- **"Job"** → Bricolage Grotesque, **bold**, color `#1A0B2E` (deep plum)
- **"Wise"** → Instrument Serif, *italic*, color `#FF6B6B` (coral)
- **Trailing dot** → 8px circle filled with `#00E676` (neon lime) + soft glow `0 0 12px rgba(0,230,118,0.7)`
- **Tagline:** *"Find work that fits."*

#### Personality
Modern · Professional · Intelligent · Efficient · Expressive · Playful · Bold · Honest

---

### Color Palette

#### Primary Surfaces

| Token | Hex | Usage |
|---|---|---|
| `jw-bg` | `#F4F0FF` | Primary lavender background |
| `jw-bg2` | `#FFE8E0` | Soft peach secondary background |
| `jw-dark` | `#1A0B2E` | Deep plum — dark sections, command-center |
| `jw-lavender` | `#E0D4FF` | Accent fills |
| `jw-peach` | `#FFD1DC` | Accent fills |

#### Brand Accents

| Token | Hex | Usage |
|---|---|---|
| `jw-coral` | `#FF6B6B` | Primary CTA, italic "Wise", hover highlights |
| `jw-coral-h` | `#FF5252` | Coral hover state |
| `jw-lime` | `#00E676` | High match scores (≥80%), success states, brand dot |
| `jw-text` | `#1C1B1F` | Body text, headings |

#### Match-Score Color Logic

| Score | Color | Label |
|---|---|---|
| ≥ 80% | `#00E676` neon lime (with drop-shadow glow) | "Apply now" |
| 60–79% | `#FFA726` warm orange | "Worth a look" |
| < 60% | `#FF6B6B` coral | "Stretch role" |

#### Glass Surfaces

- **Light glass:** `rgba(255, 255, 255, 0.65)` + `backdrop-filter: blur(20px)` + `1px solid rgba(255,255,255,0.55)` + shadow `0 8px 32px rgba(26,11,46,0.08)`
- **Dark glass:** `rgba(26, 11, 46, 0.55)` + `backdrop-filter: blur(20px)` + `1px solid rgba(255,255,255,0.08)`

#### Signature Mesh Background

```css
background-image:
  radial-gradient(at 12% 18%, #FFE8E0 0px, transparent 45%),
  radial-gradient(at 88% 12%, #FFD1DC 0px, transparent 45%),
  radial-gradient(at 76% 88%, #E0D4FF 0px, transparent 50%),
  radial-gradient(at 18% 82%, #FFE3CC 0px, transparent 50%);
```

---

### Typography System

Three carefully chosen fonts to **avoid AI-slop** (no Inter, no Roboto):

#### `Instrument Serif` — Hero & Editorial
- Used for: massive headlines (`clamp(3rem, 7.2vw, 6.5rem)`), italic emotional accents, footer mega-wordmark
- Style: editorial, romantic, confident
- Example: *"Find work that **actually** fits who you are."*

#### `Bricolage Grotesque` — Display & Headings
- Used for: section titles, card titles, navigation, stats numbers, match-score numerals
- Weights: 400 / 500 / 600 / 700 / 800
- Style: modern geometric with personality (not generic)

#### `Outfit` — Body & UI
- Used for: paragraphs, descriptions, form labels, table content, captions
- Weights: 300 / 400 / 500 / 600 / 700
- Style: clean, neutral, friendly

#### Type Scale

| Element | Size | Font |
|---|---|---|
| Mega hero | `clamp(3rem, 7.2vw, 6.5rem)` | Instrument Serif |
| Section H2 | 5rem–6rem | Instrument Serif + Bricolage Grotesque mix |
| Card H3 | 1.25rem (`text-xl`) | Bricolage Grotesque 700 |
| Stat value | 3rem (`text-5xl`), 800 weight | Bricolage Grotesque |
| Body | 1rem–1.125rem | Outfit 400 |
| Eyebrow chips | 0.75rem uppercase, 0.02em tracking | Bricolage Grotesque 600 |

---

### Spacing & Layout

- **Container:** `max-w-7xl mx-auto`, padding `px-6 md:px-10`
- **Section vertical rhythm:** `py-24` between major sections
- **Card padding:** `p-6` (cards) / `p-7`–`p-8` (large cards)
- **Border radius:** `rounded-3xl` (1.5rem) for cards, `rounded-full` for pills/buttons, `rounded-[2.5rem]` for showcase blocks
- Generous breathing: 2–3× more whitespace than typical SaaS — deliberate

---

### Component Library

#### Buttons

**Primary (`.btn-coral`)**
- Background `#FF6B6B`, white text, `rounded-full`, `px-7 py-3.5`, weight 600
- Hover: `-translate-y-2px`, deeper shadow, bg shifts to `#FF5252`
- Box-shadow: `0 6px 20px rgba(255,107,107,0.35)` → `0 10px 28px rgba(255,107,107,0.45)` on hover

**Dark (`.btn-dark`)**
- Background `#1A0B2E`, white text, `rounded-full`, weight 600
- Hover: lift + shadow

**Ghost (`.btn-ghost`)**
- `rgba(255,255,255,0.7)` background, plum text, subtle 1px border, hover to full white

#### Chip / Pill
- 6px × 14px padding, `rounded-full`, 12px text, 600 weight, 0.02em tracking
- Default: `bg-[#FFE8E0] text-[#C2185B]`
- Variants for each badge color (skill / mode / level)

#### Glass Card
- `rounded-3xl`, glassmorphic surface, `hover:-translate-y-1.5 hover:shadow-2xl`, 300ms transition
- Optional 2px gradient top accent stripe revealing company color (job cards only)

#### Match Score Ring *(signature component)*
- SVG circle, animated via `stroke-dasharray` + `stroke-dashoffset`
- 1s ease-out fill animation on mount
- Drop-shadow glow: `drop-shadow(0 0 6px color66)`
- Sizes: 42px / 48px / 52px / 56px / 64px / 104px / 120px / 132px
- Center labels: number (Bricolage 800) + "match" (Outfit 400)

#### Input Field (`.input-jw`)
- 14×18px padding, `border-radius: 14px`, 1px border `rgba(26,11,46,0.12)`
- Focus: coral border + `0 0 0 4px rgba(255,107,107,0.12)` ring
- Left-icon variant adds `padding-left: 2.75rem`

---

### Motion Principles

| Effect | Spec |
|---|---|
| `animate-float-slow` | 7s ease-in-out, ±14px Y + ±1.5° rotate (hero illustration) |
| `animate-float-x` | 6s ease-in-out, slight XY drift (floating glass cards) |
| `animate-marquee` | 28s linear infinite, company logos |
| `pulse-glow` | 2.4s box-shadow ring (CTAs/lime accents) |
| `animate-fade-up` | 0.7s `cubic-bezier(0.22, 1, 0.36, 1)`, 16px Y + opacity (hero entrance) |
| Card hover | `-translate-y-1.5` + `shadow-2xl`, 300ms |
| Button hover | `-translate-y-2px` + deeper shadow, 200ms |
| Match ring fill | `stroke-dashoffset` 1s ease-out |

> Principle: animate **specific properties** (transform, opacity, box-shadow) — never `transition: all`.

---

### Page-by-Page Blueprint

#### 1. Landing (`/`)
- **Hero:** 7/5 grid split. Left: chip eyebrow → mega Instrument Serif h1 with italic *actually* in coral → body copy → glass search bar with coral CTA → trending keywords. Right: 3D briefcase illustration `animate-float-slow` with 3 floating glass cards (top match score, detected skills, median pay zap-chip).
- **Trusted-by marquee:** Soft white-tinted band, uppercase eyebrow, infinite-scrolling row of 8 company logos.
- **How-it-works bento:** 12-column asymmetric grid. 6 feature cards of varying sizes (7-col hero feature with bg decor, 5-col, 5-col, 4-col, 4-col, 4-col dark).
- **Match-score showcase:** Rounded `[2.5rem]` peach-to-lavender gradient block. Left copy, right 2×2 grid of glass cards with match values (96, 84, 72, 58) and status labels.
- **Dark testimonials:** `#1A0B2E` background with subtle noise overlay. 5-star row → 24px Instrument Serif quote → avatar + name + role.
- **Featured jobs:** 3-column grid of pastel job cards, each tinted by `job.accent` with match ring corner.
- **Big CTA:** Coral-to-magenta gradient `[2.5rem]` block, 7xl Instrument Serif headline, twin buttons (ghost + dark).
- **Footer:** Plum dark background with `[10rem]` italic "jobwise." mega wordmark, 4-column links, social circles that hover to coral.

#### 2. Auth (`/login`, `/signup`)
- **50/50 split:** Left = mesh-bg with 3D decor illustration + logo + emotional headline + social proof (avatar stack + "12,400+ joined"). Right = clean white form area.
- **Role toggle:** Pill toggle with active pill in dark plum + white text, sliding feel.
- **Form fields:** Icon-prefixed (mail/lock/user) inputs, coral CTA button with arrow.

#### 3. Candidate Dashboard (`/dashboard`)
- **Greeting hero:** Chip + serif h1 with italic first name.
- **Stats grid (12-col):** 3× equal stat cards on row 1, then 7/5 split: big profile card with 120px MatchRing + checklist (lime check icons / coral dots), dark resume-upload card with radial coral glow.
- **Recommended jobs:** 3-col grid of pastel cards (using `job.accent` tinted backgrounds).
- **Applications table:** White `rounded-3xl` with grid rows showing company logo + title + stage + date + status pill.
- **Insights row:** Peach "Skills heating up" card with trending pill cloud + dark "AI advice" card with coral radial glow.

#### 4. Job Browse (`/jobs`)
- **Hero:** Chip → 7xl serif headline → big glass `[3rem]` rounded search bar with split title/location inputs + coral search CTA.
- **3-column sidebar + 9-column results:**
  - Left: White sticky filter card with grouped checkboxes (Employment/Mode/Seniority) + coral "Clear all"
  - Right: Results header (count in 2xl Bricolage + sort dropdown) → 2-column grid of `JobCard`s

#### 5. Job Detail (`/jobs/:id`)
- **Back button** (top-left, ghost)
- **Hero card:** Large pastel rounded-`[2rem]` block tinted with `job.accent`. 9/3 split: left has company logo + meta + 7xl serif title + chip row. Right has 132px MatchRing + "Based on your resume" caption.
- **Body 8/4 split:**
  - Left: 4 white rounded sections (About, Requirements with lime check bullets, Skills as pastel pills, Benefits as 2-col mini-cards)
  - Right: Sticky white apply card with salary, primary coral apply button that transforms into lime "✓ Application sent", Save/Share buttons, and "Why this match" bulleted list
- **Similar jobs:** 3 pastel cards at the bottom.

#### 6. Employer Dashboard (`/employer`)
- **Theme inverted to `#1A0B2E` dark** (command-center mode)
- **Greeting:** Coral-tinted chip + serif headline with italic *smarter*.
- **4-column KPI row:** Dark glass cards, one accent card with coral gradient overlay.
- **Tabs:** Underlined tabs (applicants/jobs/analytics) with coral indicator.
- **Applicants table:** Dark glass with search + filter chip, table rows with avatar + name + role + lime/orange match number + stage pill + icon actions.
- **Analytics:** Animated funnel bars (coral→lime gradient fill) + top roles list.
- **Post-job modal:** White modal with chip + serif h2 + form, success-state with lime check confirmation.

---

### Iconography

- **Library:** lucide-react (NO emoji)
- **Sizes:** 14–18px in cards, 24–28px in feature blocks
- **Colors:** Dark plum on light surfaces, white on dark surfaces, coral for active/key actions, lime for success

---

### Imagery

- **Hero illustration:** AI-generated 3D briefcase, soft pink/lavender Tubik-style, transparent PNG
- **Background decor:** Abstract 3D geometric shapes (auth split + CTA corners + bento)
- **Avatars:** High-quality Unsplash portraits + i.pravatar.cc placeholder fallbacks
- **Company logos:** Stylized colored squares with single-letter initials (S/N/L/F/V/A) — intentionally lo-fi badge style

---

### Layering & Depth Techniques

1. **Glass over mesh:** Glass cards float above mesh-gradient backgrounds
2. **Floating elements:** 2–3 layered animated cards around hero illustration
3. **Radial color blobs:** Large blurred `rounded-full` div with radial gradient inside dark sections
4. **Noise overlay:** SVG fractalNoise at 0.06 opacity inside dark sections
5. **Asymmetric grids:** Bento layouts that intentionally avoid uniform card sizes

---

### Accessibility & UX

- Color contrast: dark plum text on light bg = 14:1+, white on plum dark = 16:1+
- Coral primary against white = 3.5:1 (used only for large text or icons with weight 600+)
- `data-testid` on every interactive element (80+ test IDs across pages)
- Focus states: coral ring on inputs, native ring on buttons
- Keyboard navigation preserved (no custom hijacking)
- All links are proper `<Link>` / `<a>` elements; buttons are `<button>`

---

### File Architecture

```
/app/frontend/src/
├── App.js                       # Router with 7 routes
├── index.css                    # Fonts, CSS variables, mesh-bg, animations, buttons, input
├── App.css                      # Minimal app shell
├── context/AuthContext.js       # localStorage mock auth
├── components/
│   ├── Logo.jsx                 # JobWise wordmark
│   ├── Navbar.jsx               # Glass sticky pill nav
│   ├── Footer.jsx               # Dark footer + mega wordmark
│   ├── JobCard.jsx              # Reusable job tile w/ match ring
│   └── MatchRing.jsx            # Animated SVG ring
├── pages/
│   ├── Landing.jsx
│   ├── Auth.jsx                 # Login + Signup
│   ├── CandidateDashboard.jsx
│   ├── JobBrowse.jsx
│   ├── JobDetail.jsx
│   └── EmployerDashboard.jsx
└── data/mock.js                 # Jobs, applicants, companies, testimonials
```

---
---

## 3. Codex

---

### Design Direction

JobWise uses a modern SaaS/product-dashboard style: clean, professional, AI-forward, and efficient. The interface balances a polished landing page with dense operational dashboards for candidates and employers.

**Visual tone:**
- Professional and trustworthy
- Clean, data-driven, and modern
- Slightly editorial on the landing page
- More utilitarian inside dashboards
- Built around cards, panels, charts, match scores, and workflow steps

---

### Color Palette

#### Primary Colors

| Value | Use |
|---|---|
| `#11151c` | Ink / primary text |
| `#ffffff` | White |
| `#f7f8f5` | Paper background |
| `#eef3f4` | Soft section background |
| `#d9e0e8` | Border line |
| `#5b6473` | Muted text |

#### Accent Colors

| Value | Use |
|---|---|
| `#14b875` | AI green |
| `#08784d` | Dark green |
| `#2864ff` | Bright blue |
| `#ff6a55` | Coral highlight |
| `#ffd166` | Yellow accent |

#### Dark Surfaces

| Value | Use |
|---|---|
| `#17202b` | Dashboard dark navy |
| `#123d37` | Employer dashboard deep green |

#### Color Usage Rules

- **Green** — match quality, AI signals, completion, positive indicators
- **Blue** — actions, applications, product intelligence
- **Coral** — warm highlight in workflow and visual accents
- **Dark ink/navy** — primary buttons, dashboard hero sections, brand strength
- **Backgrounds** — mostly off-white or soft gray-green for clean product feel

---

### Typography

- **Font family:** `Inter`
- **Fallback:** `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`
- Style: modern geometric sans-serif, high readability, strong bold headings, compact dashboard labels

#### Main Heading Sizes

| Element | Size |
|---|---|
| Hero `h1` | `clamp(72px, 14vw, 168px)` |
| Page title | `clamp(48px, 9vw, 118px)` |
| Section `h2` | `clamp(30px, 4vw, 58px)` |
| Card `h3` | `22px` |

#### Body Text

- Default muted copy uses `#5b6473`
- Line height around `1.55`
- Hero paragraph: `clamp(18px, 2vw, 23px)`

#### Labels / Eyebrows

- Uppercase, `13px`, weight `800`, letter-spacing `0.08em`, color `#08784d`

---

### Layout Structure

#### Main Routes

- `Platform` / landing page
- `Jobs`
- `Candidate`
- `Employer`
- `Sign in`
- `Create profile`

#### Global Layout

- Sticky top navigation: brand left, routes center, auth actions right
- Max content width: ~`1380px` for dashboard/workflow content
- Large sections: `clamp(56px, 8vw, 110px)` vertical / `clamp(18px, 5vw, 80px)` horizontal padding

---

### Navigation

- **Topbar:** Sticky, height `76px`, background `rgba(247, 248, 245, 0.9)`, backdrop blur `18px`, subtle bottom border
- **Brand mark:** `42px` square, radius `8px`, background `#11151c`, white "Jw" text
- **Nav buttons:** Text buttons, muted by default, ink color on hover/active
- **Primary CTA:** Dark ink button, white text, rounded `8px`, subtle shadow

---

### Landing Page

#### Hero Section

- Two-column grid: left = copy + CTAs, right = AI dashboard image
- Min height: full viewport minus nav

**Left content:**
- Eyebrow chip with green pulse dot
- Massive `JobWise` heading
- Supporting value proposition
- Two CTAs: "Analyze resume" + "Post a role"
- Stats row: `94%` match precision · `3.8x` faster shortlist · `21k` skills mapped

**Right visual:**
- Bitmap image: `assets/jobwise-ai-hero.png`, rounded `8px`, object-fit cover, large soft shadow
- Floating score card: "Best match" `96%`, white translucent background, backdrop blur

#### Feature Section

4 cards: Resume intelligence · Job recommendations · Employer workspace · Hiring analytics

- White background, `8px` radius, thin border, soft shadow, min-height ~`220px`

#### Preview Product Shell

Dark background band `#17202b`, three-column layout:

- **Mini sidebar:** Candidate/Employer switch, profile completion meter, resume parser box
- **Preview main:** Section title + recommended job cards
- **Insight panel:** Circular compatibility ring, semantic fit copy, match score visualization

---

### Jobs Marketplace (`/jobs`)

- Page title: "Explore AI-ranked roles"
- **Filters:** All roles / Recommended / Applied / Saved
- **Sort:** Match score / Salary / Applicant count
- **Job card anatomy:** Company logo initials · Match score pill · Job title · Company/location/type · Summary · Skill tags · Salary estimate · Apply button
- **Card style:** White/off-white, `8px` radius, thin border, compact SaaS layout, match score in green

---

### Authentication UI

#### Layout

- Two-column: left = form panel, right = dark onboarding checklist panel

#### Auth Form

- Role toggle: Candidate / Employer
- Email, password, organization/headline fields
- CTA: "Open dashboard" / "Create mock account"
- Secondary toggle: account switch

#### Candidate Checklist

1. Upload resume
2. Confirm extracted skills
3. Review recommended jobs
4. Track applications

#### Employer Checklist

1. Create company profile
2. Publish job posts
3. Review AI-ranked candidates
4. Schedule interviews

---

### Candidate Dashboard (`/candidate`)

#### Layout

- App shell: left sidebar (`280px`) + main content on soft gray background

#### Sidebar

- User card: Avatar "A" · Name: Asha Dave · Role: Candidate
- Nav items: Overview · Matches · Applications · Interviews · Profile
- Back to site button

#### Dashboard Hero

- Dark ink background
- Greeting: "Good afternoon, Asha."
- Summary of strongest matches + "Find more jobs" CTA

#### Metrics

| Metric | Value |
|---|---|
| Profile | `82%` |
| Applications | `14` |
| Avg. match | `91%` |
| Offers | `2` |

#### Panels

- Top recommendations
- Resume intelligence (parsed mock card with skills: FastAPI · React · PostgreSQL · TF-IDF · JWT · Product)
- Interviews
- Application tracker table (Role · Company · Stage · Date · Match)

---

### Employer Dashboard (`/employer`)

#### Layout

- Same shell as candidate dashboard with employer-specific deep green hero (`#123d37`)

#### Sidebar

- Avatar "N" · Name: Nexa Systems · Role: Employer
- Nav items: Overview · Jobs · Candidates · Interviews · Analytics

#### Metrics

| Metric | Value |
|---|---|
| Open roles | `7` |
| Applicants | `248` |
| Avg. score | `88%` |
| Interviews | `14` |

#### Panels

- Candidate shortlist (name · role summary · skills · match score · hiring stage)
- Create job posting (role title · category · requirement tags · Publish CTA)
- Skill demand bar chart (Python · React · PostgreSQL · NLP)
- Job management table (Role · Status · Applicants · Matched · Interviews)

---

### Workflow Section

Layout: Intro title → connected process track → 4 elevated workflow cards → gradient line behind cards → staggered rhythm

**Steps:**

| # | Icon | Name | Description |
|---|---|---|---|
| 1 | `PDF` | Parse | Extract resume text from PDF uploads |
| 2 | `TF` | Vectorize | Transform resumes and job descriptions into TF-IDF vectors |
| 3 | `%` | Match | Rank using cosine similarity and skill weighting |
| 4 | `GO` | Connect | Move into applications, interviews, and offers |

- Soft light background transitioning to dark lower band
- White elevated cards with gradient top rule, large icon blocks
- Alternating card vertical offset on desktop

---

### Cards & Panels

| Property | Value |
|---|---|
| Radius | `8px` |
| Border | `1px solid rgba(17, 21, 28, 0.08)` |
| Background | White or near-white |
| Shadow (important) | `0 24px 70px rgba(20, 31, 44, 0.12)` |
| Shadow (dashboard) | Softer variant |

**Repeated card types:** Job cards · Feature cards · Metric cards · Dashboard panels · Workflow cards · Candidate rows · Auth panels

---

### Buttons

| Type | Background | Text | Border |
|---|---|---|---|
| Primary | `#11151c` | White | — |
| Secondary | White | Ink | `#d9e0e8` |
| Ghost | Transparent | Ink | — |
| Apply | `#2864ff` | White | — |

- **Hover:** All buttons translate `-2px` upward

---

### Tags & Pills

- **Skill tags:** Rounded pill · `rgba(20, 184, 117, 0.11)` background · Dark green text · `12px` · `800` weight
- **Match score pill:** Green text · Pale green background · Rounded full · e.g. "96% match"
- **Stage pill:** Blue-tinted background · Used in employer candidate list

---

### Charts & Data Visuals

- **Circular compatibility ring:** CSS conic gradient, green active arc, pale gray remainder, white center circle with large match percentage text
- **Horizontal bar chart:** Label column + blue-to-green gradient bar (skill demand)
- **Tables:** CSS grid rows, soft gray header row, compact muted text, horizontal overflow for small screens

---

### Responsive Behavior

| Breakpoint | Layout |
|---|---|
| Desktop | 2-col hero, 3–4 col job grids, sidebar + main, horizontal workflow with staggered cards |
| Tablet | 2-col feature/job grids, stacked preview shell, 2-col workflow |
| Mobile | Stacked hero, 1-col cards, top-section sidebar, horizontal-scroll dashboard nav, tables scroll horizontally |

---

### Mock Data Coverage

The JavaScript mock data includes: jobs · applications · interviews · candidates · employer job posts · skill demand values

Simulated functionality: routing · auth role selection · job filtering + sorting · candidate dashboard · employer dashboard · tables · charts · recommendation cards · application pipeline · hiring pipeline

---

### Overall Product Feel

> JobWise should feel like a serious AI hiring product, not a playful job board. The UI uses strong typography, subdued surfaces, confident dark sections, and clear data visualization to communicate intelligence and trust. The landing page sells the platform; the dashboards show how it would actually work for candidates and employers.