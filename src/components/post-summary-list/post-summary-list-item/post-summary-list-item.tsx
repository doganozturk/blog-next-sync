import Link from "next/link";
import { formatDate, Locale } from "@lib/format-date";

type PostRoute = `/${string}/${string}`;

export interface PostSummary {
  readonly title: string;
  readonly description: string;
  readonly permalink: string;
  readonly date: string;
  readonly lang: string;
}

function toPostRoute(permalink: string): PostRoute {
  const route = permalink.endsWith("/") ? permalink.slice(0, -1) : permalink;
  if (!/^\/[^/]+\/[^/]+$/u.test(route)) {
    throw new Error(`Invalid post permalink: ${permalink}`);
  }

  return route as PostRoute;
}

export function PostSummaryListItem({
  title,
  description,
  permalink,
  date,
  lang,
}: PostSummary) {
  const locale = lang === "tr" ? Locale.tr : Locale.en;

  return (
    <Link href={toPostRoute(permalink)} className="group relative block border-b border-stone-200 py-6 first:pt-0 last:border-0 dark:border-stone-800 md:py-8">
      <h2 className="flex items-center gap-2 font-serif text-2xl font-normal leading-tight tracking-tight group-hover:text-orange-700 group-focus-visible:text-orange-700 dark:group-hover:text-orange-500 dark:group-focus-visible:text-orange-500 md:text-3xl">
        {title}
        <span className="inline-block shrink-0 text-lg opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 motion-safe:transition" aria-hidden="true">
          →
        </span>
      </h2>
      <p className="mt-3 text-sm font-medium tracking-widest text-stone-600 uppercase dark:text-stone-400">{formatDate(date, locale)}</p>
      <p className="mt-4 text-base leading-relaxed text-stone-600 dark:text-stone-400">{description}</p>
    </Link>
  );
}
