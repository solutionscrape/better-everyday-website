// Shared media building blocks used by the business site (Home, Media) and the speaking page.
import { Button, SectionHeading, SocialLinks, TextLink } from '../ds';
import { metaLabel, h3Style } from './ui.jsx';
import { MEDIA, formatDate, localPlacements, logoFor, nationalPlacements, seenIn } from '../data/media.js';
import { SOCIALS } from '../data/social.js';

const isExternal = (href) => /^https?:/.test(href);
const linkProps = (href) => (isExternal(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {});
const NewTab = ({ href }) => (isExternal(href) ? <span className="visually-hidden"> (opens in a new tab)</span> : null);

/** Network tag from an outlet name, e.g. "KHQ-TV (NBC)" → "NBC". */
const networkOf = (name) => (name.match(/\((ABC|NBC|CBS|FOX|CW|PBS)[^)]*\)/) || name.match(/\b(ABC|NBC|CBS|FOX|CW|PBS)\b/) || [])[1] || null;
const stripNetwork = (name) => name.replace(/\s*\((ABC|NBC|CBS|FOX|CW|PBS)[^)]*\)/, '');

/** One outlet in a ticker: the publisher's logo when we have it, otherwise a name badge. */
function TickerItem({ p, hidden }) {
  const logo = logoFor(p.outlet);
  const network = networkOf(p.outlet);
  return (
    <li aria-hidden={hidden || undefined}>
      <a href={p.url} target="_blank" rel="noopener noreferrer" tabIndex={hidden ? -1 : undefined} className={'be-ticker-item' + (logo ? ' has-logo' : '')} title={p.outlet + (p.city ? ' · ' + p.city + ', ' + p.state : '')}>
        {logo ? <img src={logo} alt="" loading="lazy" decoding="async" /> : null}
        <span className="be-ticker-name">{stripNetwork(p.outlet)}</span>
        {network ? <span className="be-ticker-net">{network}</span> : null}
        {!hidden ? <span className="visually-hidden"> ({p.city ? p.city + ', ' + p.state + '; ' : ''}opens in a new tab)</span> : null}
      </a>
    </li>
  );
}

/** One scrolling row. Duration scales with length so every row moves at the same speed. */
function TickerRow({ label, outlets, reverse = false }) {
  return (
    <div className="be-ticker-row">
      {label ? <span className="be-ticker-label">{label}</span> : null}
      <div className="be-marquee-window">
        <ul className={'be-marquee-track' + (reverse ? ' is-reverse' : '')} style={{ animationDuration: Math.max(30, outlets.length * 3.2) + 's' }}>
          {outlets.map((p) => <TickerItem key={'a-' + p.outlet} p={p} />)}
          {outlets.map((p) => <TickerItem key={'b-' + p.outlet} p={p} hidden />)}
        </ul>
      </div>
    </div>
  );
}

/**
 * Scrolling "As seen in" ticker. Each outlet links to the placement itself.
 * Pauses on hover and focus, and stays still for people who prefer reduced motion.
 * rows: [{ scope: 'local' | 'national' | 'broadcast', label }]
 */
export function AsSeenIn({ scope = 'local', rows, label = 'As seen in', note }) {
  const list = (rows || [{ scope }]).map((r) => ({ ...r, outlets: seenIn(r.scope) })).filter((r) => r.outlets.length);
  if (!list.length) return null;
  return (
    <section aria-label={label} className="be-marquee" style={{ borderTop: '1px solid var(--border-strong)', borderBottom: '1px solid var(--border-strong)' }}>
      <div style={{ display: 'grid', gap: '10px', padding: '16px var(--gutter)' }}>
        <span style={{ ...metaLabel, color: '#FF4D4D' }}>{label}</span>
        {list.map((r, i) => <TickerRow key={r.scope} label={r.label} outlets={r.outlets} reverse={i % 2 === 1} />)}
      </div>
      {note ? <p style={{ margin: 0, padding: '0 var(--gutter) 16px', fontSize: '.8125rem', lineHeight: 1.6, color: '#8a93a0' }}>{note}</p> : null}
    </section>
  );
}

/** Responsive, privacy-friendly YouTube embed. */
export function VideoEmbed({ id, title }) {
  return (
    <div style={{ position: 'relative', aspectRatio: '16 / 9', background: 'var(--surface-sunken)', borderTop: '1px solid var(--border-strong)' }}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
      />
    </div>
  );
}

/** Headline numbers from a syndication report, e.g. 2,622 placements · 50 states. */
function ReachLine({ item }) {
  const s = item.placements?.stats;
  if (!s) return null;
  const parts = [s.placements && s.placements.toLocaleString('en-US') + ' placements', s.states && s.states + ' states', s.metroMarkets && s.metroMarkets + ' metro markets'].filter(Boolean);
  return <span style={{ ...metaLabel, color: 'var(--text-strong)' }}>{parts.join(' · ')}</span>;
}

/**
 * One media item in the shared format.
 * variant 'families' (business site) or 'speaking' (speaking page) picks which note and which placements show.
 */
