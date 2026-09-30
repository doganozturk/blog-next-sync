import { expect, test, type Locator } from "@playwright/test";

async function readCodeAppearance(pre: Locator, theme: "light" | "dark") {
  return pre.evaluate((element, selectedTheme) => {
    const token = [...element.querySelectorAll<HTMLElement>("span")].find((span) =>
      span.style.getPropertyValue("--shiki-light") !== span.style.getPropertyValue("--shiki-dark"),
    );
    if (!token) throw new Error("Expected a syntax token with distinct light and dark colors");
    const color = getComputedStyle(token).color;
    const background = getComputedStyle(element).backgroundColor;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas color conversion is unavailable");
    const luminance = (value: string) => {
      context.fillStyle = value;
      context.fillRect(0, 0, 1, 1);
      const channels = [...context.getImageData(0, 0, 1, 1).data].slice(0, 3);
      const linear = channels.map((channel) => {
        const normalized = channel / 255;
        return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * linear[0]! + 0.7152 * linear[1]! + 0.0722 * linear[2]!;
    };
    const foregroundLuminance = luminance(color);
    const backgroundLuminance = luminance(background);
    const contrast = (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
      (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);

    const fontProbe = token.cloneNode(false) as HTMLElement;
    fontProbe.style.setProperty(`--shiki-${selectedTheme}-font-style`, "italic");
    fontProbe.style.setProperty(`--shiki-${selectedTheme}-font-weight`, "700");
    fontProbe.style.setProperty(`--shiki-${selectedTheme}-text-decoration`, "underline");
    token.after(fontProbe);
    const probeStyle = getComputedStyle(fontProbe);
    const font = {
      style: probeStyle.fontStyle,
      weight: probeStyle.fontWeight,
      decoration: probeStyle.textDecorationLine,
    };
    fontProbe.remove();
    return { color, background, contrast, font };
  }, theme);
}

test("manual themes override the system and persist; system mode follows changes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark", reducedMotion: "reduce" });
  await page.goto("/en/");
  const button = page.getByRole("button", { name: /Theme:/ });
  await expect(button).toHaveAccessibleName("Theme: system. Switch to light");
  await button.focus();
  await expect(button).toBeFocused();
  expect(await button.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
  await page.keyboard.press("Enter");
  await expect(button).toHaveAccessibleName("Theme: light. Switch to dark");
  const lightBackground = await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor);
  await page.reload();
  await expect(button).toHaveAccessibleName("Theme: light. Switch to dark");
  await expect(page.locator("body")).toHaveCSS("background-color", lightBackground);
  await page.emulateMedia({ colorScheme: "light" });
  await button.click();
  await expect(button).toHaveAccessibleName("Theme: dark. Switch to system");
  const darkBackground = await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor);
  expect(darkBackground).not.toBe(lightBackground);
  await page.reload();
  await expect(button).toHaveAccessibleName("Theme: dark. Switch to system");
  await expect(page.locator("body")).toHaveCSS("background-color", darkBackground);
  await button.click();
  await expect(button).toHaveAccessibleName("Theme: system. Switch to light");
  await expect(page.locator("body")).toHaveCSS("background-color", lightBackground);
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("body")).toHaveCSS("background-color", darkBackground);
});

