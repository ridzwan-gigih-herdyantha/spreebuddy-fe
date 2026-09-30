import { SITE_URL, routeSeoFor, siteSeo } from "@/config/seo";

const DESCRIPTION_LIMIT = 160;

export const absoluteUrl = (value) => {
  if (!value) return SITE_URL || window.location.origin;
  if (/^https?:\/\//i.test(value)) return value;
  const base = SITE_URL || window.location.origin;
  return `${base}${value.startsWith("/") ? "" : "/"}${value}`;
};

// Search results cut descriptions around 160 characters; ending on a word
// reads better than a hard cut.
export function summarize(text, limit = DESCRIPTION_LIMIT) {
  const clean = String(text ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (clean.length <= limit) return clean;
  const cut = clean.slice(0, limit - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,.;:]$/, "")}…`;
}

function upsert(selector, create, attribute, value) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

const meta = (key, value, attribute = "name") =>
  upsert(
    `meta[${attribute}="${key}"]`,
    () => {
      const element = document.createElement("meta");
      element.setAttribute(attribute, key);
      return element;
    },
    "content",
    value,
  );

function write(pathname, entry) {
  const title = entry.title
    ? siteSeo.titleTemplate.replace("%s", entry.title)
    : siteSeo.title;
  const description = entry.description ?? siteSeo.description;
  const canonical = absoluteUrl(entry.canonical ?? pathname);
  const image = absoluteUrl(entry.image ?? siteSeo.image);
  const imageAlt = entry.imageAlt ?? (entry.image ? title : siteSeo.imageAlt);

  document.title = title;
  meta("description", description);
  meta("robots", entry.noindex ? "noindex, follow" : "index, follow");

  upsert(
    'link[rel="canonical"]',
    () => {
      const element = document.createElement("link");
      element.setAttribute("rel", "canonical");
      return element;
    },
    "href",
    canonical,
  );

  meta("og:type", entry.type ?? "website", "property");
  meta("og:title", title, "property");
  meta("og:description", description, "property");
  meta("og:url", canonical, "property");
  meta("og:image", image, "property");
  meta("og:image:alt", imageAlt, "property");
  meta("twitter:title", title);
  meta("twitter:description", description);
  meta("twitter:image", image);
  meta("twitter:image:alt", imageAlt);

  // Only the page's own structured data is swapped; the site-wide block that
  // ships in index.html is left alone.
  document.head
    .querySelectorAll('script[type="application/ld+json"][data-page]')
    .forEach((element) => element.remove());

  if (entry.jsonLd) {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.dataset.page = "";
    script.textContent = JSON.stringify(entry.jsonLd);
    document.head.appendChild(script);
  }
}

// Two writers share the head: the route table on every navigation, and a page
// once its data arrives. Whichever effect runs first in a commit, the page must
// win for its own path, so a page claims the path and the route table leaves a
// claimed path alone until the visitor goes somewhere else.
let claimed = null;

export function applyRouteSeo(pathname) {
  if (claimed === pathname) return;
  claimed = null;
  write(pathname, routeSeoFor(pathname));
}

export function applyPageSeo(pathname, entry) {
  claimed = pathname;
  write(pathname, { ...routeSeoFor(pathname), ...entry });
}
