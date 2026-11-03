// Ported from the Better Everyday design system (components/navigation/*).
import { useState } from 'react';
import { Button } from './core.jsx';

function RailLink({ item, active }) {
  const [h, setH] = useState(false);
  const on = active === item.label;
  return (
    <a
      href={item.href}
      aria-current={on ? 'page' : undefined}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: '44px',
        borderBottom: '1px solid var(--border-subtle)',
        textDecoration: 'none',
        boxShadow: 'none',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 'var(--text-nav-size)',
        letterSpacing: 'var(--tracking-nav)',
        textTransform: 'uppercase',
        color: on || h ? 'var(--text-link)' : 'var(--text-strong)',
        paddingLeft: h ? '7px' : '0',
        transition: 'padding var(--duration-fast) var(--ease-standard),color var(--duration-fast) var(--ease-standard)',
      }}
    >
      {item.label}
      <span aria-hidden="true" style={{ width: '5px', height: '5px', background: 'var(--be-red)', opacity: on || h ? 1 : 0, transition: 'opacity var(--duration-fast) var(--ease-standard)' }} />
    </a>
  );
}

/** Sticky left rail: logo, primary nav, CTA and contact details. Collapses to a top bar under 900px (see global.css). */
export function SiteRail({ items, active, logoSrc, homeHref = '#home', ctaLabel = 'Book a conversation', ctaHref = '#contact', phone, email, service = 'Boulder & Broomfield County', style }) {
  return (
    <aside
      className="be-rail"
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        background: 'var(--surface-page)',
        borderRight: '1px solid var(--border-strong)',
        padding: 'clamp(22px,2.2vw,34px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-5)',
        ...style,
      }}
    >
      <a href={homeHref} style={{ display: 'flex', alignItems: 'center', gap: '11px', flexWrap: 'wrap', textDecoration: 'none', boxShadow: 'none', color: 'var(--text-strong)' }}>
        <img src={logoSrc} alt="Better Everyday Athletics" style={{ height: '52px', width: 'auto' }} />
        <span aria-hidden="true" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.9375rem', letterSpacing: '.05em', textTransform: 'uppercase', lineHeight: 1.04 }}>
          Better<br />Everyday<br />Athletics
        </span>
      </a>
      <nav className="be-rail-nav" aria-label="Main" style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-subtle)' }}>
        {items.map((it) => <RailLink key={it.label} item={it} active={active} />)}
      </nav>
      <div className="be-rail-foot" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '13px' }}>
        <Button href={ctaHref} fullWidth>{ctaLabel}</Button>
        <small style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption-size)', letterSpacing: '.11em', textTransform: 'uppercase', color: 'var(--text-muted)', lineHeight: 1.85 }}>
          {service}<br />Virtual anywhere
        </small>
        {phone ? (
          <a href={'tel:' + phone.replace(/[^0-9]/g, '')} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.96875rem', color: 'var(--text-strong)', textDecoration: 'none', boxShadow: 'none' }}>
            {phone}
          </a>
        ) : null}
        {email ? (
          <a href={'mailto:' + email} style={{ fontFamily: 'var(--font-body)', fontSize: '.8125rem', color: '#1E90D4', textDecoration: 'none', boxShadow: 'none', overflowWrap: 'anywhere' }}>
            {email}
          </a>
        ) : null}
      </div>
    </aside>
  );
}

export function SiteFooter({ areas = 'Arvada · Boulder · Broomfield · Westminster · Lafayette · Louisville', tagline = 'Progress, not perfection', owner = '© 2026 Better Everyday Athletics', style }) {
  const cell = { fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption-size)', letterSpacing: 'var(--tracking-caption)', textTransform: 'uppercase', color: 'var(--text-muted)' };
  return (
    <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: 'var(--space-5) var(--gutter) var(--space-7)', display: 'flex', justifyContent: 'space-between', gap: 'var(--space-4)', flexWrap: 'wrap', ...style }}>
      <span style={cell}>{owner}</span>
      <span style={cell}>{areas}</span>
      <span style={cell}>{tagline}</span>
    </footer>
  );
}
