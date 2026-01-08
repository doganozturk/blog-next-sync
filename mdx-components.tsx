import type { MDXComponents } from "mdx/types";
import { PostVideo } from "~/components/post-video/post-video";
import { PostImage } from "~/components/post-image/post-image";
import { formatDate, Locale } from "@lib/format-date";

export { formatDate, Locale };

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    PostVideo,
    PostImage,
    ...components,
  };
}
