// SAMPLE DATA ONLY. The portal is a front-end prototype: nothing here is saved, and the
// demo passwords below ship to the browser. A production version needs real accounts
// (e.g. Supabase auth), a database, and package/billing status from HubSpot.

import { useState } from 'react';

export const TABS = {
  overview: { label: 'Overview', kicker: 'Client portal', title: null },
  schedule: { label: 'Schedule', kicker: 'Sessions', title: 'Schedule' },
  plan: { label: 'Workout Plan', kicker: 'This week', title: 'Workout Plan' },
  progress: { label: 'Progress', kicker: 'Check-ins', title: 'Progress' },
  messages: { label: 'Messages', kicker: 'Coach James', title: 'Messages' },
  package: { label: 'Package', kicker: 'Account', title: 'Package & Billing' },
  family: { label: 'Family Access', kicker: 'Shared access', title: 'Family Access' },
  downloads: { label: 'Downloads', kicker: 'Library', title: 'Downloads' },
};

export const SLOTS = ['Mon, Oct 19 · 3:30 PM', 'Tue, Oct 20 · 5:00 PM', 'Wed, Oct 21 · 4:00 PM', 'Fri, Oct 23 · 9:00 AM', 'Sat, Oct 24 · 10:30 AM'];

export const DOWNLOADS = [
  { title: 'Legacy of Health – Chapter 2', meta: 'PDF · Free chapter' },
  { title: 'Better Everyday Workout Guide', meta: 'PDF · Home workouts' },
  { title: 'This Week’s Plan', meta: 'PDF · Printable' },
];

export const DEMO_PASSWORD = 'demo1234';

/** The four demo logins. A caregiver account points at the client it manages. */
export const ACCOUNTS = [
  { email: 'jordan@example.com', name: 'Jordan Morgan', first: 'Jordan', roleLabel: 'Client', client: 'jordan', me: 'Jordan', blurb: 'Youth client · 10-session package' },
  { email: 'alex@example.com', name: 'Alex Morgan', first: 'Alex', roleLabel: 'Parent / caregiver', client: 'jordan', me: 'Alex (parent)', caregiver: true, blurb: 'Parent viewing Jordan’s account' },
  { email: 'margaret@example.com', name: 'Margaret Ellis', first: 'Margaret', roleLabel: 'Client', client: 'margaret', me: 'Margaret', blurb: 'Senior balance training · 20-session package' },
  { email: 'sam@example.com', name: 'Sam Rivera', first: 'Sam', roleLabel: 'Client', client: 'sam', me: 'Sam', blurb: 'Virtual programming · 5-session package' },
];

export function findAccount(email, password) {
  const a = ACCOUNTS.find((x) => x.email === String(email).trim().toLowerCase());
  return a && password === DEMO_PASSWORD ? a : null;
}

