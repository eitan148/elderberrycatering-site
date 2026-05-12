import "server-only";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "content");

export type PageRecord = {
  slug: string;
  url_original: string;
  is_homepage?: boolean;
  is_contact?: boolean;
  meta: {
    title: string;
    description: string;
    og_image?: string;
    canonical: string;
  };
  h1: string;
  h1_subtitle_html?: string;
  h1_subtitle_text?: string;
  h2_title_repeat?: string;
  body_html?: string;
  body_html_left?: string;
  body_html_right?: string;
  forms?: unknown[];
  jsonld?: unknown[];
  content_hashes?: Record<string, string>;
};

export type ChromeBlocks = {
  cta_strip_1: string;
  intro: string;
  why_us: string;
  service: string;
  gallery: string;
  cta_strip_2: string;
  related_posts_wrapper: string;
  pagination_template: string;
  hero_template: string;
  title_repeat_template: string;
  header_html?: string;
  footer_html?: string;
  sticky_bars?: string[];
  a11y_toolbar?: string;
  body_classes?: string;
};

const pageCache = new Map<string, PageRecord | null>();
let chromeCache: ChromeBlocks | null = null;
let cssListCache: string[] | null = null;

function readJSON<T>(rel: string): T | null {
  try {
    const raw = fs.readFileSync(path.join(ROOT, rel), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function readDirSafe(rel: string): string[] {
  try {
    return fs.readdirSync(path.join(ROOT, rel)).filter((f) => f.endsWith(".json"));
  } catch {
    return [];
  }
}

export function getHome(): PageRecord | null {
  return getPageBySlug("home");
}

export function getPageBySlug(slug: string): PageRecord | null {
  const decoded = (() => { try { return decodeURIComponent(slug); } catch { return slug; } })();
  const candidates = Array.from(new Set([
    slug,
    decoded,
    encodeURIComponent(decoded).toLowerCase(),
    encodeURIComponent(decoded),
  ]));
  for (const c of candidates) {
    const key = `pages/${c}.json`;
    if (pageCache.has(key)) {
      const cached = pageCache.get(key)!;
      if (cached) return cached;
      continue;
    }
    const r = readJSON<PageRecord>(`pages/${c}.json`);
    pageCache.set(key, r);
    if (r) return r;
  }
  return null;
}

export function listAllPages(): PageRecord[] {
  const out: PageRecord[] = [];
  for (const f of readDirSafe("pages")) {
    const r = readJSON<PageRecord>(`pages/${f}`);
    if (r) out.push(r);
  }
  return out;
}

export function listAllRoutableSlugs(): { slug: string; type: "page" | "post"; isHomepage?: boolean; isContact?: boolean }[] {
  const pages = listAllPages();
  return pages
    .filter((p) => p.slug !== "home")
    .map((p) => ({ slug: p.slug, type: "page" as const, isHomepage: !!p.is_homepage, isContact: !!p.is_contact }));
}

export function getChrome(): ChromeBlocks {
  if (chromeCache) return chromeCache;
  const c = readJSON<ChromeBlocks>("chrome.json");
  if (!c) {
    chromeCache = { cta_strip_1: "", intro: "", why_us: "", service: "", gallery: "", cta_strip_2: "", related_posts_wrapper: "", pagination_template: "", hero_template: "", title_repeat_template: "", header_html: "", footer_html: "", sticky_bars: [], a11y_toolbar: "", body_classes: "" };
  } else {
    chromeCache = c;
  }
  return chromeCache;
}

export function listSourceStylesheets(): string[] {
  if (cssListCache) return cssListCache;
  try {
    const dir = path.join(process.cwd(), "public", "css");
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".css")).sort();
    cssListCache = files.map((f) => `/css/${f}`);
  } catch {
    cssListCache = [];
  }
  return cssListCache;
}

/** Substitute the H1 text within the homepage hero outerHTML, preserving wrapper styling. */
export function substituteH1(heroOuterHTML: string, newH1: string, newSubtitleHTML?: string): string {
  if (!heroOuterHTML) return "";
  let html = heroOuterHTML;
  html = html.replace(/(<h1[^>]*>)([\s\S]*?)(<\/h1>)/, `$1${escapeHTML(newH1)}$3`);
  if (newSubtitleHTML) {
    html = html.replace(/(<p[^>]*>)([\s\S]*?)(<\/p>)/, `$1${newSubtitleHTML}$3`);
  }
  return html;
}

export function substituteH2(html: string, newH2: string): string {
  if (!html) return "";
  return html.replace(/(<h2[^>]*>)([\s\S]*?)(<\/h2>)/, `$1${escapeHTML(newH2)}$3`);
}

function escapeHTML(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Rewrite absolute https://www.elderberrycatering.com/wp-content/... URLs in HTML to local /images/ paths via the asset-map. */
export function rewriteAssetUrls(html: string, assetMap: Record<string, string>): string {
  if (!html) return "";
  return html.replace(/https?:\/\/www\.elderberrycatering\.com\/wp-content\/uploads\/[^\s"'>)]+/g, (m) => {
    const cleaned = m.replace(/\?.*$/, "");
    const local = assetMap[m] || assetMap[cleaned];
    return local || m;
  });
}
