import { useState } from 'react';
import { Button, TextField } from '../../ds';
import { LinkButton, Meta, StatusNote, h2Style } from '../../components/ui.jsx';
import { IMG, isEmail } from '../../data/site.js';
import { ACCOUNTS, DEMO_PASSWORD, findAccount } from './data.js';

export default function Login({ portal }) {
  const [login, setLogin] = useState({ email: '', password: '' });
  const [err, setErr] = useState({});
  const [forgotSent, setForgotSent] = useState(false);

  const field = (k) => ({
    value: login[k],
    error: err[k],
    onChange: (e) => { const v = e.target.value; setLogin((l) => ({ ...l, [k]: v })); setErr((x) => ({ ...x, [k]: undefined })); },
  });

  function signIn(e) {
    e.preventDefault();
    const x = {};
    if (!isEmail(login.email)) x.email = 'Please enter the email James has on file.';
    if (login.password.length < 6) x.password = 'Passwords are at least 6 characters.';
    if (Object.keys(x).length) { setErr(x); return; }
    // Demo only: credentials are checked in the browser against the sample accounts.
    const account = findAccount(login.email, login.password);
    if (!account) { setErr({ password: 'That email and password do not match an account.' }); return; }
    portal.setUser(account);
    window.location.hash = '#portal/overview';
  }

  const fill = (a) => { setLogin({ email: a.email, password: DEMO_PASSWORD }); setErr({}); };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '48px var(--gutter)', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', maxWidth: '440px', display: 'grid', gap: '24px' }}>
        <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', boxShadow: 'none' }}>
          <img src={IMG.mark} alt="Better Everyday Athletics" style={{ height: '48px', width: 'auto' }} />
          <span aria-hidden="true" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', lineHeight: 1.05, color: 'var(--text-strong)' }}>Better Everyday<br />Athletics</span>
        </a>
        <form onSubmit={signIn} noValidate style={{ display: 'grid', gap: '24px' }}>
          <div style={{ display: 'grid', gap: '12px', borderTop: '1px solid var(--border-strong)', paddingTop: '24px' }}>
            <Meta>Client portal</Meta>
            <h1 style={h2Style}>Sign In</h1>
          </div>
          <TextField id="pl-email" label="Email" type="email" autoComplete="email" {...field('email')} />
          <TextField id="pl-password" label="Password" type="password" autoComplete="current-password" {...field('password')} />
          <Button type="submit" size="lg" fullWidth>Sign in</Button>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <LinkButton onClick={() => setForgotSent(true)} style={{ color: '#8a93a0' }}>Forgot password?</LinkButton>
          </div>
          {forgotSent ? <StatusNote>If that email has an account, a reset link is on its way.</StatusNote> : null}
        </form>

        <section aria-labelledby="demo-label" style={{ display: 'grid', gap: '4px', borderTop: '1px solid var(--border-strong)', paddingTop: '20px' }}>
          <Meta id="demo-label">Demo accounts · password {DEMO_PASSWORD}</Meta>
          {ACCOUNTS.map((a) => (
            <button
              key={a.email}
              type="button"
              onClick={() => fill(a)}
              aria-label={'Use demo account for ' + a.name}
              style={{ display: 'grid', gap: '2px', textAlign: 'left', background: login.email === a.email ? 'var(--surface-card)' : 'none', border: 0, borderBottom: '1px solid var(--border-subtle)', padding: '12px 8px', cursor: 'pointer', minHeight: '44px', color: 'inherit', font: 'inherit' }}
            >
              <span style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-strong)' }}>{a.name}</span>
                <span style={{ fontSize: '.8125rem', color: '#1E90D4' }}>{a.email}</span>
              </span>
              <span style={{ fontSize: '.8125rem', color: '#8a93a0' }}>{a.roleLabel} · {a.blurb}</span>
            </button>
          ))}
          <p style={{ margin: '8px 0 0', fontSize: '.8125rem', lineHeight: 1.6, color: '#8a93a0' }}>Choose an account to fill in its sign-in details, then select Sign in.</p>
        </section>

        <p style={{ margin: 0, fontSize: '.875rem', lineHeight: 1.6, color: '#8a93a0' }}>
          New client? Your login is set up after your first conversation with James. <a href="#contact">Get in touch</a>.
        </p>
      </div>
    </div>
  );
}
