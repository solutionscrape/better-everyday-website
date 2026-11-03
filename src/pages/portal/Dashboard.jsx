import { useState } from 'react';
import { Button, ProgramRow, SelectField, SiteFooter, SiteRail, TextArea, TextField } from '../../ds';
import { LinkButton, Meta, SlotButton, StatusNote, Toggle, bodyText, displayStrong, h3Style, rowGrid } from '../../components/ui.jsx';
import { CONTACT, IMG, isEmail } from '../../data/site.js';
import { PACKAGES } from '../../data/catalog.js';
import { CLIENTS, DOWNLOADS, SLOTS, TABS, sortSessions, splitSlot } from './data.js';

const cardTitle = { fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.15, textTransform: 'uppercase', color: 'var(--text-strong)' };
const card = { display: 'grid', gap: '10px', alignContent: 'start', padding: '24px 24px 28px 0', borderBottom: '1px solid var(--border-subtle)' };
const twoCol = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: 'clamp(32px,5vw,72px)', alignItems: 'start' };
const panel = { display: 'grid', gap: '20px', borderTop: '1px solid var(--border-strong)', paddingTop: '24px' };

/** Package details for a client: catalog entry merged with what they've used and paid. */
function packageFor(client) {
  const pkg = PACKAGES.find((p) => p.id === client.package.id);
  return { ...pkg, ...client.package, total: pkg.sessions, short: pkg.title.split(' — ')[0] };
}

function useCredits(data, client) {
  const left = packageFor(client).total - client.package.completed;
  const booked = data.sessions.length;
  return { left, booked, unbooked: Math.max(0, left - booked) };
}

function Overview({ data, client }) {
  const next = sortSessions(data.sessions)[0];
  const done = client.plan.filter((x) => data.planDone[x.id]).length;
  const last = [...data.msgs].reverse().find((m) => m.from === 'James');
  const { left } = useCredits(data, client);
  const pkg = packageFor(client);
  const Card = ({ label, title, body, href, cta }) => (
    <div style={card}>
      <Meta>{label}</Meta>
      <span style={cardTitle}>{title}</span>
      <span style={bodyText}>{body}</span>
      <LinkButton href={href}>{cta} →</LinkButton>
    </div>
  );
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(260px,100%),1fr))', borderTop: '1px solid var(--border-strong)' }}>
      <Card label="Next session" title={next ? next.date : 'Nothing booked'} body={next ? next.time + ' · ' + next.place : 'Book your next session with James.'} href="#portal/schedule" cta="Manage schedule" />
      <Card label="This week’s plan" title={`${done} of ${client.plan.length} done`} body="Keep going. Small steps count." href="#portal/plan" cta="Open plan" />
      <Card label="Latest from James" title={last ? last.time : 'No messages yet'} body={last ? last.text : 'Send James a note any time.'} href="#portal/messages" cta={last ? 'Reply' : 'Message James'} />
      <Card label="Package" title={`${pkg.short} · ${left} left`} body={pkg.nextInstallment ? 'Next installment ' + pkg.nextInstallment.date : pkg.plan} href="#portal/package" cta="Billing" />
    </div>
  );
}

