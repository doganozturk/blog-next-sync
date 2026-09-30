import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostHeader } from "~/components/header/post-header/post-header";
import { Footer } from "~/components/footer/footer";
import { isLang } from "@data/posts/types";
import { getPostParams, getPostBySlug } from "@data/posts/server";

type Props = {
  readonly params: Promise<{ lang: string; slug: string }>;
};

export function generateStaticParams() {
  return getPostParams();
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;

  if (!isLang(lang)) {
    return {};
  }

  const post = getPostBySlug(slug, lang);

  if (!post) {
    return {};
  }

  const { title, description, permalink, date } = post.frontmatter;

  return {
    title,
    description,
    alternates: {
      canonical: `https://doganozturk.dev/${lang}/${slug}/`,
      languages: {
        en: `https://doganozturk.dev/en/${slug}/`,
        tr: `https://doganozturk.dev/tr/${slug}/`,
      },
    },
    twitter: {
      card: "summary",
      site: "Doğan Öztürk | Blog",
      creator: "Doğan Öztürk",
      title,
      description,
      images: ["https://doganozturk.dev/images/avatar.jpg"],
    },
    openGraph: {
      title,
      type: "article",
      url: `https://doganozturk.dev${permalink}`,
      images: ["https://doganozturk.dev/images/avatar.jpg"],
      description,
      siteName: "doganozturk.dev",
      publishedTime: date,
      authors: ["Doğan Öztürk"],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { lang, slug } = await params;

  if (!isLang(lang)) {
    notFound();
  }

  let Content;
  try {
    const mdxModule = await import(`@content/posts/${lang}/${slug}/index.mdx`);
    Content = mdxModule.default;
  } catch {
    notFound();
  }

  return (
    <>
      <PostHeader />
      <main>
        <article className="prose prose-stone dark:prose-invert motion-safe:animate-post-article mt-12 mb-10 w-full min-w-0 max-w-none break-words prose-headings:font-serif prose-headings:font-normal prose-headings:tracking-tight prose-a:text-orange-700 prose-a:underline-offset-4 dark:prose-a:text-orange-400 prose-code:break-words prose-code:text-orange-700 dark:prose-code:text-orange-400 prose-code:before:content-none prose-code:after:content-none [&_:not(pre)>code]:rounded [&_:not(pre)>code]:bg-stone-100 [&_:not(pre)>code]:px-2 [&_:not(pre)>code]:py-1 [&_:not(pre)>code]:font-normal dark:[&_:not(pre)>code]:bg-stone-800 [&_[data-rehype-pretty-code-figure]]:-mx-4 md:[&_[data-rehype-pretty-code-figure]]:mx-0 [&_li_[data-rehype-pretty-code-figure]]:-ml-12 md:[&_li_[data-rehype-pretty-code-figure]]:ml-0 prose-pre:max-w-full prose-pre:overflow-x-auto prose-pre:rounded-none md:prose-pre:rounded-lg prose-pre:bg-stone-100 prose-pre:text-stone-900 dark:prose-pre:bg-stone-900 dark:prose-pre:text-stone-100 [&_[data-rehype-pretty-code-figure]_span]:text-[var(--shiki-light)] dark:[&_[data-rehype-pretty-code-figure]_span]:text-[var(--shiki-dark)] [&_[data-rehype-pretty-code-figure]_span]:[font-style:var(--shiki-light-font-style,inherit)] dark:[&_[data-rehype-pretty-code-figure]_span]:[font-style:var(--shiki-dark-font-style,inherit)] [&_[data-rehype-pretty-code-figure]_span]:[font-weight:var(--shiki-light-font-weight,inherit)] dark:[&_[data-rehype-pretty-code-figure]_span]:[font-weight:var(--shiki-dark-font-weight,inherit)] [&_[data-rehype-pretty-code-figure]_span]:[text-decoration:var(--shiki-light-text-decoration,inherit)] dark:[&_[data-rehype-pretty-code-figure]_span]:[text-decoration:var(--shiki-dark-text-decoration,inherit)]">
          <Content />
        </article>
      </main>
      <Footer entranceMotion />
    </>
  );
}
