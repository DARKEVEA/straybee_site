### Stray Bee v1 Plan: Ordered Chaos Portfolio (Swiss-Style Font Set Added)

**Summary**
- Build a bilingual (`/zh`, `/en`) one-page portfolio using Next.js App Router + Tailwind.
- Visual language: Swiss grid rigor + Dada collage disruption + Constructivist diagonals.
- Emphasize a dense “creation wall” so more works are visible immediately.

**Implementation Changes**
1. App foundation: Next.js + Tailwind + TypeScript; locale routes `/zh` and `/en`; `/` redirects to `/zh`.
2. Design tokens: `industrial black`, `paper white`, `constructivist red`, `warning yellow`; hard-cut timing (no smooth easing).
3. One-page sections per locale: Hero Manifesto, Works Wall (primary), Method/About, Contact.
4. Works system: local MDX content (`/content/works/*.mdx`) with bilingual fields; filter by tags/year; load-more for larger creation volume.
5. Visual effects: monochrome default media, hover color/glitch reveal, diagonal red line, torn-paper overlays, desktop crosshair cursor, reduced-motion fallback.
6. Performance/accessibility: `next/image`, lazy loading, responsive media, touch-safe interaction fallbacks.

**Swiss-Style Web Fonts (List + Usage)**
1. `Neue Haas Grotesk` (primary Swiss grotesk; hero/nav/body if licensed).
2. `Helvetica Neue` (classic Swiss fallback where licensing/environment allows).
3. `Univers` (alternative Swiss sans for headings/navigation contrast).
4. `Akzidenz-Grotesk` (poster/accent type for strong editorial moments).
5. `IBM Plex Sans` (open-source production fallback aligned with Swiss neutrality).
6. `Space Mono` (secondary text/metadata to keep the Dada typewriter contrast).
7. CSS system stack to implement: `"Neue Haas Grotesk", "Helvetica Neue", "Helvetica", "Arial", sans-serif`.

**Public Interfaces / Types**
- URL interface: `/zh`, `/en`.
- `WorkEntry` MDX schema: `id`, `slug`, `year`, `tags[]`, `cover`, `gallery[]`, `title.zh`, `title.en`, `summary.zh`, `summary.en`, `featured`, `links`.
- Locale-aware components consume `{ zh: string; en: string }` content objects.

**Test Plan**
1. Validate MDX frontmatter schema and required bilingual fields.
2. Confirm rendering parity across `/zh` and `/en`.
3. Verify effects on pointer devices and safe degradation on touch + `prefers-reduced-motion`.
4. Check responsive layout quality on mobile/tablet/desktop.
5. Run lint, type-check, and Lighthouse performance/accessibility checks.

**Assumptions and Defaults**
- v1 stays one-page only; schema remains ready for future detail pages.
- Content source is local MDX (no CMS in v1).
- Motion level is balanced experimental, prioritizing readability/performance.
