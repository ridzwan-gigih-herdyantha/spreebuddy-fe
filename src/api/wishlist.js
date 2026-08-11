import api from "./axios";

export const addToWishlist = (productId) =>
  api.post("/api/v1/wishlists", { productId });

export const removeFromWishlist = (productId) =>
  api.delete(`/api/v1/wishlists/${productId}`);
