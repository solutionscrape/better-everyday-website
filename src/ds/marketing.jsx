// Ported from the Better Everyday design system (components/marketing/*).
import { useState } from 'react';
import { Button, Eyebrow, TextLink } from './core.jsx';

const breakRailStyle = { marginLeft: 'calc(-1 * var(--rail-width))', width: 'calc(100% + var(--rail-width))' };

const captionStyle = {
  display: 'flex',
  gap: 'var(--space-3)',
  padding: '10px var(--gutter)',
  borderTop: '1px solid var(--border-strong)',
  borderBottom: '1px solid var(--border-strong)',
  fontFamily: 'var(--font-body)',
  fontSize: 'var(--text-caption-size)',
  letterSpacing: 'var(--tracking-caption)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
};

const GROUNDS = {
  black: { background: 'var(--surface-band)', ink: 'var(--text-strong)', body: 'var(--text-body)', kicker: 'blue', btn: 'primary' },
  tint: { theme: 'light', background: 'var(--neutral-50)', ink: 'var(--ink)', body: 'var(--neutral-600)', kicker: 'blue', btn: 'primary' },
  cream: { theme: 'light', background: 'var(--bea-white)', ink: 'var(--ink)', body: 'var(--neutral-600)', kicker: 'blue', btn: 'primary' },
  red: { background: 'var(--bea-red)', ink: 'var(--bea-white)', body: 'var(--bea-white)', kicker: 'inverse', btn: 'onField' },
};

/** Full-bleed call-to-action band. Breaks out under the rail by default. */
export function Field({ kicker, title, body, action, image, imageAlt = '', tone = 'black', rule = true, breakRail = true, style, ...rest }) {
  const g = GROUNDS[tone] || GROUNDS.black;
  return (
    <section
      data-theme={g.theme}
      style={{
        background: g.background,
        color: g.ink,
        padding: 'clamp(44px,6vw,96px) var(--gutter)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))',
        gap: 'clamp(26px,4vw,64px)',
        alignItems: 'center',
        borderTop: rule ? 'var(--rule-accent-width) solid var(--be-red)' : 'none',
        boxSizing: 'border-box',
        ...(breakRail ? { ...breakRailStyle, paddingLeft: 'calc(var(--gutter) + var(--rail-width))' } : null),
        ...style,
      }}
      {...rest}
    >
      <div>
        {kicker ? <Eyebrow tone={g.kicker} style={{ marginBottom: 'var(--space-4)' }}>{kicker}</Eyebrow> : null}
        <h2 style={{ margin: '0 0 var(--space-4)', color: g.ink, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h2-size)', lineHeight: 'var(--text-h2-lh)', letterSpacing: 'var(--tracking-heading)', textTransform: 'uppercase' }}>
          {title}
        </h2>
        {body ? <p style={{ margin: '0 0 var(--space-6)', fontSize: '1.03125rem', lineHeight: 1.64, maxWidth: '42ch', color: g.body }}>{body}</p> : null}
        {action ? <Button size="lg" variant={g.btn} href={action.href}>{action.label}</Button> : null}
      </div>
      {image ? <img src={image} alt={imageAlt} style={{ width: '100%', maxWidth: '330px', justifySelf: 'end' }} /> : null}
    </section>
  );
}

/** Page-opening headline block: kicker, display title with red accent, deck and actions. */
export function Lede({ kicker, title, accent, caption, captionNumber, deck, primary, secondary, image, imageAlt = '', imageHeight = 'clamp(240px,30vw,400px)', style, ...rest }) {
  return (
    <section style={{ padding: 'clamp(44px,6.2vw,104px) var(--gutter) clamp(28px,3.6vw,50px)', ...style }} {...rest}>
      {kicker ? <Eyebrow style={{ marginBottom: 'clamp(20px,3vw,34px)' }}>{kicker}</Eyebrow> : null}
      <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-display-size)', lineHeight: 'var(--text-display-lh)', letterSpacing: 'var(--tracking-display)', textTransform: 'uppercase', textWrap: 'balance' }}>
        {title}
        {accent ? <> <span style={{ color: 'var(--be-red)' }}>{accent}</span></> : null}
      </h1>
      {caption ? (
        <div style={{ ...captionStyle, marginLeft: 'calc(-1 * var(--gutter))', marginRight: 'calc(-1 * var(--gutter))', marginTop: 'clamp(26px,3.6vw,46px)' }}>
          {captionNumber ? <b style={{ color: 'var(--text-accent-small)', fontWeight: 700 }}>{captionNumber}</b> : null}
          <span>{caption}</span>
        </div>
      ) : null}
      {deck || primary || secondary ? (
        <div className="be-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 'var(--space-5)', marginTop: 'clamp(26px,3.6vw,46px)', borderTop: caption ? 'none' : '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
          {deck ? <p style={{ gridColumn: 'span 7', margin: 0, fontSize: 'var(--text-lead-size)', lineHeight: 'var(--text-lead-lh)', maxWidth: 'var(--measure-deck)', color: 'var(--text-body)' }}>{deck}</p> : null}
          <div style={{ gridColumn: 'span 5', minWidth: 0, display: 'flex', gap: 'var(--space-5)', alignItems: 'center', flexWrap: 'wrap', alignContent: 'flex-start' }}>
            {primary ? <Button size="lg" href={primary.href}>{primary.label}</Button> : null}
            {secondary ? <TextLink href={secondary.href}>{secondary.label}</TextLink> : null}
          </div>
        </div>
      ) : null}
      {image ? <img src={image} alt={imageAlt} style={{ width: '100%', height: imageHeight, objectFit: 'cover', display: 'block', marginTop: 'clamp(28px,3.6vw,50px)' }} /> : null}
    </section>
  );
}

