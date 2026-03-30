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

      <div className="relative mx-auto max-w-[1500px]">
        <span aria-hidden className="diagonal-line" />

        <section className="relative grid gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex min-h-[66vh] flex-col justify-between gap-8 border border-industrial/30 bg-paper/90 p-6 md:min-h-[72vh] md:p-10 lg:p-12">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-industrial/70">{dictionary.hero.eyebrow}</p>

            <div className="space-y-6">
              <h1 className="poster-heading whitespace-pre-line text-6xl uppercase leading-[0.8] text-industrial sm:text-7xl md:text-8xl lg:text-[8.3rem]">
                ORDERED
                {"\n"}CHAOS
              </h1>
              <p className="poster-heading text-2xl uppercase leading-none text-redline md:text-3xl">STRAY BEE</p>
              <p className="max-w-xl whitespace-pre-line text-lg uppercase leading-tight text-redline">
                {dictionary.hero.manifesto}
              </p>
              <p className="max-w-2xl text-sm leading-relaxed text-industrial/85 md:text-base">{dictionary.hero.intro}</p>
            </div>

            <div className="pt-2">
              <Link
                href="#works"
                className="inline-flex border border-redline bg-redline px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-paper hard-cut hover:bg-industrial hover:border-industrial"
              >
                {dictionary.hero.cta}
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[680px] overflow-hidden border border-industrial/30 bg-industrial lg:mx-0 lg:justify-self-end">
            <Image
              src="/images/hero/ordered-chaos.webp"
              alt="Ordered Chaos visual schema"
              width={1148}
              height={1536}
              priority
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="h-auto w-full object-contain"
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
