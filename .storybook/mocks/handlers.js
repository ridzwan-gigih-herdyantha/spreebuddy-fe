import { http, HttpResponse, delay } from "msw";
import { mockProducts, mockCategories } from "./fixtures";

const paginate = (items, url) => {
  const params = new URL(url).searchParams;
  const page = Number(params.get("page") ?? 1);
  const limit = Number(params.get("limit") ?? 8);
  const start = (page - 1) * limit;
  const slice = items.slice(start, start + limit);
  return {
    data: slice,
    meta: {
      page,
      limit,
      total: items.length,
      totalPages: Math.ceil(items.length / limit),
      hasNextPage: start + limit < items.length,
    },
  };
};

export const successHandlers = [
  http.get("*/api/v1/health", () =>
    HttpResponse.json({ status: "ok", uptime: 1234 }),
  ),
  http.get("*/api/v1/products", ({ request }) =>
    HttpResponse.json(paginate(mockProducts, request.url)),
  ),
  http.get("*/api/v1/categories", ({ request }) =>
    HttpResponse.json(paginate(mockCategories, request.url)),
  ),
];

export const emptyHandlers = [
  http.get("*/api/v1/health", () =>
    HttpResponse.json({ status: "ok", uptime: 1234 }),
  ),
  http.get("*/api/v1/products", () =>
    HttpResponse.json({
      data: [],
      meta: { page: 1, limit: 8, total: 0, totalPages: 0, hasNextPage: false },
    }),
  ),
  http.get("*/api/v1/categories", () =>
    HttpResponse.json({
      data: [],
      meta: { page: 1, limit: 50, total: 0, totalPages: 0, hasNextPage: false },
    }),
  ),
];

export const errorHandlers = [
  http.get("*/api/v1/health", () =>
    HttpResponse.json(
      { message: "Service unavailable" },
      { status: 503 },
    ),
  ),
  http.get("*/api/v1/products", () =>
    HttpResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    ),
  ),
  http.get("*/api/v1/categories", () =>
    HttpResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    ),
  ),
];

export const loadingHandlers = [
  http.get("*/api/v1/health", async () => {
    await delay("infinite");
    return HttpResponse.json({ status: "ok" });
  }),
  http.get("*/api/v1/products", async () => {
    await delay("infinite");
    return HttpResponse.json({ data: [], meta: {} });
  }),
  http.get("*/api/v1/categories", async () => {
    await delay("infinite");
    return HttpResponse.json({ data: [], meta: {} });
  }),
];
