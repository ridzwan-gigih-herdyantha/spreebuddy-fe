import api from "./axios";

export const listCategories = () =>
  api.get("/api/v1/categories", { params: { page: 1, limit: 50 } });

export const createCategory = (body) => api.post("/api/v1/categories", body);

export const updateCategory = ({ id, ...body }) =>
  api.patch(`/api/v1/categories/${id}`, body);

export const deleteCategory = (id) => api.delete(`/api/v1/categories/${id}`);
