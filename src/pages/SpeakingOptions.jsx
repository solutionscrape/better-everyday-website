// Three design options for the speaking page, shown side by side while one is chosen.
// #speaking and #speaking-1 → Option 1, #speaking-2 → Option 2, #speaking-3 → Option 3.
// Once a direction is picked, keep that option, delete the others and the switcher.
import { Button, Eyebrow, Field, Plate, Quote, SectionHeading, Split, StatRow, TextLink } from '../ds';
import Publications from '../components/Publications.jsx';
import { h3Style, metaLabel } from '../components/ui.jsx';
import { IMG } from '../data/site.js';
import { AUDIENCES, SPEAKING_FACTS, TOPICS } from '../data/speaking.js';
import { About, RequestForm, SpeakingGuide, bodyP } from './Speaking.jsx';

const VIDEO = 'https://youtu.be/cS0J61IcJxU';
const OPTIONS = [
  { base: '#speaking-1', label: 'Option 1 · Program guide' },
  { base: '#speaking-2', label: 'Option 2 · Speaker one-sheet' },
  { base: '#speaking-3', label: 'Option 3 · Keynote first' },
];

const KIRKLAND = {
  quote: 'He has the patience, temperament, kindness, poise, responsibility, reliability, respect, and fun-loving nature needed to be an excellent role model.',
  author: 'Michael Kirkland',
  role: 'Sports Buddies Team Lead, Big Brothers Big Sisters of Colorado',
};

const External = ({ href, children }) => (
  <TextLink href={href} target="_blank" rel="noopener noreferrer">
    {children}<span className="visually-hidden"> (opens in a new tab)</span>
  </TextLink>
);

/** Temporary bar for flipping between the three design options. */
function OptionSwitcher({ current }) {
  return (
    <nav aria-label="Speaking page design options" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 16px', padding: '10px var(--gutter)', background: '#1B1D22', borderBottom: '1px solid var(--border-strong)' }}>
      <span style={{ ...metaLabel, color: '#FF4D4D' }}>Design review</span>
      {OPTIONS.map((o) => {
        const on = o.base === current;
        return (
          <a
            key={o.base}
            href={o.base}
            aria-current={on ? 'page' : undefined}
            style={{ minHeight: '36px', display: 'inline-flex', alignItems: 'center', padding: '0 14px', border: '1px solid var(--border-subtle)', textDecoration: 'none', boxShadow: 'none', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '.8125rem', letterSpacing: 'var(--tracking-button)', textTransform: 'uppercase', background: on ? 'var(--be-blue-ink)' : 'transparent', color: on ? '#fff' : 'var(--text-strong)' }}
          >
            {o.label}
          </a>
        );
      })}
    </nav>
  );
}

/** Option 2 · Speaker one-sheet: photo-led, short, each audience paired with its talk. */
function SpeakingOneSheet({ base }) {
  const pairs = AUDIENCES.map((a, i) => ({ audience: a, topic: TOPICS[i] }));
  return (
    <>
      <Split image={IMG.headshot} imageAlt="Headshot of James Anderson, CSCS, smiling with arms crossed" style={{ borderTop: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '52ch' }}>
          <Eyebrow>Speaking · Available nationwide</Eyebrow>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h1-size)', lineHeight: 'var(--text-h1-lh)', letterSpacing: 'var(--tracking-display)', textTransform: 'uppercase', color: 'var(--text-strong)' }}>
            James Anderson, <span style={{ color: 'var(--be-red)' }}>CSCS</span>
          </h1>
          <span style={{ ...metaLabel, color: 'var(--text-strong)' }}>Speaker · Coach · Author of Legacy of Health</span>
          <p style={bodyP}>James helps nonprofits and health providers serve people of all abilities through movement, and challenges graduating classes to build a life around purpose and passion rather than money.</p>
          <div style={{ display: 'flex', gap: '16px 24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <Button size="lg" href={base + '/request'}>Invite James to speak</Button>
            <External href={VIDEO}>Watch James coach</External>
          </div>
        </div>
      </Split>
      <StatRow items={SPEAKING_FACTS} />

      <section id="speaking-talks" style={{ padding: 'var(--section-y) var(--gutter)' }}>
        <SectionHeading number="Talks" title="Three rooms, three talks" note="Each talk is shaped around the people in the room." />
        {pairs.map(({ audience, topic }, i) => (
          <div key={topic.title} className="be-program-row" style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1.4fr) minmax(0,.6fr)', gap: 'clamp(14px,2.4vw,38px)', alignItems: 'baseline', padding: 'clamp(24px,3vw,40px) 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.3rem,2.3vw,1.9rem)', lineHeight: 1, color: '#FF4D4D' }}>{String(i + 1).padStart(2, '0')}</span>
            <div style={{ display: 'grid', gap: '10px', minWidth: 0 }}>
              <span style={{ ...metaLabel, color: 'var(--text-link)' }}>For {audience.title.charAt(0).toLowerCase() + audience.title.slice(1)}</span>
              <h3 style={h3Style}>{topic.title}</h3>
              <p style={{ margin: 0, lineHeight: 1.66, color: 'var(--text-body)', maxWidth: '58ch', textWrap: 'pretty' }}>{topic.desc}</p>
            </div>
            <div style={{ display: 'grid', gap: '10px', alignContent: 'start' }}>
              <span style={{ fontSize: '.875rem', lineHeight: 1.6, color: '#8a93a0' }}>{audience.examples}</span>
              <TextLink href={base + '/request'}>Request this talk</TextLink>
            </div>
          </div>
        ))}
      </section>

      <Field
        tone="red"
        kicker="The message"
        title="Get a Little Better Every Day"
        body="Progress, not perfection. Failure is not a stopping point, but a stepping stone. It is the idea behind every talk James gives, in every room."
        action={{ label: 'Invite James to speak', href: base + '/request' }}
      />
      <section style={{ padding: 'var(--section-y) var(--gutter)' }}>
        <Quote variant="lead" {...KIRKLAND} style={{ maxWidth: '64ch' }} />
      </section>
      <RequestForm number="Book" />
    </>
  );
}

