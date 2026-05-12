import type { PageRecord } from "@/lib/content-store";

export function ContactShell({ page }: { page: PageRecord }) {
  return (
    <main className="page-shell page-shell--contact" dir="rtl">
      {page.body_html_left ? (
        <div className="wp-html-section" data-section="contact-form" dangerouslySetInnerHTML={{ __html: page.body_html_left }} />
      ) : null}
      {page.body_html_right ? (
        <div className="wp-html-section" data-section="contact-cta" dangerouslySetInnerHTML={{ __html: page.body_html_right }} />
      ) : null}
    </main>
  );
}
