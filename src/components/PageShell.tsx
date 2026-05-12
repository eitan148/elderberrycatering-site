import { getChrome, substituteH1, substituteH2, type PageRecord } from "@/lib/content-store";

export function PageShell({ page }: { page: PageRecord }) {
  const chrome = getChrome();
  const heroHTML = substituteH1(chrome.hero_template, page.h1, page.h1_subtitle_html);
  const titleRepeatHTML = substituteH2(chrome.title_repeat_template, page.h2_title_repeat || page.h1);

  return (
    <main className="page-shell elementor elementor-87 elementor-location-single" data-elementor-type="single-post" data-elementor-id="87" dir="rtl">
      <RawHTML html={heroHTML} label="hero" />
      <RawHTML html={chrome.cta_strip_1} label="cta-1" />
      <RawHTML html={chrome.intro} label="intro" />
      <RawHTML html={chrome.why_us} label="why-us" />
      <RawHTML html={chrome.service} label="service" />
      <RawHTML html={chrome.gallery} label="gallery" />
      <RawHTML html={chrome.cta_strip_2} label="cta-2" />
      <RawHTML html={chrome.related_posts_wrapper} label="related-posts" />
      <RawHTML html={titleRepeatHTML} label="title-repeat" />
      {page.body_html ? <RawHTML html={page.body_html} label="seo-body" /> : null}
      <RawHTML html={chrome.pagination_template} label="pagination" />
    </main>
  );
}

function RawHTML({ html, label }: { html: string; label: string }) {
  if (!html) return null;
  return (
    <div className="wp-html-section" data-section={label} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
