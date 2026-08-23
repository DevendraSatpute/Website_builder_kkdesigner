# PRD — K K Designers Portfolio Website

## Original Problem Statement
Build a clean, modern, high-converting single-page portfolio website for K K Designers, an interior design studio in Pune led by founder Akshada Kisan Thorat (Interior Designer, 3D Visualiser, Design Consultant). Core philosophy: "Passion over profession" — bridging 3D visualisation and raw on-site execution. Sections: header nav + Book a Consultation CTA, hero with 3D-render-vs-reality interactive slider, About the founder, 4 service cards, portfolio with 3 tabs (3D Render vs Real Site, Raw Stage to Final Touch, Feature Highlights), Design Philosophy with quote banner + colour psychology/material callouts, lead form "Let's Build Your Dream Space" that opens WhatsApp pre-filled, WhatsApp float button + Instagram @k_k_designers. Palette: warm beige #F5F2EB, soft taupe, muted sage/olive, charcoal #1A1A1A. Fonts: Cormorant Garamond (headings) + Montserrat (body). Awwwards-level motion: masked line-reveal hero, Lenis smooth scroll, framer-motion reveals, editorial marquee, parallax.

## User Personas
- Homeowner in Pune seeking luxury/boutique interior makeover
- Bungalow/villa owner wanting turnkey execution
- Client wanting only photorealistic 3D renders / design consultation

## Architecture
- Frontend-only React SPA (no backend dependency; template backend left untouched)
- React 19 + Tailwind + framer-motion + lenis + react-fast-marquee + react-compare-slider + lucide-react
- Components in /app/frontend/src/components/kk/: Navbar, Hero, CompareSlider, Ribbon, About, Services, Portfolio, Philosophy, Contact, Footer, WhatsAppFloat, Reveal, data.js
- Lead form builds a wa.me URL with pre-filled message (no DB), per user choice
- Images: curated Pexels/Unsplash stock (replaceable with real project photos later)

## Core Requirements (static)
- Single long scrolling page, asymmetrical editorial layout
- Interactive before/after compare slider in hero and portfolio
- WhatsApp-prefill consultation form + floating WhatsApp button
- data-testid on all interactive elements

## Implemented (2026-07)
- Full single-page site: kinetic masked hero, editorial marquee, About founder, 4 services, 3-tab portfolio (compare slider, raw-to-final tetris grid, feature highlights grid), philosophy quote banner + 2 callouts, dark contact section with WhatsApp form, Instagram section, footer, WhatsApp float
- Lenis momentum scrolling, framer-motion scroll reveals + tab transitions, hero parallax
- Verified: all sections screenshot-checked, tabs switch, form opens wa.me with correct pre-filled text, no console errors

## Updates (2026-07, round 2)
- WhatsApp number updated to real number: +91 90282 02970 (919028202970) — form, float button, footer links all use it
- Founder portrait replaced with Akshada's real photo (uploaded asset, used as-is)
- Instagram URL updated to https://www.instagram.com/k_k_designers/?hl=en
- New "Fresh from the studio" Instagram section (chapter 06, above footer): auto-fetching grid via Behold JSON feed when REACT_APP_BEHOLD_FEED_ID is set in frontend/.env; until then shows curated fallback tiles linking to the profile. Requires user to create a free Behold account (behold.so), connect @k_k_designers, and share the feed ID.

## Updates (2026-07, round 3)
- WhatsApp fully removed (float button deleted, footer link replaced) per user request
- Lead capture switched to EMAIL: POST /api/enquiry (FastAPI) stores enquiry in MongoDB `enquiries` and sends notification email to kkdesigners15@gmail.com via Emergent managed Resend (EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME="K K Designers", EMAIL_REPLY_TO set). Server-side template + guardrail gate per Resend playbook.
- Founder photo replaced with second uploaded photo, cropped to a 4:5 close-up portrait saved at /app/frontend/public/founder.jpg (referenced as /founder.jpg)
- Name changed site-wide: "Akshada Kisan Thorat" → "Akshada Thorat"
- Contact form now posts to backend with success/error states (no WhatsApp prefill)
- Verified: curl POST /api/enquiry returns success + email_id; form submits end-to-end with success UI

