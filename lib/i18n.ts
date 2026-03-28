import type { Locale } from "@/lib/types";

export const locales = ["zh", "en"] as const;
export const defaultLocale: Locale = "zh";

export const isLocale = (value: string): value is Locale => {
  return locales.includes(value as Locale);
};

type Dictionary = {
  nav: {
    works: string;
    method: string;
    contact: string;
  };
  hero: {
    eyebrow: string;
    manifesto: string;
    intro: string;
    cta: string;
  };
  works: {
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
  contact: {
    title: string;
    body: string;
    emailLabel: string;
  };
  footer: string;
};

const dictionaries: Record<Locale, Dictionary> = {
  zh: {
    nav: {
      works: "作品",
      method: "方法",
      contact: "联系"
    },
    hero: {
      eyebrow: "秩序与游离 / ORDERED CHAOS",
      manifesto: "在理性网格里，\n制造受控失序。",
      intro:
        "Stray Bee 是一个以图像为优先的个人站。以瑞士网格为骨架，用达达拼贴与构成主义斜线切开秩序，展示我的创作与实验。",
      cta: "进入作品墙"
    },
    works: {
      title: "CREATION WALL",
      subtitle: "更多作品被压缩进同一张海报式页面。",
      filters: "筛选",
      tag: "标签",
      year: "年份",
      all: "全部",
      loadMore: "加载更多",
      empty: "没有匹配的作品，请调整筛选。",
      open: "打开链接"
    },
    contact: {
      title: "CONTACT / 协作",
      body: "如果你正在寻找视觉工程、创意前端或数字叙事合作，欢迎联系我。",
      emailLabel: "邮件"
    },
    footer: "STRAY BEE / SWISS GRID + DADA COLLAGE + CONSTRUCTIVIST GEOMETRY"
  },
  en: {
    nav: {
      works: "Works",
      method: "Method",
      contact: "Contact"
    },
    hero: {
      eyebrow: "ORDERED CHAOS / STRAY BEE",
      manifesto: "Engineer strict grids.\nThen rupture them on purpose.",
      intro:
        "Stray Bee is an image-first personal portfolio. Swiss structure sets the frame; Dada collage and Constructivist diagonals break it to reveal my creations.",
      cta: "Enter The Wall"
    },
    works: {
      title: "CREATION WALL",
      subtitle: "More works, denser layout, one manifesto page.",
      filters: "Filters",
      tag: "Tag",
      year: "Year",
      all: "All",
      loadMore: "Load more",
      empty: "No works match these filters.",
      open: "Open link"
    },
    contact: {
      title: "CONTACT",
      body: "Open to collaborations in visual engineering, creative frontend, and digital storytelling.",
      emailLabel: "Email"
    },
    footer: "STRAY BEE / SWISS GRID + DADA COLLAGE + CONSTRUCTIVIST GEOMETRY"
  }
};

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
