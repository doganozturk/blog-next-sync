import type { MDXComponents } from "mdx/types";
import { PostVideo } from "~/components/post-video/post-video";
import { PostImage } from "~/components/post-image/post-image";
export { formatDate, Locale } from "@lib/format-date";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    PostVideo,
    PostImage,
    ...components,
  };
}