function Schedule({ data, update, client }) {
  const [booking, setBooking] = useState(false);
  const [resched, setResched] = useState(null);
  const [note, setNote] = useState('');
  const { unbooked } = useCredits(data, client);
  const taken = new Set(data.sessions.map((x) => x.date + ' · ' + x.time));
  const free = SLOTS.filter((x) => !taken.has(x));

  const book = (sl) => {
    update((d) => ({ sessions: [...d.sessions, { id: Date.now(), ...splitSlot(sl), type: client.sessionType, place: client.place }] }));
    setBooking(false);
    setNote('Booked ' + sl + '. James will confirm by message.');
  };
  const move = (id, sl) => {
    update((d) => ({ sessions: d.sessions.map((y) => (y.id === id ? { ...y, ...splitSlot(sl) } : y)) }));
    setResched(null);
    setNote('Moved to ' + sl + '. James will confirm by message.');
  };

  return (
    <div style={{ display: 'grid', gap: '8px' }}>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
        <Button size="lg" disabled={unbooked === 0} onClick={() => { setBooking(!booking); setResched(null); setNote(''); }}>Book a session</Button>
        {note ? <StatusNote>{note}</StatusNote> : null}
      </div>
      <p style={{ ...bodyText, fontSize: '.875rem', color: '#8a93a0' }}>
        {unbooked > 0 ? `${unbooked} of your package sessions ${unbooked === 1 ? 'is' : 'are'} ready to book.` : <>Every remaining session is booked. <a href="#services">Buy more sessions</a>.</>}
      </p>
      {booking ? (
        <div style={{ display: 'grid', gap: '10px', padding: '16px 0' }}>
          <Meta>Choose a time</Meta>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{free.map((sl) => <SlotButton key={sl} onClick={() => book(sl)}>{sl}</SlotButton>)}</div>
        </div>
      ) : null}
      <div style={{ borderTop: '1px solid var(--border-strong)', marginTop: '16px' }}>
        {sortSessions(data.sessions).map((s) => (
          <div key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ ...rowGrid, borderBottom: 0 }}>
              <span style={{ ...displayStrong, fontSize: '1.375rem' }}>{s.date}</span>
              <span style={{ color: 'var(--text-body)' }}>{s.time} · {s.place}</span>
              <span style={{ color: 'var(--text-body)' }}>{s.type}</span>
              <LinkButton onClick={() => { setResched(resched === s.id ? null : s.id); setBooking(false); setNote(''); }}>{resched === s.id ? 'Cancel' : 'Reschedule'}</LinkButton>
            </div>
            {resched === s.id ? (
              <div style={{ paddingBottom: '12px' }}>
                <Meta>Move to</Meta>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', paddingTop: '10px' }}>{free.map((sl) => <SlotButton key={sl} onClick={() => move(s.id, sl)}>{sl}</SlotButton>)}</div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
      <p style={{ margin: '12px 0 0', fontSize: '.875rem', color: '#8a93a0' }}>Please reschedule at least 24 hours ahead when you can.</p>
    </div>
  );
}

function Plan({ data, update, client }) {
  const done = client.plan.filter((x) => data.planDone[x.id]).length;
  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      <p style={bodyText}>{client.week} · {done} of {client.plan.length} done. James updates your plan after each session.</p>
      <div style={{ borderTop: '1px solid var(--border-strong)' }}>
        {client.plan.map((x) => {
          const on = !!data.planDone[x.id];
          return (
            <div key={x.id} style={rowGrid}>
              <span style={{ ...displayStrong, fontSize: '1.375rem', color: '#FF4D4D' }}>{x.day}</span>
              <div style={{ display: 'grid', gap: '4px', gridColumn: 'span 2', minWidth: 0 }}>
                <span style={{ ...displayStrong, fontSize: '1.0625rem' }}>{x.name}</span>
                <span style={{ color: 'var(--text-body)', fontSize: '.9375rem' }}>{x.detail}</span>
              </div>
              <Toggle active={on} onClick={() => update((d) => ({ planDone: { ...d.planDone, [x.id]: !d.planDone[x.id] } }))} style={{ justifySelf: 'start' }} aria-label={(on ? 'Mark not done: ' : 'Mark done: ') + x.name}>
                {on ? 'Done ✓' : 'Mark done'}
              </Toggle>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const ENERGY = [{ value: '1', label: '1 · Very low' }, { value: '2', label: '2 · Low' }, { value: '3', label: '3 · Okay' }, { value: '4', label: '4 · Good' }, { value: '5', label: '5 · Great' }];
const FEEL = ['Too easy', 'About right', 'A little hard', 'Too hard'];
const CI_EMPTY = { energy: '3', feel: 'About right', note: '' };

function Progress({ data, update }) {
  const [ci, setCi] = useState(CI_EMPTY);
  const [saved, setSaved] = useState(false);
  const f = (k) => ({ value: ci[k], onChange: (e) => { const v = e.target.value; setCi((c) => ({ ...c, [k]: v })); setSaved(false); } });
  const submit = () => {
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    update((d) => ({ checkins: [{ date: today, energy: ci.energy, feel: ci.feel, note: ci.note.trim() || 'No notes this week.' }, ...d.checkins] }));
    setCi(CI_EMPTY);
    setSaved(true);
  };
  return (
    <div style={twoCol}>
      <div style={panel}>
        <h2 style={h3Style}>Weekly check-in</h2>
        <SelectField id="ci-energy" label="Energy this week" options={ENERGY} {...f('energy')} />
        <SelectField id="ci-feel" label="How did the workouts feel?" options={FEEL} {...f('feel')} />
        <TextArea id="ci-note" label="Notes for James" rows={4} hint="Wins, sore spots, anything that got in the way." {...f('note')} />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="lg" onClick={submit}>Send check-in</Button>
          {saved ? <StatusNote>Check-in sent to James.</StatusNote> : null}
        </div>
      </div>
      <div style={{ borderTop: '1px solid var(--border-strong)', paddingTop: '24px' }}>
        <h2 style={h3Style}>History</h2>
        {data.checkins.map((c, i) => (
          <div key={i} style={{ display: 'grid', gap: '6px', padding: '18px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <Meta>{c.date}</Meta>
              <span style={{ fontSize: '.8125rem', color: '#8a93a0' }}>Energy {c.energy} · {c.feel}</span>
            </div>
            <p style={bodyText}>{c.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Messages({ data, update, me }) {
  const [draft, setDraft] = useState('');
  const send = () => {
    if (!draft.trim()) return;
    update((d) => ({ msgs: [...d.msgs, { from: me, time: 'Just now', text: draft.trim() }] }));
    setDraft('');
  };
  return (
    <div style={{ display: 'grid', gap: '24px', maxWidth: '760px' }}>
      <div style={{ borderTop: '1px solid var(--border-strong)' }} aria-live="polite">
        {data.msgs.map((m, i) => (
          <div key={i} style={{ display: 'grid', gap: '6px', padding: '18px 0 18px 16px', borderBottom: '1px solid var(--border-subtle)', borderLeft: '3px solid ' + (m.from === 'James' ? '#1E90D4' : 'transparent') }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <span style={displayStrong}>{m.from}</span>
              <span style={{ fontSize: '.8125rem', color: '#8a93a0' }}>{m.time}</span>
            </div>
            <p style={bodyText}>{m.text}</p>
          </div>
        ))}
      </div>
      <TextArea id="msg-draft" label="Message James" rows={4} value={draft} onChange={(e) => setDraft(e.target.value)} />
      <div><Button size="lg" onClick={send}>Send</Button></div>
    </div>
  );
}

function PackageTab({ data, client }) {
  const { left, booked } = useCredits(data, client);
  const pkg = packageFor(client);
  const n = pkg.nextInstallment;
  return (
    <div style={{ display: 'grid', gap: '40px' }}>
      <div style={{ borderTop: '1px solid var(--border-strong)' }}>
        <ProgramRow
          number={pkg.number}
          featured
          title={pkg.title}
          description={`${left} of ${pkg.total} sessions left, ${booked} already booked. A one-time package with no auto-renewal.`}
          price={'$' + pkg.price.toLocaleString('en-US')}
          priceNote={pkg.plan}
          action={{ label: 'Buy more sessions', href: '#services' }}
        />
      </div>
      <div>
        <h2 style={h3Style}>Billing</h2>
        <div style={rowGrid}>
          <Meta>{n ? 'Next installment' : 'Balance'}</Meta>
          <span style={{ color: 'var(--text-strong)' }}>{n ? n.date + ' · ' + n.amount : 'Nothing due'}</span>
          <span style={{ color: 'var(--text-body)' }}>{n ? n.label : pkg.plan} · managed in HubSpot</span>
          <LinkButton href={'mailto:' + CONTACT.email + '?subject=Billing%20question'}>Billing question →</LinkButton>
        </div>
        {pkg.invoices.map((i) => (
          <div key={i.date} style={rowGrid}>
            <Meta>{i.date}</Meta>
            <span style={{ color: 'var(--text-strong)' }}>{i.desc}</span>
            <span style={{ color: 'var(--text-body)' }}>{i.amt} · {i.status}</span>
            <LinkButton href="#portal/package">Receipt</LinkButton>
          </div>
        ))}
      </div>
    </div>
  );
}

const ACCESS = ['Full access', 'Schedule and messages', 'View only'];

function Family({ data, update, client, user }) {
  const [inv, setInv] = useState({ email: '', access: 'Schedule and messages' });
  const [err, setErr] = useState();
  const [note, setNote] = useState('');
  const send = () => {
    if (!isEmail(inv.email)) { setErr('Please enter a valid email address.'); return; }
    update((d) => ({ people: [...d.people, { name: inv.email.trim(), rel: 'Invited', access: inv.access, status: 'Invite sent' }] }));
    setInv({ email: '', access: 'Schedule and messages' });
    setNote('Invite sent.');
  };
  return (
    <div style={twoCol}>
      <div style={{ borderTop: '1px solid var(--border-strong)' }}>
        {data.people.length === 0 ? <p style={{ ...bodyText, padding: '18px 0' }}>No one else has access yet.</p> : null}
        {data.people.map((o) => (
          <div key={o.name} style={{ display: 'grid', gap: '4px', padding: '18px 0', borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <span style={displayStrong}>{o.name}</span>
              <span style={{ fontSize: '.8125rem', color: '#8a93a0' }}>{o.status}</span>
            </div>
            <span style={{ color: 'var(--text-body)' }}>{o.rel} · {o.access}</span>
          </div>
        ))}
      </div>
      <div style={panel}>
        <h2 style={h3Style}>Invite someone</h2>
        <p style={bodyText}>Give a parent, caregiver or support staff member access to {user.caregiver ? client.first + '’s' : 'your'} schedule, plan and messages.</p>
        <TextField id="inv-email" label="Their email" type="email" value={inv.email} error={err} onChange={(e) => { const v = e.target.value; setInv((x) => ({ ...x, email: v })); setErr(undefined); }} />
        <SelectField id="inv-access" label="Access" options={ACCESS} value={inv.access} onChange={(e) => { const v = e.target.value; setInv((x) => ({ ...x, access: v })); }} />
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Button size="lg" onClick={send}>Send invite</Button>
          {note ? <StatusNote>{note}</StatusNote> : null}
        </div>
      </div>
    </div>
  );
}

function Downloads() {
  return (
    <div style={{ borderTop: '1px solid var(--border-strong)', maxWidth: '900px' }}>
      {DOWNLOADS.map((d) => (
        <div key={d.title} style={rowGrid}>
          <span style={{ ...displayStrong, fontSize: '1.0625rem' }}>{d.title}</span>
          <span style={{ color: 'var(--text-body)' }}>{d.meta}</span>
          {/* TODO: link real PDFs once James provides them. */}
          <LinkButton href="#portal/downloads">Download</LinkButton>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ portal, sub }) {
  const tabKey = sub === 'membership' ? 'package' : TABS[sub] ? sub : 'overview';
  const tab = TABS[tabKey];
  const user = portal.user;
  const client = CLIENTS[user.client];
  const caregiver = !!user.caregiver;
  const title = tab.title || 'Welcome Back, ' + user.first;
  const props = { data: portal.data[user.client], update: (fn) => portal.update(user.client, fn), me: user.me, client, user };
  const signOut = () => { portal.setUser(null); window.location.hash = '#portal'; };
  const Body = { overview: Overview, schedule: Schedule, plan: Plan, progress: Progress, messages: Messages, package: PackageTab, family: Family, downloads: Downloads }[tabKey];

  return (
    <div className="be-shell">
      <SiteRail
        logoSrc={IMG.mark}
        homeHref="#portal/overview"
        items={Object.entries(TABS).map(([k, t]) => ({ label: t.label, href: '#portal/' + k }))}
        active={tab.label}
        ctaLabel="Message James"
        ctaHref="#portal/messages"
        phone={CONTACT.phone}
        service="Client portal"
      />
      <main style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap', padding: '0 var(--gutter)', minHeight: '44px', borderBottom: '1px solid #4b5563', fontSize: '11px', letterSpacing: '.15em', textTransform: 'uppercase', color: '#8a93a0' }}>
          <span>Signed in as {user.name} · {user.roleLabel}</span>
          {caregiver ? <span style={{ color: 'var(--text-strong)' }}>Viewing {client.name}’s account</span> : null}
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#home" style={{ color: '#8a93a0', textDecoration: 'none', boxShadow: 'none', minHeight: '44px', display: 'flex', alignItems: 'center' }}>Website</a>
            <button type="button" onClick={signOut} style={{ background: 'none', border: 0, cursor: 'pointer', minHeight: '44px', font: 'inherit', letterSpacing: 'inherit', textTransform: 'inherit', color: '#1E90D4' }}>Sign out</button>
          </div>
        </div>
        <div style={{ padding: 'clamp(40px,5vw,80px) var(--gutter) var(--section-y)', display: 'grid', gap: '40px' }}>
          <header style={{ display: 'grid', gap: '14px' }}>
            <Meta>{tab.kicker}</Meta>
            <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.2rem,4.4vw,4rem)', lineHeight: 0.98, letterSpacing: 'var(--tracking-display)', textTransform: 'uppercase', color: 'var(--text-strong)', textWrap: 'balance' }}>{title}</h1>
          </header>
          <Body key={tabKey} {...props} />
        </div>
        <SiteFooter />
      </main>
    </div>
  );
}
