import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import ShopCard from "@/components/shop/ShopCard";
import ShopToolbar from "@/components/shop/ShopToolbar";
import { listCategories, listProducts } from "@/api/products";
import { addToWishlist, removeFromWishlist } from "@/api/wishlist";
import { currentPrice } from "@/utils/format";
import { PAGE_SIZE, shopContent } from "@/data/shop";

const sorters = {
  "price-asc": (a, b) => currentPrice(a) - currentPrice(b),
  "price-desc": (a, b) => currentPrice(b) - currentPrice(a),
  name: (a, b) => a.name.localeCompare(b.name),
};

export default function Shop() {
  const { title, lead, askAi, allCategories, loadMore, empty } = shopContent;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [limit, setLimit] = useState(PAGE_SIZE);
  const [category, setCategory] = useState(allCategories);
  const [sort, setSort] = useState("relevance");
  const [wishlisted, setWishlisted] = useState({});

  const products = useQuery({
    queryKey: ["products", limit],
    queryFn: () => listProducts({ page: 1, limit }),
    placeholderData: (previous) => previous,
  });

  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
    staleTime: 5 * 60 * 1000,
  });

  const toggleWishlist = useMutation({
    mutationFn: ({ id, saved }) =>
      saved ? removeFromWishlist(id) : addToWishlist(id),
    onSuccess: (_data, { id, saved }) => {
      setWishlisted((state) => ({ ...state, [id]: !saved }));
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
    onError: (err) => {
      if (err.status === 401) navigate("/login");
    },
  });

  const items = useMemo(() => products.data?.data ?? [], [products.data]);
  const total = products.data?.meta?.total ?? items.length;
  const hasMore = products.data?.meta?.hasNextPage ?? false;

  const categoryNames = useMemo(
    () => (categories.data?.data ?? []).map(({ name }) => name),
    [categories.data],
  );

  const visible = useMemo(() => {
    const filtered =
      category === allCategories
        ? items
        : items.filter((product) => product.category === category);
    return sorters[sort] ? [...filtered].sort(sorters[sort]) : filtered;
  }, [items, category, sort, allCategories]);

  return (
    <section className="sb-section">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
        <div>
          <h1 className="sb-h1 mb-1">{title}</h1>
          <p className="sb-lead mb-0">{lead}</p>
        </div>
        <Link to={askAi.to} className="sb-pill sb-pill-outline text-nowrap">
          <i className="bi bi-stars" /> {askAi.label}
        </Link>
      </div>

      <ShopToolbar
        categories={categoryNames}
        category={category}
        onCategory={setCategory}
        sort={sort}
        onSort={setSort}
      />

      {products.isPending && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 mt-0">
          {Array.from({ length: PAGE_SIZE }, (_, i) => (
            <div className="col" key={i}>
              <div className="sb-card sb-shop-skeleton" />
            </div>
          ))}
        </div>
      )}

      {products.isError && (
        <p className="sb-form-error mt-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill" />{" "}
          {products.error.message}
        </p>
      )}

      {products.isSuccess && visible.length === 0 && (
        <div className="text-center py-5">
          <h2 className="sb-h2 mb-2">{empty.title}</h2>
          <p className="sb-lead mb-0">{empty.lead}</p>
        </div>
      )}

      {visible.length > 0 && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4 mt-0">
          {visible.map((product) => (
            <div className="col" key={product.id}>
              <ShopCard
                product={product}
                wishlisted={Boolean(wishlisted[product.id])}
                onToggleWishlist={({ id }) =>
                  toggleWishlist.mutate({ id, saved: Boolean(wishlisted[id]) })
                }
              />
            </div>
          ))}
        </div>
      )}

      {products.isSuccess && (
        <div className="text-center mt-5">
          <p className="sb-meta mb-3">
            Showing {visible.length} of {total} products
          </p>
          {hasMore && (
            <button
              type="button"
              className="btn sb-btn-outline rounded-pill px-4"
              onClick={() => setLimit((value) => value + PAGE_SIZE)}
              disabled={products.isFetching}
            >
              {products.isFetching ? "Loading…" : loadMore}
            </button>
          )}
        </div>
      )}
    </section>
  );
}
