import { formatDate, Locale } from "./format-date";

describe("formatDate", () => {
  it("formats date in English by default", () => {
    const result = formatDate("2025-01-10");
    expect(result).toBe("January 10, 2025");
  });

  it("formats date in Turkish when locale is tr", () => {
    const result = formatDate("2025-01-10", Locale.tr);
    expect(result).toBe("10 Ocak 2025");
  });

  it("formats older dates correctly in English", () => {
    const result = formatDate("2024-12-15");
    expect(result).toBe("December 15, 2024");
  });

  it("formats older dates correctly in Turkish", () => {
    const result = formatDate("2024-12-15", Locale.tr);
    expect(result).toBe("15 Aralık 2024");
  });
});
