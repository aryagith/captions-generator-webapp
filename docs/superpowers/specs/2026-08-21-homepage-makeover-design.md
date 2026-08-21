# Captioner Homepage Makeover — Design Spec

**Date:** 2026-08-21  
**Scope (phase 1):** Homepage + shared shell (layout, theme, visual system)  
**Out of scope for phase 1:** Pricing page polish, editor (`/[filename]`) redesign (follow-up)

## Goals

- Heavy glass UI on a soft grainy rainbow background with organic Chroma-style shapes
- Light mode (off-white + vivid blobs) and dark mode (near-black + deeper blobs)
- Theme: system preference default + header toggle with localStorage override
- Responsive: mobile stacks cleanly; desktop demos centered with no orphan empty space
- Asymmetric background shapes (not mirrored left/right)
- Film-title typography for the brand wordmark on the home hero
- Variable grain: denser at soft blob edges, smoother in the core

## Visual system

### Palette

- Rainbow accents: blue `#3b82f6` / `#2563eb`, green `#22c55e` / `#16a34a`, yellow `#eab308` / `#ca8a04`, red `#ef4444` / `#dc2626`
- Light surface: `#f0eee9` (warm off-white)
- Dark surface: `#0a0a0a`
- Cream text/UI on dark: `#f5f0e6`
- Ink text/UI on light: `#0a0a0a` / `#111`

### Typography

- Display (hero brand): high-contrast serif (Bodoni Moda or equivalent) — wide tracking, uppercase, cinematic intro motion
- Kicker: italic serif (Cormorant Garamond)
- UI / body: DM Sans (or similar clean sans — not Inter/Roboto as primary)

### Glass

- Frosted nav pill, demo cards, optional soft panels
- `backdrop-filter: blur` + translucent fills + thin borders
- White/cream pill CTA for upload on both themes (invert ink on light)

### Background

- Layered organic blobs (irregular `border-radius`, uneven placement)
- Variable grain via SVG noise: stronger on rim layers, lighter on page + core
- **Asymmetric:** blobs offset differently left/right/top/bottom — no mirrored composition

### Motion

1. Film title letter-spacing / fade intro
2. Soft kicker float
3. Subtle glass hover on primary CTA

## Homepage structure

1. Glass pill nav: brand | Home / Pricing / Contact | theme toggle  
2. Hero: italic kicker → film-title “Captioner” → short support line → Choose file CTA  
3. Before / After demo videos in frosted cards, tightly centered (`fit-content` row); mobile: two-column or stacked  
4. Keep existing upload + demo video URLs/behavior

## Theme behavior

- Default: `prefers-color-scheme`
- Manual toggle stores `captioner-theme` = `light` | `dark` | `system` (or equivalent)
- Apply `class="dark"` (or `data-theme`) on `<html>` early to avoid flash

## Implementation notes

- Next.js 14 App Router, Tailwind already present — extend tokens in `globals.css` + `tailwind.config.js`
- Client component for theme toggle + optional theme provider
- Preserve upload API / routing; visual-only changes for phase 1
- Iterate colors/shapes after first homepage review

## Success criteria

- Homepage matches locked mockup direction (Chroma blob + film title + glass demos)
- Light and dark both usable; toggle works with system default
- Looks balanced on desktop and mobile; no large empty gap beside demos
- Existing upload flow still works
