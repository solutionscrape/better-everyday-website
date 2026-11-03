import { useState } from 'react';
import { Button, Field, Lede, ProductRow, SectionHeading } from '../ds';
import { LinkButton, Toggle, metaLabel, h2Style } from '../components/ui.jsx';
import { BOOK_AMAZON_URL, PACKAGES, PRODUCTS, packageLine } from '../data/catalog.js';
import { IMG, usd } from '../data/site.js';
import { useCart } from '../lib/cart.jsx';

export const STORE_PRODUCTS = PRODUCTS.map((p) => ({ ...p, image: IMG[p.img], href: '#store/' + p.id, priceLabel: p.price ? usd(p.price) : 'Free' }));
const CATS = ['All', 'Publications', 'Swag', 'Packages'];
const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(240px,100%),1fr))', gap: '40px 32px', paddingTop: '32px' };

export function StoreIndex() {
  const cart = useCart();
  const [cat, setCat] = useState('All');
  const show = (c) => cat === 'All' || cat === c;
  const apparel = STORE_PRODUCTS.filter((p) => p.img !== 'book');

  return (
    <>
      <Lede kicker="Store" title="Books, Gear and" accent="Sessions" deck="Everything here supports the same idea: get a little better every day. Payment is completed securely through HubSpot." />
      <section style={{ padding: '0 var(--gutter) var(--section-y)', display: 'grid', gap: 'clamp(48px,6vw,96px)' }}>
        <div role="group" aria-label="Filter the store" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', borderTop: '1px solid var(--border-strong)', paddingTop: '20px' }}>
          {CATS.map((c) => <Toggle key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Toggle>)}
        </div>

        {show('Publications') ? (
          <div>
            <SectionHeading number="01" title="Publications" note="Legacy of Health: A Parent’s Guide to Building Strength, Energy, and Longevity for the Next Generation." />
            <div style={grid}>
              <ProductRow title="Legacy of Health (Book)" price="Amazon" category="Paperback · opens Amazon" image={IMG.book} href={BOOK_AMAZON_URL} target="_blank" rel="noopener" />
              <ProductRow title="Legacy of Health – Chapter 2" price="Free" category="Digital download" image={IMG.book} href="#store/chapter-2" />
            </div>
          </div>
        ) : null}

        {show('Swag') ? (
          <div>
            <SectionHeading number="02" title="Swag" note="Better Everyday apparel for adults and kids." />
            <div style={grid}>
              {apparel.map((a) => <ProductRow key={a.id} title={a.title} price={a.priceLabel} category={a.cat} image={a.image} href={a.href} />)}
            </div>
          </div>
        ) : null}

        {show('Packages') ? (
          <div>
            <SectionHeading number="03" title="Session Packages" note="In-person 1:1 coaching with James. One-time purchases with no auto-renewal. Book sessions when they work for you." />
            <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-strong)' }}>
              {PACKAGES.map((p) => {
                const inCart = cart.has(p.id);
                return (
                  <div key={p.id} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(130px,100%),1fr))', gap: '8px 24px', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.02em', color: 'var(--text-strong)' }}>{p.title}</span>
                    <span style={{ color: 'var(--text-body)' }}>{p.sessions} {p.sessions === 1 ? 'session' : 'sessions'} · ${p.perSession} per session</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--text-strong)' }}>{usd(p.price)}</span>
                    <LinkButton onClick={() => cart.add(packageLine(p))} aria-label={'Add ' + p.title + ' to cart'} style={{ justifySelf: 'start' }}>{inCart ? 'Added ✓' : 'Add to cart'}</LinkButton>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </section>
      <Field tone="black" kicker="Session packages" title="Not Sure Which Package Fits?" body="Tell James who the coaching is for and he will recommend a starting point before you buy." action={{ label: 'Ask James', href: '#contact' }} />
    </>
  );
}

export function ProductPage({ product }) {
  const cart = useCart();
  const [size, setSize] = useState(null);
  const [sizeErr, setSizeErr] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const add = () => {
    if (product.sizes && !size) { setSizeErr(true); return; }
    cart.add({ id: product.id, title: product.title, variant: product.sizes ? 'Size ' + size : 'Digital download', size, price: product.price });
    setJustAdded(true);
  };

  return (
    <section style={{ padding: 'clamp(44px,6vw,96px) var(--gutter) var(--section-y)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }}>
      <div style={{ background: 'var(--surface-sunken)', aspectRatio: '1/1', borderTop: '1px solid var(--border-strong)', overflow: 'hidden' }}>
        <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      <div style={{ display: 'grid', gap: '24px', alignContent: 'start' }}>
        <LinkButton href="#store">← Back to store</LinkButton>
        <span style={metaLabel}>{product.cat}</span>
        <h1 style={{ ...h2Style, fontSize: 'clamp(2rem,3.6vw,3.25rem)' }}>{product.title}</h1>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.75rem', color: 'var(--text-strong)' }}>{product.priceLabel}</span>
        <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--text-body)', maxWidth: '46ch' }}>{product.desc}</p>
        {product.sizes ? (
          <div style={{ display: 'grid', gap: '10px' }}>
            <span style={metaLabel} id="size-label">Size</span>
            <div role="group" aria-labelledby="size-label" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {product.sizes.map((z) => (
                <Toggle key={z} active={size === z} onClick={() => { setSize(z); setSizeErr(false); }} style={{ minWidth: '56px' }}>{z}</Toggle>
              ))}
            </div>
            {sizeErr ? <p role="alert" style={{ margin: 0, color: '#FF4D4D', fontSize: '.875rem' }}>Please choose a size.</p> : null}
          </div>
        ) : null}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="lg" onClick={add}>{product.price === 0 ? 'Add free chapter' : 'Add to cart'}</Button>
          {justAdded ? <LinkButton onClick={cart.openCart}>View cart · {cart.count}</LinkButton> : null}
        </div>
      </div>
    </section>
  );
}
