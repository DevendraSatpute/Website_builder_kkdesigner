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
- Full single-page site: kinetic masked hero, editorial marquee, About founder, 4 services, 3-tab portfolio (compare slider, raw-to-final tetris grid, feature highlights grid), philosophy quote banner + 2 callouts, dark contact section with WhatsApp form, footer, WhatsApp float
- Lenis momentum scrolling, framer-motion scroll reveals + tab transitions, hero parallax
- Verified: all sections screenshot-checked, tabs switch, form opens wa.me with correct pre-filled text, no console errors

## Known Gaps / Backlog
- P0: Replace placeholder WhatsApp number (currently 919876543210 in src/components/kk/data.js) with Akshada's real number
- P1: Replace stock images with real project photos and real founder portrait
- P1: Add real project case-study detail pages/modals
- P2: Google Maps embed, SEO meta/OG images, lead backup (email via Resend) if WhatsApp-only proves limiting
- P2: Lightbox for portfolio images, Instagram feed embed

## Credentials
No logins in this app. See /app/memory/test_credentials.md (none required).
