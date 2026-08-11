import { createContext } from "react";

export const CartContext = createContext({
  items: [],
  count: 0,
  total: 0,
  isLoading: false,
  addItem: () => {},
  removeItem: () => {},
  setQuantity: () => {},
  clear: () => {},
});
