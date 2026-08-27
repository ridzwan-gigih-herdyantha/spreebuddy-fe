import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/api/cart";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { cartMessages } from "@/data/cart";
import { CartContext } from "./cartStore";

const CART_KEY = ["cart"];
const CART_MUTATION = ["cart", "mutate"];

const sumTotal = (items) => items.reduce((sum, item) => sum + item.total, 0);

export default function CartProvider({ children }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const toast = useToast();
  const [busy, setBusy] = useState({});

  const cart = useQuery({
    queryKey: CART_KEY,
    queryFn: getCart,
    enabled: Boolean(user),
    retry: false,
  });

  const mark = useCallback(
    (productId, kind) => setBusy((state) => ({ ...state, [productId]: kind })),
    [],
  );

  const unmark = useCallback(
    (productId) =>
      setBusy((state) => {
        const next = { ...state };
        delete next[productId];
        return next;
      }),
    [],
  );

  const patchItems = useCallback(
    (updater) =>
      queryClient.setQueryData(CART_KEY, (old) => {
        if (!old?.data) return old;
        const items = updater(old.data.items ?? []);
        return { ...old, data: { ...old.data, items, total: sumTotal(items) } };
      }),
    [queryClient],
  );

  const snapshot = useCallback(async () => {
    await queryClient.cancelQueries({ queryKey: CART_KEY });
    return queryClient.getQueryData(CART_KEY);
  }, [queryClient]);

  // Refetch only when this is the last cart mutation, so a late response
  // cannot overwrite optimistic changes that are still in flight.
  const settle = useCallback(
    (productId) => {
      if (productId) unmark(productId);
      if (queryClient.isMutating({ mutationKey: CART_MUTATION }) === 1) {
        queryClient.invalidateQueries({ queryKey: CART_KEY });
      }
    },
    [queryClient, unmark],
  );

  const rollback = useCallback(
    (context) => {
      if (context?.previous)
        queryClient.setQueryData(CART_KEY, context.previous);
    },
    [queryClient],
  );

  const add = useMutation({
    mutationKey: CART_MUTATION,
    mutationFn: addToCart,
    onMutate: ({ productId }) => mark(productId, "add"),
    onSuccess: () =>
      toast.success(cartMessages.added, {
        action: { label: cartMessages.viewCart, to: "/cart" },
      }),
    onError: (err) => toast.error(err?.message ?? cartMessages.addFailed),
    onSettled: (_data, _err, { productId }) => settle(productId),
  });

  const update = useMutation({
    mutationKey: CART_MUTATION,
    mutationFn: updateCartItem,
    onMutate: async ({ productId, quantity }) => {
      const previous = await snapshot();
      mark(productId, "update");
      patchItems((items) =>
        items.map((item) =>
          item.product?.id === productId
            ? {
                ...item,
                quantity,
                total: (item.total / item.quantity) * quantity,
              }
            : item,
        ),
      );
      return { previous };
    },
    onError: (err, _variables, context) => {
      rollback(context);
      toast.error(err?.message ?? cartMessages.updateFailed);
    },
    onSettled: (_data, _err, { productId }) => settle(productId),
  });

  const remove = useMutation({
    mutationKey: CART_MUTATION,
    mutationFn: removeCartItem,
    onMutate: async (productId) => {
      const previous = await snapshot();
      mark(productId, "remove");
      patchItems((items) =>
        items.filter((item) => item.product?.id !== productId),
      );
      return { previous };
    },
    onError: (err, _variables, context) => {
      rollback(context);
      toast.error(err?.message ?? cartMessages.removeFailed);
    },
    onSuccess: () => toast.success(cartMessages.removed),
    onSettled: (_data, _err, productId) => settle(productId),
  });

  const wipe = useMutation({
    mutationKey: CART_MUTATION,
    mutationFn: clearCart,
    onMutate: async () => {
      const previous = await snapshot();
      patchItems(() => []);
      return { previous };
    },
    onError: (err, _variables, context) => {
      rollback(context);
      toast.error(err?.message ?? cartMessages.clearFailed);
    },
    onSettled: () => settle(),
  });

  const items = useMemo(() => cart.data?.data?.items ?? [], [cart.data]);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.quantity, 0),
      total: cart.data?.data?.total ?? 0,
      isLoading: cart.isPending && Boolean(user),
      isClearing: wipe.isPending,
      busyOf: (productId) => busy[productId],
      addItem: (product, quantity = 1) =>
        add.mutate({ productId: product.id, quantity }),
      setQuantity: (productId, quantity) =>
        update.mutate({ productId, quantity }),
      removeItem: (productId) => remove.mutate(productId),
      clear: () => wipe.mutate(),
    }),
    [items, cart.data, cart.isPending, user, busy, add, update, remove, wipe],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
