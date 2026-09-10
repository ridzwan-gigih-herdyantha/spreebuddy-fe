import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@/components/ui/Skeleton";
import { listCategories } from "@/api/categories";
import { searchablePages } from "@/config/navigation";
import { globalSearchContent } from "@/data/search";

const MIN_CHARS = 2;

const IS_APPLE =
  typeof navigator !== "undefined" &&
  /Mac|iPhone|iPad|iPod/i.test(navigator.userAgent);

const SHORTCUT_KEY = IS_APPLE ? "⌘" : "Ctrl";
const MAX_PAGES = 4;
const MAX_CATEGORIES = 5;
const CATEGORY_TTL = 5 * 60 * 1000;

export default function GlobalSearch() {
  const content = globalSearchContent;
  const navigate = useNavigate();
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inputRef = useRef(null);
  const query = useDeferredValue(term.trim());

  // Cmd+K on Apple keyboards, Ctrl+K everywhere else.
  useEffect(() => {
    const onKeyDown = (event) => {
      if (
        !(event.metaKey || event.ctrlKey) ||
        event.key.toLowerCase() !== "k"
      ) {
        return;
      }
      event.preventDefault();
      setOpen(true);
      inputRef.current?.focus();
      inputRef.current?.select();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return;

    const close = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const pages = useMemo(() => {
    const needle = query.toLowerCase();
    if (needle.length < MIN_CHARS) return [];
    return searchablePages
      .filter(({ label, keywords }) =>
        `${label} ${keywords ?? ""}`.toLowerCase().includes(needle),
      )
      .slice(0, MAX_PAGES);
  }, [query]);

  // One cached list, filtered in the browser. Categories are a short, slow
  // moving set, so this never grows with the catalogue.
  const categories = useQuery({
    queryKey: ["categories"],
    queryFn: listCategories,
    enabled: open,
    staleTime: CATEGORY_TTL,
    retry: false,
  });

  const matches = useMemo(() => {
    const needle = query.toLowerCase();
    if (needle.length < MIN_CHARS) return [];
    return (categories.data?.data ?? [])
      .filter(({ name }) => name.toLowerCase().includes(needle))
      .slice(0, MAX_CATEGORIES);
  }, [categories.data, query]);

  const active = open && query.length >= MIN_CHARS;
  const loading = categories.isPending && categories.isFetching;
  const empty = !loading && pages.length === 0 && matches.length === 0;

  const go = (to) => {
    setOpen(false);
    setTerm("");
    navigate(to);
  };

  return (
    <div className="sb-globalsearch" ref={ref}>
      <input
        ref={inputRef}
        type="search"
        className="sb-search form-control bg-body-secondary border-0 rounded-pill"
        placeholder={content.placeholder}
        aria-label={content.placeholder}
        value={term}
        role="combobox"
        aria-expanded={active}
        aria-controls="sb-search-results"
        onChange={(event) => {
          setTerm(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            event.currentTarget.blur();
          }
          if (event.key === "Enter" && query.length >= MIN_CHARS) {
            event.preventDefault();
            go(`/shop?search=${encodeURIComponent(query)}`);
          }
        }}
      />

      {!term && (
        <kbd className="sb-search-kbd" aria-hidden="true">
          {SHORTCUT_KEY}
          <span>K</span>
        </kbd>
      )}

      {active && (
        <div className="sb-search-panel" id="sb-search-results" role="listbox">
          {pages.length > 0 && (
            <>
              <p className="sb-search-group">{content.pages}</p>
              {pages.map(({ label, to, icon }) => (
                <button
                  key={to}
                  type="button"
                  role="option"
                  aria-selected="false"
                  className="sb-search-item"
                  onClick={() => go(to)}
                >
                  <span className="sb-search-icon">
                    <i className={`bi ${icon}`} />
                  </span>
                  <span className="text-truncate">{label}</span>
                  <span className="sb-search-hint">{to}</span>
                </button>
              ))}
            </>
          )}

          <p className="sb-search-group">{content.categories}</p>

          {loading &&
            Array.from({ length: 3 }, (_, index) => (
              <div className="sb-search-item is-static" key={index}>
                <Skeleton width={32} height={32} radius={8} />
                <Skeleton height={12} />
              </div>
            ))}

          {!loading &&
            matches.map(({ id, name }) => (
              <button
                key={id ?? name}
                type="button"
                role="option"
                aria-selected="false"
                className="sb-search-item"
                onClick={() => go(`/shop?category=${encodeURIComponent(name)}`)}
              >
                <span className="sb-search-icon">
                  <i className="bi bi-tags" />
                </span>
                <span className="text-truncate">{name}</span>
                <span className="sb-search-hint">{content.browse}</span>
              </button>
            ))}

          {!loading && matches.length === 0 && pages.length > 0 && (
            <p className="sb-search-none">{content.noCategories}</p>
          )}

          {empty && <p className="sb-search-none">{content.nothing}</p>}

          <button
            type="button"
            className="sb-search-all"
            onClick={() => go(`/shop?search=${encodeURIComponent(query)}`)}
          >
            {content.searchShop.replace("{term}", query)}
            <i className="bi bi-arrow-right" />
          </button>
        </div>
      )}
    </div>
  );
}
