# Architecture — K K Designers Website

Software-engineering view of this repository: what problem it solves, which platform it sits on, how the system is designed, and which features are actually live versus leftover from the template.

Related: [system-design.md](system-design.md) (C4 + flows) · [prod-serverless.md](prod-serverless.md) (AWS/GCP + domain) · [frontend-for-backend-engineers.md](frontend-for-backend-engineers.md) (Node/Yarn/React) · [../infra/README.md](../infra/README.md) (local Docker).

---

## 1. Executive summary

This repo is **not a generic website-builder product**. It is a **single-tenant marketing site** for **K K Designers**, an interior design studio in Pune (founder: Akshada Thorat).

It was generated on the **Emergent** stack (`FastAPI + React + MongoDB + shadcn/ui`) and then customized into a long-scrolling portfolio. Most of the template (Radix/shadcn kit, `/api/status`, auth test IDs, health-check plugin) is unused by the product UI.

| Layer | Role in this project |
| --- | --- |
| Product | High-converting single-page portfolio + consultation lead capture |
| Frontend | React 19 SPA (`Create React App` + CRACO). All visitor-facing features live here. |
| Backend | FastAPI + Motor/Mongo. Enquiry + email path exists but **the live form does not call it**. |
| Platform | Emergent preview/build image, visual-edits overlay, optional webpack health endpoints |

**Current lead path (production behavior):** the contact form builds a `mailto:` URL and opens the visitor’s mail client. Enquiry email goes to `kkdesigners15@gmail.com`. No database write happens on submit.

---

## 2. Problem the product solves

K K Designers sells **3D visualisation + on-site execution**. The site has to do three jobs that a static brochure usually fails at:

1. **Prove fidelity** — “the render is what we build.” Interactive before/after sliders carry that claim.
2. **Explain the process** — raw site → framing → finishes → handover, so villa/apartment owners trust turnkey work.
3. **Convert without a CRM** — a consultation request that lands in Akshada’s inbox (originally WhatsApp, then API+email, now mailto).

**Personas**

- Homeowners in Pune looking for boutique / luxury interiors
- Bungalow / villa owners who want turnkey execution
- Clients who only want photorealistic 3D / consultation

**Non-goals (today)**

- Multi-page CMS, user accounts, payments, admin dashboard
- Case-study detail routes
- Live inventory of projects from a database

---

## 3. The “framework” you are looking at

Two things share this repo. Do not confuse them.

### 3.1 Emergent application template (platform)

The Emergent base image (`fastapi_react_mongo_shadcn_base_image_cloud_arm`) gives you:

- `frontend/` — CRA 5, CRACO, Tailwind 3, Radix/shadcn primitives, TanStack Query, path alias `@/`
- `backend/` — FastAPI, Pydantic v2, Motor (async Mongo), CORS, dotenv
- `.emergent/` — job metadata, cron helpers
- `frontend/plugins/health-check/` — webpack plugin + `/health` style endpoints when `ENABLE_HEALTH_CHECK=true`
- `@emergentbase/visual-edits` — in-browser visual editing in **dev only** (wrapped in `craco.config.js`)
- `memory/PRD.md` + `design_guidelines.json` — generation briefs, not runtime code

This is a **batteries-included SaaS starter**, not a page builder SDK. You compose React components; you do not configure a site from a schema.

### 3.2 K K Designers product (domain)

Domain code lives almost entirely in:

```
frontend/src/App.js
frontend/src/components/kk/*
frontend/src/components/kk/data.js   # copy, images, contact constants
frontend/public/founder.jpg
backend/server.py                   # Enquiry + Resend-style email (dormant from UI)
```

The product is a **section-composed SPA**. `App.js` mounts Lenis and a fixed page order. There is no React Router usage in `App.js` despite `react-router-dom` being in `package.json`.

---

## 4. System context

