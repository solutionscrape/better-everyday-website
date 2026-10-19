# Verification record

Local verification, October 19, 2026:

- `npm run check`: passed. Zero package dependencies.
- Eight pages and the 404 page: unique titles; one H1 and main landmark; HTML language; descriptions and organization structured data on the eight main pages.
- All internal links, fragment targets, stylesheets, scripts and images resolve inside the built publish directory.
- All eight pages expose the same primary navigation and mark their own current page.
- Every image has alt text and dimensions; images and fonts are self-hosted.
- Menu interaction tests: initial mobile collapse, toggle open/close, Escape closes and restores toggle focus, desktop navigation stays visible, resize back to mobile collapses correctly.
- Text token contrast: brand-blue buttons use dark labels; primary and muted copy pass AA on the specified surfaces. Focus styling, 44px controls, semantic native details/summary controls and reduced-motion rules are included.
- Netlify TOML parses; legacy alias targets exist; commerce/blog/cart redirects remain external and do not force-shadow local pages. A real custom 404 is supplied.

Fresh HTTP checks returned 200 for the existing contact page, store, Chapter 2 product, community page and first featured article. The existing contact HTML contains a configured Squarespace contact form (`formName: Contact`, `useFormsJs: true`); its rendering and submission were not browser-tested. `/services` returned 404, so enrollment uses the verified store instead. These are reachability checks, not payment, email-delivery or submission tests.

## Verification limits

Browser control was not available in this environment. Visual viewport checks, browser focus behavior, screen-reader output and hosted Netlify routing/headers have not been exercised. The menu tests run against a DOM stub and do not replace browser checks. No public deployment or domain cutover was performed. See deployment decisions before production.
