import { useCallback, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/api/cart";
import { useAuth } from "@/hooks/useAuth";
import { CartContext } from "./cartStore";

export default function CartProvider({ children }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const cart = useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: Boolean(user),
    retry: false,
  });

  const refresh = useCallback(
    () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    [queryClient],
  );

  const add = useMutation({ mutationFn: addToCart, onSuccess: refresh });
  const update = useMutation({
    mutationFn: updateCartItem,
    onSuccess: refresh,
  });
  const remove = useMutation({
    mutationFn: removeCartItem,
    onSuccess: refresh,
  });
  const wipe = useMutation({ mutationFn: clearCart, onSuccess: refresh });

  const items = useMemo(() => cart.data?.data?.items ?? [], [cart.data]);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: cart.data?.data?.total ?? 0,
      isLoading: cart.isPending && Boolean(user),
      addItem: (product, quantity = 1) =>
        add.mutate({ productId: product.id, quantity }),
      setQuantity: (productId, quantity) =>
        update.mutate({ productId, quantity }),
      removeItem: (productId) => remove.mutate(productId),
      clear: () => wipe.mutate(),
    }),
    [items, cart.data, cart.isPending, user, add, update, remove, wipe],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
