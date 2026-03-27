import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { z } from "zod";
import type { WorkEntry } from "@/lib/types";

const localizedTextSchema = z.object({
  zh: z.string().trim().min(1),
  en: z.string().trim().min(1)
});

const workLinkSchema = z.object({
  label: localizedTextSchema,
  url: z.string().trim().url()
});

const workFrontmatterSchema = z.object({
  id: z.string().trim().min(1),
  slug: z.string().trim().min(1),
  year: z.number().int().min(1990).max(2100),
  tags: z.array(z.string().trim().min(1)).min(1),
  cover: z.string().trim().min(1),
  gallery: z.array(z.string().trim().min(1)).default([]),
  title: localizedTextSchema,
  summary: localizedTextSchema,
  featured: z.boolean().default(false),
  links: z.array(workLinkSchema).default([])
});

const worksDir = path.join(process.cwd(), "content", "works");

const parseWorkFile = async (fileName: string): Promise<WorkEntry> => {
  const fullPath = path.join(worksDir, fileName);
  const raw = await fs.readFile(fullPath, "utf8");
  const { data, content } = matter(raw);

  const parsed = workFrontmatterSchema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => issue.message).join("; ");
    throw new Error(`Invalid frontmatter in ${fileName}: ${issues}`);
  }

  return {
    ...parsed.data,
    tags: parsed.data.tags.map((tag) => tag.toLowerCase()),
    body: content.trim()
  };
};

const ensureUnique = (works: WorkEntry[]) => {
  const ids = new Set<string>();
  const slugs = new Set<string>();

  for (const work of works) {
    if (ids.has(work.id)) {
      throw new Error(`Duplicate work id detected: ${work.id}`);
    }
    if (slugs.has(work.slug)) {
      throw new Error(`Duplicate work slug detected: ${work.slug}`);
    }
    ids.add(work.id);
    slugs.add(work.slug);
  }
};

export const getAllWorks = cache(async (): Promise<WorkEntry[]> => {
  const files = await fs.readdir(worksDir);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  const works = await Promise.all(mdxFiles.map((file) => parseWorkFile(file)));
  ensureUnique(works);

  return works.sort((a, b) => {
    if (a.featured === b.featured) {
      return b.year - a.year;
    }
    return a.featured ? -1 : 1;
  });
});
