import Select from "@/components/ui/Select";

export default function FilterBar({
  search,
  onSearch,
  searchPlaceholder = "Search",
  chips = [],
  active,
  onChip,
  sort,
  sortOptions,
  onSort,
  trailing,
}) {
  return (
    <div className="sb-card sb-filterbar">
      {onSearch && (
        <label className="sb-filterbar-search">
          <i className="bi bi-search" />
          <input
            type="search"
            value={search}
            placeholder={searchPlaceholder}
            onChange={(event) => onSearch(event.target.value)}
          />
        </label>
      )}

      {chips.length > 0 && (
        <div className="d-flex flex-wrap gap-2">
          {chips.map((name) => (
            <button
              key={name}
              type="button"
              className={`sb-pill ${active === name ? "sb-pill-gradient" : "sb-pill-outline"}`}
              onClick={() => onChip(name)}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      {sortOptions && (
        <Select value={sort} options={sortOptions} onChange={onSort} />
      )}

      {trailing && <span className="sb-filterbar-trailing">{trailing}</span>}
    </div>
  );
}
