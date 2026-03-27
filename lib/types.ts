export type Locale = "zh" | "en";

export type LocalizedText = {
  zh: string;
  en: string;
};

export type WorkLink = {
  label: LocalizedText;
  url: string;
};

export type WorkEntry = {
  id: string;
  slug: string;
  year: number;
  tags: string[];
  cover: string;
  gallery: string[];
  title: LocalizedText;
  summary: LocalizedText;
  featured: boolean;
  links: WorkLink[];
  body: string;
};
