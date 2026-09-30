import { expect, test } from "@playwright/test";

for (const lang of ["en", "tr"]) {
  test(`${lang} theme colors share one fade through control and system changes`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: "light", reducedMotion: "no-preference" });
    await page.addInitScript(() => localStorage.setItem("theme", "light"));
    await page.goto(`/${lang}/`);
    const control = page.getByRole("button", { name: /Theme:/ });
    await expect(control).toHaveAccessibleName("Theme: light. Switch to dark", { timeout: 10000 });

    // Color timing must also stay synchronized while a pointer rests on a control.
    await page.locator("footer a").last().hover();
    const colors = page.locator("body, header img, h1, header p, main, main h2, main p, main a, footer, footer a");
    const timing = await colors.evaluateAll((elements) => elements.map((element) => {
      const style = getComputedStyle(element);
      const properties = style.transitionProperty.split(", ").map((property) => property.trim());
      const durations = style.transitionDuration.split(", ");
      const themeProperties = element.tagName === "MAIN" ? ["background-color", "box-shadow"] : ["color", "background-color", "border-color"];
      return themeProperties.map((property) => {
        const index = properties.indexOf(property);
        return index < 0 ? "missing" : durations[index % durations.length];
      });
    }));
    expect(timing.length).toBeGreaterThan(10);
    for (const element of timing) for (const duration of element) expect(duration).toBe("0.3s");

    const checkFade = async (change: () => Promise<unknown>, effectiveTheme: "light" | "dark") => {
      await change();
      await expect(page.locator("html")).toHaveClass(new RegExp(effectiveTheme));
      const { transitions, midpoint } = await page.evaluate(async () => {
        await new Promise(requestAnimationFrame);
        const animations = document.getAnimations().filter((animation) => {
          if (!(animation instanceof CSSTransition)) return false;
          const element = (animation.effect as KeyframeEffect).target as Element;
          const property = animation.transitionProperty;
          if (property === "color") return element.matches("body, h1, main h2, header p, main p, footer a");
          if (property === "background-color" || property === "box-shadow") return element.matches("body, main");
          return property.startsWith("border-") && element.matches("header img, main a, footer");
        });
        const transitions = animations.map((animation) => ({
          timing: {
            duration: animation.effect!.getTiming().duration,
            delay: animation.effect!.getTiming().delay,
            easing: animation.effect!.getTiming().easing,
          },
          progress: animation.effect!.getComputedTiming().progress!,
        }));
        for (const animation of animations) {
          animation.pause();
          animation.currentTime = 150;
        }
        const body = getComputedStyle(document.body).backgroundColor;
        const main = getComputedStyle(document.querySelector("main")!);
        const midpoint = { body, main: main.backgroundColor, gutter: main.boxShadow };
        for (const animation of animations) animation.play();
        return { transitions, midpoint };
      });
      expect(transitions.length).toBeGreaterThan(3);
      for (const transition of transitions) expect(transition.timing).toEqual({ duration: 300, delay: 0, easing: "cubic-bezier(0.4, 0, 0.2, 1)" });
      const progress = transitions.map((transition) => transition.progress);
      expect(Math.max(...progress) - Math.min(...progress)).toBeLessThanOrEqual(0.02);
      expect(midpoint.main).toBe(midpoint.body);
      expect(midpoint.gutter).toContain(midpoint.body);
      await expect.poll(() => page.evaluate(() => document.getAnimations().filter((animation) => animation instanceof CSSTransition).length)).toBe(0);
      const background = await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor);
      await expect(page.locator("main")).toHaveCSS("background-color", background);
    };

    await checkFade(() => control.click(), "dark");
    await checkFade(() => control.click(), "light"); // system follows the light device setting
    await checkFade(() => page.emulateMedia({ colorScheme: "dark" }), "dark");
    await checkFade(() => page.emulateMedia({ colorScheme: "light" }), "light");

    await page.emulateMedia({ reducedMotion: "reduce" });
    const checkImmediate = async (change: () => Promise<unknown>, effectiveTheme: "light" | "dark") => {
      await change();
      await expect(page.locator("html")).toHaveClass(new RegExp(effectiveTheme));
      for (const element of await colors.all()) await expect(element).toHaveCSS("transition-property", "none");
      expect(await page.evaluate(() => document.getAnimations().filter((animation) => animation instanceof CSSTransition).length)).toBe(0);
      const background = await page.locator("body").evaluate((element) => getComputedStyle(element).backgroundColor);
      await expect(page.locator("main")).toHaveCSS("background-color", background);
    };
    await checkImmediate(() => page.emulateMedia({ colorScheme: "dark" }), "dark");
    await checkImmediate(() => page.emulateMedia({ colorScheme: "light" }), "light");
    await control.click(); // system to light
    await checkImmediate(() => control.click(), "dark");
    await checkImmediate(() => control.click(), "light"); // dark to system
  });

  test(`${lang} repeat post visits return to an immediate homepage with brief feedback`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await page.goto(`/${lang}/`);
    const post = page.locator("main a").first();
    for (let visit = 0; visit < 2; visit++) {
      for (const region of ["header", "main", "main a", "footer"]) {
        for (const element of await page.locator(region).all()) await expect(element).toHaveCSS("animation-name", "none");
      }
      await post.focus();
      expect(await post.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
      await post.hover();
      await expect(post.locator("span")).toHaveCSS("opacity", "1");
      await expect(post.locator("span")).toHaveCSS("transition-duration", "0.15s");
      await post.click();
      await expect(page.locator("header")).toHaveCSS("animation-name", "fadeIn");
      await expect(page.locator("article")).toHaveCSS("animation-name", "fadeInUp");
      await expect(page.locator("footer")).toHaveCSS("animation-name", "fadeIn");
      await page.goBack();
      await expect(page).toHaveURL(new RegExp(`/${lang}/$`));
    }
    await expect(page.locator("footer a span").first()).toHaveCSS("transition-duration", "0.15s");
  });
}
