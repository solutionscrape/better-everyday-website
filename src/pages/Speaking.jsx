// Speaking page, built on the speaker one-sheet: who James is and who he helps, three topics
// with takeaways and PDF topic sheets, formats, video, media coverage, schedule and booking.
import { useRef, useState } from 'react';
import { Button, Eyebrow, Field, Quote, SectionHeading, SelectField, Split, StatRow, TextArea, TextField, TextLink } from '../ds';
import { AsSeenIn, MediaList, VideoEmbed } from '../components/Media.jsx';
import { Bullet, LinkButton, h2Style, h3Style, metaLabel } from '../components/ui.jsx';
import { CONTACT, IMG, isEmail } from '../data/site.js';
import {
  AUDIENCES, AUDIENCE_OPTIONS, BUDGET_OPTIONS, FORMATS, FORMAT_OPTIONS, NOW_BOOKING, ORG_OPTIONS,
  SCHEDULE, SETTING_OPTIONS, SPEAKING_FACTS, TOPICS,
} from '../data/speaking.js';
import { formatDate } from '../data/media.js';
import { submitNetlifyForm } from '../lib/netlify-forms.js';

export const bodyP = { margin: 0, fontSize: '1.03125rem', lineHeight: 1.7, color: 'var(--text-body)', textWrap: 'pretty' };
const twoUp = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(220px,100%),1fr))', gap: '24px' };
const TOPIC_OPTIONS = [...TOPICS.map((t) => t.title), 'A custom topic', 'Not sure yet'];
const REQUEST = '#speaking/request';
const speakingMail = (subject) => 'mailto:' + CONTACT.speakingEmail + '?subject=' + encodeURIComponent(subject);
const EMPTY = {
  name: '', email: '', phone: '', organization: '', orgType: ORG_OPTIONS[0], date: '', setting: SETTING_OPTIONS[0], location: '',
  audience: '', audienceSize: AUDIENCE_OPTIONS[1], topic: TOPIC_OPTIONS[0], format: FORMAT_OPTIONS[0], budget: BUDGET_OPTIONS.at(-1), message: '',
};

