import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getHome } from "@/lib/content-store";
import { PageShell } from "@/components/PageShell";

export async function generateMetadata(): Promise<Metadata> {
  const page = getHome();
  if (!page) return {};
  return {
    title: page.meta.title || undefined,
    description: page.meta.description || undefined,
    alternates: { canonical: page.meta.canonical || "/" },
    openGraph: page.meta.og_image
      ? { images: [{ url: page.meta.og_image }] }
      : undefined,
  };
}

export default function HomePage() {
  const page = getHome();
  if (!page) notFound();
  return <PageShell page={page} />;
}
