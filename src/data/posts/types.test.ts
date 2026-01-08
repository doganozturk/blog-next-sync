import { describe, expect, it } from "bun:test";
import { isLang, LANGS } from "./types";

describe("isLang", () => {
  it("returns true for 'en'", () => {
    expect(isLang("en")).toBe(true);
  });

  it("returns true for 'tr'", () => {
    expect(isLang("tr")).toBe(true);
  });

  it("returns false for invalid language codes", () => {
    expect(isLang("de")).toBe(false);
    expect(isLang("fr")).toBe(false);
    expect(isLang("")).toBe(false);
    expect(isLang("EN")).toBe(false);
    expect(isLang("english")).toBe(false);
  });
});

describe("LANGS", () => {
  it("contains expected languages", () => {
    expect(LANGS).toContain("en");
    expect(LANGS).toContain("tr");
    expect(LANGS).toHaveLength(2);
  });
});