/** Option 3 · Keynote first: leads with the message and the graduation keynote, then organizations. */
function SpeakingKeynote({ base }) {
  const [movement, methods, purpose, progress] = TOPICS;
  const [nonprofits, providers, schools] = AUDIENCES;
  return (
    <>
      <section style={{ padding: 'clamp(44px,6.2vw,104px) var(--gutter) clamp(28px,3.6vw,50px)' }}>
        <Eyebrow style={{ marginBottom: 'clamp(20px,3vw,34px)' }}>Keynote speaker · Available nationwide</Eyebrow>
        <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(3.6rem,10vw,8.6rem)', lineHeight: 0.86, letterSpacing: 'var(--tracking-display)', textTransform: 'uppercase', color: 'var(--text-strong)' }}>
          Purpose<br />Over <span style={{ color: 'var(--be-red)' }}>Paycheck</span>
        </h1>
        <div className="be-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gap: 'var(--space-5)', marginTop: 'clamp(26px,3.6vw,46px)', borderTop: '1px solid var(--border-strong)', paddingTop: 'var(--space-5)' }}>
          <p style={{ gridColumn: 'span 7', margin: 0, fontSize: 'var(--text-lead-size)', lineHeight: 'var(--text-lead-lh)', maxWidth: '46ch', color: 'var(--text-body)' }}>
            James Anderson, CSCS, challenges students, staff and leaders to find the work they were made for, follow their passion and measure success by the people they serve.
          </p>
          <div style={{ gridColumn: 'span 5', display: 'flex', gap: 'var(--space-5)', alignItems: 'center', flexWrap: 'wrap', alignContent: 'flex-start' }}>
            <Button size="lg" href={base + '/request'}>Invite James to speak</Button>
            <External href={VIDEO}>Watch James coach</External>
          </div>
        </div>
      </section>
      <Plate data-pos="speaker" breakRail={false} src={IMG.james} alt="James Anderson on a field at sunset with a young player" number="—" caption="James Anderson, CSCS · Better Everyday Athletics" height="clamp(320px,44vw,600px)" />

      <section id="speaking-keynote" style={{ padding: 'var(--section-y) var(--gutter)' }}>
        <SectionHeading number="Keynote" title="The signature talk" note={schools.examples} />
        <div className="be-program-row" style={{ display: 'grid', gridTemplateColumns: 'auto minmax(0,1.4fr) auto', gap: 'clamp(14px,2.4vw,38px)', alignItems: 'center', marginTop: '24px', padding: 'clamp(24px,3vw,40px) clamp(14px,1.8vw,24px)', background: 'var(--surface-card)', borderLeft: '3px solid #FC1111' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.3rem,2.3vw,1.9rem)', lineHeight: 1, color: '#FF4D4D' }}>01</span>
          <div style={{ display: 'grid', gap: '10px', minWidth: 0 }}>
            <span style={{ ...metaLabel, color: '#FF4D4D' }}>Graduations · youth events</span>
            <h3 style={{ ...h3Style, fontSize: 'clamp(1.6rem,3vw,2.4rem)' }}>{purpose.title}</h3>
            <p style={{ margin: 0, lineHeight: 1.66, color: 'var(--text-body)', maxWidth: '60ch', textWrap: 'pretty' }}>{purpose.desc}</p>
          </div>
          <Button href={base + '/request'} style={{ justifySelf: 'start' }}>Book this keynote</Button>
        </div>
      </section>

      <section id="speaking-organizations" style={{ padding: '0 var(--gutter) var(--section-y)' }}>
        <SectionHeading number="For organizations" title="Serve every client better" note="For teams that already serve people with disabilities, and want to do more through movement." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'clamp(32px,5vw,72px)', paddingTop: '32px' }}>
          {[[nonprofits, movement], [providers, methods]].map(([a, t]) => (
            <div key={t.title} style={{ display: 'grid', gap: '14px', alignContent: 'start', borderTop: '3px solid #FC1111', paddingTop: '20px' }}>
              <span style={{ ...metaLabel, color: 'var(--text-link)' }}>{a.title}</span>
              <h3 style={h3Style}>{t.title}</h3>
              <p style={{ margin: 0, lineHeight: 1.66, color: 'var(--text-body)', textWrap: 'pretty' }}>{t.desc}</p>
              <span style={{ fontSize: '.875rem', lineHeight: 1.6, color: '#8a93a0' }}>{a.examples}</span>
              <TextLink href={base + '/request'}>Request this session</TextLink>
            </div>
          ))}
        </div>
        <p style={{ margin: '40px 0 0', lineHeight: 1.7, color: 'var(--text-body)' }}>
          Also available for any audience: <strong style={{ color: 'var(--text-strong)' }}>{progress.title}</strong>, on mindset, setbacks and getting a little better every day.
        </p>
      </section>

      <About base={base} />
      <Publications id="speaking-publications" number="Writing" note="The book, the video and the writing behind the talks." />
      <RequestForm number="Book" />
    </>
  );
}

export default function Speaking({ variant }) {
  const base = OPTIONS.some((o) => o.base === '#' + variant) ? '#' + variant : '#speaking-1';
  const Page = { '#speaking-1': SpeakingGuide, '#speaking-2': SpeakingOneSheet, '#speaking-3': SpeakingKeynote }[base];
  return (
    <>
      <OptionSwitcher current={base} />
      <Page base={base} />
    </>
  );
}
