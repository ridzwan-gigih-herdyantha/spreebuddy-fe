import api from "./axios";

const BASE = "/api/v1/carts";

export const getCart = () => api.get(BASE);

export const addToCart = ({ productId, quantity = 1 }) =>
  api.post(BASE, { productId, quantity });

export const updateCartItem = ({ productId, quantity }) =>
  api.patch(`${BASE}/${productId}`, { quantity });

export const removeCartItem = (productId) => api.delete(`${BASE}/${productId}`);

export const clearCart = () => api.delete(BASE);
