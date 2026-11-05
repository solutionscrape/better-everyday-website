// Single source of truth for everything that can go in the cart.
// Imported by the site AND by netlify/functions/checkout.mjs, so the server
// prices orders from this file and never trusts prices sent by the browser.

// Hoodie sizes were not on the captured store page; it reuses the tee's run. Confirm with James.
export const ADULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'];
export const YOUTH_SIZES = ['YXS', 'YS', 'YM', 'YL', 'YXL'];

/** Session packages: one-time purchases, no auto-renewal. */
export const PACKAGES = [
  {
    id: 'pkg-five',
    number: '01',
    title: 'Get Started — 5 Sessions',
    sessions: 5,
    price: 500,
    perSession: 100,
    installments: 'Or 2 payments of $250, when available.',
    save: 'Save $125',
    desc: 'A flexible way to begin, establish your goals, and see what works best for you.',
  },
  {
    id: 'pkg-ten',
    number: '02',
    title: 'Build Momentum — 10 Sessions',
    sessions: 10,
    price: 900,
    perSession: 90,
    installments: 'Or 3 payments of $300, when available.',
    save: 'Save $350',
    badge: 'Most recommended',
    featured: true,
    desc: 'Give yourself more opportunities to develop consistency, work toward your goals, and measure progress — all on your own schedule.',
  },
  {
    id: 'pkg-twenty',
    number: '03',
    title: 'Long-Term Commitment — 20 Sessions',
    sessions: 20,
    price: 1500,
    perSession: 75,
    installments: 'Or 3 payments of $500, when available.',
    save: 'Save $1,000',
    badge: 'Best value per session',
    desc: 'The greatest savings for clients who know they want ongoing support, without being tied to a weekly schedule or automatically renewing membership.',
  },
  { id: 'pkg-single', title: 'Single Session', sessions: 1, price: 125, perSession: 125, small: true },
  { id: 'pkg-three', title: '3-Session Starter Package', sessions: 3, price: 345, perSession: 115, small: true },
];

export const PRODUCTS = [
  { id: 'comfort-tee', title: 'Better Everyday – Classic Comfort Tee', price: 27, img: 'tee', sizes: ADULT_SIZES, cat: 'Swag · Adult', desc: 'A soft everyday tee carrying the Better Everyday mark.' },
  { id: 'streetwear-hoodie', title: 'Better Everyday – Classic Streetwear Hoodie', price: 37, img: 'hoodie', sizes: ADULT_SIZES, cat: 'Swag · Adult', desc: 'A warm pullover hoodie for cool Colorado mornings and evenings on the field.' },
  { id: 'youth-performance-tee', title: 'Better Everyday – Youth Performance Tee', price: 17, img: 'youth', sizes: YOUTH_SIZES, cat: 'Swag · Youth', desc: 'A lightweight tee for kids on the move.' },
  {
    id: 'chapter-2',
    title: 'Free Download: Legacy of Health – Chapter 2',
    price: 0,
    img: 'book',
    sizes: null,
    cat: 'Publications · Digital',
    desc: 'Chapter two of Legacy of Health: A Parent’s Guide to Building Strength, Energy, and Longevity for the Next Generation. Check out to have it sent to your email.',
  },
];

export const BOOK_AMAZON_URL = 'https://www.amazon.com/dp/B0GDTJX4Z4';

/** Cart line for a session package. */
export const packageLine = (pkg) => ({ id: pkg.id, title: pkg.title, variant: 'Session package · one-time purchase', price: pkg.price });

/** Look up the authoritative price and title for a cart line id. Returns null for unknown ids. */
export function findItem(id) {
  const pkg = PACKAGES.find((p) => p.id === id);
  if (pkg) return { id, title: pkg.title, price: pkg.price, sizes: null, kind: 'package' };
  const prod = PRODUCTS.find((p) => p.id === id);
  if (prod) return { id, title: prod.title, price: prod.price, sizes: prod.sizes, kind: prod.price === 0 ? 'download' : 'merch' };
  return null;
}
