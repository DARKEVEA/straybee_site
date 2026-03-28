"use client";

import { useEffect, useMemo, useState } from "react";
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

type RandomBar = {
  top: number;
  left: number;
  width: number;
  height: number;
  angle: number;
  color: string;
  opacity: number;
};

type WorksWallUiText = {
  previous: string;
  next: string;
  page: string;
  details: string;
  close: string;
};

const pageSize = 6;
const fallbackPalette = ["rgb(229 49 34)", "rgb(243 201 50)", "rgb(20 214 255)", "rgb(253 88 152)"];

const getSaturation = (r: number, g: number, b: number): number => {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const lightness = (max + min) / 2;

  if (max === min) {
    return 0;
  }

  const delta = max - min;
  return lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
};

const extractPaletteFromImage = async (src: string): Promise<string[]> => {
  if (typeof window === "undefined") {
    return fallbackPalette;
  }

  return new Promise((resolve) => {
    const image = new window.Image();
    image.decoding = "async";
    image.src = src;

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const sampleSize = 48;
        canvas.width = sampleSize;
        canvas.height = sampleSize;

        const context = canvas.getContext("2d");
        if (!context) {
          resolve(fallbackPalette);
          return;
        }

        context.drawImage(image, 0, 0, sampleSize, sampleSize);
        const { data } = context.getImageData(0, 0, sampleSize, sampleSize);
        const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];
          const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;

          if (alpha < 150 || luminance < 16 || luminance > 245) {
            continue;
          }

          const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
          const existing = buckets.get(key);

          if (existing) {
            existing.count += 1;
            existing.r += r;
            existing.g += g;
            existing.b += b;
          } else {
            buckets.set(key, { count: 1, r, g, b });
          }
        }

        const candidates = Array.from(buckets.values()).map((bucket) => {
          const rr = Math.round(bucket.r / bucket.count);
          const gg = Math.round(bucket.g / bucket.count);
          const bb = Math.round(bucket.b / bucket.count);
          const saturation = getSaturation(rr, gg, bb);
          const score = bucket.count * (0.45 + saturation * 2.2);
          return {
            color: `rgb(${rr} ${gg} ${bb})`,
            saturation,
            score
          };
        });

        const ranked = candidates.sort((a, b) => b.score - a.score);
        const vivid = ranked.filter((entry) => entry.saturation >= 0.18).map((entry) => entry.color);
        const neutral = ranked.filter((entry) => entry.saturation < 0.18).map((entry) => entry.color);

        const merged = Array.from(new Set([...vivid.slice(0, 4), ...neutral.slice(0, 2)]));
        if (vivid.length < 2) {
          const boosted = Array.from(new Set([...fallbackPalette, ...merged]));
          resolve(boosted.slice(0, 6));
          return;
        }

        resolve([...merged, ...fallbackPalette].slice(0, 6));
      } catch {
        resolve(fallbackPalette);
      }
    };

    image.onerror = () => {
      resolve(fallbackPalette);
    };
  });
};

const createRandomBars = (palette: string[]): RandomBar[] => {
  const count = Math.floor(Math.random() * 3) + 2;
  const accentPool = palette.slice(0, Math.min(4, palette.length));

  return Array.from({ length: count }).map(() => {
    const isLine = Math.random() < 0.4;
    return {
      top: Math.random() * 84 + 8,
      left: Math.random() * 84 + 8,
      width: isLine ? Math.random() * 3 + 0.8 : Math.random() * 38 + 18,
      height: isLine ? Math.random() * 44 + 26 : Math.random() * 10 + 4,
      angle: Math.random() * 34 - 17,
      color: accentPool[Math.floor(Math.random() * accentPool.length)] ?? fallbackPalette[0],
      opacity: Math.random() * 0.33 + 0.52
    };
  });
};

type WorkCardProps = {
  locale: Locale;
  work: WorkEntry;
  openLabel: string;
  detailsLabel: string;
  onOpen: (work: WorkEntry) => void;
};

