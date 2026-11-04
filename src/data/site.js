export const CONTACT = {
  phone: '(303) 579-7350',
  email: 'james@bettereverydayathletics.com',
  // Speaking requests only. The mailbox must exist before launch.
  speakingEmail: 'speaking@bettereverydayathletics.com',
};
export const phoneDigits = CONTACT.phone.replace(/[^0-9]/g, '');

export const SERVICE_AREA = ['Arvada', 'Boulder', 'Broomfield', 'Westminster', 'Superior', 'Lafayette', 'Louisville', 'Northglenn', 'Denver'];

export const IMG = {
  mark: '/img/be-mark.png',
  hero: '/img/adaptive-soccer-coach-high-five-wheelchair-athlete-boulder.jpg',
  james: '/img/james-field-portrait-4x5.jpg',
  headshot: '/img/james-anderson-cscs-headshot-dark-stripes.jpg',
  group: '/img/inclusive-fitness-group-flex-better-everyday-gym-colorado.jpg',
  kite: '/img/child-kite-sunset-wheelchair-adaptive-family.jpg',
  book: '/img/legacy-of-health-promo.png',
  tee: '/img/comfort-tee-black.jpg',
  hoodie: '/img/streetwear-hoodie-black.jpg',
  youth: '/img/youth-performance-tee-black.jpg',
};

export const NAV = [
  { label: 'Home', href: '#home', page: 'home' },
  { label: 'Work With James', href: '#services', page: 'services' },
  { label: 'Speaking', href: '#speaking', page: 'speaking' },
  { label: 'Media', href: '#media', page: 'media' },
  { label: 'Store', href: '#store', page: 'store' },
  { label: 'Blog', href: '#blog', page: 'blog' },
  { label: 'Contact', href: '#contact', page: 'contact' },
  { label: 'Client Portal', href: '#portal', page: 'portal' },
];

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const isEmail = (v) => EMAIL_RE.test(String(v || '').trim());

export const usd = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
