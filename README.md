# Faiz Wahbeh — Bilingual Landing Page

Static, frontend-only landing page for Faiz Wahbeh (fire bricks, clay tiles and architectural bricks, since 1970).
Built with React, TypeScript, Vite, Tailwind CSS, GSAP + ScrollTrigger, Lenis, SplitType and i18next (English / Arabic with full RTL).

## Commands

```bash
npm install
npm run dev        # local development
npm run build      # type-check + production build (dist/)
npm run preview    # serve the production build
```

## Structure

```
src/
  animations/   GSAP registration, reusable presets (fadeUp, slideStart, imageReveal, textReveal, parallax…), SplitType helper
  hooks/        useReveal (declarative data-attribute animations), useLenis, usePointerDrift, useActiveSection…
  components/   layout (Header, MobileMenu, Footer, Cursor, ScrollProgress), ui (Button, AnimatedImage, LogoMark…), items
  sections/     One file per page section, plus the logo Preloader
  data/         Typed content lists (products, services, applications, contacts, locations…)
  locales/      en.json / ar.json — every visible string lives here
  assets/       brand SVGs and source photography (optimised at build time)
```

## Content and language

- All copy is in `src/locales/en.json` and `src/locales/ar.json`. Repeated items (products, services…) are typed in `src/data/`.
- The language is detected from `?lang=ar|en`, then the saved choice, then the browser. Switching sets `lang`/`dir` on `<html>`
  and rebuilds animations for the new reading direction.

## Animation system

Sections opt into scroll animations with data attributes handled by `useReveal`:

| Attribute | Effect |
| --- | --- |
| `data-reveal="fade-up \| fade-in \| slide-start \| slide-end \| scale"` | Entrance tween (`data-delay` optional) |
| `data-split` | Masked word reveal for headings (Arabic always animates by word) |
| `data-stagger` | Children fade up in sequence (`data-stagger="0.18"` sets the gap) |
| `data-parallax="8"` | Scrubbed drift, desktop only |
| `data-line` | Scrubbed line draw from the reading-start side |

Everything is wrapped in `gsap.matchMedia()`: with `prefers-reduced-motion: reduce` the preloader, smooth scrolling and
all entrance/parallax motion are skipped and content is shown immediately.

## Images

Photos in `src/assets/images/**` are imported with `?responsive`, which vite-imagetools turns into AVIF + WebP sources at
480/800/1200/1440 px. `<Picture>` renders them with `sizes`, lazy loading below the fold, and high fetch priority for the hero.
To add an image, drop the PNG/JPG into the right folder and reference it from `src/data/images.ts`.

## Contact form

There is no backend. The form validates in the browser and then opens the visitor's email app (`mailto:sales@fwbrick.com`)
or WhatsApp with the request pre-filled — nothing is stored or sent by the site itself. A form service or API can be wired
into `src/components/ContactForm.tsx` later.

## Before going live

- Replace the placeholder origin `https://fwbrick.com` in `src/components/Seo.tsx`, `index.html` (JSON-LD) and `public/` files if the domain differs.
- Leadership portraits are intentionally omitted (monograms are shown) until real, approved photos are supplied.
- Social links are not shown because no verified profiles were provided.