const WorkCard = ({ locale, work, openLabel, detailsLabel, onOpen }: WorkCardProps) => {
  const [isActive, setIsActive] = useState(false);
  const [palette, setPalette] = useState<string[]>(fallbackPalette);
  const [bars, setBars] = useState<RandomBar[]>([]);

  useEffect(() => {
    let mounted = true;

    extractPaletteFromImage(work.cover).then((nextPalette) => {
      if (mounted) {
        setPalette(nextPalette);
      }
    });

    return () => {
      mounted = false;
    };
  }, [work.cover]);

  const activate = () => {
    setIsActive(true);
    setBars(createRandomBars(palette));
  };

  const deactivate = () => {
    setIsActive(false);
  };

  const openDetails = () => {
    onOpen(work);
  };

  return (
    <article
      className={clsx("work-card hard-cut", isActive && "work-card-active")}
      onPointerEnter={activate}
      onPointerLeave={deactivate}
    >
      <div
        className="relative aspect-[4/5] cursor-pointer overflow-hidden border border-industrial/35 bg-industrial"
        onClick={openDetails}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openDetails();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <Image
          src={work.cover}
          alt={work.title[locale]}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="work-card-image hard-cut object-cover"
        />
        <div className="random-overlay" aria-hidden>
          {bars.map((bar, index) => (
            <span
              key={`${work.id}-bar-${index}`}
              className="random-bar hard-cut"
              style={{
                top: `${bar.top}%`,
                left: `${bar.left}%`,
                width: `${bar.width}%`,
                height: `${bar.height}%`,
                transform: `translate(-50%, -50%) rotate(${bar.angle}deg)`,
                backgroundColor: bar.color,
                opacity: bar.opacity
              }}
            />
          ))}
        </div>
      </div>

      <div className="space-y-3 border-x border-b border-industrial/35 bg-paper/95 p-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="poster-heading text-xl leading-none text-industrial">{work.title[locale]}</h3>
          <span className="font-mono text-xs uppercase tracking-[0.16em] text-industrial/70">{work.year}</span>
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
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={openDetails}
            className="inline-flex items-center border border-industrial/60 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-industrial hard-cut hover:bg-industrial hover:text-paper"
          >
            {detailsLabel}
          </button>
          {work.links[0] ? (
            <a
              href={work.links[0].url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center border border-redline/70 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-redline hard-cut hover:bg-redline hover:text-paper"
            >
              {openLabel}
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
};

export const WorksWall = ({ locale, works, labels }: WorksWallProps) => {
  const [activeTag, setActiveTag] = useState("all");
  const [activeYear, setActiveYear] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedWork, setSelectedWork] = useState<WorkEntry | null>(null);

  const uiText: WorksWallUiText =
    locale === "zh"
      ? {
          previous: "上一页",
          next: "下一页",
          page: "页",
          details: "查看详情",
          close: "关闭"
        }
      : {
          previous: "Previous",
          next: "Next",
          page: "Page",
          details: "Details",
          close: "Close"
        };

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

  const totalPages = Math.max(1, Math.ceil(filteredWorks.length / pageSize));
  const start = (currentPage - 1) * pageSize;
  const visibleWorks = filteredWorks.slice(start, start + pageSize);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handleTagChange = (nextTag: string) => {
    setActiveTag(nextTag);
    setCurrentPage(1);
  };

  const handleYearChange = (nextYear: string) => {
    setActiveYear(nextYear);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!selectedWork) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedWork(null);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedWork]);

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
          {visibleWorks.map((work) => (
            <WorkCard
              key={work.id}
              locale={locale}
              work={work}
              openLabel={labels.open}
              detailsLabel={uiText.details}
              onOpen={setSelectedWork}
            />
          ))}
        </div>
      )}

      {totalPages > 1 ? (
        <nav aria-label={locale === "zh" ? "作品分页" : "Works pagination"} className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((value) => Math.max(1, value - 1))}
            disabled={currentPage === 1}
            className="inline-flex border border-industrial px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-industrial hard-cut enabled:hover:bg-industrial enabled:hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
            {uiText.previous}
          </button>

          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setCurrentPage(pageNumber)}
              aria-current={pageNumber === currentPage ? "page" : undefined}
              className={clsx(
                "inline-flex min-w-9 items-center justify-center border px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] hard-cut",
                pageNumber === currentPage
                  ? "border-industrial bg-industrial text-paper"
                  : "border-industrial/45 text-industrial hover:border-industrial hover:bg-paper/70"
              )}
            >
              {pageNumber}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex border border-industrial px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-industrial hard-cut enabled:hover:bg-industrial enabled:hover:text-paper disabled:cursor-not-allowed disabled:opacity-40"
          >
            {uiText.next}
          </button>
          <p className="ml-2 font-mono text-xs uppercase tracking-[0.16em] text-industrial/70">
            {uiText.page} {currentPage}/{totalPages}
          </p>
        </nav>
      ) : null}

      {selectedWork ? (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-industrial/85 p-4"
          onClick={() => setSelectedWork(null)}
        >
          <article
            className="max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-paper/30 bg-paper"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex items-center justify-between border-b border-industrial/20 px-4 py-3 md:px-6">
              <h3 className="poster-heading text-xl uppercase leading-none text-industrial md:text-2xl">
                {selectedWork.title[locale]}
              </h3>
              <button
                type="button"
                onClick={() => setSelectedWork(null)}
                className="inline-flex border border-industrial px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-industrial hard-cut hover:bg-industrial hover:text-paper"
              >
                {uiText.close}
              </button>
            </header>

            <div className="grid gap-0 lg:grid-cols-[1.08fr_0.92fr]">
              <div className="relative aspect-[4/5] border-b border-industrial/20 bg-industrial lg:border-b-0 lg:border-r">
                <Image
                  src={selectedWork.cover}
                  alt={selectedWork.title[locale]}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover"
                />
              </div>

              <div className="space-y-5 p-4 md:p-6">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-industrial/70">{selectedWork.year}</p>
                <p className="text-base leading-relaxed text-industrial/85">{selectedWork.summary[locale]}</p>
                {selectedWork.body ? (
                  <p className="text-sm leading-relaxed text-industrial/80">{selectedWork.body}</p>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  {selectedWork.tags.map((tag) => (
                    <span
                      key={`${selectedWork.id}-modal-${tag}`}
                      className="border border-industrial/35 px-2 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-industrial/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                {selectedWork.links.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedWork.links.map((link) => (
                      <a
                        key={`${selectedWork.id}-${link.url}`}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center border border-redline/70 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.16em] text-redline hard-cut hover:bg-redline hover:text-paper"
                      >
                        {link.label[locale]}
                      </a>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </article>
        </div>
      ) : null}
    </section>
  );
};
