# Stray Bee - Ordered Chaos Portfolio

Bilingual personal portfolio (`/zh`, `/en`) built with Next.js App Router + Tailwind CSS.

## Tech

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Local MDX content (`content/works/*.mdx`) with schema validation

## Font stack (Swiss-style web usage)

```css
"Neue Haas Grotesk", "Helvetica Neue", "Univers", "Akzidenz-Grotesk", "IBM Plex Sans", "Helvetica", "Arial", sans-serif;
```

Secondary mono:

```css
"Space Mono", monospace;
```

## Run

```bash
npm install
npm run dev
```

## Validate content schema

```bash
npm run validate:works
```

## Work image naming

Use lowercase kebab-case filenames based on the work slug:

- Cover: `{work-slug}-cover.{ext}`
- Gallery: `{work-slug}-gallery-{nn}.{ext}`

Examples: `signal-atlas-cover.png`, `signal-atlas-gallery-01.webp`.
