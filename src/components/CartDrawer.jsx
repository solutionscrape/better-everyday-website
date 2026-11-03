import { useEffect, useRef, useState } from 'react';
import { Button, TextField } from '../ds';
import { LinkButton, metaLabel, h3Style, bodyText } from './ui.jsx';
import { useCart } from '../lib/cart.jsx';
import { CONTACT, isEmail, usd } from '../data/site.js';

const qtyBtn = { minWidth: '44px', textAlign: 'center', border: '1px solid var(--border-subtle)' };

/** Sends the order to the Netlify Function, which creates the HubSpot contact, deal and line items. */
async function startCheckout(customer, lines) {
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer, items: lines.map((l) => ({ id: l.id, size: l.size || null, qty: l.qty })) }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Checkout failed: ' + res.status);
  return data;
}

export default function CartDrawer() {
  const cart = useCart();
  const [co, setCo] = useState({ name: '', email: '', phone: '' });
  const [err, setErr] = useState({});
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(null);
  const panel = useRef(null);

  useEffect(() => {
    if (!cart.open) return;
    const onKey = (e) => { if (e.key === 'Escape') cart.closeCart(); };
    window.addEventListener('keydown', onKey);
    panel.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [cart.open]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!cart.open) return null;

  const field = (k) => ({
    value: co[k],
    error: err[k],
    onChange: (e) => { const v = e.target.value; setCo((c) => ({ ...c, [k]: v })); setErr((x) => ({ ...x, [k]: undefined })); },
  });

  async function placeOrder() {
    const e = {};
    if (!co.name.trim()) e.name = 'Please add your name.';
    if (!isEmail(co.email)) e.email = 'Please enter a valid email address.';
    if (Object.keys(e).length) { setErr(e); return; }
    setSending(true);
    setFailed(null);
    const customer = { name: co.name.trim(), email: co.email.trim(), phone: co.phone.trim() };
    const lines = cart.lines;
    try {
      const data = await startCheckout(customer, lines);
      if (data.paymentUrl) { window.location.assign(data.paymentUrl); return; }
    } catch (error) {
      // The Vite dev server has no functions; show the confirmation locally so the flow can be reviewed.
      if (!import.meta.env.DEV) {
        console.error(error);
        setFailed('We could not start checkout. Please try again, or email ' + CONTACT.email + '.');
        setSending(false);
        return;
      }
    }
    setSending(false);
    cart.complete({ lines, email: customer.email, name: customer.name });
  }

  const o = cart.order;
  const onlyFree = o && o.lines.every((l) => l.price === 0);
  const hasPackage = o && o.lines.some((l) => l.id.startsWith('pkg-'));
  const doneMsg = !o
    ? ''
    : onlyFree
      ? 'Your free chapter is on its way to ' + o.email + '.'
      : 'A secure HubSpot payment link is on its way to ' + o.email + '. Your order is confirmed once payment is complete.' + (hasPackage ? ' James will reach out to schedule your first session.' : '');

  return (
    <aside
      ref={panel}
      tabIndex={-1}
      role="dialog"
      aria-label="Your cart"
      style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(440px,100%)', zIndex: 50, background: '#1B1D22', borderLeft: '1px solid var(--border-strong)', overflow: 'auto', padding: '28px var(--gutter)', display: 'flex', flexDirection: 'column', gap: '24px', boxSizing: 'border-box', outline: 'none' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-strong)', paddingBottom: '16px' }}>
        <h2 style={h3Style}>Your Cart</h2>
        <LinkButton onClick={cart.closeCart}>Close</LinkButton>
      </div>

      {cart.step === 'cart' ? (
        cart.count === 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            <p style={bodyText}>Your cart is empty.</p>
            <LinkButton href="#store">Browse the store</LinkButton>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid' }}>
              {cart.lines.map((l) => (
                <div key={l.key} style={{ display: 'grid', gap: '8px', padding: '16px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-strong)', lineHeight: 1.2 }}>{l.title}</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: 'var(--text-strong)', whiteSpace: 'nowrap' }}>{l.price ? usd(l.price * l.qty) : 'Free'}</span>
                  </div>
                  <span style={{ fontSize: '.8125rem', color: '#8a93a0' }}>{l.variant}</span>
                  <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                    <LinkButton aria-label={'Decrease quantity of ' + l.title} onClick={() => cart.setQty(l.key, -1)} style={qtyBtn}>−</LinkButton>
                    <span aria-live="polite" style={{ minWidth: '36px', textAlign: 'center', color: 'var(--text-strong)' }}>{l.qty}</span>
                    <LinkButton aria-label={'Increase quantity of ' + l.title} onClick={() => cart.setQty(l.key, 1)} style={qtyBtn}>+</LinkButton>
                    <LinkButton onClick={() => cart.setQty(l.key, -l.qty)} style={{ marginLeft: 'auto', color: '#8a93a0' }}>Remove</LinkButton>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <span style={metaLabel}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--text-strong)' }}>{usd(cart.total)}</span>
            </div>
            <Button size="lg" fullWidth onClick={() => cart.setStep('details')}>Checkout</Button>
            <p style={{ margin: 0, fontSize: '.8125rem', lineHeight: 1.6, color: '#8a93a0' }}>Payment is completed securely through HubSpot. Sessions are booked with James after purchase.</p>
          </>
        )
      ) : null}

      {cart.step === 'details' ? (
        <div style={{ display: 'grid', gap: '20px' }}>
          <p style={bodyText}>{cart.count} item(s) · {usd(cart.total)}</p>
          <TextField id="co-name" label="Full name" required autoComplete="name" {...field('name')} />
          <TextField id="co-email" label="Email" type="email" required autoComplete="email" hint="Your receipt and payment link are sent here." {...field('email')} />
          <TextField id="co-phone" label="Phone" type="tel" hint="Optional" autoComplete="tel" {...field('phone')} />
          <Button size="lg" fullWidth onClick={placeOrder} disabled={sending}>
            {sending ? 'Sending…' : cart.total === 0 ? 'Send my download' : 'Continue to payment'}
          </Button>
          {failed ? <p role="alert" style={{ margin: 0, color: '#FF4D4D', fontSize: '.875rem', lineHeight: 1.6 }}>{failed}</p> : null}
          <LinkButton onClick={() => cart.setStep('cart')}>← Back to cart</LinkButton>
        </div>
      ) : null}

      {cart.step === 'done' && o ? (
        <div role="status" style={{ borderLeft: '3px solid #FC1111', padding: '8px 0 8px 20px', display: 'grid', gap: '14px' }}>
          <span style={metaLabel}>Order received</span>
          <h3 style={h3Style}>Thank you, {o.name.split(' ')[0]}</h3>
          <p style={bodyText}>{doneMsg}</p>
          <LinkButton onClick={cart.closeCart}>Continue browsing</LinkButton>
        </div>
      ) : null}
    </aside>
  );
}
