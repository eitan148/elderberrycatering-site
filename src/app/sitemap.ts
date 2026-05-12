import type { MetadataRoute } from "next";
import { listAllRoutableSlugs, getHome } from "@/lib/content-store";

const SITE = "https://www.elderberrycatering.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const out: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
  ];
  const home = getHome();
  if (home?.meta?.canonical) out[0].url = home.meta.canonical;

  const slugs = listAllRoutableSlugs();
  for (const s of slugs) {
    const url = `${SITE}/${encodeURIComponent(s.slug)}/`;
    out.push({
      url,
      lastModified: new Date(),
      changeFrequency: s.type === "post" ? "weekly" : "monthly",
      priority: s.type === "page" ? 0.8 : 0.6,
    });
  }
  return out;
}
