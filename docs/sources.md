# Content and asset provenance

Reviewed October 19, 2026. Website copy is a concise adaptation of supplied requirements and the existing site, with no testimonials or numeric outcome claims.

| Source | Used for |
| --- | --- |
| Original repository README at commit `baa9661647e95bd6804fb0132d9aafc13095db2e` | Eight-page scope, two conversion paths, external workflow requirements |
| October 12 `Better_Everyday_Athletics_Claude_Brand_Kit.zip` | Logo master, palette, Barlow Condensed / Inter recommendations |
| October `BEA-Brand-Guide.pdf` | Confirmed user-specified blue `#1e90d4`; dark UI guidance |
| https://www.mybettereveryday.org/ | James’s name, audience, book link, coaching path, article titles and dates |
| https://www.mybettereveryday.org/about | CSCS, former RBT, founder and inclusive coaching background |
| https://www.mybettereveryday.org/store | Existing enrollment products, shop and free-chapter destination |
| https://www.mybettereveryday.org/contact | Existing contact form destination |
| https://www.mybettereveryday.org/community | Community landing destination |
| https://www.mybettereveryday.org/resources | Resource directory and three linked community organizations |

## Shipped assets

All raster files are WebP derivatives, resized/compressed only, without changes to faces or logo artwork.

| File in `public/assets/` | Source |
| --- | --- |
| `better-everyday-logo.webp` | October kit `assets/logo-original-black.png`; original full lockup |
| `james-anderson-coach.webp` | October 12 `james-anderson-BE-portrait-dark.jpg` |
| `better-everyday-community-soccer.webp` | October 12 source photograph `1(1).jpg` |
| `legacy-of-health-book.webp` | Existing store’s `Book+Launch+Promo+1.png`, source URL below |

Book artwork: https://images.squarespace-cdn.com/content/v1/680fdef6fd8b3c35206fea84/0b334c0c-a6fb-4603-998f-7367127f7db7/Book%2BLaunch%2BPromo%2B1.png

Selected portrait Library ID: `libfile_59c272d51f14819186d6fbe99f48be2e`.
Selected soccer photo Library ID: `libfile_017ec27c40a08191a3aa85180cedb6a2`.
Brand kit Library ID: `libfile_b3045eb4ac8481918a4c49ee24a3f3a2`.

Additional generated October adaptive-fitness imagery and headshot variants were located but are not shipped. Selection of final generated imagery remains open; these images are not represented as client outcomes or testimonials.

Fonts were downloaded from Google Fonts (Barlow Condensed 800, Inter 400/700), and are served locally. Original SIL Open Font License files are retained alongside them. Font-source stylesheet: https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;600;700&display=swap

## External actions

- Enrollment and shop: https://www.mybettereveryday.org/store
- Free Chapter 2 delivery: https://www.mybettereveryday.org/store/p/v1jqbt3qj2jpucoon3ffy6l2t38n7m
- Full book: https://www.amazon.com/Legacy-Health-Building-Longevity-Generation/dp/B0GDTJX4Z4/ (same product linked from existing homepage, tracking parameters removed)
- Contact form: https://www.mybettereveryday.org/contact
- Community support: https://www.mybettereveryday.org/community

The existing `/services` endpoint returned HTTP 404 in fresh checks, despite appearing in the existing homepage’s links and cached search content. The existing store returned HTTP 200 and listed Foundation/Legacy enrollment products. The implementation uses the functioning store for enrollment rather than copying older prices. A reachable page does not establish that checkout or form submission succeeds; those transactions were not performed.
