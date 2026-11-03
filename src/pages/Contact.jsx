import { useRef, useState } from 'react';
import { Button, Eyebrow, Lede, Plate, SelectField, TextArea, TextField, TextLink } from '../ds';
import { LinkButton, h2Style, metaLabel } from '../components/ui.jsx';
import { CONTACT, IMG, SERVICE_AREA, isEmail, phoneDigits } from '../data/site.js';

const WHO = ['Myself', 'My child', 'A family member I support', 'A group or facility', 'Not sure yet'];
const INTEREST = ['1:1 coaching', 'Session package', 'Adaptive & inclusive training', 'Virtual programming', 'Speaking engagement', 'Something else'];
const EMPTY = { name: '', email: '', phone: '', who: WHO[0], interest: INTEREST[0], message: '' };

const bigLink = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.375rem', letterSpacing: '.01em', textDecoration: 'none' };

/** Posts the form to Netlify Forms (the static twin lives in index.html). */
async function submitToNetlify(form) {
  const body = new URLSearchParams({ 'form-name': 'contact', ...form }).toString();
  const res = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body });
  if (!res.ok) throw new Error('Form submission failed: ' + res.status);
}

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed
  const [sentTo, setSentTo] = useState(null);
  const formRef = useRef(null);

  const ctrl = (k) => ({
    value: form[k],
    error: errors[k],
    onChange: (e) => {
      const v = e.target.value;
      setForm((f) => ({ ...f, [k]: v }));
      setErrors((er) => ({ ...er, [k]: undefined }));
    },
  });

  async function submit(e) {
    e.preventDefault();
    const er = {};
    if (!form.name.trim()) er.name = 'Please add your name.';
    if (!isEmail(form.email)) er.email = 'Please enter a valid email address.';
    if (form.message.trim().length < 10) er.message = 'Please write a little more so James can help.';
    if (Object.keys(er).length) {
      setErrors(er);
      formRef.current?.querySelector('#cf-' + Object.keys(er)[0])?.focus();
      return;
    }
    setStatus('sending');
    try {
      await submitToNetlify(form);
    } catch (err) {
      // The Vite dev server has no Netlify Forms endpoint; let the success state show locally.
      if (!import.meta.env.DEV) {
        console.error(err);
        setStatus('failed');
        return;
      }
    }
    setSentTo({ first: form.name.trim().split(' ')[0], email: form.email.trim() });
    setStatus('sent');
  }

  const reset = () => { setForm(EMPTY); setStatus('idle'); setSentTo(null); };

  return (
    <>
      <Lede kicker="Contact" title="Ready to Take the First" accent="Step?" deck="Use the form below to send James a message. Whether you are a family, a caregiver or a facility director, he will get back to you as soon as he can." />
      <section style={{ padding: '0 var(--gutter) var(--section-y)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'clamp(32px,5vw,80px)', alignItems: 'start' }}>
        <div style={{ borderTop: '1px solid var(--border-strong)', paddingTop: '32px', minWidth: 0 }}>
          {status !== 'sent' ? (
            <form ref={formRef} onSubmit={submit} noValidate name="contact" style={{ display: 'grid', gap: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: '24px' }}>
                <TextField id="cf-name" name="name" label="Your name" required autoComplete="name" {...ctrl('name')} />
                <TextField id="cf-email" name="email" label="Email" type="email" required autoComplete="email" {...ctrl('email')} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: '24px' }}>
                <TextField id="cf-phone" name="phone" label="Phone" type="tel" hint="Optional" autoComplete="tel" {...ctrl('phone')} />
                <SelectField id="cf-who" name="who" label="Who is the coaching for?" options={WHO} {...ctrl('who')} />
              </div>
              <SelectField id="cf-interest" name="interest" label="What are you interested in?" options={INTEREST} {...ctrl('interest')} />
              <TextArea id="cf-message" name="message" label="Message" required rows={6} hint="A few sentences is plenty. Goals, questions or anything James should know." {...ctrl('message')} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
                <Button type="submit" size="lg" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</Button>
                <span style={{ fontSize: '.8125rem', color: '#8a93a0' }}><span style={{ color: '#FF4D4D' }}>*</span> Required</span>
              </div>
              {status === 'failed' ? (
                <p role="alert" style={{ margin: 0, color: '#FF4D4D' }}>
                  Your message did not go through. Please try again, or email James at <a href={'mailto:' + CONTACT.email}>{CONTACT.email}</a>.
                </p>
              ) : null}
            </form>
          ) : (
            <div role="status" style={{ borderLeft: '3px solid #FC1111', padding: '8px 0 8px 24px', display: 'grid', gap: '16px' }}>
              <Eyebrow>Message sent</Eyebrow>
              <h2 style={h2Style}>Thank you, {sentTo.first}</h2>
              <p style={{ margin: 0, fontSize: '1.03125rem', lineHeight: 1.7, color: 'var(--text-body)', maxWidth: '46ch' }}>James has your message and will reply to {sentTo.email} as soon as he can.</p>
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <TextLink href="#memberships">See packages</TextLink>
                <LinkButton onClick={reset}>Send another message</LinkButton>
              </div>
            </div>
          )}
        </div>
        <aside style={{ borderTop: '1px solid var(--border-strong)', paddingTop: '32px', display: 'grid', gap: '28px', minWidth: 0 }}>
          <div style={{ display: 'grid', gap: '8px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={metaLabel}>Email</span>
            <a href={'mailto:' + CONTACT.email} style={{ ...bigLink, wordBreak: 'break-word' }}>{CONTACT.email}</a>
          </div>
          <div style={{ display: 'grid', gap: '8px', paddingBottom: '24px', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={metaLabel}>Phone</span>
            <a href={'tel:' + phoneDigits} style={bigLink}>{CONTACT.phone}</a>
          </div>
          <div style={{ display: 'grid', gap: '8px' }}>
            <span style={metaLabel}>Service area</span>
            <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--text-body)' }}>{SERVICE_AREA.join(' · ')}</p>
            <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--text-body)' }}>Virtual programming anywhere.</p>
          </div>
        </aside>
      </section>
      <Plate
        data-pos="group"
        height="clamp(340px,52vw,680px)"
        number="03"
        src={IMG.group}
        alt="A group of participants, several using wheelchairs, flexing and smiling in the Better Everyday Athletics gym"
        caption="The Better Everyday community · Colorado"
      />
    </>
  );
}
