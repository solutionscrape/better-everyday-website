import { useRef, useState } from 'react';
import { Button, Eyebrow, Lede, Quote, SectionHeading, SelectField, Split, StatRow, TextArea, TextField, TextLink } from '../ds';
import Publications from '../components/Publications.jsx';
import { Bullet, LinkButton, h2Style, h3Style, metaLabel } from '../components/ui.jsx';
import { CONTACT, IMG, isEmail } from '../data/site.js';
import { AUDIENCE_OPTIONS, FORMATS, FORMAT_OPTIONS, SETTING_OPTIONS, SPEAKING_FACTS, TOPICS } from '../data/speaking.js';
import { submitNetlifyForm } from '../lib/netlify-forms.js';

const bodyP = { margin: 0, fontSize: '1.03125rem', lineHeight: 1.7, color: 'var(--text-body)', textWrap: 'pretty' };
const twoUp = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: '24px' };
const TOPIC_OPTIONS = [...TOPICS.map((t) => t.title), 'A custom topic', 'Not sure yet'];
const EMPTY = { name: '', email: '', organization: '', phone: '', date: '', setting: SETTING_OPTIONS[0], format: FORMAT_OPTIONS[0], audience: AUDIENCE_OPTIONS[1], topic: TOPIC_OPTIONS[0], message: '' };

function Topics() {
  return (
    <section id="speaking-topics" style={{ padding: 'var(--section-y) var(--gutter)' }}>
      <SectionHeading number="Sect. 01" title="Speaking topics" note="Every talk is shaped around the audience in the room. These are where most conversations start." />
      <div>
        {TOPICS.map((t, i) => (
          <div key={t.title} className="be-program-row" style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1.3fr) minmax(0,.7fr)', gap: 'clamp(14px,2.4vw,38px)', alignItems: 'baseline', padding: 'clamp(22px,3vw,38px) 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.3rem,2.3vw,1.9rem)', lineHeight: 1, color: '#FF4D4D' }}>{String(i + 1).padStart(2, '0')}</span>
            <div style={{ display: 'grid', gap: '10px', minWidth: 0 }}>
              <h3 style={h3Style}>{t.title}</h3>
              <p style={{ margin: 0, lineHeight: 1.66, color: 'var(--text-body)', maxWidth: '56ch', textWrap: 'pretty' }}>{t.desc}</p>
            </div>
            <div style={{ display: 'grid', gap: '6px' }}>
              <span style={metaLabel}>Best for</span>
              <span style={{ fontSize: '.9375rem', lineHeight: 1.6, color: 'var(--text-body)' }}>{t.audience}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Formats() {
  return (
    <section id="speaking-formats" style={{ padding: '0 var(--gutter) var(--section-y)' }}>
      <SectionHeading number="Sect. 02" title="Formats & logistics" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'clamp(32px,5vw,72px)', paddingTop: '32px' }}>
        <div style={{ display: 'grid', gap: '16px', alignContent: 'start' }}>
          <h3 style={h3Style}>How James presents</h3>
          <div style={{ display: 'grid', gap: '12px' }}>{FORMATS.map((f) => <Bullet key={f}>{f}</Bullet>)}</div>
        </div>
        <div style={{ display: 'grid', gap: '16px', alignContent: 'start' }}>
          <h3 style={h3Style}>Where and how</h3>
          <p style={bodyP}>In person across Colorado, and virtual anywhere.</p>
          <p style={bodyP}>Talks are plainspoken and practical, and they get people moving when the room allows. James plans accessibility needs with you ahead of time so everyone can take part.</p>
          <TextLink href="https://youtu.be/cS0J61IcJxU" target="_blank" rel="noopener noreferrer">
            Watch James coach at FRIENDS of Broomfield<span className="visually-hidden"> (opens in a new tab)</span>
          </TextLink>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <div id="speaking-about">
      <Split reverse image={IMG.headshot} imageAlt="Headshot of James Anderson, CSCS, smiling with arms crossed">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '50ch' }}>
          <Eyebrow>About James</Eyebrow>
          <h2 style={h2Style}>James Anderson, CSCS</h2>
          <p style={{ margin: 0, borderLeft: '3px solid #FC1111', paddingLeft: '20px', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.2rem,2vw,1.6rem)', lineHeight: 1.2, textTransform: 'uppercase', color: 'var(--text-strong)' }}>
            “To empower individuals of all abilities to realize their full potential through movement.”
          </p>
          <p style={bodyP}>James is an NSCA Certified Strength &amp; Conditioning Specialist, a former Registered Behavior Technician and the author of <em>Legacy of Health</em>. His mission is woven into everything he does, from coaching athletes to supporting individuals with intellectual and developmental disabilities.</p>
          <p style={bodyP}>His work with the Special Olympics of Colorado and his background in behavioral therapy give him a rare depth of understanding when it comes to motivation, adaptation and personal growth. He builds meaningful connections, provides unwavering encouragement and celebrates every win, big or small.</p>
          <div style={{ display: 'flex', gap: '8px 24px', flexWrap: 'wrap' }}>
            <TextLink href="#speaking/request">Invite James to speak</TextLink>
            <TextLink href="#services">Work with James</TextLink>
          </div>
        </div>
      </Split>
      <section style={{ padding: 'var(--section-y) var(--gutter)' }}>
        <Quote
          variant="lead"
          quote="He has the patience, temperament, kindness, poise, responsibility, reliability, respect, and fun-loving nature needed to be an excellent role model."
          author="Michael Kirkland"
          role="Sports Buddies Team Lead, Big Brothers Big Sisters of Colorado"
          style={{ maxWidth: '64ch' }}
        />
      </section>
    </div>
  );
}

function RequestForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | failed
  const [sent, setSent] = useState(null);
  const ref = useRef(null);

  const ctrl = (k) => ({
    name: k,
    value: form[k],
    error: errors[k],
    onChange: (e) => { const v = e.target.value; setForm((f) => ({ ...f, [k]: v })); setErrors((x) => ({ ...x, [k]: undefined })); },
  });

  async function submit(e) {
    e.preventDefault();
    const x = {};
    if (!form.name.trim()) x.name = 'Please add your name.';
    if (!isEmail(form.email)) x.email = 'Please enter a valid email address.';
    if (!form.organization.trim()) x.organization = 'Please add the organization or event.';
    if (form.message.trim().length < 10) x.message = 'Please tell James a little about the event.';
    if (Object.keys(x).length) {
      setErrors(x);
      ref.current?.querySelector('#sp-' + Object.keys(x)[0])?.focus();
      return;
    }
    setStatus('sending');
    try {
      await submitNetlifyForm('speaking', form);
    } catch (err) {
      // The Vite dev server has no Netlify Forms endpoint; show the success state locally.
      if (!import.meta.env.DEV) { console.error(err); setStatus('failed'); return; }
    }
    setSent({ first: form.name.trim().split(' ')[0], email: form.email.trim() });
    setStatus('sent');
  }

  return (
    <section id="speaking-request" style={{ padding: '0 var(--gutter) var(--section-y)' }}>
      <SectionHeading number="Sect. 04" title="Invite James to speak" note="Share what you know so far. Dates and details can be worked out together." />
      <div className="be-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 'clamp(32px,5vw,80px)', alignItems: 'start', paddingTop: '32px' }}>
        {status !== 'sent' ? (
          <form ref={ref} onSubmit={submit} noValidate name="speaking" style={{ display: 'grid', gap: '24px', minWidth: 0 }}>
            <div style={twoUp}>
              <TextField id="sp-name" label="Your name" required autoComplete="name" {...ctrl('name')} />
              <TextField id="sp-email" label="Email" type="email" required autoComplete="email" {...ctrl('email')} />
            </div>
            <div style={twoUp}>
              <TextField id="sp-organization" label="Organization or event" required autoComplete="organization" {...ctrl('organization')} />
              <TextField id="sp-phone" label="Phone" type="tel" hint="Optional" autoComplete="tel" {...ctrl('phone')} />
            </div>
            <div style={twoUp}>
              <TextField id="sp-date" label="Event date or timeframe" hint="For example: March 12, or spring 2027" {...ctrl('date')} />
              <SelectField id="sp-setting" label="Setting" options={SETTING_OPTIONS} {...ctrl('setting')} />
            </div>
            <div style={twoUp}>
              <SelectField id="sp-format" label="Format" options={FORMAT_OPTIONS} {...ctrl('format')} />
              <SelectField id="sp-audience" label="Audience size" options={AUDIENCE_OPTIONS} {...ctrl('audience')} />
            </div>
            <SelectField id="sp-topic" label="Topic" options={TOPIC_OPTIONS} {...ctrl('topic')} />
            <TextArea id="sp-message" label="About the event" required rows={5} hint="Who will be in the room, what you hope they take away, and anything about accessibility or budget." {...ctrl('message')} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <Button type="submit" size="lg" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send request'}</Button>
              <span style={{ fontSize: '.8125rem', color: '#8a93a0' }}><span style={{ color: '#FF4D4D' }}>*</span> Required</span>
            </div>
            {status === 'failed' ? (
              <p role="alert" style={{ margin: 0, color: '#FF4D4D' }}>
                Your request did not go through. Please try again, or email James at <a href={'mailto:' + CONTACT.email}>{CONTACT.email}</a>.
              </p>
            ) : null}
          </form>
        ) : (
          <div role="status" style={{ borderLeft: '3px solid #FC1111', padding: '8px 0 8px 24px', display: 'grid', gap: '16px' }}>
            <Eyebrow>Request sent</Eyebrow>
            <h3 style={h2Style}>Thank you, {sent.first}</h3>
            <p style={{ ...bodyP, maxWidth: '46ch' }}>James has your request and will reply to {sent.email} to talk through the details.</p>
            <LinkButton onClick={() => { setForm(EMPTY); setStatus('idle'); setSent(null); }}>Send another request</LinkButton>
          </div>
        )}
        <aside style={{ borderTop: '1px solid var(--border-strong)', paddingTop: '24px', display: 'grid', gap: '16px', alignContent: 'start' }}>
          <span style={metaLabel}>Prefer to talk first?</span>
          <a href={'mailto:' + CONTACT.email + '?subject=Speaking%20inquiry'} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', textDecoration: 'none', wordBreak: 'break-word' }}>{CONTACT.email}</a>
          <a href={'tel:' + CONTACT.phone.replace(/[^0-9]/g, '')} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', textDecoration: 'none' }}>{CONTACT.phone}</a>
          <p style={{ margin: 0, fontSize: '.875rem', lineHeight: 1.6, color: '#8a93a0' }}>You do not need to have everything figured out before reaching out.</p>
        </aside>
      </div>
    </section>
  );
}

export default function Speaking() {
  return (
    <>
      <Lede
        kicker="About & speaking · James Anderson, CSCS"
        title="Movement Is for"
        accent="Everyone"
        deck="James speaks to schools, parent groups, care providers and organizations about inclusive fitness, family health and building habits that last. Practical, warm and grounded in years of coaching people of all abilities."
        primary={{ label: 'Invite James to speak', href: '#speaking/request' }}
        secondary={{ label: 'Meet James', href: '#speaking/about' }}
      />
      <StatRow items={SPEAKING_FACTS} style={{ borderTop: '1px solid var(--border-strong)' }} />
      <Topics />
      <Formats />
      <About />
      <Publications id="speaking-publications" number="Sect. 03" note="The book, the video and the writing behind the talks." />
      <RequestForm />
    </>
  );
}
