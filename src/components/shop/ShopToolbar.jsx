import { shopContent, sortOptions } from "@/data/shop";

export default function ShopToolbar({
  categories,
  category,
  onCategory,
  sort,
  onSort,
}) {
  return (
    <div className="sb-card sb-shop-toolbar">
      <div className="d-flex flex-wrap gap-2">
        {[shopContent.allCategories, ...categories].map((name) => (
          <button
            key={name}
            type="button"
            className={`sb-pill ${category === name ? "sb-pill-gradient" : "sb-pill-outline"}`}
            onClick={() => onCategory(name)}
          >
            {name}
          </button>
        ))}
      </div>

      <label className="sb-shop-sort">
        <span className="sb-meta">Sort</span>
        <select
          className="sb-input"
          value={sort}
          onChange={(e) => onSort(e.target.value)}
        >
          {sortOptions.map(({ id, label }) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