for (const width of [390, 767, 769, 1280]) {
  test(`localized reader paths fit ${width}px and retain usable controls`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    for (const lang of ["en", "tr"]) {
      await page.goto(`/${lang}/`);
      await expect(page.getByRole("heading", { name: "Doğan Öztürk", level: 1 })).toBeVisible();
      await expect(page.getByText("CULTURE, AND LIFE")).toHaveCSS("display", width < 768 ? "block" : "inline");
      const button = page.getByRole("button", { name: /Theme:/ });
      const box = await button.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
      expect(await button.evaluate((element) => getComputedStyle(element).transitionDuration)).toBe("0s");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const article = page.locator("main a").first();
      const title = await article.locator("h2").innerText();
      await article.click();
      await expect(page.locator("article")).toContainText(title.replace("→", "").trim());
      await expect(page.getByRole("link", { name: "back", exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  });
}

test("post entrance motion remains separate from the homepage and respects reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/en/");
  for (const selector of ["header", "main", "footer"]) {
    await expect(page.locator(selector)).toHaveCSS("animation-name", "none");
  }

  await page.locator("main a").first().click();
  await expect(page.locator("header")).toHaveCSS("animation-name", "fadeIn");
  await expect(page.locator("article")).toHaveCSS("animation-name", "fadeInUp");
  await expect(page.locator("footer")).toHaveCSS("animation-name", "fadeIn");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();
  for (const selector of ["header", "article", "footer"]) {
    await expect(page.locator(selector)).toHaveCSS("animation-name", "none");
  }
});

test("theme loading placeholder reserves the hydrated control footprint", async ({ browser }) => {
  const initial = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
  const page = await initial.newPage();
  await page.goto("http://127.0.0.1:8830/en/");
  const placeholder = await page.locator("header > :last-child").boundingBox();
  await initial.close();
  const hydrated = await browser.newContext({ viewport: { width: 390, height: 900 } });
  const ready = await hydrated.newPage();
  await ready.goto("http://127.0.0.1:8830/en/");
  const control = await ready.getByRole("button", { name: /Theme:/ }).boundingBox();
  expect(placeholder).toEqual(control);
  await hydrated.close();
});

test("video respects reduced motion and supports keyboard activation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en/web-components/");
  const button = page.getByRole("button", { name: "Play video: Web Components", exact: true });
  await button.scrollIntoViewIfNeeded();
  await button.focus();
  await expect(button).toBeFocused();
  expect(await button.evaluate((element) => getComputedStyle(element).boxShadow)).not.toBe("none");
  await expect(button.locator("span")).toHaveCSS("transition-duration", "0s");
  await page.keyboard.press("Enter");
  await expect(page.getByTitle("Web Components", { exact: true })).toHaveAttribute("src", "https://www.youtube.com/embed/IGDJyP_-p6A?autoplay=1");
});

test("inline code has a padded highlight without generated backticks in both themes", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const lang of ["en", "tr"]) {
      await page.goto(`/${lang}/cross-platform-development-react-native-web/`);
      const code = page.locator("article :not(pre) > code");
      expect(await code.count()).toBeGreaterThan(0);
      for (const theme of ["light", "dark"]) {
        await expect(page.locator("html")).toHaveClass(new RegExp(theme));
        const appearances = await code.evaluateAll((elements) => elements.map((element) => {
          const style = getComputedStyle(element);
          return {
            background: style.backgroundColor,
            padding: Number.parseFloat(style.paddingLeft),
            radius: Number.parseFloat(style.borderRadius),
            before: getComputedStyle(element, "::before").content,
            after: getComputedStyle(element, "::after").content,
          };
        }));
        for (const appearance of appearances) {
          expect(appearance.background).not.toBe("rgba(0, 0, 0, 0)");
          expect(appearance.padding).toBeGreaterThan(0);
          expect(appearance.radius).toBeGreaterThan(0);
          expect(appearance.before).toBe("none");
          expect(appearance.after).toBe("none");
        }
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        if (theme === "light") await page.getByRole("button", { name: /Theme:/ }).click();
      }
    }
  }
});