/** Per-client profile: package, plan and the starting sample data. */
export const CLIENTS = {
  jordan: {
    name: 'Jordan Morgan',
    first: 'Jordan',
    place: 'Broomfield field',
    sessionType: '1:1 Strength',
    package: {
      id: 'pkg-ten',
      completed: 4,
      plan: '3 payments of $300',
      nextInstallment: { date: 'Nov 1, 2026', amount: '$300.00', label: 'Installment 3 of 3' },
      invoices: [
        { date: 'Oct 1, 2026', desc: 'Build Momentum · installment 2 of 3', amt: '$300.00', status: 'Paid' },
        { date: 'Sep 1, 2026', desc: 'Build Momentum · installment 1 of 3', amt: '$300.00', status: 'Paid' },
      ],
    },
    week: 'Week of October 12',
    plan: [
      { id: 'a', day: 'Mon', name: 'Warm-up and balance circuit', detail: '10 min · step-ups, single-leg holds, heel walks' },
      { id: 'b', day: 'Tue', name: 'Walk or ride', detail: '20–30 min at an easy, talking pace' },
      { id: 'c', day: 'Wed', name: 'Strength A', detail: '3 × 10 goblet squats · 3 × 8 band rows · 3 × 20 s plank' },
      { id: 'd', day: 'Fri', name: 'Strength B', detail: '3 × 8 step-ups · 3 × 10 wall push-ups · 3 × 12 glute bridges' },
      { id: 'e', day: 'Sat', name: 'Family activity', detail: 'Anything active together: the park, bikes or a short hike' },
    ],
    initial: {
      sessions: [
        { id: 1, date: 'Thu, Oct 15', time: '4:00 PM', type: '1:1 Strength', place: 'Broomfield field' },
        { id: 2, date: 'Thu, Oct 22', time: '4:00 PM', type: '1:1 Strength', place: 'Broomfield field' },
        { id: 3, date: 'Thu, Oct 29', time: '4:00 PM', type: '1:1 Strength', place: 'Virtual' },
      ],
      planDone: { a: true, b: true },
      checkins: [
        { date: 'Oct 8', energy: '4', feel: 'About right', note: 'Finished every workout. Squats felt easier.' },
        { date: 'Oct 1', energy: '3', feel: 'A little hard', note: 'Missed Friday, made it up on Saturday.' },
      ],
      msgs: [
        { from: 'James', time: 'Oct 9 · 6:12 PM', text: 'Great work this week. Next session we will add a little weight to the goblet squats.' },
        { from: 'Alex (parent)', time: 'Oct 9 · 7:40 PM', text: 'Thanks! Jordan was proud of the plank time.' },
        { from: 'James', time: 'Oct 10 · 8:05 AM', text: 'Jordan should be. See you Thursday at 4.' },
      ],
      people: [
        { name: 'Alex Morgan', rel: 'Parent', access: 'Full access', status: 'Active' },
        { name: 'Pat Lee', rel: 'Respite caregiver', access: 'Schedule and messages', status: 'Active' },
      ],
    },
  },

  margaret: {
    name: 'Margaret Ellis',
    first: 'Margaret',
    place: 'Westminster · home visit',
    sessionType: 'Balance & strength',
    package: {
      id: 'pkg-twenty',
      completed: 11,
      plan: 'Paid in full',
      nextInstallment: null,
      invoices: [{ date: 'Aug 4, 2026', desc: 'Long-Term Commitment · paid in full', amt: '$1,500.00', status: 'Paid' }],
    },
    week: 'Week of October 12',
    plan: [
      { id: 'a', day: 'Mon', name: 'Balance at the counter', detail: '3 × 20 s single-leg stands each side · heel-to-toe walk, 2 lengths of the hall' },
      { id: 'b', day: 'Tue', name: 'Neighborhood walk', detail: '20 min at a comfortable pace, with a friend if you can' },
      { id: 'c', day: 'Thu', name: 'Chair strength', detail: '3 × 8 sit-to-stands · 3 × 10 seated band rows · 2 × 10 calf raises holding the counter' },
      { id: 'd', day: 'Sat', name: 'Play with the grandkids', detail: 'Ball toss or a park walk: any time on your feet counts' },
    ],
    initial: {
      sessions: [
        { id: 1, date: 'Tue, Oct 20', time: '10:00 AM', type: 'Balance & strength', place: 'Westminster · home visit' },
        { id: 2, date: 'Tue, Oct 27', time: '10:00 AM', type: 'Balance & strength', place: 'Westminster · home visit' },
      ],
      planDone: { a: true, b: true, c: true },
      checkins: [
        { date: 'Oct 9', energy: '4', feel: 'About right', note: 'Held the single-leg stand for 20 seconds on my left side for the first time.' },
        { date: 'Oct 2', energy: '3', feel: 'About right', note: 'Knee was a little stiff after the walk, fine the next day.' },
      ],
      msgs: [
        { from: 'James', time: 'Oct 9 · 2:30 PM', text: 'Twenty seconds on the left is a big step, Margaret. Next week we will try it with your eyes closed for a few seconds.' },
        { from: 'Margaret', time: 'Oct 9 · 4:05 PM', text: 'I will practice at the counter! See you Tuesday.' },
      ],
      people: [{ name: 'David Ellis', rel: 'Son', access: 'View only', status: 'Active' }],
    },
  },

  sam: {
    name: 'Sam Rivera',
    first: 'Sam',
    place: 'Virtual',
    sessionType: 'Virtual check-in',
    package: {
      id: 'pkg-five',
      completed: 1,
      plan: '2 payments of $250',
      nextInstallment: { date: 'Nov 15, 2026', amount: '$250.00', label: 'Installment 2 of 2' },
      invoices: [{ date: 'Oct 15, 2026', desc: 'Get Started · installment 1 of 2', amt: '$250.00', status: 'Paid' }],
    },
    week: 'Week of October 12',
    plan: [
      { id: 'a', day: 'Mon', name: 'Full-body circuit', detail: '3 rounds · 12 bodyweight squats, 10 push-ups (incline is fine), 20 s side plank each side' },
      { id: 'b', day: 'Wed', name: 'Intervals', detail: '8 × 30 s brisk effort, 90 s easy: run, bike or stairs' },
      { id: 'c', day: 'Fri', name: 'Dumbbell strength', detail: '3 × 10 Romanian deadlifts · 3 × 10 one-arm rows · 3 × 8 split squats' },
      { id: 'd', day: 'Sun', name: 'Mobility', detail: '15 min: hips, upper back and ankles. Video in Downloads' },
    ],
    initial: {
      sessions: [{ id: 1, date: 'Wed, Oct 21', time: '6:30 PM', type: 'Virtual check-in', place: 'Virtual' }],
      planDone: { a: true },
      checkins: [{ date: 'Oct 10', energy: '3', feel: 'Too easy', note: 'The circuit felt easy. Could I add weight?' }],
      msgs: [
        { from: 'James', time: 'Oct 10 · 9:15 AM', text: 'Good sign, Sam. Hold a dumbbell for the squats this week and send me a short video of your first set.' },
      ],
      people: [],
    },
  },
};

const INITIAL = Object.fromEntries(Object.entries(CLIENTS).map(([k, c]) => [k, c.initial]));

/** Signed-in account plus per-client sample data, held above the portal routes so it survives tab changes. */
export function usePortalState() {
  const [user, setUser] = useState(null);
  const [data, setData] = useState(INITIAL);
  const update = (client, fn) => setData((all) => ({ ...all, [client]: { ...all[client], ...fn(all[client]) } }));
  return { user, setUser, data, update };
}

export const splitSlot = (sl) => { const [date, time] = sl.split(' · '); return { date, time }; };
export const sortSessions = (list) => [...list].sort((a, b) => new Date(a.date.split(', ')[1] + ' 2026') - new Date(b.date.split(', ')[1] + ' 2026'));
