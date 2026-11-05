// Ported from the Better Everyday design system (components/forms/* and disclosure/Accordion).
import { useState } from 'react';

const labelStyle = {
  display: 'block',
  fontFamily: 'var(--font-body)',
  fontWeight: 600,
  fontSize: 'var(--text-caption-size)',
  letterSpacing: 'var(--tracking-eyebrow)',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: 'var(--space-2)',
};
const controlStyle = (invalid, focused) => ({
  width: '100%',
  boxSizing: 'border-box',
  fontFamily: 'var(--font-body)',
  fontSize: '1rem',
  lineHeight: 1.5,
  color: 'var(--text-strong)',
  background: 'var(--surface-card)',
  border: '1px solid ' + (invalid ? 'var(--status-danger)' : focused ? 'var(--border-strong)' : 'var(--border-subtle)'),
  borderRadius: 'var(--radius-input)',
  padding: '0 var(--space-4)',
  outline: 'none',
  transition: 'border-color var(--duration-fast) var(--ease-standard)',
});
const hintStyle = (invalid) => ({ margin: 'var(--space-2) 0 0', fontSize: 'var(--text-small-size)', color: invalid ? 'var(--status-danger)' : 'var(--text-muted)' });

const fieldId = (id, label) => id || 'be-' + (label || 'field').toLowerCase().replace(/[^a-z0-9]+/g, '-');

function FieldShell({ uid, label, required, hint, error, style, children }) {
  const invalid = !!error;
  return (
    <div style={style}>
      {label ? (
        <label htmlFor={uid} style={labelStyle}>
          {label}
          {required ? <span style={{ color: 'var(--be-red)' }}> *</span> : null}
        </label>
      ) : null}
      {children}
      {error || hint ? <p id={uid + '-hint'} style={hintStyle(invalid)}>{error || hint}</p> : null}
    </div>
  );
}

export function TextField({ label, hint, error, required = false, type = 'text', id, style, ...rest }) {
  const [f, setF] = useState(false);
  const uid = fieldId(id, label);
  return (
    <FieldShell uid={uid} label={label} required={required} hint={hint} error={error} style={style}>
      <input
        id={uid}
        type={type}
        required={required}
        aria-invalid={!!error || undefined}
        aria-describedby={error || hint ? uid + '-hint' : undefined}
        onFocus={() => setF(true)}
        onBlur={() => setF(false)}
        style={{ ...controlStyle(!!error, f), height: 'var(--control-height-md)' }}
        {...rest}
      />
    </FieldShell>
  );
}

export function TextArea({ label, hint, error, required = false, rows = 5, id, style, ...rest }) {
  const [f, setF] = useState(false);
  const uid = fieldId(id, label);
  return (
    <FieldShell uid={uid} label={label} required={required} hint={hint} error={error} style={style}>
      <textarea
        id={uid}
        rows={rows}
        required={required}
        aria-invalid={!!error || undefined}
        aria-describedby={error || hint ? uid + '-hint' : undefined}
        onFocus={() => setF(true)}
        onBlur={() => setF(false)}
        style={{ ...controlStyle(!!error, f), padding: 'var(--space-3) var(--space-4)', resize: 'vertical' }}
        {...rest}
      />
    </FieldShell>
  );
}

const chevron = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236b645c' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")";

export function SelectField({ label, hint, error, required = false, options = [], id, style, ...rest }) {
  const [f, setF] = useState(false);
  const uid = fieldId(id, label);
  return (
    <FieldShell uid={uid} label={label} required={required} hint={hint} error={error} style={style}>
      <select
        id={uid}
        required={required}
        aria-invalid={!!error || undefined}
        onFocus={() => setF(true)}
        onBlur={() => setF(false)}
        style={{
          ...controlStyle(!!error, f),
          height: 'var(--control-height-md)',
          appearance: 'none',
          backgroundImage: chevron,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right var(--space-4) center',
        }}
        {...rest}
      >
        {options.map((o) => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </FieldShell>
  );
}

export function Accordion({ items = [], defaultOpen = -1, style }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ display: 'grid', borderTop: '1px solid var(--border-strong)', ...style }}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div
            key={it.question}
            style={{
              borderBottom: '1px solid var(--border-subtle)',
              borderLeft: 'var(--rule-accent-width) solid ' + (isOpen ? 'var(--be-red)' : 'transparent'),
              paddingLeft: 'var(--space-4)',
              transition: 'border-color var(--duration-base) var(--ease-standard)',
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                background: 'none',
                border: 0,
                cursor: 'pointer',
                padding: 'var(--space-5) var(--space-4) var(--space-5) 0',
                minHeight: '44px',
                textAlign: 'left',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: '1.03125rem',
                lineHeight: 1.3,
                letterSpacing: 'var(--tracking-subhead)',
                textTransform: 'uppercase',
                color: isOpen ? 'var(--text-link)' : 'var(--text-strong)',
                transition: 'var(--transition-control)',
              }}
            >
              <span>{it.question}</span>
              <span aria-hidden="true" style={{ flex: '0 0 auto', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', lineHeight: 1, color: 'var(--text-accent-small)' }}>
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen ? (
              <div style={{ padding: '0 var(--space-6) var(--space-5) 0', color: 'var(--text-body)', fontSize: 'var(--text-body-size)', lineHeight: 1.72, maxWidth: '68ch' }}>
                {it.answer}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
