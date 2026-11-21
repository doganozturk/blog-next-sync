import { errors, expect, test } from "@playwright/test";

for (const lang of ["en", "tr"]) {
  test(`${lang} homepage waits for navigation before requesting posts`, async ({ page }) => {
    const requests: string[] = [];
    page.on("request", (request) => requests.push(new URL(request.url()).pathname));

    await page.goto(`/${lang}/`);
    const posts = page.locator("main").getByRole("link").filter({
      has: page.getByRole("heading", { level: 2 }),
    });
    await expect(posts.first()).toBeVisible();
    const postPaths = await posts.evaluateAll((links) =>
      links.map((link) => (link as HTMLAnchorElement).pathname.replace(/\/$/u, "")),
    );
    const isPostRequest = (path: string) =>
      path.startsWith("/images/posts/") ||
      postPaths.some((post) => path === post || path.startsWith(`${post}/`));

    expect(requests.filter(isPostRequest)).toEqual([]);
    // Keep observing after load to catch deferred viewport prefetches.
    await expect(page.waitForRequest(
      (request) => isPostRequest(new URL(request.url()).pathname),
      { timeout: 2000 },
    )).rejects.toThrow(errors.TimeoutError);

    await posts.first().click();
    await expect(page.locator("article")).toBeVisible();
  });
}
