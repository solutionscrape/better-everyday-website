import { useState } from 'react';
import { Accordion, Button, Eyebrow, Field, Lede, SectionHeading, Split, TextLink } from '../ds';
import { LinkButton, Bullet, StatusNote, h3Style } from '../components/ui.jsx';
import { PACKAGES, packageLine } from '../data/catalog.js';
import { IMG, SERVICE_AREA, usd } from '../data/site.js';
import { useCart } from '../lib/cart.jsx';

const lead = { margin: 0, lineHeight: 1.7, color: 'var(--text-body)', fontSize: '1.0625rem' };
const tag = { fontSize: '11px', letterSpacing: '.22em', textTransform: 'uppercase', fontWeight: 600 };
const priceBig = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.6rem,2.6vw,2.2rem)', letterSpacing: '-.02em', color: 'var(--text-strong)', lineHeight: 1 };
const rowGrid = { display: 'grid', gridTemplateColumns: 'auto minmax(0,1.3fr) minmax(220px,.7fr)', gap: 'clamp(14px,2.4vw,38px)', alignItems: 'start', borderBottom: '1px solid var(--border-subtle)' };

const POINTS = [
  'Book sessions when they work for you, subject to availability.',
  'Weekly consistency is encouraged, never required.',
  'Select packages may be paid in installments.',
  'Each package is a one-time purchase, not an automatically renewing membership.',
];

const FAQ = [
  { question: 'Do I need any experience to start?', answer: 'No. James starts from where you are today, whether that is your first workout in years or your next season of sport.' },
  { question: 'Do you coach people with disabilities?', answer: 'Yes. James has extensive experience coaching youth and adults with autism, Down syndrome and other intellectual and developmental disabilities. Families and caregivers are part of the process.' },
  { question: 'Where do sessions happen?', answer: `In person across ${SERVICE_AREA.slice(0, -1).join(', ')} and ${SERVICE_AREA.at(-1)}. Virtual programming works anywhere.` },
  { question: 'How do I choose a package?', answer: 'Most people start with Build Momentum, 10 sessions at $90 each. If you want to try it first, Get Started gives you 5 sessions, or you can book a single session for $125 or the 3-Session Starter Package for $345. Packages are one-time purchases with no auto-renewal, and you book sessions when they work for you. Weekly sessions are recommended but never required.' },
];

function PackageRow({ pkg, onChoose }) {
  return (
    <div
      className="be-program-row"
      style={{
        ...rowGrid,
        padding: pkg.featured ? 'clamp(24px,3vw,40px) clamp(14px,1.8vw,24px)' : 'clamp(24px,3vw,40px) 0',
        ...(pkg.featured ? { background: 'var(--surface-card)', borderLeft: '3px solid #FC1111' } : null),
      }}
    >
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.3rem,2.3vw,1.9rem)', lineHeight: 1, color: '#FF4D4D' }}>{pkg.number}</span>
      <div style={{ display: 'grid', gap: '10px', minWidth: 0 }}>
        {pkg.badge ? <span style={{ ...tag, color: '#FF4D4D' }}>{pkg.badge}</span> : null}
        <h3 style={h3Style}>{pkg.title}</h3>
        <p style={{ margin: 0, lineHeight: 1.66, color: 'var(--text-body)', maxWidth: '52ch', textWrap: 'pretty' }}>{pkg.desc}</p>
        <span style={{ ...tag, color: 'var(--text-strong)' }}>{pkg.save}</span>
      </div>
      <div style={{ display: 'grid', gap: '10px', alignContent: 'start', minWidth: 0 }}>
        <span style={priceBig}>{usd(pkg.price).replace('.00', '')}</span>
        <span style={{ ...tag, color: '#8a93a0' }}>${pkg.perSession} per session</span>
        <span style={{ fontSize: '.875rem', lineHeight: 1.5, color: 'var(--text-body)' }}>{pkg.installments}</span>
        {pkg.featured ? (
          <Button onClick={onChoose} style={{ justifySelf: 'start' }}>Choose Your Package</Button>
        ) : (
          <LinkButton onClick={onChoose} style={{ justifySelf: 'start' }}>Choose Your Package →</LinkButton>
        )}
      </div>
    </div>
  );
}

