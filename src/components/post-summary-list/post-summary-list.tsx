import {
  PostSummary,
  PostSummaryListItem,
} from "./post-summary-list-item/post-summary-list-item";

interface PostSummaryListProps {
  data: PostSummary[];
}

export function PostSummaryList({ data }: PostSummaryListProps) {
  return (
    <section className="post-summary-list">
      {data.map(({ title, description, permalink, date, lang }) => (
        <PostSummaryListItem
          key={permalink}
          title={title}
          description={description}
          permalink={permalink}
          date={date}
          lang={lang}
        />
      ))}
    </section>
  );
}
