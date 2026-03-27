import Link from "next/link";
import clsx from "clsx";
import type { Locale } from "@/lib/types";

type LocaleSwitcherProps = {
  locale: Locale;
};

export const LocaleSwitcher = ({ locale }: LocaleSwitcherProps) => {
  return (
    <div className="inline-flex border border-industrial/40 text-xs uppercase tracking-[0.24em]">
      <Link
        href="/zh"
        className={clsx(
          "px-3 py-2 transition-colors",
          locale === "zh" ? "bg-industrial text-paper" : "text-industrial hover:bg-industrial/10"
        )}
        aria-current={locale === "zh" ? "page" : undefined}
      >
        中文
      </Link>
      <Link
        href="/en"
        className={clsx(
          "px-3 py-2 transition-colors",
          locale === "en" ? "bg-industrial text-paper" : "text-industrial hover:bg-industrial/10"
        )}
        aria-current={locale === "en" ? "page" : undefined}
      >
        EN
      </Link>
    </div>
  );
};
