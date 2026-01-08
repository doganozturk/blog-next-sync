export const LANGS = ["en", "tr"] as const;
export type Lang = (typeof LANGS)[number];

export function isLang(value: string): value is Lang {
  return LANGS.includes(value as Lang);
}

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  permalink: string;
  lang: Lang;
}

export interface PostData {
  frontmatter: PostFrontmatter;
  slug: string;
  content: string;
}

export interface PostParams {
  lang: Lang;
  slug: string;
}
