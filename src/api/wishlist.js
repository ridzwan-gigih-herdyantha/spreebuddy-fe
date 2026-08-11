import api from "./axios";

export const addToWishlist = (productId) =>
  api.post("/api/v1/wishlists", { productId });

export const removeFromWishlist = (productId) =>
  api.delete(`/api/v1/wishlists/${productId}`);

export const listWishlist = () =>
  api.get("/api/v1/wishlists", { params: { page: 1, limit: 100 } });
