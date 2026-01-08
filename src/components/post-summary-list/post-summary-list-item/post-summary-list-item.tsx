import type { Route } from "next";
import Link from "next/link";
import { formatDate, Locale } from "@lib/format-date";
import styles from "./post-summary-list-item.module.css";

export interface PostSummary {
  title: string;
  description: string;
  permalink: string;
  date: string;
  lang: string;
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
    <Link href={permalink as Route} className={styles.postSummaryListItem}>
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