export default function Services() {
  const cart = useCart();
  const [added, setAdded] = useState(null);
  const choose = (pkg) => () => {
    cart.add(packageLine(pkg));
    setAdded(pkg.title);
    cart.openCart();
  };
  const main = PACKAGES.filter((p) => !p.small);
  const small = PACKAGES.filter((p) => p.small);

  return (
    <>
      <Lede kicker="Work with James · Session packages" title="Your Goals. Your Schedule." accent="Your Pace." deck="Flexible session packages designed around real life." secondary={{ label: 'Have a question first?', href: '#contact' }} />
      <section style={{ padding: '0 var(--gutter) clamp(32px,4vw,56px)', display: 'grid', gap: '16px', maxWidth: '64ch' }}>
        <p style={lead}>Building consistency doesn't mean committing to a rigid schedule.</p>
        <p style={lead}>Purchase the sessions that fit your goals, then book them when it's convenient for you. Weekly sessions are recommended to help maintain momentum, but how often you schedule is entirely up to you.</p>
        <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-strong)', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '.01em' }}>
          No auto-renewing membership. No required weekly appointments. Just support when you need it.
        </p>
      </section>

      <section id="memberships" style={{ padding: '0 var(--gutter) var(--section-y)' }}>
        <SectionHeading number="Sect. 01" title="Choose Your Package" />
        <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-strong)' }}>
          {main.map((p) => <PackageRow key={p.id} pkg={p} onChoose={choose(p)} />)}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(300px,100%),1fr))', gap: 'clamp(32px,5vw,72px)', paddingTop: 'clamp(40px,5vw,72px)' }}>
          <div style={{ display: 'grid', gap: '16px', alignContent: 'start', borderTop: '1px solid var(--border-strong)', paddingTop: '24px' }}>
            <h3 style={h3Style}>Looking for something smaller?</h3>
            {small.map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', flexWrap: 'wrap', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-strong)', fontSize: '1.125rem' }}>{p.title} — ${p.price}</span>
                <LinkButton onClick={choose(p)} aria-label={'Add ' + p.title + ' to cart'}>Add to cart</LinkButton>
              </div>
            ))}
            <p style={{ margin: 0, lineHeight: 1.66, color: 'var(--text-body)', maxWidth: '52ch', textWrap: 'pretty' }}>Start where you're comfortable. You can always purchase another package later.</p>
          </div>
          <div style={{ display: 'grid', gap: '16px', alignContent: 'start', borderTop: '1px solid var(--border-strong)', paddingTop: '24px' }}>
            <h3 style={h3Style}>Flexible scheduling. Flexible ways to pay.</h3>
            <div style={{ display: 'grid', gap: '12px' }}>{POINTS.map((pt) => <Bullet key={pt}>{pt}</Bullet>)}</div>
            <p style={{ margin: '8px 0 0', fontSize: '.8125rem', lineHeight: 1.6, color: '#8a93a0', fontStyle: 'italic' }}>
              Installment plans are subject to availability and agreed payment terms. Booking, cancellation, and package redemption policies apply.
            </p>
          </div>
        </div>
        {added ? <StatusNote style={{ marginTop: '32px', padding: '6px 0 6px 16px' }}>{added} added to your cart.</StatusNote> : null}
      </section>

      <Split reverse image={IMG.headshot} imageAlt="Headshot of James Anderson, CSCS, smiling with arms crossed">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '46ch' }}>
          <Eyebrow>Your coach</Eyebrow>
          <h2 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h2-size)', lineHeight: 'var(--text-h2-lh)', letterSpacing: 'var(--tracking-heading)', textTransform: 'uppercase', color: 'var(--text-strong)' }}>Every Session Is With James</h2>
          <p style={{ margin: 0, fontSize: '1.03125rem', lineHeight: 1.7, color: 'var(--text-body)', textWrap: 'pretty' }}>
            James Anderson is an NSCA Certified Strength &amp; Conditioning Specialist and a former Registered Behavior Technician. He plans, coaches and adjusts every program himself.
          </p>
          <TextLink href="#contact">Ask James a question</TextLink>
        </div>
      </Split>

      <section style={{ padding: 'var(--section-y) var(--gutter)' }}>
        <SectionHeading number="Sect. 02" title="Common questions" note="If yours is not here, ask. You do not need to have everything figured out before reaching out." />
        <div style={{ paddingTop: '32px' }}>
          <Accordion defaultOpen={0} items={FAQ} />
        </div>
      </section>
      <Field tone="black" kicker="First step" title="Not Sure Which Level Fits?" body="Tell James a little about who the coaching is for. He will suggest a starting point, with no pressure to commit." action={{ label: 'Get in touch', href: '#contact' }} />
    </>
  );
}
