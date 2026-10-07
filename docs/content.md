# Blog content

Create each post at `content/posts/<en|tr>/<slug>/index.mdx`. Its folder defines the language and permalink. Keep published slugs stable.

Frontmatter requires `title`, `description`, and `date` strings. Use the publication date in `YYYY-MM-DD` form. [The post reader](../src/data/posts/server.ts) validates these fields.

Store post images under `public/images/posts/<slug>/`. Use `PostImage` with useful `alt` text. Use `PostVideo` with its video ID and title. [MDX components](../mdx-components.tsx) define the available components.

English and Turkish posts are independent. They can use different slugs. Check language links and metadata against the actual published pages.

Preview the post, then run the applicable package checks. Check media at narrow and wide widths. Preserve the author's meaning when editing existing content.