```
┌─────────────┐     hash-scroll (#about, #contact, …)      ┌──────────────────┐
│   Visitor   │ ─────────────────────────────────────────► │  React SPA       │
│  (browser)  │                                            │  CRA / CRACO     │
└─────────────┘                                            └────────┬─────────┘
       │                                                            │
       │ mailto:kkdesigners15@gmail.com                             │ optional GET
       ▼                                                            │
┌─────────────┐                                            ┌────────▼─────────┐
│ Mail client │                                            │ Behold Instagram │
│ (user-owned)│                                            │ feeds.behold.so  │
└─────────────┘                                            └──────────────────┘
                                                                   │
                         unused by current form                    │
┌─────────────┐  POST /api/enquiry   ┌──────────────┐  POST email  │
│  FastAPI    │ ◄─────────────────── │  (dormant)   │              │
│  uvicorn    │                      └──────────────┘              │
└──────┬──────┘                                                    │
       │ insert                                                    │
       ▼                                                           │
┌─────────────┐     HTTPS + X-Email-Key                            │
│  MongoDB    │ ──────────────────► Emergent Email                 │
│  enquiries  │                     integrations.emergentagent.com │
└─────────────┘                                                    │
       Stock images: Pexels / Unsplash (hotlinked)                 │
       Founder: /founder.jpg (static asset)                        │
```

**Trust boundary:** the live conversion path never hits your servers. Reliability of lead delivery depends on the visitor having a mail client. The unused API path *would* persist to Mongo and notify via Emergent’s email integration (Resend behind `EMERGENT_EMAIL_KEY`).

---

## 5. C4-style design

### 5.1 Containers

| Container | Tech | Responsibility |
| --- | --- | --- |
| Web SPA | React 19, Tailwind, Framer Motion, Lenis | Render the portfolio, motion, form, Instagram grid |
| API | FastAPI 0.110, Uvicorn | `/api/enquiry`, `/api/status`, email guardrails |
| Database | MongoDB via Motor | `enquiries`, `status_checks` collections |
| Email gateway | Emergent `integrations.emergentagent.com` | Transactional HTML email |
| Instagram adapter | Behold JSON feed | Optional live grid (`REACT_APP_BEHOLD_FEED_ID`) |
| CDN images | Pexels / Unsplash | Portfolio photography (not owned assets except founder) |

### 5.2 Frontend component tree

```
index.js
  QueryClientProvider          # present; no queries used by kk components
  App
    Lenis (rAF loop, window.__lenis)
    Navbar                     # fixed header, Lenis scrollTo
    main
      Hero                     # masked line reveal + parallax + CompareSlider
      Ribbon                   # react-fast-marquee editorial strip
      About                    # founder story + tokenized portrait blob
      Services                 # 4 service cards from SERVICES[]
      Portfolio                # 3 local-state tabs
      Philosophy               # quote + material / colour callouts
      Contact                  # mailto form (no API)
      InstagramFeed            # Behold or fallback tiles
    Footer
```

Shared primitives in `kk/`:

| Module | Role |
| --- | --- |
| `data.js` | Single source of truth for email, Instagram URL, image URLs, services, portfolio grids |
| `Reveal.jsx` | Viewport fade-up (`framer-motion` `whileInView`) + `Chapter` heading |
| `CompareSlider.jsx` | `react-compare-slider` wrapper (hero + portfolio) |
| `Navbar.scrollToSection` | Lenis-aware in-page navigation |

`frontend/src/components/ui/*` is the unused shadcn kit (dialog, form, calendar, etc.). Product UI is custom Tailwind, not shadcn composition.

### 5.3 Backend modules (`server.py`)

Single-file service. No routers split, no auth, no admin.

