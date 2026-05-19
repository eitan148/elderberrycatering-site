import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug, listAllRoutableSlugs } from "@/lib/content-store";
import { PageShell } from "@/components/PageShell";
import { ContactShell } from "@/components/ContactShell";

export const dynamicParams = true;     // allow runtime SSR for slugs added after build (N8N posts)
export const revalidate = false;       // static forever; revalidatePath() in API route triggers refresh on demand

export async function generateStaticParams() {
  const all = listAllRoutableSlugs();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) return {};
  return {
    title: page.meta.title || page.h1,
    description: page.meta.description || undefined,
    alternates: { canonical: page.meta.canonical || `/${page.slug}` },
    openGraph: page.meta.og_image
      ? { images: [{ url: page.meta.og_image }] }
      : undefined,
  };
}

export default async function DynamicPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const page = getPageBySlug(slug);
  if (!page) notFound();
  if (page.is_contact) return <ContactShell page={page} />;
  return <PageShell page={page} />;
}
