# JobWise - Design Documentation

---

## Project Overview

**JobWise** is an AI-powered job matching platform that uses advanced TF-IDF vectorization and cosine similarity algorithms to connect candidates with their ideal job opportunities.

---

## Design Philosophy

**"Neo-Tubik Expressive"** — A fusion of soft pastel optimism with confident dark "command-center" sections, elevated by editorial serif typography and unexpected glassmorphism layering. Inspired by tubikstudio.com — bold, playful, emotionally honest, never generic.

### Core Principles
- **Modern & Professional** — Trustworthy platform for serious career opportunities
- **Intelligent** — AI-driven approach to job matching
- **Expressive** — Bold typography and unique visual identity
- **Efficient** — Streamlined processes saving time for both candidates and employers
- **Unique** — Stands out from generic job boards with distinctive design

---

## Brand Identity

### Wordmark
- **"Job"** → Bricolage Grotesque, **bold**, color `#1A0B2E` (deep plum)
- **"Wise"** → Instrument Serif, *italic*, color `#FF6B6B` (coral)
- **Trailing dot** → 8px circle filled with `#00E676` (neon lime) + soft glow `0 0 12px rgba(0,230,118,0.7)`

### Tagline
*"Find work that fits."*

### Personality
Modern · Professional · Intelligent · Efficient · Expressive · Playful · Bold · Honest

---

## Color Palette

### Primary Surfaces

| Token | Hex | Usage |
|---|---|---|
| `jw-bg` | `#F4F0FF` | Primary lavender background |
| `jw-bg2` | `#FFE8E0` | Soft peach secondary background |
| `jw-dark` | `#1A0B2E` | Deep plum — dark sections, command-center |
| `jw-lavender` | `#E0D4FF` | Accent fills |
| `jw-peach` | `#FFD1DC` | Accent fills |

### Brand Accents

| Token | Hex | Usage |
|---|---|---|
| `jw-coral` | `#FF6B6B` | Primary CTA, italic "Wise", hover highlights |
| `jw-coral-h` | `#FF5252` | Coral hover state |
| `jw-lime` | `#00E676` | High match scores (≥80%), success states, brand dot |
| `jw-text` | `#1C1B1F` | Body text, headings |

### Match-Score Color Logic

| Score | Color | Label |
|---|---|---|
| ≥ 80% | `#00E676` neon lime (with drop-shadow glow) | "Apply now" |
| 60–79% | `#FFA726` warm orange | "Worth a look" |
| < 60% | `#FF6B6B` coral | "Stretch role" |

### Glass Surfaces

- **Light glass:** `rgba(255, 255, 255, 0.65)` + `backdrop-filter: blur(20px)` + `1px solid rgba(255,255,255,0.55)` + shadow `0 8px 32px rgba(26,11,46,0.08)`
- **Dark glass:** `rgba(26, 11, 46, 0.55)` + `backdrop-filter: blur(20px)` + `1px solid rgba(255,255,255,0.08)`

### Signature Mesh Background

```css
background-image:
  radial-gradient(at 12% 18%, #FFE8E0 0px, transparent 45%),
  radial-gradient(at 88% 12%, #FFD1DC 0px, transparent 45%),
  radial-gradient(at 76% 88%, #E0D4FF 0px, transparent 50%),
  radial-gradient(at 18% 82%, #FFE3CC 0px, transparent 50%);
```

---

## Typography System

Three carefully chosen fonts to avoid AI-slop (no Inter, no Roboto):

### Instrument Serif — Hero & Editorial
- **Used for:** Massive headlines (`clamp(3rem, 7.2vw, 6.5rem)`), italic emotional accents, footer mega-wordmark
- **Style:** Editorial, romantic, confident
- **Example:** *"Find work that **actually** fits who you are."*

### Bricolage Grotesque — Display & Headings
- **Used for:** Section titles, card titles, navigation, stats numbers, match-score numerals
- **Weights:** 400 / 500 / 600 / 700 / 800
- **Style:** Modern geometric with personality (not generic)

### Outfit — Body & UI
- **Used for:** Paragraphs, descriptions, form labels, table content, captions
- **Weights:** 300 / 400 / 500 / 600 / 700
- **Style:** Clean, neutral, friendly

### Type Scale

| Element | Size | Font |
|---|---|---|
| Mega hero | `clamp(3rem, 7.2vw, 6.5rem)` | Instrument Serif |
| Section H2 | 5rem–6rem | Instrument Serif + Bricolage Grotesque mix |
| Card H3 | 1.25rem (`text-xl`) | Bricolage Grotesque 700 |
| Stat value | 3rem (`text-5xl`), 800 weight | Bricolage Grotesque |
| Body | 1rem–1.125rem | Outfit 400 |
| Eyebrow chips | 0.75rem uppercase, 0.02em tracking | Bricolage Grotesque 600 |

