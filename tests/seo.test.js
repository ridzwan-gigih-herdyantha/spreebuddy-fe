// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from "vitest";
import { applyPageSeo, applyRouteSeo, absoluteUrl, summarize } from "@/utils/seo";
import { SITE_URL, siteSeo } from "@/config/seo";

const head = () => document.head;
const meta = (key, attribute = "name") =>
  head().querySelector(`meta[${attribute}="${key}"]`)?.getAttribute("content");
const canonical = () => head().querySelector('link[rel="canonical"]')?.getAttribute("href");
const jsonLd = () => head().querySelectorAll('script[type="application/ld+json"][data-page]');

beforeEach(() => {
  head().innerHTML = "";
});

describe("trimming a description", () => {
  it("leaves a short one alone", () => {
    expect(summarize("A short description.")).toBe("A short description.");
  });

  it("collapses whitespace", () => {
    expect(summarize("two   lines\nof  text")).toBe("two lines of text");
  });

  it("cuts on a word boundary and marks the cut", () => {
    const long = "word ".repeat(60).trim();
    const short = summarize(long, 40);
    expect(short.length).toBeLessThanOrEqual(40);
    expect(short.endsWith("…")).toBe(true);
    expect(short).not.toContain("wor…");
  });

  it("copes with nothing at all", () => {
    expect(summarize(undefined)).toBe("");
  });
});

describe("building absolute urls", () => {
  it("keeps a url that is already absolute, such as a product photo on a CDN", () => {
    expect(absoluteUrl("https://cdn.shopify.com/a.jpg")).toBe("https://cdn.shopify.com/a.jpg");
  });

  it("puts the site in front of a path", () => {
    expect(absoluteUrl("/shop")).toBe(`${SITE_URL}/shop`);
  });
});

describe("what the head says about a page", () => {
  it("gives the home page the site title and lets it be indexed", () => {
    applyRouteSeo("/");
    expect(document.title).toBe(siteSeo.title);
    expect(meta("robots")).toBe("index, follow");
    expect(canonical()).toBe(`${SITE_URL}/`);
  });

  it("titles a private page but keeps it out of the index", () => {
    applyRouteSeo("/cart");
    expect(document.title).toBe("Cart — SpreeBuddy");
    expect(meta("robots")).toBe("noindex, follow");
  });

  it("mirrors the title and description into the share tags", () => {
    applyRouteSeo("/shop");
    expect(meta("og:title", "property")).toBe(document.title);
    expect(meta("twitter:title")).toBe(document.title);
    expect(meta("og:image", "property")).toBe(`${SITE_URL}${siteSeo.image}`);
  });
});

describe("a page that knows more than the route table", () => {
  const product = {
    title: "JLab Go Air Pop",
    description: "Cheap earbuds.",
    image: "https://cdn.shopify.com/jlab.jpg",
    type: "product",
    jsonLd: { "@type": "Product" },
  };

  it("wins when the route table ran first", () => {
    applyRouteSeo("/product/jlab");
    applyPageSeo("/product/jlab", product);
    expect(document.title).toBe("JLab Go Air Pop — SpreeBuddy");
    expect(jsonLd()).toHaveLength(1);
  });

  it("wins when its own data arrived first, as it does from cache", () => {
    applyPageSeo("/product/jlab", product);
    applyRouteSeo("/product/jlab");
    expect(document.title).toBe("JLab Go Air Pop — SpreeBuddy");
    expect(meta("og:image", "property")).toBe(product.image);
  });

  it("gives its structured data back when the visitor leaves", () => {
    applyPageSeo("/product/jlab", product);
    applyRouteSeo("/about");
    expect(document.title).toBe("About — SpreeBuddy");
    expect(jsonLd()).toHaveLength(0);
    expect(meta("og:image", "property")).toBe(`${SITE_URL}${siteSeo.image}`);
  });

  it("never leaves a second copy of a tag behind", () => {
    applyRouteSeo("/");
    applyPageSeo("/shop", { title: "Electronics", canonical: "/shop?category=Electronics" });
    applyRouteSeo("/about");
    applyPageSeo("/product/x", product);

    expect(head().querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(head().querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(head().querySelectorAll('meta[property="og:image"]')).toHaveLength(1);
  });

  it("canonicalises a filtered shop to the filter, not the raw path", () => {
    applyPageSeo("/shop", { title: "Electronics", canonical: "/shop?category=Electronics" });
    expect(canonical()).toBe(`${SITE_URL}/shop?category=Electronics`);
  });
});
