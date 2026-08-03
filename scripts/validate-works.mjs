import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import matter from "gray-matter";
import { z } from "zod";

const localizedTextSchema = z.object({
  zh: z.string().trim().min(1),
  en: z.string().trim().min(1)
});

const workSchema = z.object({
  id: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  year: z.number().int().min(1990).max(2100),
  tags: z.array(z.string().trim().min(1)).min(1),
  cover: z.string().trim().min(1),
  gallery: z.array(z.string().trim().min(1)).default([]),
  title: localizedTextSchema,
  summary: localizedTextSchema,
  featured: z.boolean().optional(),
  links: z
    .array(
      z.object({
        label: localizedTextSchema,
        url: z.string().trim().url()
      })
    )
    .optional()
});

const worksDir = path.join(process.cwd(), "content", "works");
const files = (await fs.readdir(worksDir)).filter((file) => file.endsWith(".mdx"));

if (files.length === 0) {
  throw new Error("No MDX files found in content/works.");
}

const ids = new Set();
const slugs = new Set();
const imageExtension = "(?:avif|jpe?g|png|webp)";

const assertImageExists = async (imagePath, fileName) => {
  const relativePath = imagePath.replace(/^\/+/, "");
  const fullPath = path.join(process.cwd(), "public", relativePath);

  try {
    await fs.access(fullPath);
  } catch {
    throw new Error(`Missing image in ${fileName}: ${imagePath}`);
  }
};

for (const fileName of files) {
  const fullPath = path.join(worksDir, fileName);
  const raw = await fs.readFile(fullPath, "utf8");
  const { data } = matter(raw);
  const parsed = workSchema.safeParse(data);

  if (!parsed.success) {
    const message = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join("; ");
    throw new Error(`Invalid file ${fileName}: ${message}`);
  }

  if (ids.has(parsed.data.id)) {
    throw new Error(`Duplicate id detected: ${parsed.data.id}`);
  }
  if (slugs.has(parsed.data.slug)) {
    throw new Error(`Duplicate slug detected: ${parsed.data.slug}`);
  }

  const escapedSlug = parsed.data.slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const coverPattern = new RegExp(`^/images/works/${escapedSlug}-cover\\.${imageExtension}$`);
  if (!coverPattern.test(parsed.data.cover)) {
    throw new Error(`Invalid cover name in ${fileName}: expected /images/works/${parsed.data.slug}-cover.{ext}`);
  }

  await assertImageExists(parsed.data.cover, fileName);

  const galleryPattern = new RegExp(`^/images/works/${escapedSlug}-gallery-\\d{2}\\.${imageExtension}$`);
  for (const galleryImage of parsed.data.gallery) {
    if (!galleryPattern.test(galleryImage)) {
      throw new Error(
        `Invalid gallery image name in ${fileName}: expected /images/works/${parsed.data.slug}-gallery-{nn}.{ext}`
      );
    }
    await assertImageExists(galleryImage, fileName);
  }

  ids.add(parsed.data.id);
  slugs.add(parsed.data.slug);
}

process.stdout.write(`Validated ${files.length} work entries.\n`);