function Intro() {
  return (
    <>
      <Split image={IMG.headshot} imageAlt="Headshot of James Anderson, CSCS, smiling with arms crossed" style={{ borderTop: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '52ch' }}>
          <Eyebrow>Speaking · Available nationwide</Eyebrow>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h1-size)', lineHeight: 'var(--text-h1-lh)', letterSpacing: 'var(--tracking-display)', textTransform: 'uppercase', color: 'var(--text-strong)' }}>
            James Anderson, <span style={{ color: 'var(--be-red)' }}>CSCS</span>
          </h1>
          <span style={{ ...metaLabel, color: 'var(--text-strong)' }}>Speaker · Inclusive fitness coach · Author of Legacy of Health</span>
          <p style={bodyP}>
            James is a Certified Strength &amp; Conditioning Specialist and former Registered Behavior Technician who coaches people of all abilities. He helps nonprofits and behavioral and physical health providers serve clients with special needs through movement, and challenges graduating classes to build a life around purpose and passion rather than money.
          </p>
          <div style={{ display: 'flex', gap: '16px 24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button size="lg" href={REQUEST}>Invite James to speak</Button>
            <TextLink href="#speaking/topics">See the topics</TextLink>
          </div>
        </div>
      </Split>
      <StatRow items={SPEAKING_FACTS} />
      <AsSeenIn scope="national" label="As seen in" note="James’s feature “Why Inclusive Fitness Is About More Than Exercise” ran in 2,622 news outlets across all 50 states." />
    </>
  );
}

function WhoHeHelps() {
  return (
    <section id="speaking-audiences" style={{ padding: 'var(--section-y) var(--gutter) 0' }}>
      <SectionHeading number="Sect. 01" title="Who James helps" note="Three kinds of rooms, one message: everyone deserves the chance to get a little better every day." />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(280px,100%),1fr))', gap: 'clamp(24px,3vw,48px)', paddingTop: '32px' }}>
        {AUDIENCES.map((a) => (
          <div key={a.title} style={{ display: 'grid', gap: '14px', alignContent: 'start', borderTop: '3px solid #FC1111', paddingTop: '20px' }}>
            <h3 style={h3Style}>{a.title}</h3>
            <p style={{ margin: 0, lineHeight: 1.66, color: 'var(--text-body)', textWrap: 'pretty' }}>{a.desc}</p>
            <span style={{ fontSize: '.875rem', lineHeight: 1.6, color: '#8a93a0' }}>{a.examples}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Topics() {
  return (
    <section id="speaking-topics" style={{ padding: 'var(--section-y) var(--gutter)' }}>
      <SectionHeading number="Sect. 02" title="Three topics" note="Every talk is shaped around the people in the room. Download a topic sheet to share with your team." />
      {TOPICS.map((t, i) => (
        <div key={t.id} id={'topic-' + t.id} className="be-program-row" style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1.3fr) minmax(0,.8fr)', gap: 'clamp(14px,2.4vw,38px)', alignItems: 'start', padding: 'clamp(24px,3vw,40px) 0', borderBottom: '1px solid var(--border-subtle)' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.3rem,2.3vw,1.9rem)', lineHeight: 1, color: '#FF4D4D' }}>{String(i + 1).padStart(2, '0')}</span>
          <div style={{ display: 'grid', gap: '10px', minWidth: 0 }}>
            <span style={{ ...metaLabel, color: 'var(--text-link)' }}>{t.label}</span>
            <h3 style={h3Style}>{t.title}</h3>
            <p style={{ margin: 0, lineHeight: 1.66, color: 'var(--text-body)', maxWidth: '58ch', textWrap: 'pretty' }}>{t.desc}</p>
            <span style={{ fontSize: '.875rem', lineHeight: 1.6, color: '#8a93a0' }}>Best for: {t.audience}</span>
          </div>
          <div style={{ display: 'grid', gap: '12px', alignContent: 'start' }}>
            <span style={metaLabel}>Audience takeaways</span>
            <div style={{ display: 'grid', gap: '10px' }}>{t.takeaways.map((k) => <Bullet key={k}>{k}</Bullet>)}</div>
            <div style={{ display: 'flex', gap: '4px 20px', flexWrap: 'wrap' }}>
              <TextLink href={t.pdf} target="_blank" rel="noopener">Topic sheet (PDF)<span className="visually-hidden">: {t.title}, opens in a new tab</span></TextLink>
              <TextLink href={REQUEST}>Request this talk</TextLink>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}

function Formats() {
  return (
    <section id="speaking-formats" style={{ padding: 'var(--section-y) var(--gutter)' }}>
      <SectionHeading number="Sect. 03" title="Formats & video" />
      <div className="be-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.2fr)', gap: 'clamp(32px,5vw,72px)', paddingTop: '32px', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: '16px', alignContent: 'start' }}>
          <h3 style={h3Style}>How James presents</h3>
          <div style={{ display: 'grid', gap: '12px' }}>{FORMATS.map((f) => <Bullet key={f}>{f}</Bullet>)}</div>
          <p style={{ ...bodyP, marginTop: '8px' }}>In person or virtual. National, virtual and co-op events are welcome, and James plans accessibility needs with you ahead of time so everyone can take part.</p>
        </div>
        <div style={{ display: 'grid', gap: '12px' }}>
          <VideoEmbed id="cS0J61IcJxU" title="Fitness Fun at FRIENDS of Broomfield" />
          <span style={{ fontSize: '.875rem', lineHeight: 1.6, color: '#8a93a0' }}>James coaching his twice-weekly class at FRIENDS of Broomfield.</span>
        </div>
      </div>
    </section>
  );
}

function Schedule() {
  return (
    <section id="speaking-schedule" style={{ padding: '0 var(--gutter) var(--section-y)' }}>
      <SectionHeading number="Sect. 05" title="Speaker schedule" />
      {SCHEDULE.length ? (
        <div>
          {SCHEDULE.map((e) => (
            <div key={e.date + e.title} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(170px,100%),1fr))', gap: '8px 24px', alignItems: 'baseline', padding: '20px 0', borderBottom: '1px solid var(--border-subtle)' }}>
              <span style={{ ...h3Style, fontSize: '1.25rem' }}>{formatDate(e.date)}</span>
              <span style={{ color: 'var(--text-strong)' }}>{e.title}</span>
              <span style={{ color: 'var(--text-body)' }}>{e.org} · {e.location}</span>
            </div>
          ))}
        </div>
      ) : null}
      <div style={{ display: 'flex', gap: '16px 32px', alignItems: 'center', flexWrap: 'wrap', paddingTop: '24px' }}>
        <span style={{ ...h3Style, fontSize: 'clamp(1.2rem,2vw,1.6rem)' }}>{NOW_BOOKING}</span>
        <Button href={REQUEST}>Invite James to speak</Button>
      </div>
    </section>
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
    if (!form.organization.trim()) x.organization = 'Please add the organization or event.';
    if (form.setting !== 'Virtual' && !form.location.trim()) x.location = 'Please add the city and state, or choose Virtual.';
    if (form.message.trim().length < 10) x.message = 'Please tell James a little about the event.';
    if (!form.name.trim()) x.name = 'Please add your name.';
    if (!isEmail(form.email)) x.email = 'Please enter a valid email address.';
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
      <SectionHeading number="Book" title="Invite James to speak" note="In person or virtual. National, virtual and co-op events are welcome. Share what you know so far." />
      <div className="be-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,2fr) minmax(0,1fr)', gap: 'clamp(32px,5vw,80px)', alignItems: 'start', paddingTop: '32px' }}>
        {status !== 'sent' ? (
          <form ref={ref} onSubmit={submit} noValidate name="speaking" style={{ display: 'grid', gap: '32px', minWidth: 0 }}>
            <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'grid', gap: '24px', minWidth: 0 }}>
              <legend style={{ ...metaLabel, color: 'var(--text-strong)', marginBottom: '16px', padding: 0 }}>The event</legend>
              <div style={twoUp}>
                <TextField id="sp-organization" label="Organization or event" required autoComplete="organization" {...ctrl('organization')} />
                <SelectField id="sp-orgType" label="Type of organization" options={ORG_OPTIONS} {...ctrl('orgType')} />
              </div>
              <div style={twoUp}>
                <TextField id="sp-date" label="Date or timeframe" hint="For example: March 12, or spring 2027" {...ctrl('date')} />
                <SelectField id="sp-setting" label="In person or virtual" options={SETTING_OPTIONS} {...ctrl('setting')} />
              </div>
              <TextField id="sp-location" label="Location" required={form.setting !== 'Virtual'} hint="City and state. Not needed for virtual events." {...ctrl('location')} />
              <div style={twoUp}>
                <TextField id="sp-audience" label="Who is the audience?" hint="For example: graduating seniors, ABA therapists, families" {...ctrl('audience')} />
                <SelectField id="sp-audienceSize" label="Audience size" options={AUDIENCE_OPTIONS} {...ctrl('audienceSize')} />
              </div>
              <div style={twoUp}>
                <SelectField id="sp-topic" label="Topic" options={TOPIC_OPTIONS} {...ctrl('topic')} />
                <SelectField id="sp-format" label="Format" options={FORMAT_OPTIONS} {...ctrl('format')} />
              </div>
              <SelectField id="sp-budget" label="Budget" options={BUDGET_OPTIONS} hint="An estimate is fine. It helps James suggest the right format." {...ctrl('budget')} />
              <TextArea id="sp-message" label="About the event" required rows={5} hint="The event theme, what you hope attendees take away, and any travel or accessibility details." {...ctrl('message')} />
            </fieldset>
            <fieldset style={{ border: 0, margin: 0, padding: 0, display: 'grid', gap: '24px', minWidth: 0 }}>
              <legend style={{ ...metaLabel, color: 'var(--text-strong)', marginBottom: '16px', padding: 0 }}>Your contact details</legend>
              <div style={twoUp}>
                <TextField id="sp-name" label="Your name" required autoComplete="name" {...ctrl('name')} />
                <TextField id="sp-email" label="Email" type="email" required autoComplete="email" {...ctrl('email')} />
              </div>
              <TextField id="sp-phone" label="Phone" type="tel" hint="Optional" autoComplete="tel" {...ctrl('phone')} />
            </fieldset>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <Button type="submit" size="lg" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send request'}</Button>
              <span style={{ fontSize: '.8125rem', color: '#8a93a0' }}><span style={{ color: '#FF4D4D' }}>*</span> Required</span>
            </div>
            {status === 'failed' ? (
              <p role="alert" style={{ margin: 0, color: '#FF4D4D' }}>
                Your request did not go through. Please try again, or email <a href={speakingMail('Speaking request')}>{CONTACT.speakingEmail}</a>.
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
          <span style={metaLabel}>Speaking inquiries</span>
          <a id="speaking-email" href={speakingMail('Speaking inquiry')} style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', textDecoration: 'none', wordBreak: 'break-word' }}>{CONTACT.speakingEmail}</a>
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
      <Intro />
      <WhoHeHelps />
      <Topics />
      <Field
        tone="red"
        kicker="The message"
        title="Get a Little Better Every Day"
        body="Progress, not perfection. Failure is not a stopping point, but a stepping stone. It is the idea behind every talk James gives, in every room."
        action={{ label: 'Invite James to speak', href: REQUEST }}
      />
      <Formats />
      <MediaList id="speaking-media" variant="speaking" showVideo={false} number="Sect. 04" title="Media coverage" note="Articles, interviews and appearances, and how each one connects to what James speaks about." />
      <Schedule />
      <section style={{ padding: '0 var(--gutter) var(--section-y)' }}>
        <Quote
          variant="lead"
          quote="He has the patience, temperament, kindness, poise, responsibility, reliability, respect, and fun-loving nature needed to be an excellent role model."
          author="Michael Kirkland"
          role="Sports Buddies Team Lead, Big Brothers Big Sisters of Colorado"
          style={{ maxWidth: '64ch' }}
        />
      </section>
      <RequestForm />
    </>
  );
}