| Symbol | Purpose |
| --- | --- |
| `Enquiry` | Pydantic: name, phone (min 5), location, project_type, style |
| `POST /api/enquiry` | Insert `enquiries` + send HTML notification |
| `_assert_safe_email` / `_EmailScan` | Guardrails: no forms in email, no credential-ask phrases, HTTPS-only links, no shorteners, no host-mismatch anchors |
| `send_email` | `httpx` POST to Emergent email API |
| `POST/GET /api/status` | Template health/demo collection |
| `GET /api/` | Hello World |
| CORS | `CORS_ORIGINS` (comma-separated), credentials allowed |

Startup **requires** env: `MONGO_URL`, `DB_NAME`, `EMERGENT_EMAIL_KEY`, `EMAIL_FROM_NAME`, `OWNER_EMAIL`. Optional: `EMAIL_REPLY_TO`, `CORS_ORIGINS`.

---

## 6. Runtime architecture (frontend)

### 6.1 Build and module graph

- **Bundler:** webpack via `react-scripts` 5, customized by CRACO
- **Alias:** `@` → `frontend/src`
- **Styling:** Tailwind 3 + CSS variables in `index.css` (shadcn tokens remapped to beige/charcoal)
- **Fonts:** Cormorant Garamond (serif headings), Montserrat (body) — configured in `tailwind.config.js`
- **Dev overlay:** `@emergentbase/visual-edits` applied only when `NODE_ENV !== "production"`
- **Health:** optional webpack plugin when `ENABLE_HEALTH_CHECK=true`

### 6.2 State

There is **no global store**. State is local:

- Navbar: scroll shadow, mobile drawer
- Portfolio: active tab (`accuracy` | `journey` | `highlights`)
- Contact: form fields + `idle` / `opened` + draft URL
- Instagram: `livePosts` or curated fallback
- App: Lenis instance on `window.__lenis` for cross-component scroll

TanStack Query is wired in `index.js` but unused. SWR is a leftover dependency.

### 6.3 Navigation model

Single document. Sections use `id` anchors. Navbar intercepts clicks and calls `lenis.scrollTo(href, { offset: -64 })`. This is a **marketing landing page**, not an app router.

### 6.4 Motion stack

| Concern | Library | Where |
| --- | --- | --- |
| Smooth scroll | Lenis | `App.js` |
| Enter animations | Framer Motion | `Reveal`, Hero lines, mobile nav |
| Parallax | `useScroll` / `useTransform` | Hero |
| Marquee | `react-fast-marquee` | Ribbon |
| Compare | `react-compare-slider` | Hero, Portfolio |

### 6.5 Testability

Interactive nodes carry `data-testid` (see `frontend/src/constants/testIds/` plus inline ids in `kk/`). This is designed for Emergent / Playwright-style visual agents, not a rich unit-test suite.

---

## 7. Data model

### 7.1 Static content (source of truth)

`frontend/src/components/kk/data.js` is the CMS. Changing services, images, or contact email is a code change.

Collections:

- `IMAGES` — remote URLs + `/founder.jpg`
- `SERVICES` — 4 offerings (3D, residential, turnkey, styling)
- `RAW_TO_FINAL` — 6-stage process grid (span classes included)
- `HIGHLIGHTS` — feature bento
- `EMAIL`, `INSTAGRAM_URL`

### 7.2 Mongo (only if API is used)

**`enquiries`**

```
{
  id: uuid,
  name, phone, location, project_type, style,
  created_at: ISO-8601
}
```

**`status_checks`** (template)

```
{ id, client_name, timestamp }
```

No indexes, no TTL, no PII retention policy in code.

---

## 8. Feature catalog (as implemented)

### 8.1 Visitor-facing (live)