test("highlighted articles keep their generated token colors and scroll long code", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/en/how-do-we-test-our-front-end-applications-in-trendyol-go-part-2/");

  const article = page.locator("article");
  await expect(article.getByRole("heading", { level: 1 })).toBeVisible();
  const code = article.locator("figure[data-rehype-pretty-code-figure] pre");
  await expect(code.first()).toBeVisible();
  await expect(code.first().locator("code")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(code.first().locator("code")).toHaveCSS("padding", "0px");
  const light = await readCodeAppearance(code.first(), "light");
  expect(light.contrast).toBeGreaterThanOrEqual(4.5);
  expect(light.font).toEqual({ style: "italic", weight: "700", decoration: "underline" });
  expect(await code.evaluateAll((blocks) => blocks.some((pre) => pre.scrollWidth > pre.clientWidth))).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

  const theme = page.getByRole("button", { name: /Theme:/ });
  await theme.click();
  await expect(theme).toHaveAccessibleName("Theme: light. Switch to dark");
  await theme.click();
  await expect(theme).toHaveAccessibleName("Theme: dark. Switch to system");
  await expect(code.first().locator("code")).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(code.first().locator("code")).toHaveCSS("padding", "0px");
  const dark = await readCodeAppearance(code.first(), "dark");
  expect(dark.contrast).toBeGreaterThanOrEqual(4.5);
  expect(dark.font).toEqual({ style: "italic", weight: "700", decoration: "underline" });
  expect(dark.color).not.toBe(light.color);
  expect(dark.background).not.toBe(light.background);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const width of [390, 769, 1280]) {
  test(`article media and Turkish code fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/tr/javascript-temelleri-hoisting/");
    const article = page.locator("article");
    await expect(article.getByRole("blockquote")).toBeVisible();
    await expect(article.locator("figure[data-rehype-pretty-code-figure] pre").first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await page.goto("/en/how-do-we-test-our-front-end-applications-in-trendyol-go-part-2/");
    const image = page.locator("article img").first();
    await expect(image).toHaveAttribute("alt", /.+/);
    const imageBox = await image.boundingBox();
    const articleBox = await page.locator("article").boundingBox();
    expect(imageBox).not.toBeNull();
    expect(articleBox).not.toBeNull();
    expect(imageBox!.width).toBeLessThanOrEqual((width < 768 ? width : articleBox!.width) + 1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

    await page.goto("/tr/amsterdam-jsnation-2019/");
    const turkishImage = page.locator("article img").first();
    await expect(turkishImage).toHaveAttribute("alt", /.+/);
    const turkishImageBox = await turkishImage.boundingBox();
    const turkishArticleBox = await page.locator("article").boundingBox();
    expect(turkishImageBox).not.toBeNull();
    expect(turkishArticleBox).not.toBeNull();
    expect(turkishImageBox!.width).toBeLessThanOrEqual((width < 768 ? width : turkishArticleBox!.width) + 1);

    const video = page.getByRole("button", { name: /Play video:/ }).first();
    const videoTitle = (await video.getAttribute("aria-label"))?.replace("Play video: ", "");
    expect(videoTitle).toBeTruthy();
    const frame = video.locator("..");
    const videoBox = await video.boundingBox();
    const frameBox = await frame.boundingBox();
    expect(videoBox).not.toBeNull();
    expect(frameBox).not.toBeNull();
    expect(videoBox!.width).toBeCloseTo(frameBox!.width, 0);
    expect(videoBox!.height).toBeCloseTo(frameBox!.height, 0);
    await video.click();
    await expect(page.getByTitle(videoTitle!, { exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

test("article images and code blocks reach mobile edges while desktop stays contained", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [390, 767, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/en/how-do-we-test-our-front-end-applications-in-trendyol-go-part-2/", "/tr/amsterdam-jsnation-2019/", "/tr/javascript-temelleri-hoisting/"]) {
      await page.goto(path);
      const sections = page.locator("article img:not(button img), article pre");
      expect(await sections.count()).toBeGreaterThan(0);
      for (const section of await sections.all()) {
        const box = await section.boundingBox();
        expect(box).not.toBeNull();
        if (width < 768) {
          expect(box!.x).toBeCloseTo(0, 0);
          expect(box!.width).toBeCloseTo(width, 0);
        } else {
          const article = await page.locator("article").boundingBox();
          expect(box!.x).toBeGreaterThanOrEqual(article!.x - 1);
          expect(box!.x + box!.width).toBeLessThanOrEqual(article!.x + article!.width + 1);
        }
      }
      const text = await page.locator("article > p").first().boundingBox();
      expect(text!.x).toBeGreaterThan(0);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    }
  }
});
