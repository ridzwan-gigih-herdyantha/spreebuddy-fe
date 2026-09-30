import { beforeEach, describe, expect, it } from "vitest";
import { previousRoute, rememberRoute } from "@/utils/routeHistory";
import { quickRepliesFor, quickReplyPresets } from "@/data/chatPage";
import { routeSeoFor } from "@/config/seo";

describe("where the visitor came from", () => {
  beforeEach(() => {
    // The tracker is module state, so each test walks it from a known point.
    rememberRoute("/reset-a");
    rememberRoute("/reset-b");
  });

  it("answers correctly before the tracker has caught up", () => {
    rememberRoute("/shop");
    expect(previousRoute("/chat")).toBe("/shop");
  });

  it("answers the same once it has", () => {
    rememberRoute("/shop");
    rememberRoute("/chat");
    expect(previousRoute("/chat")).toBe("/shop");
  });

  it("is unmoved by a page rewriting its own query string", () => {
    rememberRoute("/wishlist");
    rememberRoute("/chat");
    rememberRoute("/chat"); // ?session= written
    expect(previousRoute("/chat")).toBe("/wishlist");
  });
});

describe("openers offered in the chat", () => {
  it("follows the page the visitor came from", () => {
    expect(quickRepliesFor("/shop")).toEqual(quickReplyPresets["/shop"]);
    expect(quickRepliesFor("/wishlist")).toEqual(quickReplyPresets["/wishlist"]);
    expect(quickRepliesFor("/cart")).toEqual(quickReplyPresets["/cart"]);
  });

  it("matches a page with an id in the path", () => {
    expect(quickRepliesFor("/product/meja-kayu")).toEqual(quickReplyPresets["/product"]);
    expect(quickRepliesFor("/orders/abc123")).toEqual(quickReplyPresets["/orders"]);
  });

  it("falls back to the default for anywhere else, or nowhere at all", () => {
    expect(quickRepliesFor("/about")).toEqual(quickReplyPresets.default);
    expect(quickRepliesFor(null)).toEqual(quickReplyPresets.default);
  });

  it("always offers something to click", () => {
    for (const path of ["/shop", "/wishlist", "/cart", "/orders", "/product/x", "/"]) {
      expect(quickRepliesFor(path).length).toBeGreaterThan(0);
    }
  });
});

describe("which pages search engines may index", () => {
  it("indexes the storefront", () => {
    expect(routeSeoFor("/").noindex).toBeFalsy();
    expect(routeSeoFor("/shop").noindex).toBeFalsy();
    expect(routeSeoFor("/product/meja-kayu").noindex).toBeFalsy();
    expect(routeSeoFor("/blog/a-post").noindex).toBeFalsy();
  });

  it("keeps private and transactional pages out", () => {
    for (const path of [
      "/cart",
      "/checkout",
      "/checkout/success",
      "/orders",
      "/orders/abc",
      "/account",
      "/settings",
      "/chat",
      "/chat-history",
      "/login",
      "/register",
      "/admin",
      "/admin/products",
    ]) {
      expect(routeSeoFor(path).noindex, path).toBe(true);
    }
  });

  it("treats an unknown path as not found, since the app answers 200 for everything", () => {
    expect(routeSeoFor("/products/typo").noindex).toBe(true);
    expect(routeSeoFor("/nope").title).toBe("Page not found");
  });

  it("matches whole segments, so a longer name is not swallowed by a shorter one", () => {
    expect(routeSeoFor("/chat-history").title).toBe("Chat history");
    expect(routeSeoFor("/chat").title).toBe("Chat");
  });
});
