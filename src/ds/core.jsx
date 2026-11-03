// Ported from the Better Everyday design system (components/core/*).
// Styles are kept identical to the design-system source.
import { useState } from 'react';

const base = {
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: 'var(--tracking-button)',
  borderRadius: 'var(--radius-button)',
  border: '1px solid transparent',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 'var(--space-2)',
  textDecoration: 'none',
  whiteSpace: 'nowrap',
  boxShadow: 'none',
  transition: 'var(--transition-control)',
};
const sizes = {
  sm: { minHeight: 'var(--control-height-sm)', padding: '0 var(--space-5)', fontSize: '.8125rem' },
  md: { minHeight: 'var(--control-height-md)', padding: '0 var(--space-6)', fontSize: '.875rem' },
  lg: { minHeight: 'var(--control-height-lg)', padding: '0 var(--space-7)', fontSize: '.96875rem' },
};
const variants = {
  primary: { background: 'var(--be-blue-ink)', color: 'var(--be-white)', borderColor: 'var(--be-blue-ink)' },
  accent: { background: 'var(--be-red)', color: 'var(--be-white)', borderColor: 'var(--be-red)' },
  secondary: { background: 'transparent', color: 'var(--text-strong)', borderColor: 'var(--text-strong)' },
  onDark: { background: 'var(--bea-white)', color: 'var(--ink)', borderColor: 'var(--bea-white)' },
  onField: { background: 'var(--bea-white)', color: 'var(--ink)', borderColor: 'var(--bea-white)' },
};
const hovers = {
  primary: { background: 'var(--be-blue-press)', borderColor: 'var(--be-blue-press)' },
  accent: { background: 'var(--be-red-press)', borderColor: 'var(--be-red-press)' },
  secondary: { background: 'var(--text-strong)', color: 'var(--surface-page)' },
  onDark: { background: 'var(--be-white)', borderColor: 'var(--be-white)' },
  onField: { background: 'var(--be-white)', borderColor: 'var(--be-white)' },
};

export function Button({ variant = 'primary', size = 'md', href, disabled = false, fullWidth = false, iconLeft, iconRight, style, children, type = 'button', ...rest }) {
  const [h, setH] = useState(false);
  const [p, setP] = useState(false);
  const off = { background: 'var(--neutral-800)', color: 'var(--neutral-400)', borderColor: 'var(--neutral-800)', cursor: 'not-allowed' };
  const s = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...(h && !disabled ? hovers[variant] : null),
    ...(disabled ? off : null),
    width: fullWidth ? '100%' : undefined,
    transform: p && !disabled ? 'scale(var(--press-scale))' : 'none',
    ...style,
  };
  const handlers = {
    onMouseEnter: () => setH(true),
    onMouseLeave: () => { setH(false); setP(false); },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false),
  };
  const inner = <>{iconLeft}{children}{iconRight}</>;
  if (href && !disabled) return <a href={href} style={s} {...handlers} {...rest}>{inner}</a>;
  return <button type={type} style={s} disabled={disabled} {...handlers} {...rest}>{inner}</button>;
}

const eyebrowColors = { blue: 'var(--text-link)', red: 'var(--text-accent-small)', muted: 'var(--text-muted)', inverse: 'var(--text-strong)' };

export function Eyebrow({ tone = 'blue', style, children, ...rest }) {
  return (
    <span
      style={{
        display: 'block',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: 'var(--text-eyebrow-size)',
        lineHeight: 'var(--text-eyebrow-lh)',
        letterSpacing: 'var(--tracking-eyebrow)',
        textTransform: 'uppercase',
        color: eyebrowColors[tone],
        margin: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </span>
  );
}

export function SectionHeading({ number, title, note, inverse = false, level = 2, style, ...rest }) {
  const H = 'h' + level;
  return (
    <header
      className="be-stack-sm"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12,1fr)',
        gap: 'var(--space-5)',
        alignItems: 'end',
        borderBottom: '1px solid ' + (inverse ? 'var(--border-subtle)' : 'var(--border-strong)'),
        paddingBottom: 'var(--space-4)',
        ...style,
      }}
      {...rest}
    >
      {number ? (
        <span style={{ gridColumn: 'span 2', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '.75rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--text-accent-small)' }}>
          {number}
        </span>
      ) : null}
      <H
        style={{
          gridColumn: number ? 'span 6' : 'span 8',
          margin: 0,
          fontFamily: 'var(--font-display)',
          fontWeight: 700,
          fontSize: 'var(--text-h2-size)',
          lineHeight: 'var(--text-h2-lh)',
          letterSpacing: 'var(--tracking-heading)',
          textTransform: 'uppercase',
          color: 'var(--text-strong)',
        }}
      >
        {title}
      </H>
      {note ? (
        <p style={{ gridColumn: 'span 4', margin: 0, fontSize: 'var(--text-small-size)', lineHeight: 1.62, color: inverse ? 'var(--text-inverse-muted)' : 'var(--text-body)' }}>
          {note}
        </p>
      ) : null}
    </header>
  );
}

const linkColors = { blue: 'var(--text-link)', red: 'var(--text-accent-small)', ink: 'var(--text-strong)', inverse: 'var(--text-strong)' };

export function TextLink({ href = '#', tone = 'blue', arrow = true, style, children, ...rest }) {
  const [h, setH] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: h ? '14px' : '9px',
        minHeight: '44px',
        whiteSpace: 'nowrap',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: '.8125rem',
        letterSpacing: 'var(--tracking-button)',
        textTransform: 'uppercase',
        color: linkColors[tone],
        textDecoration: 'none',
        boxShadow: 'inset 0 -1px 0 currentColor',
        transition: 'gap var(--duration-fast) var(--ease-standard)',
        ...style,
      }}
      {...rest}
    >
      {children}
      {arrow ? <span aria-hidden="true">→</span> : null}
    </a>
  );
}
