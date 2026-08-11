import { useContext } from "react";
import { CartContext } from "@/context/cartStore";

export const useCart = () => useContext(CartContext);
