# Better Everyday website

Responsive static website for James Anderson and Better Everyday Athletics. Eight complete HTML pages are in `public/`: Home, Work With James, Book + Shop, Community, About, Blog, Resources, and Contact. Each page works without JavaScript; the small navigation script adds a collapsible mobile menu.

## Local development and checks

Requirements: Node 22+ and Python 3.11+; no third-party packages or install step.

```sh
npm run check
```

This builds `dist/`, crawls every HTML reference and anchor, checks navigation and metadata, validates Netlify configuration and text contrast, and exercises the mobile menu. JavaScript syntax is also checked. For manual local review after building, serve `dist/` with any static HTTP server, for example `python3 -m http.server 8000 --directory dist`. Root-relative links require HTTP; opening an HTML file with `file://` is not supported.

Edit HTML in `public/`, shared styles in `public/assets/styles.css`, and menu behavior in `public/assets/site.js`. Do not edit `dist/`; it is regenerated and ignored by Git. GitHub Actions runs the same checks on pushes and pull requests.

## Netlify

Connect this repository with build command `npm run check` and publish directory `dist`. These values are recorded in `netlify.toml`. Directory index pages supply real clean URLs, including trailing-slash requests. Netlify Pretty URLs handles normalization. Missing paths receive the custom `404.html`; there is no catch-all homepage rewrite.

Legacy `/services` and `/store` routes redirect to local coaching and book/shop pages. Existing product, article, cart, and speaking links redirect to the live Squarespace destinations. Actual checkout, enrollment, chapter delivery, contact submissions, and community support remain external. No payment or CRM integration is claimed.

**Do not cut over `www.mybettereveryday.org` to this build yet.** External actions still depend on Squarespace at that address. First establish and verify a separate legacy commerce/form host, update all corresponding links and redirect destinations, then test checkout, delivery, and inquiry workflows end to end. A separate Netlify preview hostname is suitable for review.

## Brand and content

October 12, 2026 materials supersede the old README: official blue `#1e90d4`, sampled red `#fc1111`, dark canvas `#101012`, Barlow Condensed headings, and Inter body copy. The logo remains an image with its original proportions and color treatment. Fonts and images are self-hosted; font license files are included. Dark primary-button text meets AA contrast on the approved blue; white normal-size text on that blue would not.

No local prices, testimonials, purchase buttons that simulate checkout, or new credentials have been invented. Pricing is intentionally omitted because existing membership products and the proposed package model need reconciliation. Current enrollment continues through the existing store. The prior `/services` endpoint returned 404 during implementation, so it is not used as an external CTA.

See [source and asset provenance](docs/sources.md), [deployment decisions](docs/deployment.md), and [verification](docs/verification.md).
