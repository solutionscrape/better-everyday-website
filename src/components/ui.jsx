// Small recurring patterns from the prototype that are not design-system components.

export const linkBtn = {
  background: 'none',
  border: 0,
  padding: 0,
  minHeight: '44px',
  cursor: 'pointer',
  fontFamily: 'var(--font-display)',
  fontWeight: 600,
  fontSize: '.875rem',
  letterSpacing: 'var(--tracking-button)',
  textTransform: 'uppercase',
  color: '#1E90D4',
  textAlign: 'left',
};

/** Text-style button (blue, uppercase). Renders an <a> when given href. */
export function LinkButton({ href, style, children, ...rest }) {
  if (href) {
    return (
      <a href={href} style={{ ...linkBtn, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', ...style }} {...rest}>
        {children}
      </a>
    );
  }
  return <button type="button" style={{ ...linkBtn, ...style }} {...rest}>{children}</button>;
}

/** Square segmented toggle used for filters, sizes, roles and time slots. */
export function Toggle({ active, onClick, style, children, ...rest }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      style={{
        minHeight: '44px',
        padding: '0 16px',
        border: '1px solid var(--border-subtle)',
        cursor: 'pointer',
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: '.875rem',
        letterSpacing: 'var(--tracking-button)',
        textTransform: 'uppercase',
        background: active ? 'var(--be-blue-ink)' : 'transparent',
        color: active ? '#fff' : 'var(--text-strong)',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Plain time-slot style button (same look as Toggle, never pressed). */
export const SlotButton = ({ children, ...rest }) => <Toggle active={false} aria-pressed={undefined} {...rest}>{children}</Toggle>;

export const metaLabel = { fontSize: '11px', letterSpacing: '.22em', textTransform: 'uppercase', color: '#8a93a0', fontWeight: 600 };
export const Meta = ({ style, children, ...rest }) => <span style={{ ...metaLabel, ...style }} {...rest}>{children}</span>;

export const h2Style = { margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h2-size)', lineHeight: 'var(--text-h2-lh)', letterSpacing: 'var(--tracking-heading)', textTransform: 'uppercase', color: 'var(--text-strong)' };
export const h3Style = { margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h3-size)', lineHeight: 'var(--text-h3-lh)', letterSpacing: 'var(--tracking-subhead)', textTransform: 'uppercase', color: 'var(--text-strong)' };
export const bodyText = { margin: 0, lineHeight: 1.7, color: 'var(--text-body)' };
export const displayStrong = { fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-strong)' };

export const StatusNote = ({ style, children }) => (
  <p role="status" style={{ margin: 0, borderLeft: '3px solid #FC1111', padding: '6px 0 6px 16px', color: 'var(--text-strong)', ...style }}>{children}</p>
);

export const Bullet = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '10px minmax(0,1fr)', gap: '14px', alignItems: 'baseline' }}>
    <span aria-hidden="true" style={{ width: '6px', height: '6px', background: '#FC1111', display: 'block', transform: 'translateY(-2px)' }} />
    <span style={{ lineHeight: 1.6, color: 'var(--text-body)' }}>{children}</span>
  </div>
);

/** Repeating row grid used in the portal tables. */
export const rowGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(170px,100%),1fr))', gap: '8px 24px', alignItems: 'baseline', padding: '20px 0', borderBottom: '1px solid var(--border-subtle)' };
