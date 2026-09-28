import { afterEach, describe, expect, it } from "vitest";
import { resolveSiteUrl } from "../seo.plugin.js";

const original = process.env.VERCEL_PROJECT_PRODUCTION_URL;

afterEach(() => {
  if (original === undefined) delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  else process.env.VERCEL_PROJECT_PRODUCTION_URL = original;
});

describe("deciding the site's own address at build time", () => {
  it("uses VITE_SITE_URL when it is set", () => {
    expect(resolveSiteUrl({ VITE_SITE_URL: "https://example.com" })).toBe("https://example.com");
  });

  it("drops a trailing slash, so urls are not built with a double one", () => {
    expect(resolveSiteUrl({ VITE_SITE_URL: "https://example.com/" })).toBe("https://example.com");
  });

  it("falls back to the domain Vercel exposes at build time", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "spreebuddy.example.com";
    expect(resolveSiteUrl({})).toBe("https://spreebuddy.example.com");
  });

  it("prefers an explicit setting over the Vercel one", () => {
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "fallback.example.com";
    expect(resolveSiteUrl({ VITE_SITE_URL: "https://chosen.example.com" })).toBe(
      "https://chosen.example.com",
    );
  });

  it("treats a blank setting as absent rather than as a valid url", () => {
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    expect(resolveSiteUrl({ VITE_SITE_URL: "   " })).toBeNull();
  });

  it("answers with nothing when it cannot tell, so the build can stop", () => {
    delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
    expect(resolveSiteUrl({})).toBeNull();
  });
});
