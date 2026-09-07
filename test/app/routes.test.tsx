import { expect, test } from "bun:test";
import RootPage from "../../src/app/page";
import RootLayout, { metadata } from "../../src/app/layout";
import LangLayout, { generateStaticParams as languages } from "../../src/app/[lang]/layout";
import HomePage, { generateMetadata as homeMetadata, generateStaticParams as homeParams } from "../../src/app/[lang]/page";
import PostPage, { generateMetadata as postMetadata, generateStaticParams as postParams } from "../../src/app/[lang]/[slug]/page";

test("root redirects and retains site metadata and children", () => {
  expect(RootPage).toThrow("NEXT_REDIRECT");
  expect(RootLayout({ children: "child" })).toBe("child");
  expect(String(metadata.metadataBase)).toBe("https://doganozturk.dev/");
});

test("localized routes expose supported languages and reject unknown languages", async () => {
  expect(languages()).toEqual([{ lang: "en" }, { lang: "tr" }]);
  expect(homeParams()).toEqual(languages());
  for (const lang of ["en", "tr"]) {
    const params = Promise.resolve({ lang });
    expect((await homeMetadata({ params })).alternates?.canonical).toBe(`https://doganozturk.dev/${lang}/`);
    expect(await HomePage({ params })).toBeTruthy();
    expect((await LangLayout({ params, children: "child" })).props.lang).toBe(lang);
  }
  const params = Promise.resolve({ lang: "invalid" });
  expect(await homeMetadata({ params })).toEqual({});
  expect(HomePage({ params })).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
});

test("post routes derive static metadata and reject missing content", async () => {
  const entries = postParams();
  expect(entries.length).toBeGreaterThan(0);
  const entry = entries[0]!;
  const metadata = await postMetadata({ params: Promise.resolve(entry) });
  expect(metadata.title).toBeTruthy();
  expect(metadata.alternates?.canonical).toBe(`https://doganozturk.dev/${entry.lang}/${entry.slug}/`);
  for (const lang of ["invalid", "en"]) {
    const params = Promise.resolve({ lang, slug: "missing-post-713" });
    expect(await postMetadata({ params })).toEqual({});
    expect(PostPage({ params })).rejects.toThrow("NEXT_HTTP_ERROR_FALLBACK;404");
  }
});