| Feature | Behavior | Primary files |
| --- | --- | --- |
| Fixed editorial header | Brand, section links, Book a Consultation, mobile menu | `Navbar.jsx` |
| Kinetic hero | Masked line reveal, dual CTAs, parallax, 3D-vs-real slider | `Hero.jsx`, `CompareSlider.jsx` |
| Brand ribbon | Endless marquee (passion / studio lines) | `Ribbon.jsx` |
| About founder | Narrative + real portrait `/founder.jpg` | `About.jsx` |
| Four services | Numbered cards with hover image treatment | `Services.jsx`, `SERVICES` |
| Portfolio tabs | Render vs site; raw-to-final tetris grid; feature highlights | `Portfolio.jsx` |
| Philosophy | Quote banner + colour/material callouts | `Philosophy.jsx` |
| Consultation form | Name, phone, location, project type, style → `mailto:` draft | `Contact.jsx` |
| Instagram chapter | 6 tiles; Behold if env set, else fallback + profile links | `InstagramFeed.jsx` |
| Footer | Portfolio jump, Instagram, email | `Footer.jsx` |
| Design system | Beige `#F5F2EB`, charcoal `#1A1A1A`, sage `#8A9A86`, taupe `#BCAAA4` | `index.css`, Tailwind |

WhatsApp float / `wa.me` prefill were **removed** (PRD round 3). Do not treat them as current features.

### 8.2 Platform / unused but present

| Feature | Status |
| --- | --- |
| `POST /api/enquiry` + Mongo + Emergent email | Implemented, **not called** by `Contact.jsx` |
| `/api/status` | Template leftover |
| Full shadcn/Radix inventory | Installed, unused by `kk/` |
| React Router, Recharts, OTP, calendar, etc. | Dependencies only |
| Visual edits overlay | Dev-only Emergent tooling |
| Webpack health plugin | Opt-in via env |

### 8.3 Lead-capture evolution (important for engineers)

| Round | Mechanism | Why it changed |
| --- | --- | --- |
| 1 | `wa.me` prefilled message | Fast mobile conversion |
| 3 | `POST /api/enquiry` + email to owner | WhatsApp removed; persist + notify |
| 4 (current) | `mailto:` only | API+validation failures (“Something went wrong”, short phones) |

The backend still validates `phone` with `min_length=5`. Re-enabling the API without relaxing validation will regress short test numbers.

---

## 9. Key sequences

### 9.1 Consultation (current)

```
User fills form → submit
  → encode subject/body
  → setStatus("opened")
  → window.location.href = mailto:...
  → success panel + "Open Email Draft" fallback
```

No network to FastAPI. No toast/error from HTTP.

### 9.2 Consultation (dormant API)

```
Client POST /api/enquiry
  → Pydantic validate
  → db.enquiries.insert_one
  → HTML table email (escaped fields)
  → _assert_safe_email
  → Emergent /api/v1/email/send
  → { status, id, email_id }
```

Email HTML is table-based, beige branded, no user-controlled URLs (avoids G3 failures).

### 9.3 Instagram

```
If REACT_APP_BEHOLD_FEED_ID:
  GET https://feeds.behold.so/{id}
  take first 6 posts
else:
  FALLBACK_POSTS → Instagram profile
```

Failure is silent (`catch` empty); UI stays on fallback.

---

## 10. Security and operations notes

- **No authentication.** There is no admin UI. Mongo is only reachable via the API process.
- **CORS** defaults to `*` if `CORS_ORIGINS` unset — tighten before public API use.
- **Email guardrails** are defense-in-depth for the *outbound* notification, not inbound spam (there is no CAPTCHA on the unused API).
- **PII:** mailto keeps phone/name on the client; API path would store PII in Mongo with no encryption-at-rest policy in this repo.
- **Third-party images:** hotlinked Unsplash/Pexels URLs can break or change license; treat as temporary.
- **Secrets:** `backend/.env` (`MONGO_URL`, `EMERGENT_EMAIL_KEY`, `OWNER_EMAIL`) must not be committed.
- **Supply chain:** `frontend/package.json` `resolutions` pin many transitive CVEs; keep that in mind when upgrading CRA.

---

## 11. Quality attributes

