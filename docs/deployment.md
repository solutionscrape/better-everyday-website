# Decisions before production deployment

1. **Review on a separate hostname.** Connect Netlify for a deploy preview first. This change does not merge to `main`, create a hosting project, or deploy production.
2. **Resolve the legacy host before a domain cutover.** All external commerce/contact destinations currently use `www.mybettereveryday.org`. Moving that same domain to the new site would turn some CTAs into loops and remove access to existing forms/products. Verify a distinct Squarespace hostname (do not guess its account subdomain), then replace every legacy destination in HTML and Netlify redirects. Preserve the full paths and query behavior.
3. **Reconcile coaching offers.** The existing store lists Foundation/Legacy memberships; the recent package proposal differs. Confirm final packages, session duration, payment terms, scheduling/cancellation/refund terms and actual purchasable products before exposing prices or changing enrollment destinations. No installment plan or HubSpot billing feature is promised by this site.
4. **Confirm final image selection.** The site includes the October full logo, branded portrait, source soccer photograph, and existing book artwork. Review cropping on desktop/mobile and confirm approval for website use, including the youth photograph. Additional generated adaptive imagery is available but remains unselected.
5. **Review claims and copy.** Confirm James’s current credential status, preferred contact address, service area, and the concise service descriptions. No testimonials, client counts, or guaranteed outcomes are included.
6. **Complete live QA.** Check mobile navigation at 375/768px and desktop at 1440px, keyboard focus, zoom/reflow, screen-reader navigation, image crops, and Netlify redirects/custom 404 responses. Automated source checks are not a browser accessibility audit.
7. **Exercise external workflows.** On their actual hosts, verify the correct enrollment product, cart/session continuity, book purchase, chapter delivery and form submission. Confirm receipt and consent handling with the business owner. No purchases or test inquiries were sent during implementation.
8. **Set production identity.** After the final domain is decided, add canonical URLs, absolute social-preview images, sitemap and search-console configuration. Those values are intentionally not guessed. Review privacy/consent requirements before adding analytics, HubSpot or Stripe scripts; none is currently installed.

## Route contract

| Request | Expected behavior |
| --- | --- |
| `/` | Home |
| `/work-with-james/`, `/book-shop/`, `/community/`, `/about/`, `/blog/`, `/resources/`, `/contact/` | Matching static page |
| `/services` | 301 to local `/work-with-james/` |
| `/store` | 301 to local `/book-shop/` |
| `/store/p/...` | 302 to matching existing Squarespace product |
| `/blog/article-slug` | 302 to matching existing Squarespace article |
| `/cart` | 302 to existing Squarespace cart |
| `/speaking-engagements` | 302 to existing Squarespace page |
| Unknown path | Netlify serves custom `404.html` with 404 status |

File shadowing is intentional: existing `/blog/index.html` takes priority over the unforced `/blog/*` rule. No SPA fallback is used. Directory indexes work with standard static hosting; Netlify legacy redirects require Netlify itself.
