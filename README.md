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

## Optimize images before deploy

Preview expected savings without writing files:

```bash
npm run images:dry-run
```

Generate `.webp` images and update references in content/app files:

```bash
npm run images:optimize
```

Optional flags (manual):

```bash
node scripts/optimize-images.mjs --quality=72 --max-width=1800 --update-content --delete-original
```
