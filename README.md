# Better Everyday Website

Website for Better Everyday Athletics and James Anderson, CSCS. Built with Vite + React from the
Claude Design prototype `Better Everyday Site.dc.html` and the Better Everyday design system.

## Pages (hash routes)

| Route | Page |
|---|---|
| `#home` | Home: lede, hero photo, stats, ways to work with James, coach bio, testimonials, kite photo, book band (`#book`) |
| `#services` | Work With James: session packages (`#memberships` scrolls to them), coach headshot, FAQ |
| `#contact` | Contact form (Netlify Forms), email, phone, service area, community photo |
| `#blog`, `#blog/<slug>` | Blog index and all 11 migrated posts |
| `#store`, `#store/<id>` | Store with Publications / Swag / Packages filter; product pages with size picker |
| `#portal`, `#portal/<tab>` | Client portal sign-in and dashboard (**sample data only**, see below) |

## Develop

```sh
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs dist/
```

In `npm run dev` the contact form and checkout show their success states without a backend.
In production they report an error if the backend call fails, so no message or order is lost silently.

## Project layout

- `src/ds/` — design-system components ported from the Claude Design bundle (Button, Lede, Plate, Split, SiteRail…). Styles are kept identical to the source.
- `src/styles/tokens/` — design tokens (colors, type, spacing…). `src/styles/global.css` holds the site-level overrides: photo framing, the responsive rail and phone layouts.
- `src/data/catalog.js` — **single source of truth** for packages, products and prices. The checkout function imports it too.
- `src/data/site.js` — contact details, service area, image paths, nav.
- `src/data/blog-posts.json` — migrated blog content.
- `src/pages/` — pages; `src/pages/portal/` — client portal.
- `netlify/functions/checkout.mjs` — HubSpot checkout (`POST /api/checkout`).

## Deploy (Netlify)

`netlify.toml` builds with `npm run build`, publishes `dist/` and deploys functions from `netlify/functions/`.

### Contact form

Uses Netlify Forms (form name `contact`). Submissions appear under **Forms** in the Netlify dashboard;
add an email notification there so James gets each message.

### HubSpot setup (checkout)

1. In HubSpot, create a **private app** with the scopes `crm.objects.contacts.write`,
   `crm.objects.deals.write` and `crm.objects.line_items.write`.
2. In Netlify, set the `HUBSPOT_ACCESS_TOKEN` environment variable to the app's token.
   Optional: `HUBSPOT_PIPELINE` (default `default`) and `HUBSPOT_DEAL_STAGE` (default `appointmentscheduled`).
3. Create a HubSpot **workflow** triggered when a deal named `Website order · …` is created that emails the
   contact a payment link (HubSpot Payments or Stripe). For `Free chapter request · …` deals, email the chapter PDF.

On checkout the function upserts the contact by email, creates a deal and adds a line item per cart line,
priced from `src/data/catalog.js`. Until the token is set, checkout returns "not configured" and the
cart shows an error with James's email address.

If you later generate payment links directly, return the URL as `paymentUrl` from the function and the
site redirects there automatically.

## Known gaps

- **Client portal** is a front-end prototype with four demo logins (password `demo1234` for all; listed on the sign-in page):
  - `jordan@example.com`: Jordan Morgan, youth client, Build Momentum (10 sessions)
  - `alex@example.com`: Alex Morgan, Jordan's parent, sees Jordan's account
  - `margaret@example.com`: Margaret Ellis, senior balance training, Long-Term Commitment (20 sessions, paid in full)
  - `sam@example.com`: Sam Rivera, virtual client, Get Started (5 sessions)

  Credentials are checked in the browser and the passwords ship with the site, so they are not secure. All data is sample content (`src/pages/portal/data.js`) and changes reset on reload. A real version needs accounts (e.g. Supabase auth), a database, and package/billing status from HubSpot. Download links are placeholders until the PDFs exist.
- **Blog photos** still load from Squarespace. Run `npm run fetch-blog-images` (with internet access) to copy them into `public/img/blog/` and repoint the posts, **before** the Squarespace site is closed.
- **Hoodie sizes** reuse the tee's XS–5XL run; please confirm with James.