| Attribute | How it is addressed | Gap |
| --- | --- | --- |
| Conversion | Single CTA path, dark contact band, prefilled draft | Relies on mail client |
| Perceived quality | Editorial type, motion, compare sliders | Stock photos still dominate portfolio |
| Performance | Lazy Instagram images; no code-splitting | Long page + many remote images; CRA bundle includes unused UI kit |
| Accessibility | Contrast tokens; `data-testid`; some `aria-label` | `prefers-reduced-motion` not implemented in `Reveal` despite design brief |
| SEO | Single HTML document | No dedicated OG/meta strategy in product code beyond CRA defaults |
| Observability | Backend logging on email failure; optional webpack health | No product analytics, no enquiry metrics on current path |
| Testability | Stable testids | `test_result.md` protocol exists; little automated coverage in-repo |

---

## 12. Repository map

```
Website_builder_kkdesigner/
├── docs/architecture.md          ← this document
├── memory/PRD.md                 ← product history and backlog
├── design_guidelines.json        ← visual / motion spec used at generation time
├── test_result.md                ← agent testing protocol (empty data block)
├── .emergent/                    ← platform metadata + cron helpers
├── backend/
│   ├── server.py                 ← entire API
│   ├── requirements.txt
│   └── pytest.ini
└── frontend/
    ├── craco.config.js           ← alias, health, visual-edits, webpack 5 compat
    ├── src/App.js                ← page composition + Lenis
    ├── src/index.js              ← QueryClient + mount
    ├── src/components/kk/        ← product
    ├── src/components/ui/        ← unused shadcn
    ├── src/constants/testIds/
    ├── plugins/health-check/
    └── public/founder.jpg
```

---

## 13. Engineering backlog (from code + PRD)

High leverage if you continue this as a product:

1. **Decide lead capture:** keep mailto (zero infra) **or** reconnect `POST /api/enquiry` with looser phone validation and a client timeout/error UI.
2. **Replace stock photography** with real project assets; stop hotlinking as the long-term store.
3. **Case-study pages or modals** — PRD P1; would introduce React Router for the first time.
4. **SEO / OG images**, Google Maps for Pune service area.
5. **Portfolio lightbox**; wire Behold (`REACT_APP_BEHOLD_FEED_ID`).
6. **Tree-shake the template** — unused Radix packages inflate install and cognitive load.
7. **Honor `prefers-reduced-motion`** in `Reveal` and Hero.
8. **PRD stale items:** WhatsApp number in backlog is obsolete; WhatsApp is gone.

---

## 14. How an engineer should think about extending it

- **Content change:** edit `data.js` and section JSX. There is no CMS.
- **New section:** add a `kk/` component, mount it in `App.js`, add a Navbar hash + `id`.
- **Reliable leads:** call `/api/enquiry` again from `Contact.jsx` (axios is already a dependency) and keep mailto as fallback.
- **Do not** start from shadcn forms unless you want the generic admin look; the brand is custom Tailwind.
- **Do not** assume the backend is the source of truth for the live site. Today the frontend *is* the product.

---

## 15. Environment reference

**Backend**

| Variable | Required | Use |
| --- | --- | --- |
| `MONGO_URL` | yes | Motor connection |
| `DB_NAME` | yes | Database name |
| `EMERGENT_EMAIL_KEY` | yes (process start) | Email API key |
| `EMAIL_FROM_NAME` | yes | Display name on notification |
| `OWNER_EMAIL` | yes | Enquiry recipient |
| `EMAIL_REPLY_TO` | no | Reply-to / contact_email |
| `CORS_ORIGINS` | no | Comma-separated origins |

**Frontend**

| Variable | Required | Use |
| --- | --- | --- |
| `REACT_APP_BEHOLD_FEED_ID` | no | Live Instagram grid |
| `ENABLE_HEALTH_CHECK` | no | Dev-server health plugin |

---

*Generated from the repository as of 2026-08-19. Product history also recorded in `memory/PRD.md`.*