export function MediaItem({ item, variant = 'families', showVideo = true }) {
  const near = variant === 'families' ? localPlacements(item) : nationalPlacements(item).slice(0, 8);
  return (
    <article id={'media-' + item.id} style={{ display: 'grid', gap: '14px', padding: 'clamp(24px,3vw,40px) 0', borderBottom: '1px solid var(--border-subtle)' }}>
      <span style={{ ...metaLabel, lineHeight: 1.6 }}>
        <span style={{ color: '#FF4D4D' }}>{item.type}</span> · {item.outlet}{item.date ? ' · ' + formatDate(item.date) : ''}
      </span>
      <h3 style={{ ...h3Style, maxWidth: '30ch' }}>{item.title}</h3>
      <ReachLine item={item} />
      <div className="be-stack-sm" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr)', gap: 'clamp(20px,3vw,48px)', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: '14px', minWidth: 0 }}>
          <p style={{ margin: 0, lineHeight: 1.7, color: 'var(--text-body)', textWrap: 'pretty' }}>{item.intro}</p>
          <div style={{ borderLeft: '3px solid #FC1111', paddingLeft: '16px', display: 'grid', gap: '6px' }}>
            <span style={metaLabel}>{variant === 'families' ? 'What it means for families' : 'What your audience can learn'}</span>
            <p style={{ margin: 0, lineHeight: 1.66, color: 'var(--text-strong)', textWrap: 'pretty' }}>{variant === 'families' ? item.families : item.speaking}</p>
          </div>
          <div style={{ display: 'flex', gap: '8px 24px', flexWrap: 'wrap' }}>
            <TextLink href={item.action.href} {...linkProps(item.action.href)}>{item.action.label}<NewTab href={item.action.href} /></TextLink>
            {item.audio ? <TextLink href={item.audio} {...linkProps(item.audio)}>Listen to the appearance<NewTab href={item.audio} /></TextLink> : null}
            {item.more ? <TextLink href={item.more.href} {...linkProps(item.more.href)}>{item.more.label}<NewTab href={item.more.href} /></TextLink> : null}
          </div>
        </div>
        {item.youtube && showVideo ? <VideoEmbed id={item.youtube} title={item.title} /> : null}
        {near.length ? (
          <div style={{ display: 'grid', gap: '10px', alignContent: 'start' }}>
            <span style={metaLabel}>{variant === 'families' ? 'Where it ran near you' : 'Where it ran'}</span>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: '2px' }}>
              {near.map((p) => (
                <li key={p.url}>
                  <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', minHeight: '36px', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', textDecoration: 'none', boxShadow: 'none', fontSize: '.9375rem' }}>
                    <span>{p.outlet}<span className="visually-hidden"> (opens in a new tab)</span></span>
                    <span style={{ fontSize: '.8125rem', color: '#8a93a0', whiteSpace: 'nowrap' }}>{p.city}, {p.state}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </article>
  );
}

/** The full media list in one variant, with an optional heading. */
export function MediaList({ id, variant = 'families', number, title = 'Media', note, limit, moreHref, showSocials = true, showVideo = true }) {
  const items = limit ? MEDIA.slice(0, limit) : MEDIA;
  return (
    <section id={id} style={{ padding: 'var(--section-y) var(--gutter)' }}>
      <SectionHeading number={number} title={title} note={note} />
      <div>{items.map((m) => <MediaItem key={m.id} item={m} variant={variant} showVideo={showVideo} />)}</div>
      <div style={{ display: 'flex', gap: '12px 24px', alignItems: 'center', flexWrap: 'wrap', paddingTop: '24px', justifyContent: 'space-between' }}>
        {showSocials ? (
          <div style={{ display: 'flex', gap: '12px 24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={metaLabel}>Follow James</span>
            <SocialLinks items={SOCIALS} />
          </div>
        ) : <span />}
        {moreHref ? <TextLink href={moreHref}>See all media</TextLink> : null}
      </div>
    </section>
  );
}

/** "See the work, take the next step": explore services → book → speaking. */
export function NextSteps({ number = 'Next' }) {
  const steps = [
    { n: '01', title: 'Explore services', body: 'See how James coaches kids, adults and seniors of all abilities.', label: 'Work with James', href: '#services' },
    { n: '02', title: 'Book a session', body: 'Choose a session package. No auto-renewal, and you book when it suits you.', label: 'See packages', href: '#memberships', primary: true },
    { n: '03', title: 'Bring James to your group', body: 'Talks and staff trainings for nonprofits, health providers and schools.', label: 'Speaking', href: '#speaking' },
  ];
  return (
    <section style={{ padding: '0 var(--gutter) var(--section-y)' }}>
      <SectionHeading number={number} title="Take the next step" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(240px,100%),1fr))', gap: '16px', paddingTop: '24px' }}>
        {steps.map((s) => (
          <div key={s.n} style={{ display: 'grid', gap: '10px', alignContent: 'start', padding: '20px', borderTop: '1px solid var(--border-strong)', ...(s.primary ? { background: 'var(--surface-card)', borderLeft: '3px solid #FC1111' } : null) }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', lineHeight: 1, color: '#FF4D4D' }}>{s.n}</span>
            <span style={{ ...h3Style, fontSize: '1.25rem' }}>{s.title}</span>
            <p style={{ margin: 0, lineHeight: 1.6, color: 'var(--text-body)' }}>{s.body}</p>
            {s.primary ? <Button href={s.href} style={{ justifySelf: 'start' }}>{s.label}</Button> : <TextLink href={s.href}>{s.label}</TextLink>}
          </div>
        ))}
      </div>
    </section>
  );
}
