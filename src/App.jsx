import { useEffect } from 'react';
import { SiteFooter, SiteRail } from './ds';
import CartDrawer from './components/CartDrawer.jsx';
import { CONTACT, IMG, NAV } from './data/site.js';
import { useHashRoute } from './lib/router.js';
import { useCart } from './lib/cart.jsx';
import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import Contact from './pages/Contact.jsx';
import { BlogIndex, BlogPost, POSTS } from './pages/Blog.jsx';
import { ProductPage, STORE_PRODUCTS, StoreIndex } from './pages/Store.jsx';
import Login from './pages/portal/Login.jsx';
import Dashboard from './pages/portal/Dashboard.jsx';
import { usePortalState } from './pages/portal/data.js';

const TITLES = {
  home: 'Adaptive Coaching with James Anderson, CSCS',
  services: 'Work With James · Session Packages',
  contact: 'Contact',
  blog: 'Blog',
  store: 'Store',
  portal: 'Client Portal',
};

function SitePage({ route }) {
  const { page, sub } = route;
  if (page === 'services') return <Services />;
  if (page === 'contact') return <Contact />;
  if (page === 'blog') {
    const post = sub && POSTS.find((p) => p.slug === sub);
    return post ? <BlogPost key={post.slug} post={post} /> : <BlogIndex />;
  }
  if (page === 'store') {
    const product = sub && STORE_PRODUCTS.find((p) => p.id === sub);
    return product ? <ProductPage key={product.id} product={product} /> : <StoreIndex />;
  }
  return <Home />;
}

export default function App() {
  const route = useHashRoute();
  const cart = useCart();
  const portal = usePortalState();

  // Navigating anywhere closes the cart, as in the prototype.
  useEffect(() => { cart.closeCart(); }, [route]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let t = TITLES[route.page];
    if (route.page === 'blog' && route.sub) t = POSTS.find((p) => p.slug === route.sub)?.title || t;
    if (route.page === 'store' && route.sub) t = STORE_PRODUCTS.find((p) => p.id === route.sub)?.title || t;
    document.title = t + ' · Better Everyday Athletics';
  }, [route]);

  if (route.page === 'portal') {
    return portal.user ? <Dashboard portal={portal} sub={route.sub} /> : <Login portal={portal} />;
  }

  const active = NAV.find((n) => n.page === route.page)?.label || 'Home';

  return (
    <>
      <div className="be-shell">
        <SiteRail logoSrc={IMG.mark} items={NAV} active={active} ctaLabel="Book a conversation" ctaHref="#contact" phone={CONTACT.phone} email={CONTACT.email} />
        <main style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', padding: '9px var(--gutter)', borderBottom: '1px solid #4b5563', fontFamily: "'Inter',sans-serif", fontSize: '11px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#8a93a0' }}>
            <span>Progress, not perfection</span>
            <span>Adaptive &amp; inclusive coaching</span>
            <span>James Anderson, CSCS</span>
            <button type="button" onClick={cart.openCart} aria-label={`Cart, ${cart.count} ${cart.count === 1 ? 'item' : 'items'}`} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', color: '#1E90D4' }}>
              Cart · {cart.count}
            </button>
          </div>
          <SitePage route={route} />
          <SiteFooter />
        </main>
      </div>
      <CartDrawer />
    </>
  );
}
