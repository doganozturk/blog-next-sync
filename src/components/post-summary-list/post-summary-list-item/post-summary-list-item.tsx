import Link from "next/link";
import { formatDate, Locale } from "@lib/format-date";
import styles from "./post-summary-list-item.module.css";

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
    <Link href={toPostRoute(permalink)} className={styles.postSummaryListItem}>
      <h2 className={styles.title}>
        {title}
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      </h2>
      <p className={styles.date}>{formatDate(date, locale)}</p>
      <p className={styles.summary}>{description}</p>
    </Link>
  );
}
