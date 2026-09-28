import { afterEach, describe, expect, it, vi } from "vitest";
import {
  currentPrice,
  formatDimensions,
  formatPrice,
  formatRelative,
  formatSpec,
  isOnSale,
  parseApiDate,
} from "@/utils/format";

afterEach(() => vi.useRealTimers());

describe("prices", () => {
  it("shows dollars with cents", () => {
    expect(formatPrice(249.99)).toBe("$249.99");
    expect(formatPrice(10)).toBe("$10.00");
    expect(formatPrice(1000)).toBe("$1,000.00");
  });

  it("never drops the cents, which an IDR format used to do", () => {
    expect(formatPrice(29.99)).toContain(".99");
  });

  it("shows a dash rather than a wrong number when there is no price", () => {
    expect(formatPrice(undefined)).toBe("—");
    expect(formatPrice(null)).toBe("—");
    expect(formatPrice("12")).toBe("—");
  });

  it("counts a product as on sale only when the sale price is genuinely lower", () => {
    expect(isOnSale({ regularPrice: 100, salePrice: 80 })).toBe(true);
    expect(isOnSale({ regularPrice: 100, salePrice: 100 })).toBe(false);
    expect(isOnSale({ regularPrice: 100, salePrice: 120 })).toBe(false);
    expect(isOnSale({ regularPrice: 100, salePrice: 0 })).toBe(false);
    expect(isOnSale({ regularPrice: 100 })).toBe(false);
  });

  it("charges the sale price when there is one", () => {
    expect(currentPrice({ regularPrice: 100, salePrice: 80 })).toBe(80);
    expect(currentPrice({ regularPrice: 100, salePrice: 0 })).toBe(100);
    expect(currentPrice({ regularPrice: 100 })).toBe(100);
  });
});

describe("dates from the API", () => {
  it("reads DD/MM/YYYY the way the API sends it, not as US order", () => {
    const date = parseApiDate("05/09/2026");
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(8); // September
    expect(date.getDate()).toBe(5);
  });

  it("still reads an ISO date", () => {
    expect(parseApiDate("2026-09-05T00:00:00.000Z").getUTCFullYear()).toBe(2026);
  });

  it("returns nothing for a value it cannot read", () => {
    expect(parseApiDate("")).toBeNull();
    expect(parseApiDate("not a date")).toBeNull();
    expect(parseApiDate(undefined)).toBeNull();
  });
});

describe("relative dates", () => {
  const at = (iso) => vi.setSystemTime(new Date(iso));

  it("describes recent days in words", () => {
    vi.useFakeTimers();
    at("2026-09-10T10:00:00Z");
    expect(formatRelative("10/09/2026")).toBe("today");
    expect(formatRelative("09/09/2026")).toBe("yesterday");
    expect(formatRelative("07/09/2026")).toBe("3 days ago");
  });

  it("switches to weeks and months as things get older", () => {
    vi.useFakeTimers();
    at("2026-09-10T10:00:00Z");
    expect(formatRelative("28/08/2026")).toBe("last week");
    expect(formatRelative("10/08/2026")).toBe("4 weeks ago");
    expect(formatRelative("10/05/2026")).toBe("4 months ago");
  });

  it("says nothing rather than guessing when the date is unreadable", () => {
    expect(formatRelative("nonsense")).toBe("");
  });
});

describe("specs", () => {
  it("formats dimensions only when every side is known", () => {
    expect(formatDimensions({ length: 10, width: 20, height: 30 })).toBe("10 × 20 × 30 cm");
    expect(formatDimensions({ length: 10, width: 20 })).toBe("—");
    expect(formatDimensions(null)).toBe("—");
  });

  it("formats each spec by what it is", () => {
    expect(formatSpec("weight", 2)).toBe("2 kg");
    expect(formatSpec("regularPrice", 25)).toBe("$25.00");
    expect(formatSpec("stock", 15)).toBe("15");
    expect(formatSpec("category", null)).toBe("—");
  });
});