---

## Spacing & Layout

- **Container:** `max-w-7xl mx-auto`, padding `px-6 md:px-10`
- **Section vertical rhythm:** `py-24` between major sections
- **Card padding:** `p-6` (cards) / `p-7`–`p-8` (large cards)
- **Border radius:** `rounded-3xl` (1.5rem) for cards, `rounded-full` for pills/buttons, `rounded-[2.5rem]` for showcase blocks
- **Generous breathing:** 2–3× more whitespace than typical SaaS — deliberate

---

## Component Library

### Buttons

**Primary (`.btn-coral`)**
- Background `#FF6B6B`, white text, `rounded-full`, `px-7 py-3.5`, weight 600
- Hover: `-translate-y-2px`, deeper shadow, bg shifts to `#FF5252`
- Box-shadow: `0 6px 20px rgba(255,107,107,0.35)` → `0 10px 28px rgba(255,107,107,0.45)` on hover

**Dark (`.btn-dark`)**
- Background `#1A0B2E`, white text, `rounded-full`, weight 600
- Hover: Lift + shadow

**Ghost (`.btn-ghost`)**
- `rgba(255,255,255,0.7)` background, plum text, subtle 1px border, hover to full white

### Chip / Pill
- 6px × 14px padding, `rounded-full`, 12px text, 600 weight, 0.02em tracking
- Default: `bg-[#FFE8E0] text-[#C2185B]`
- Variants for each badge color (skill / mode / level)

### Glass Card
- `rounded-3xl`, glassmorphic surface, `hover:-translate-y-1.5 hover:shadow-2xl`, 300ms transition
- Optional 2px gradient top accent stripe revealing company color (job cards only)

### Match Score Ring *(Signature Component)*
- SVG circle, animated via `stroke-dasharray` + `stroke-dashoffset`
- 1s ease-out fill animation on mount
- Drop-shadow glow: `drop-shadow(0 0 6px color66)`
- Sizes: 42px / 48px / 52px / 56px / 64px / 104px / 120px / 132px
- Center labels: number (Bricolage 800) + "match" (Outfit 400)

### Input Field (`.input-jw`)
- 14×18px padding, `border-radius: 14px`, 1px border `rgba(26,11,46,0.12)`
- Focus: Coral border + `0 0 0 4px rgba(255,107,107,0.12)` ring
- Left-icon variant adds `padding-left: 2.75rem`

---

## Motion Principles

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

## Page Architecture

### Public Routes
- `/` — Landing: Nav · Hero (gradient + 3D character + floating match cards + search) · Logo strip · Features · How It Works · Employers · Testimonials · CTA banner · Footer
- `/login`, `/signup` — Split layout with brand panel + form, role toggle (candidate/employer)

### Candidate Routes (`/dashboard/*`)
- `/dashboard` — Jobs discovery + search + category filters + match score cards
- `/dashboard/jobs/:jobId` — Job detail + match breakdown + One-Click Apply
- `/dashboard/applications` — Status tracking
- `/dashboard/profile` — Editor + skill tags + simulated resume analysis

### Employer Routes (`/employer/*`)
- `/employer` — Overview, hiring stats, top matches
- `/employer/jobs`, `/employer/jobs/new` — Post a job
- `/employer/candidates` — Talent browser, contact/save actions

---

## Iconography

- **Library:** lucide-react (NO emoji)
- **Sizes:** 14–18px in cards, 24–28px in feature blocks
- **Colors:** Dark plum on light surfaces, white on dark surfaces, coral for active/key actions, lime for success

---

## Imagery

- **Hero illustration:** AI-generated 3D briefcase, soft pink/lavender Tubik-style, transparent PNG
- **Background decor:** Abstract 3D geometric shapes (auth split + CTA corners + bento)
- **Avatars:** High-quality Unsplash portraits + i.pravatar.cc placeholder fallbacks
- **Company logos:** Stylized colored squares with single-letter initials (S/N/L/F/V/A) — intentionally lo-fi badge style

---

## Layering & Depth Techniques

1. **Glass over mesh:** Glass cards float above mesh-gradient backgrounds
2. **Floating elements:** 2–3 layered animated cards around hero illustration
3. **Radial color blobs:** Large blurred `rounded-full` div with radial gradient inside dark sections
4. **Noise overlay:** SVG fractalNoise at 0.06 opacity inside dark sections
5. **Asymmetric grids:** Bento layouts that intentionally avoid uniform card sizes

