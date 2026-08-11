# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-page static marketing site for "Rustic Revival" (interior design & custom artwork studio, Ahmedabad, India). There is no build system, package manager, or framework — it is plain HTML/CSS/JS served directly.

## Running the site

There is no build/lint/test tooling in this repo. To preview changes, just open `index.html` in a browser, or serve the folder with any static file server, e.g.:

```
npx serve .
```

or Python's built-in server:

```
python -m http.server 8000
```

Any changes to `index.html`, `css/style.css`, or `js/script.js` are visible on a page refresh — no compilation step.

## Architecture

Three files drive the entire site:

- **`index.html`** — All page markup, in one file, organized into clearly delimited sections via HTML comments (`<!-- =================== HERO =================== -->`, etc.): Nav, Hero, About, Services, Gallery, Custom Artwork, Projects, Why Us, Testimonials, Process, CTA, Footer. Section anchors (`#about`, `#services`, `#gallery`, `#projects`, `#process`, `#contact`) are used for in-page nav and smooth-scroll links.
- **`css/style.css`** — Single stylesheet, organized in the same section order as the HTML, each preceded by a `/* ── Section Name ── */` comment banner. All design tokens (colors, fonts, spacing, shadows, easing curves) are defined as CSS custom properties in `:root` at the top of the file — always reuse these variables rather than hardcoding new values.
- **`js/script.js`** — Single script, `'use strict'`, organized as ~20 numbered, independent `init*()` functions (each documented with a numbered comment banner, e.g. `5. NAVIGATION`, `10. ARTWORK GALLERY`), all invoked from one `DOMContentLoaded` listener at the bottom of the file. When adding new behavior, follow this pattern: write a new `initX()` function and register it in the init block at the bottom rather than adding inline/ad-hoc listeners elsewhere.

### External dependencies (all via CDN `<script>`/`<link>` tags in `index.html` — no npm/bundler)

- **GSAP** (+ ScrollTrigger, SplitText) — scroll-triggered reveal animations, hero entrance timeline, parallax.
- **Swiper** — testimonials carousel.
- **Vanilla-Tilt** — 3D tilt-on-hover for gallery items, service cards, and project images.
- **Lenis** — smooth-scroll, wired into GSAP's ticker/ScrollTrigger in `initLenis()`; most other code checks `if (lenis)` before calling into it, since it must be initialized first.
- Google Fonts: `Cormorant Garamond` (display/serif, headings) and `Manrope` (body/sans).

### The artwork gallery is data-driven, not hand-authored HTML

`js/script.js` defines three parallel arrays — `ARTWORK_COUNT`, `ARTWORK_CATEGORIES`, `ARTWORK_TITLES`, `ARTWORK_DESCS` — indexed by position (index `i` corresponds to `assets/artworks/{i+1}.jpeg`). `initGallery()` generates the masonry grid and lightbox content from these arrays at runtime; there is no per-image markup in `index.html`. To add/remove/re-categorize an artwork:

1. Add/remove the numbered image file in `assets/artworks/` (sequential `N.jpeg`, 1-indexed).
2. Update `ARTWORK_COUNT` and add/remove matching entries (same index position) in `ARTWORK_CATEGORIES`, `ARTWORK_TITLES`, and `ARTWORK_DESCS`.
3. Categories currently in use for gallery filtering: `abstract`, `texture`, `portrait`, `nature` — these must match the `data-filter` values on the `.filter-btn` elements in `index.html`.

Gallery filtering (`initGalleryFilters()`) and the lightbox prev/next navigation (`prevArtwork()`/`nextArtwork()`) both operate on visible/filtered items, not the full array, so filtered state and lightbox state stay in sync.

### Contact / conversion touchpoints

WhatsApp deep links (`https://wa.me/91...`) appear in multiple places (hero CTA, gallery lightbox, custom-art commission CTA, main CTA section, floating WA button, footer) with different pre-filled `text=` query params per context. When updating the phone number or messaging, all instances need updating together — do a project-wide search rather than editing one and assuming the rest follow.

### Placeholder/graceful-degradation patterns

- `.about-img-placeholder` and `.project-placeholder` use inline SVG/CSS gradients standing in for real photography — replace with real `<img>`s when photos are available, matching the existing `aspect-ratio` and `border-radius` treatment.
- `initPlaceholders()` in `script.js` attaches an `error` handler to gallery `<img>` tags so a missing artwork file degrades to a colored gradient block instead of a broken image icon.
