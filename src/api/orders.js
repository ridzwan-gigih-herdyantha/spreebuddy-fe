import api from "./axios";

export const createOrders = (items) =>
  api.post("/api/v1/orders", {
    orders: items.map(({ productId, quantity }) => ({ productId, quantity })),
  });

export const listOrders = ({ page = 1, limit = 10 } = {}) =>
  api.get("/api/v1/orders", { params: { page, limit } });
