import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CrosshairCursor } from "@/components/crosshair-cursor";
import { WorksWall } from "@/components/works-wall";
import { getDictionary, isLocale, locales } from "@/lib/i18n";
import { getAllWorks } from "@/lib/works";

type LocalePageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export const generateStaticParams = () => {
  return locales.map((locale) => ({ locale }));
};

export default async function LocalePage({ params }: LocalePageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = getDictionary(locale);
  const works = await getAllWorks();

  return (
    <main lang={locale} className="poster-surface min-h-screen px-4 py-6 md:px-8 lg:px-12">
      <CrosshairCursor />

      <div className="relative mx-auto w-full max-w-[1632px]">
        <span aria-hidden className="diagonal-line" />

        <section className="relative flex flex-col gap-10 lg:flex-row lg:items-stretch lg:justify-between">
          <div className="flex flex-1 flex-col justify-between gap-8 border border-industrial/30 bg-paper/90 p-6 md:p-10 lg:self-stretch lg:p-12">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-industrial/70">{dictionary.hero.eyebrow}</p>

            <div className="space-y-4 sm:space-y-6">
              <h1 className="poster-heading whitespace-pre-line text-[clamp(3.825rem,7.225vw,9.775rem)] uppercase leading-[1.02] text-industrial">
                ORDERED
                {"\n"}CHAOS
              </h1>
              <p className="poster-heading text-[clamp(1.275rem,2.55vw,2.975rem)] uppercase leading-none text-redline">STRAY BEE</p>
              <p className="max-w-xl whitespace-pre-line text-[clamp(0.85rem,1.19vw,1.275rem)] font-medium uppercase leading-tight text-redline">
                {dictionary.hero.manifesto}
              </p>
              <p className="max-w-2xl text-[clamp(0.744rem,0.935vw,0.956rem)] leading-relaxed text-industrial/85">{dictionary.hero.intro}</p>
            </div>

            <div className="pt-6">
              <Link
                href="#works"
                className="inline-flex border border-redline bg-redline px-5 py-2.5 font-mono text-[clamp(0.638rem,0.765vw,0.744rem)] uppercase tracking-[0.2em] text-paper hard-cut hover:border-industrial hover:bg-industrial"
              >
                {dictionary.hero.cta}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-[3/4] w-full max-w-[680px] overflow-hidden border border-industrial/30 bg-industrial lg:mx-0 lg:w-[48%]">
            <Image
              src="/images/hero/ordered-chaos.webp"
              alt="Ordered Chaos visual schema"
              fill
              priority
              sizes="(max-width: 1024px) 92vw, (max-width: 1400px) 46vw, 44vw"
              className="object-contain"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,242,234,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,242,234,0.2)_1px,transparent_1px)] bg-[size:74px_74px] mix-blend-screen" />
            <div className="absolute left-4 top-4 max-w-[220px] bg-paper/90 p-3 font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.16em] text-industrial">
              ORDERED CHAOS // SWISS GRID + DADA COLLAGE + CONSTRUCTIVIST DIAGONAL
            </div>
          </div>
        </section>

        <WorksWall locale={locale} works={works} labels={dictionary.works} />

        <section id="contact" className="mt-16 mb-10 grid gap-6 border border-industrial/30 bg-industrial p-6 text-paper md:grid-cols-[0.7fr_1.3fr] md:p-8">
          <h2 className="poster-heading text-4xl uppercase leading-none text-paper md:text-6xl">{dictionary.contact.title}</h2>
          <div className="space-y-4">
            <p className="max-w-2xl text-sm leading-relaxed text-paper/90 md:text-base">{dictionary.contact.body}</p>
            <a
              href="mailto:hello@straybee.dev"
              className="inline-flex border border-warning px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-warning hard-cut hover:bg-warning hover:text-industrial"
            >
              {dictionary.contact.emailLabel}: hello@straybee.dev
            </a>
          </div>
        </section>

        <footer className="pb-4 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-industrial/70">
          {dictionary.footer}
        </footer>
      </div>
    </main>
  );
}
