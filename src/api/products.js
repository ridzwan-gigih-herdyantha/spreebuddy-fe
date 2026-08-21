import api from "./axios";

const ID_SWEEP_LIMIT = 100;
const ID_SWEEP_MAX_PAGES = 20;

// `category` matches on the exact category name, not its id.
export const listProducts = ({ page = 1, limit = 8, search, category } = {}) =>
  api.get("/api/v1/products", {
    params: {
      page,
      limit,
      ...(search ? { search } : {}),
      ...(category ? { category } : {}),
    },
  });

export const listCategories = () =>
  api.get("/api/v1/categories", { params: { page: 1, limit: 50 } });

export const getProduct = (slug) => api.get(`/api/v1/products/${slug}`);

export const createProduct = (body) => api.post("/api/v1/products", body);

export const updateProduct = ({ id, ...body }) =>
  api.patch(`/api/v1/products/${id}`, body);

export const deleteProduct = (id) => api.delete(`/api/v1/products/${id}`);

// Resolves the ids behind a "select all" so a bulk action never acts on a
// count it cannot enumerate.
export async function fetchProductIds({ search, category } = {}) {
  const ids = [];

  for (let page = 1; page <= ID_SWEEP_MAX_PAGES; page += 1) {
    const response = await listProducts({
      page,
      limit: ID_SWEEP_LIMIT,
      search,
      category,
    });
    ids.push(...(response?.data ?? []).map(({ id }) => id));
    if (!response?.meta?.hasNextPage) break;
  }

  return ids;
}