/** Full-bleed photograph with a numbered caption strip. */
export function Plate({ src, alt = '', number, caption, breakRail = true, height = 'clamp(300px,42vw,560px)', style, ...rest }) {
  return (
    <figure style={{ margin: 0, ...(breakRail ? breakRailStyle : null), ...style }} {...rest}>
      <img src={src} alt={alt} style={{ width: '100%', height, objectFit: 'cover', display: 'block' }} />
      {number || caption ? (
        <figcaption style={captionStyle}>
          {number ? <b style={{ color: 'var(--text-accent-small)', fontWeight: 700 }}>{number}</b> : null}
          <span>{caption}</span>
        </figcaption>
      ) : null}
    </figure>
  );
}

export function PostRow({ title, excerpt, date, category, href = '#', style, ...rest }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,.28fr) minmax(0,1.72fr)',
        gap: 'clamp(14px,2.4vw,38px)',
        alignItems: 'baseline',
        padding: 'clamp(20px,2.6vw,32px) 0',
        borderBottom: '1px solid var(--border-subtle)',
        textDecoration: 'none',
        boxShadow: 'none',
        color: 'var(--text-strong)',
        ...style,
      }}
      {...rest}
    >
      <div style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption-size)', letterSpacing: 'var(--tracking-caption)', textTransform: 'uppercase', color: 'var(--text-muted)', lineHeight: 1.9 }}>
        {date}
        {category ? <><br /><span style={{ color: 'var(--text-link)' }}>{category}</span></> : null}
      </div>
      <div>
        <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h3-size)', lineHeight: 'var(--text-h3-lh)', letterSpacing: 'var(--tracking-subhead)', textTransform: 'uppercase', color: h ? 'var(--text-link)' : 'var(--text-strong)', transition: 'color var(--duration-fast) var(--ease-standard)' }}>
          {title}
        </h3>
        {excerpt ? <p style={{ margin: 0, fontSize: 'var(--text-small-size)', lineHeight: 1.66, color: 'var(--text-secondary)', maxWidth: '56ch' }}>{excerpt}</p> : null}
      </div>
    </a>
  );
}

export function ProductRow({ image, imageAlt = '', title, price, category, href = '#', style, ...rest }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ textDecoration: 'none', boxShadow: 'none', color: 'var(--text-strong)', display: 'flex', flexDirection: 'column', borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-4)', ...style }}
      {...rest}
    >
      <div style={{ overflow: 'hidden', background: 'var(--surface-sunken)', aspectRatio: '1 / 1' }}>
        <img src={image} alt={imageAlt || title} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: h ? 'scale(1.03)' : 'scale(1)', transition: 'var(--transition-media)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', alignItems: 'baseline', marginTop: 'var(--space-4)' }}>
        <h3 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', lineHeight: 1.2, letterSpacing: 'var(--tracking-subhead)', textTransform: 'uppercase', color: h ? 'var(--text-link)' : 'var(--text-strong)', transition: 'color var(--duration-fast) var(--ease-standard)' }}>
          {title}
        </h3>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.0625rem', letterSpacing: '-.02em', whiteSpace: 'nowrap' }}>{price}</span>
      </div>
      {category ? <span style={{ marginTop: '6px', fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption-size)', letterSpacing: 'var(--tracking-caption)', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{category}</span> : null}
    </a>
  );
}

