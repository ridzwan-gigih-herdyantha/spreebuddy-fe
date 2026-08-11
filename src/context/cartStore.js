import { createContext } from "react";

export const CartContext = createContext({
  items: [],
  count: 0,
  total: 0,
  isLoading: false,
  isClearing: false,
  busyOf: () => undefined,
  addItem: () => {},
  removeItem: () => {},
  setQuantity: () => {},
  clear: () => {},
});
