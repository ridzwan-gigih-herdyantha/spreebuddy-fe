import { createContext } from "react";

export const CartContext = createContext({
  items: [],
  count: 0,
  addItem: () => {},
  removeItem: () => {},
  setQuantity: () => {},
  clear: () => {},
});

export const CART_KEY = "cart";
