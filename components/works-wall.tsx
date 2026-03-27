"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import type { Locale, WorkEntry } from "@/lib/types";

type WorksWallLabels = {
  title: string;
  subtitle: string;
  filters: string;
  tag: string;
  year: string;
  all: string;
  loadMore: string;
  empty: string;
  open: string;
};

type WorksWallProps = {
  locale: Locale;
  works: WorkEntry[];
  labels: WorksWallLabels;
};

const baseVisibleCount = 6;
const loadMoreStep = 3;

export const WorksWall = ({ locale, works, labels }: WorksWallProps) => {
  const [activeTag, setActiveTag] = useState("all");
  const [activeYear, setActiveYear] = useState("all");
  const [visibleCount, setVisibleCount] = useState(baseVisibleCount);

  const tags = useMemo(() => {
    return Array.from(new Set(works.flatMap((work) => work.tags))).sort();
  }, [works]);

  const years = useMemo(() => {
    return Array.from(new Set(works.map((work) => String(work.year)))).sort((a, b) => Number(b) - Number(a));
  }, [works]);

  const filteredWorks = useMemo(() => {
    return works.filter((work) => {
      const passTag = activeTag === "all" || work.tags.includes(activeTag);
      const passYear = activeYear === "all" || String(work.year) === activeYear;
      return passTag && passYear;
    });
  }, [activeTag, activeYear, works]);

  const visibleWorks = filteredWorks.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredWorks.length;

  const handleTagChange = (nextTag: string) => {
    setActiveTag(nextTag);
    setVisibleCount(baseVisibleCount);
  };

  const handleYearChange = (nextYear: string) => {
    setActiveYear(nextYear);
    setVisibleCount(baseVisibleCount);
  };

  return (
    <section id="works" className="mt-24 space-y-8">
      <header className="space-y-2">
        <h2 className="poster-heading text-4xl leading-none text-redline md:text-6xl">{labels.title}</h2>
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-industrial/70">{labels.subtitle}</p>
      </header>

      <div className="space-y-3 border border-industrial/25 bg-paper/70 p-4 md:p-6">
        <p className="font-mono text-xs uppercase tracking-[0.22em] text-industrial">{labels.filters}</p>
        <div className="grid gap-3 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-industrial/80">
            {labels.tag}
            <select
              className="border border-industrial/40 bg-paper px-3 py-2 text-sm uppercase tracking-[0.12em] text-industrial"
              value={activeTag}
              onChange={(event) => handleTagChange(event.target.value)}
            >
              <option value="all">{labels.all}</option>
              {tags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.18em] text-industrial/80">
            {labels.year}
            <select
              className="border border-industrial/40 bg-paper px-3 py-2 text-sm uppercase tracking-[0.12em] text-industrial"
              value={activeYear}
              onChange={(event) => handleYearChange(event.target.value)}
            >
              <option value="all">{labels.all}</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {visibleWorks.length === 0 ? (
        <div className="border border-dashed border-industrial/40 p-6 font-mono text-sm text-industrial/70">
          {labels.empty}
        </div>
      ) : (
        <div className="works-grid">
          {visibleWorks.map((work, index) => (
            <article
              key={work.id}
              className={clsx(
                "work-card hard-cut",
                index % 5 === 0 ? "md:row-span-2" : "",
                index % 4 === 0 ? "md:-translate-y-2" : ""
              )}
            >
              <div className="relative aspect-[4/5] overflow-hidden border border-industrial/35 bg-industrial">
                <Image
                  src={work.cover}
                  alt={work.title[locale]}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="work-card-image hard-cut object-cover"
                />
                <div className="glitch-overlay" aria-hidden>
                  <span className="glitch-strip glitch-strip-a" />
                  <span className="glitch-strip glitch-strip-b" />
                  <span className="glitch-strip glitch-strip-c" />
                </div>
                <div className="tear-edge" aria-hidden />
              </div>

              <div className="space-y-3 border-x border-b border-industrial/35 bg-paper/95 p-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="poster-heading text-xl leading-none text-industrial">{work.title[locale]}</h3>
                  <span className="font-mono text-xs uppercase tracking-[0.16em] text-industrial/70">
                    {work.year}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-industrial/85">{work.summary[locale]}</p>
                <div className="flex flex-wrap gap-2">
                  {work.tags.map((tag) => (
                    <span
                      key={`${work.id}-${tag}`}
                      className="border border-industrial/30 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-industrial/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {work.links[0] ? (
                  <a
                    href={work.links[0].url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center border border-redline/70 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-redline hard-cut hover:bg-redline hover:text-paper"
                  >
                    {labels.open}
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}

      {canLoadMore ? (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + loadMoreStep)}
          className="inline-flex border border-industrial bg-industrial px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-paper hard-cut hover:bg-redline hover:border-redline"
        >
          {labels.loadMore}
        </button>
      ) : null}
    </section>
  );
};
