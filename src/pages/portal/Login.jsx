import { useState } from 'react';
import { Button, TextField } from '../../ds';
import { LinkButton, Toggle, Meta, StatusNote, h2Style } from '../../components/ui.jsx';
import { IMG, isEmail } from '../../data/site.js';

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
    // Demo only: any well-formed email and 6+ character password signs in.
    portal.setAuthed(true);
    window.location.hash = '#portal/overview';
  }

  const useDemo = () => {
    setLogin({ email: portal.role === 'Caregiver' ? 'alex@example.com' : 'jordan@example.com', password: 'demo1234' });
    setErr({});
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '48px var(--gutter)', boxSizing: 'border-box' }}>
      <form onSubmit={signIn} noValidate style={{ width: '100%', maxWidth: '440px', display: 'grid', gap: '24px' }}>
        <a href="#home" style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none', boxShadow: 'none' }}>
          <img src={IMG.mark} alt="Better Everyday Athletics" style={{ height: '48px', width: 'auto' }} />
          <span aria-hidden="true" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', lineHeight: 1.05, color: 'var(--text-strong)' }}>Better Everyday<br />Athletics</span>
        </a>
        <div style={{ display: 'grid', gap: '12px', borderTop: '1px solid var(--border-strong)', paddingTop: '24px' }}>
          <Meta>Client portal</Meta>
          <h1 style={h2Style}>Sign In</h1>
        </div>
        <div style={{ display: 'grid', gap: '10px' }}>
          <Meta id="role-label">I am signing in as</Meta>
          <div role="group" aria-labelledby="role-label" style={{ display: 'flex', gap: '8px' }}>
            {['Client', 'Caregiver'].map((r) => (
              <Toggle key={r} active={portal.role === r} onClick={() => portal.setRole(r)} style={{ flex: 1 }}>{r === 'Client' ? 'Client' : 'Parent / caregiver'}</Toggle>
            ))}
          </div>
        </div>
        <TextField id="pl-email" label="Email" type="email" autoComplete="email" {...field('email')} />
        <TextField id="pl-password" label="Password" type="password" autoComplete="current-password" {...field('password')} />
        <Button type="submit" size="lg" fullWidth>Sign in</Button>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <LinkButton onClick={useDemo}>Use demo account</LinkButton>
          <LinkButton onClick={() => setForgotSent(true)} style={{ color: '#8a93a0' }}>Forgot password?</LinkButton>
        </div>
        {forgotSent ? <StatusNote>If that email has an account, a reset link is on its way.</StatusNote> : null}
        <p style={{ margin: 0, fontSize: '.875rem', lineHeight: 1.6, color: '#8a93a0' }}>
          New client? Your login is set up after your first conversation with James. <a href="#contact">Get in touch</a>.
        </p>
      </form>
    </div>
  );
}
