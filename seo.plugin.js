import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Pages worth a place in search results. Private and transactional routes are
// left out here and disallowed in robots.txt.
const STATIC_ROUTES = [
  { loc: "/", priority: "1.0", changefreq: "daily" },
  { loc: "/shop", priority: "0.9", changefreq: "daily" },
  { loc: "/about", priority: "0.5", changefreq: "monthly" },
  { loc: "/help", priority: "0.5", changefreq: "monthly" },
  { loc: "/blog", priority: "0.5", changefreq: "weekly" },
  { loc: "/careers", priority: "0.3", changefreq: "weekly" },
  { loc: "/contact", priority: "0.3", changefreq: "yearly" },
  { loc: "/status", priority: "0.2", changefreq: "daily" },
  { loc: "/privacy", priority: "0.2", changefreq: "yearly" },
  { loc: "/terms", priority: "0.2", changefreq: "yearly" },
];

const PAGE_LIMIT = 100;
const MAX_PAGES = 50;
const FETCH_TIMEOUT = 15_000;

// VITE_SITE_URL wins when set. On Vercel the production domain is always
// available at build time, so a deploy can never ship a literal placeholder.
export function resolveSiteUrl(env) {
  const explicit = env.VITE_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return null;
}

const escapeXml = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

// The API sends DD/MM/YYYY; a sitemap wants W3C dates.
const toW3cDate = (value) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value ?? "");
  return match ? `${match[3]}-${match[2]}-${match[1]}` : null;
};

async function fetchJson(url) {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT),
  });
  if (!response.ok) throw new Error(`${response.status} for ${url}`);
  return response.json();
}

async function fetchAll(apiBase, resource) {
  const items = [];
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const body = await fetchJson(
      `${apiBase}/api/v1/${resource}?page=${page}&limit=${PAGE_LIMIT}`,
    );
    items.push(...(body.data ?? []));
    if (!body.meta?.hasNextPage) break;
  }
  return items;
}

function urlEntry(siteUrl, { loc, lastmod, changefreq, priority, images = [] }) {
  const lines = [`    <loc>${escapeXml(`${siteUrl}${loc}`)}</loc>`];
  if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`);
  if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);
  if (priority) lines.push(`    <priority>${priority}</priority>`);
  for (const image of images) {
    lines.push(
      `    <image:image><image:loc>${escapeXml(image)}</image:loc></image:image>`,
    );
  }
  return `  <url>\n${lines.join("\n")}\n  </url>`;
}

export default function seoPlugin() {
  let config;

  return {
    name: "spreebuddy-seo",
    apply: "build",

    configResolved(resolved) {
      config = resolved;
    },

    // The catalogue lives behind the API, so product and category URLs are
    // read at build time. If the API is unreachable the build still succeeds
    // with the static pages, and says so, rather than failing the deploy.
    async closeBundle() {
      const siteUrl = config.env.VITE_SITE_URL;
      const apiBase = String(config.env.VITE_API_BASE_URL ?? "").replace(
        /\/+$/,
        "",
      );
      const outDir = path.resolve(config.root, config.build.outDir);
      const entries = [...STATIC_ROUTES];

      if (apiBase) {
        try {
          const [products, categories] = await Promise.all([
            fetchAll(apiBase, "products"),
            fetchAll(apiBase, "categories"),
          ]);

          for (const category of categories) {
            entries.push({
              loc: `/shop?category=${encodeURIComponent(category.name)}`,
              changefreq: "weekly",
              priority: "0.7",
            });
          }
          for (const product of products) {
            entries.push({
              loc: `/product/${encodeURIComponent(product.slug)}`,
              lastmod: toW3cDate(product.updatedAt),
              changefreq: "weekly",
              priority: "0.8",
              images: (product.images ?? []).slice(0, 5),
            });
          }

          config.logger.info(
            `[seo] sitemap: ${products.length} products, ${categories.length} categories`,
          );
        } catch (error) {
          config.logger.warn(
            `[seo] catalogue unavailable, sitemap has static pages only (${error.message})`,
          );
        }
      }

      const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"',
        '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
        ...entries.map((entry) => urlEntry(siteUrl, entry)),
        "</urlset>",
        "",
      ].join("\n");
      await writeFile(path.join(outDir, "sitemap.xml"), sitemap);

      const robotsPath = path.join(outDir, "robots.txt");
      const robots = await readFile(robotsPath, "utf8").catch(() => "");
      const withoutSitemap = robots
        .split(/\r?\n/)
        .filter((line) => !/^sitemap:/i.test(line.trim()))
        .join("\n")
        .trimEnd();
      await writeFile(
        robotsPath,
        `${withoutSitemap}\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
      );
    },
  };
}
