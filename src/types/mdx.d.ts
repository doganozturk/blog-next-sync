declare module "*.mdx" {
  import type { MDXProps } from "mdx/types";

  export const frontmatter: {
    title: string;
    description: string;
    date: string;
    permalink: string;
    lang: "en" | "tr";
  };

  export default function MDXContent(props: MDXProps): JSX.Element;
}
