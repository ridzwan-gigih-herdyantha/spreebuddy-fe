import api from "./axios";

export const createOrders = (items) =>
  api.post("/api/v1/orders", {
    orders: items.map(({ productId, quantity }) => ({ productId, quantity })),
  });

export const listOrders = ({ page = 1, limit = 10, status } = {}) =>
  api.get("/api/v1/orders", {
    params: { page, limit, ...(status ? { status } : {}) },
  });

export const getOrderStats = ({ days = "30" } = {}) =>
  api.get("/api/v1/orders/stats", { params: { days } });

export const getOrder = (id) => api.get(`/api/v1/orders/${id}`);

export const updateOrderStatus = ({ id, status }) =>
  api.patch(`/api/v1/orders/${id}/status`, { status });

export const cancelOrder = (id) => api.patch(`/api/v1/orders/${id}/cancel`);

export const deleteOrder = (id) => api.delete(`/api/v1/orders/${id}`);

// Cancelling is a separate endpoint; the status route rejects "cancelled".
export const moveOrderTo = ({ id, status }) =>
  status === "cancelled" ? cancelOrder(id) : updateOrderStatus({ id, status });
