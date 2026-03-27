import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CrosshairCursor } from "@/components/crosshair-cursor";
import { LocaleSwitcher } from "@/components/locale-switcher";
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

        <header className="flex flex-col gap-8 border border-industrial/30 bg-paper/85 p-5 backdrop-blur-sm md:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <p className="poster-heading text-sm tracking-[0.34em] text-industrial md:text-base">STRAY BEE</p>
            <LocaleSwitcher locale={locale} />
          </div>

          <nav className="flex flex-wrap gap-4 font-mono text-xs uppercase tracking-[0.2em] text-industrial/75">
            <Link href="#works" className="hard-cut hover:text-redline">
              {dictionary.nav.works}
            </Link>
            <Link href="#method" className="hard-cut hover:text-redline">
              {dictionary.nav.method}
            </Link>
            <Link href="#contact" className="hard-cut hover:text-redline">
              {dictionary.nav.contact}
            </Link>
          </nav>
        </header>

        <section className="relative mt-8 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6 border border-industrial/30 bg-paper/90 p-6 md:p-8">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-industrial/70">{dictionary.hero.eyebrow}</p>
            <h1 className="poster-heading whitespace-pre-line text-6xl uppercase leading-[0.82] text-industrial sm:text-7xl lg:text-8xl">
              STRAY
              {"\n"}BEE
            </h1>
            <p className="max-w-xl whitespace-pre-line text-lg uppercase leading-tight text-redline">
              {dictionary.hero.manifesto}
            </p>
            <p className="max-w-xl text-sm leading-relaxed text-industrial/85 md:text-base">{dictionary.hero.intro}</p>
            <Link
              href="#works"
              className="inline-flex border border-redline bg-redline px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-paper hard-cut hover:bg-industrial hover:border-industrial"
            >
              {dictionary.hero.cta}
            </Link>
          </div>

          <div className="relative min-h-[420px] overflow-hidden border border-industrial/30 bg-industrial md:min-h-[620px]">
            <Image
              src="/images/hero/ordered-chaos.png"
              alt="Ordered Chaos visual schema"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,242,234,0.2)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,242,234,0.2)_1px,transparent_1px)] bg-[size:74px_74px] mix-blend-screen" />
            <div className="absolute left-4 top-4 max-w-[220px] bg-paper/90 p-3 font-mono text-[0.62rem] uppercase leading-relaxed tracking-[0.16em] text-industrial">
              ORDERED CHAOS // SWISS GRID + DADA COLLAGE + CONSTRUCTIVIST DIAGONAL
            </div>
          </div>
        </section>

        <WorksWall locale={locale} works={works} labels={dictionary.works} />

        <section id="method" className="mt-24 grid gap-6 border border-industrial/30 bg-paper/88 p-6 md:grid-cols-[0.7fr_1.3fr] md:p-8">
          <h2 className="poster-heading text-4xl uppercase leading-none text-industrial md:text-6xl">
            {dictionary.method.title}
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-industrial/85">{dictionary.method.body}</p>
        </section>

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
