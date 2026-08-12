import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Select from "@/components/ui/Select";
import WishlistCard from "@/components/wishlist/WishlistCard";
import { listWishlist, removeFromWishlist } from "@/api/wishlist";
import { currentPrice } from "@/utils/format";
import { useAuth } from "@/hooks/useAuth";
import {
  COMPARE_MAX,
  wishlistContent,
  wishlistSortOptions,
} from "@/data/wishlist";

const WISHLIST_KEY = ["wishlists"];
const REMOVE_MUTATION = ["wishlists", "remove"];

const sorters = {
  "price-asc": (a, b) => currentPrice(a.product) - currentPrice(b.product),
  "price-desc": (a, b) => currentPrice(b.product) - currentPrice(a.product),
  name: (a, b) => (a.product?.name ?? "").localeCompare(b.product?.name ?? ""),
};

export default function Wishlist() {
  const content = wishlistContent;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [category, setCategory] = useState(content.allCategories);
  const [sort, setSort] = useState("recent");
  const [selected, setSelected] = useState([]);
  const [removing, setRemoving] = useState({});

  const wishlist = useQuery({
    queryKey: WISHLIST_KEY,
    queryFn: listWishlist,
    enabled: Boolean(user),
    retry: false,
  });

  const remove = useMutation({
    mutationKey: REMOVE_MUTATION,
    mutationFn: removeFromWishlist,
    onMutate: async (productId) => {
      await queryClient.cancelQueries({ queryKey: WISHLIST_KEY });
      const previous = queryClient.getQueryData(WISHLIST_KEY);

      setRemoving((state) => ({ ...state, [productId]: true }));
      queryClient.setQueryData(WISHLIST_KEY, (old) => ({
        ...old,
        data: (old?.data ?? []).filter(
          (entry) => entry.product?.id !== productId,
        ),
      }));

      return { previous };
    },
    onError: (_err, _productId, context) => {
      if (context?.previous)
        queryClient.setQueryData(WISHLIST_KEY, context.previous);
    },
    onSettled: (_data, _err, productId) => {
      setRemoving((state) => {
        const next = { ...state };
        delete next[productId];
        return next;
      });
      if (queryClient.isMutating({ mutationKey: REMOVE_MUTATION }) === 1) {
        queryClient.invalidateQueries({ queryKey: WISHLIST_KEY });
      }
    },
  });

  const entries = useMemo(
    () => (wishlist.data?.data ?? []).filter((entry) => entry.product),
    [wishlist.data],
  );

  const categories = useMemo(
    () =>
      [...new Set(entries.map((entry) => entry.product.category))].filter(
        Boolean,
      ),
    [entries],
  );

  const visible = useMemo(() => {
    const filtered =
      category === content.allCategories
        ? entries
        : entries.filter((entry) => entry.product.category === category);
    return sorters[sort] ? [...filtered].sort(sorters[sort]) : filtered;
  }, [entries, category, sort, content.allCategories]);

  if (!user) {
    return (
      <section className="sb-section text-center">
        <h1 className="sb-h1 mb-2">{content.signedOut.title}</h1>
        <p className="sb-lead sb-measure mx-auto mb-4">
          {content.signedOut.lead}
        </p>
        <Link to="/login" className="btn btn-primary rounded-pill px-4">
          Sign in
        </Link>
      </section>
    );
  }

  const toggleSelected = (id) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((value) => value !== id)
        : current.length < COMPARE_MAX
          ? [...current, id]
          : current,
    );

  return (
    <section className="sb-section">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <h1 className="sb-h1 mb-1">{content.title}</h1>
          <p className="sb-lead mb-0">
            {entries.length} {entries.length === 1 ? "item" : "items"} saved.{" "}
            {content.lead}
          </p>
        </div>

        <div className="d-flex flex-wrap gap-2">
          <button
            type="button"
            className="sb-pill sb-pill-outline"
            disabled={selected.length < 2}
            onClick={() => navigate(`/compare?ids=${selected.join(",")}`)}
          >
            {content.compare}
            {selected.length > 0 && ` (${selected.length})`}
          </button>
          <Link to={content.askAi.to} className="sb-pill sb-pill-outline">
            <i className="bi bi-stars" /> {content.askAi.label}
          </Link>
        </div>
      </div>

      {entries.length > 0 && (
        <div className="sb-card sb-shop-toolbar">
          <div className="d-flex flex-wrap gap-2">
            {[content.allCategories, ...categories].map((name) => (
              <button
                key={name}
                type="button"
                className={`sb-pill ${category === name ? "sb-pill-gradient" : "sb-pill-outline"}`}
                onClick={() => setCategory(name)}
              >
                {name}
              </button>
            ))}
          </div>

          <Select
            label="Sort"
            value={sort}
            options={wishlistSortOptions}
            onChange={setSort}
          />
        </div>
      )}

      {wishlist.isPending && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 mt-0">
          {Array.from({ length: 3 }, (_, i) => (
            <div className="col" key={i}>
              <div className="sb-card sb-shop-skeleton" />
            </div>
          ))}
        </div>
      )}

      {wishlist.isError && (
        <p className="sb-form-error mt-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />{" "}
          {wishlist.error.message}
        </p>
      )}

      {wishlist.isSuccess && visible.length === 0 && (
        <div className="text-center py-5">
          <h2 className="sb-h2 mb-2">{content.empty.title}</h2>
          <p className="sb-lead mb-4">{content.empty.lead}</p>
          <Link
            to={content.empty.action.to}
            className="btn btn-primary rounded-pill px-4"
          >
            {content.empty.action.label}
          </Link>
        </div>
      )}

      {visible.length > 0 && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-4 mt-0">
          {visible.map((entry) => (
            <div className="col" key={entry.id}>
              <WishlistCard
                entry={entry}
                selected={selected.includes(entry.product.id)}
                removing={Boolean(removing[entry.product.id])}
                onSelect={() => toggleSelected(entry.product.id)}
                onRemove={() => remove.mutate(entry.product.id)}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