---

## Accessibility & UX

- **Color contrast:** Dark plum text on light bg = 14:1+, white on plum dark = 16:1+
- **Coral primary against white = 3.5:1** (used only for large text or icons with weight 600+)
- `data-testid` on every interactive element (80+ test IDs across pages)
- **Focus states:** Coral ring on inputs, native ring on buttons
- **Keyboard navigation preserved** (no custom hijacking)
- All links are proper `<Link>` / `<a>` elements; buttons are `<button>`

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite |
| Styling | CSS modules with custom CSS variables |
| Routing | React Router v6 |
| Icons | Lucide React |
| State | React Context API (auth) + localStorage |
| API | Axios for FastAPI backend integration |

---

## File Architecture

```
/frontend
├── src/
│   ├── App.jsx                    # Router with all routes
│   ├── index.css                  # Fonts, CSS variables, mesh-bg, animations
│   ├── App.css                    # Minimal app shell
│   ├── context/
│   │   └── AuthContext.jsx        # Auth state management
│   ├── components/
│   │   ├── Logo.jsx               # JobWise wordmark
│   │   ├── Navbar.jsx             # Glass sticky pill nav
│   │   ├── Footer.jsx             # Dark footer + mega wordmark
│   │   ├── GlassCard.jsx          # Reusable glass card
│   │   ├── MatchRing.jsx          # Animated SVG ring
│   │   ├── Button.jsx             # Button variants
│   │   ├── Input.jsx              # Input field
│   │   └── Chip.jsx               # Pill/chip component
│   ├── pages/
│   │   ├── Landing.jsx            # Landing page
│   │   ├── Auth.jsx               # Login + Signup
│   │   ├── CandidateDashboard.jsx
│   │   ├── JobDetail.jsx
│   │   ├── JobBrowse.jsx
│   │   └── EmployerDashboard.jsx
│   ├── api/
│   │   └── client.js              # Axios instance for API calls
│   └── utils/
│       └── helpers.js             # Utility functions
└── package.json
```

---

## Integration with FastAPI Backend

### API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/login` | POST | User authentication, returns JWT token |
| `/user/` | POST | Create new user (candidate/employer) |
| `/candidate/update-profile` | PATCH | Update candidate profile with resume |
| `/candidate/my-profile` | GET | Get candidate profile |
| `/candidate/recommend-jobs` | GET | Get AI-recommended jobs with match scores |
| `/employer/update-profile` | PATCH | Update employer company profile |
| `/employer/my-profile` | GET | Get employer profile |
| `/job/create-job` | POST | Create new job posting |
| `/job/update-job-status/:id` | PATCH | Update job status |
| `/job/` | GET | Get all jobs |

### Authentication Flow
1. User logs in via `/login` endpoint
2. JWT token stored in localStorage
3. Token included in Authorization header for all API calls
4. Token refresh handled by AuthContext

### Data Mapping
- Backend match scores → MatchRing component
- Backend job data → JobCard component
- Backend profile data → Profile section
- Backend skills → Skill chips/pills

---

## Implementation Phases

### Phase 1: Foundation
- [x] Design documentation
- [ ] Set up React + Vite project
- [ ] Implement CSS custom properties
- [ ] Load custom fonts
- [ ] Create base components (Button, Input, GlassCard)

### Phase 2: Landing Page
- [ ] Build hero section with mesh gradient
- [ ] Implement floating cards
- [ ] Add navigation
- [ ] Build feature sections
- [ ] Add footer

### Phase 3: Authentication
- [ ] Build login/signup pages
- [ ] Implement role toggle
- [ ] Connect to FastAPI auth
- [ ] Add error handling

### Phase 4: Candidate Dashboard
- [ ] Build dashboard layout
- [ ] Implement MatchRing component
- [ ] Build job cards
- [ ] Connect to recommendation API
- [ ] Build profile section

### Phase 5: Employer Dashboard
- [ ] Build dark theme employer dashboard
- [ ] Implement candidate list
- [ ] Build job posting form
- [ ] Add analytics section

### Phase 6: Integration & Polish
- [ ] Connect all API endpoints
- [ ] Add loading states
- [ ] Implement error handling
- [ ] Add animations
- [ ] Optimize performance
- [ ] Test accessibility

---

## Design Inspiration Reference

The JobWise design is inspired by the "Emergent" UI blueprint, which combines:
- TubikStudio's bold, playful aesthetic
- Neo-Tubik Expressive design language
- Glassmorphism and modern depth techniques
- Custom typography to avoid generic AI-slop
- Pastel color palette with neon accents

Reference: `jobwise_ui_blueprint.md` for complete component specifications.