export function ProgramRow({ number, title, description, price, priceNote, featured = false, action, style, ...rest }) {
  return (
    <div
      className="be-program-row"
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto minmax(0,1.25fr) minmax(0,.55fr) auto',
        gap: 'clamp(14px,2.4vw,38px)',
        alignItems: 'center',
        padding: 'clamp(22px,3vw,38px) 0',
        borderBottom: '1px solid var(--border-subtle)',
        ...(featured
          ? { background: 'var(--surface-card)', borderLeft: 'var(--rule-accent-width) solid var(--be-red)', paddingLeft: 'clamp(14px,1.8vw,24px)', paddingRight: 'clamp(14px,1.8vw,24px)', boxShadow: 'var(--shadow-raised)' }
          : null),
        ...style,
      }}
      {...rest}
    >
      {number ? <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.3rem,2.3vw,1.9rem)', lineHeight: 1, color: 'var(--text-accent-small)', letterSpacing: '-.02em' }}>{number}</span> : null}
      <div>
        <h3 style={{ margin: '0 0 9px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h3-size)', lineHeight: 'var(--text-h3-lh)', letterSpacing: 'var(--tracking-subhead)', textTransform: 'uppercase' }}>{title}</h3>
        <p style={{ margin: 0, fontSize: 'var(--text-small-size)', lineHeight: 1.66, color: 'var(--text-secondary)', maxWidth: '42ch' }}>{description}</p>
      </div>
      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.3rem,2.1vw,1.8rem)', letterSpacing: '-.026em' }}>
        {price}
        {priceNote ? (
          <small style={{ display: 'block', fontFamily: 'var(--font-body)', fontWeight: 400, fontSize: 'var(--text-caption-size)', letterSpacing: 'var(--tracking-caption)', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '5px', lineHeight: 1.6 }}>{priceNote}</small>
        ) : null}
      </div>
      {action ? (featured ? <Button href={action.href}>{action.label}</Button> : <TextLink href={action.href}>{action.label}</TextLink>) : <span />}
    </div>
  );
}

export function Quote({ quote, author, role, variant = 'lead', inverse = false, style, ...rest }) {
  const lead = variant === 'lead';
  return (
    <figure style={{ margin: 0, ...(lead ? { borderLeft: 'var(--rule-accent-width) solid var(--be-red)', paddingLeft: 'var(--space-5)' } : null), ...style }} {...rest}>
      <blockquote
        style={{
          margin: 0,
          color: lead ? 'var(--text-strong)' : inverse ? 'var(--text-inverse-muted)' : 'var(--text-body)',
          fontFamily: lead ? 'var(--font-display)' : 'var(--font-body)',
          fontWeight: lead ? 700 : 400,
          fontSize: lead ? 'clamp(1.4rem,2.9vw,2.4rem)' : 'var(--text-small-size)',
          lineHeight: lead ? 1.14 : 1.62,
          letterSpacing: lead ? '-.02em' : 'var(--tracking-body)',
        }}
      >
        {'“' + quote + '”'}
      </blockquote>
      <figcaption style={{ marginTop: lead ? 'var(--space-5)' : '7px', fontFamily: 'var(--font-body)', fontSize: lead ? 'var(--text-eyebrow-size)' : 'var(--text-caption-size)', letterSpacing: 'var(--tracking-caption)', textTransform: 'uppercase', color: inverse ? 'var(--text-inverse-muted)' : 'var(--text-muted)', lineHeight: 1.8 }}>
        {author}
        {role ? <><br />{role}</> : null}
      </figcaption>
    </figure>
  );
}

/** Two-column photo + copy band. `reverse` puts the photo on the right. */
export function Split({ image, imageAlt = '', reverse = false, children, style, ...rest }) {
  const pic = <img src={image} alt={imageAlt} style={{ width: '100%', height: '100%', minHeight: '320px', objectFit: 'cover' }} />;
  const body = (
    <div style={{ padding: 'clamp(36px,5vw,80px) var(--gutter)', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: reverse ? 'none' : '1px solid var(--border-subtle)', borderRight: reverse ? '1px solid var(--border-subtle)' : 'none' }}>
      {children}
    </div>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', borderTop: '1px solid var(--border-strong)', borderBottom: '1px solid var(--border-strong)', ...style }} {...rest}>
      {reverse ? <>{body}{pic}</> : <>{pic}{body}</>}
    </div>
  );
}

export function StatRow({ items = [], style, ...rest }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(152px,100%),1fr))', borderBottom: '1px solid var(--border-strong)', ...style }} {...rest}>
      {items.map((it, i) => (
        <div key={it.label} style={{ padding: 'clamp(22px,2.8vw,34px) clamp(18px,2.2vw,30px)', borderRight: i === items.length - 1 ? 'none' : '1px solid var(--border-subtle)' }}>
          <b style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.7rem,2.9vw,2.5rem)', lineHeight: 1, letterSpacing: '-.028em' }}>{it.value}</b>
          <span style={{ display: 'block', marginTop: 'var(--space-2)', fontFamily: 'var(--font-body)', fontSize: 'var(--text-caption-size)', letterSpacing: 'var(--tracking-caption)', textTransform: 'uppercase', color: 'var(--text-muted)', lineHeight: 1.55 }}>{it.label}</span>
        </div>
      ))}
    </div>
  );
}