## Updates (2026-07, round 4 — bug fix)
- Bug reported: "Something went wrong" on Send Enquiry (caused by backend email dependency + strict phone min-length validation, e.g. phone "737")
- Fix per user request: form now uses pure mailto: — clicking Send Enquiry opens the visitor's own email app (mobile app or browser mail client) with a pre-filled draft to kkdesigners15@gmail.com
- Draft format: Subject "New enquiry — {name} ({project_type})"; Body "Hi Akshada, I'm {name} from {location}. I'm planning a {project_type} project and I like the "{style}" style. I'd like to book a consultation. You can reach me on {phone}."
- Fallback "Open Email Draft" button (data-testid open-draft-link) shown after submit in case the mail app didn't open
- Backend /api/enquiry endpoint still exists but is no longer called by the form
- Verified in browser with the exact failing inputs (Shruti / 737 / Pune): mailto URL generated correctly, draft panel shown

## Updates (2026-07, round 5)
- Enquiry Backup: form now silently POSTs a copy of every enquiry to POST /api/enquiry (store-only, no email send) before opening the mailto draft; phone validation relaxed to min 3 chars
- Enquiry Dashboard: new private page at /admin — passcode gate (server-checked X-Admin-Key header on GET /api/enquiries, key in backend/.env as ADMIN_DASH_KEY="kkd-s7-admin-2026-9xq4", stored in sessionStorage). Shows enquiry cards (name, phone with tel: link, location, project type, style, date), count, refresh, logout
- App.js now uses react-router: "/" main site, "/admin" dashboard
- Developer credit in footer: "Developed by Shruti Khedkar — Connect on LinkedIn" → https://in.linkedin.com/in/shruti-khedkar-34357b158
- frontend/.env: REACT_APP_BEHOLD_FEED_ID= slot added (empty — awaiting user's Behold feed ID for live Instagram posts; user must create the Behold account themselves as it requires their Instagram login)
- Verified: 401 without key / list with key via curl; form submit silently saved enquiry ("Backup Test"); /admin wrong passcode rejected, correct passcode shows dashboard; footer LinkedIn href correct

## Updates (2026-07, round 6 — real project photos)
- Commercial Offices: new 4th portfolio tab with 3 real photos (conference suite, director's office, visitor lounge) saved in frontend/public as commercial-*.jpeg; "Commercial Office" added to contact form project types
- Living area: real photo /living-area.jpeg → Feature Highlights "Custom TV Media Unit & Mural Wall" + Instagram fallback tile
- Kitchen & Dining: real photo /kitchen-dining.jpeg → Feature Highlights card (replaces stock "Ambient Strip Lighting") + Instagram tile
- Daughter's room: /daughter-room.jpeg → Feature Highlights "Daughter's Room — Arched Wardrobe Wall" (replaces stock "Accent Wall Mural")
- Master bedroom: /master-bed.jpeg → Highlights "Master Bedroom — Halo Ceiling & Lounge Corner" (replaces stock bedroomArch); /master-tv.jpeg → Journey tab Stage 05 "Cove Lighting & TV Wall"; /master-wardrobe.jpeg → Instagram tile
- Verified via screenshots: commercial tab, highlights grid, journey grid all render real photos

## Known Gaps / Backlog
- P0: Replace placeholder WhatsApp number (currently 919876543210 in src/components/kk/data.js) with Akshada's real number
- P1: Replace stock images with real project photos and real founder portrait
- P1: Add real project case-study detail pages/modals
- P2: Google Maps embed, SEO meta/OG images, lead backup (email via Resend) if WhatsApp-only proves limiting
- P2: Lightbox for portfolio images, Instagram feed embed

## Credentials
No logins in this app. See /app/memory/test_credentials.md (none required).
