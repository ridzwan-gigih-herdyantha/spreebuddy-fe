import Select from "@/components/ui/Select";
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

      <Select
        label="Sort"
        value={sort}
        options={sortOptions}
        onChange={onSort}
      />
    </div>
  );
}
