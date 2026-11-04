import { SectionHeading, SocialLinks, TextLink } from '../ds';
import { metaLabel } from './ui.jsx';
import { PUBLICATIONS, SOCIALS } from '../data/social.js';

/** Book, video and articles by James, plus his social links. Used on Home and About & Speaking. */
export default function Publications({ id = 'publications', number = 'Sect. 03', note = 'James writes about movement, family health and ADHD. Start with the book.' }) {
  return (
    <section id={id} style={{ padding: '0 var(--gutter) var(--section-y)' }}>
      <SectionHeading number={number} title="Publications" note={note} />
      <div>
        {PUBLICATIONS.map((p) => (
          <div key={p.href} className="be-program-row" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,.5fr) minmax(0,1.5fr) auto', gap: 'clamp(14px,2.4vw,38px)', alignItems: 'baseline', padding: 'clamp(18px,2.4vw,28px) 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <span style={{ ...metaLabel, lineHeight: 1.6 }}>{p.kind}<br /><span style={{ color: 'var(--text-link)' }}>{p.outlet}</span></span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(1.1rem,1.7vw,1.4rem)', lineHeight: 1.15, textTransform: 'uppercase', color: 'var(--text-strong)', textWrap: 'pretty' }}>{p.title}</span>
            <TextLink href={p.href} target="_blank" rel="noopener noreferrer">
              {p.cta}<span className="visually-hidden"> (opens in a new tab)</span>
            </TextLink>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px 24px', alignItems: 'center', flexWrap: 'wrap', paddingTop: '24px' }}>
        <span style={metaLabel}>Follow James</span>
        <SocialLinks items={SOCIALS} />
      </div>
    </section>
  );
}
