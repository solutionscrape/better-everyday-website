// SAMPLE DATA ONLY. The portal is a front-end prototype: nothing here is saved.
// A production version needs real accounts (e.g. Supabase auth) and a database,
// and should read package/billing status from HubSpot.

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

export const PLAN = [
  { id: 'a', day: 'Mon', name: 'Warm-up and balance circuit', detail: '10 min · step-ups, single-leg holds, heel walks' },
  { id: 'b', day: 'Tue', name: 'Walk or ride', detail: '20–30 min at an easy, talking pace' },
  { id: 'c', day: 'Wed', name: 'Strength A', detail: '3 × 10 goblet squats · 3 × 8 band rows · 3 × 20 s plank' },
  { id: 'd', day: 'Fri', name: 'Strength B', detail: '3 × 8 step-ups · 3 × 10 wall push-ups · 3 × 12 glute bridges' },
  { id: 'e', day: 'Sat', name: 'Family activity', detail: 'Anything active together: the park, bikes or a short hike' },
];

/** The sample client's purchased package. Completed sessions are already used. */
export const PACKAGE = {
  id: 'pkg-ten',
  title: 'Build Momentum — 10 Sessions',
  short: 'Build Momentum',
  total: 10,
  completed: 4,
  price: 900,
  plan: '3 payments of $300',
  nextInstallment: { date: 'Nov 1, 2026', amount: '$300.00', label: 'Installment 3 of 3' },
  invoices: [
    { date: 'Oct 1, 2026', desc: 'Build Momentum · installment 2 of 3', amt: '$300.00', status: 'Paid' },
    { date: 'Sep 1, 2026', desc: 'Build Momentum · installment 1 of 3', amt: '$300.00', status: 'Paid' },
  ],
};

export const DOWNLOADS = [
  { title: 'Legacy of Health – Chapter 2', meta: 'PDF · Free chapter' },
  { title: 'Better Everyday Workout Guide', meta: 'PDF · Home workouts' },
  { title: 'This Week’s Plan', meta: 'PDF · Printable' },
];

const INITIAL = {
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
};

/** Portal session + sample data, held above the portal routes so it survives tab changes. */
export function usePortalState() {
  const [authed, setAuthed] = useState(false);
  const [role, setRole] = useState('Client');
  const [data, setData] = useState(INITIAL);
  const update = (fn) => setData((d) => ({ ...d, ...fn(d) }));
  return { authed, setAuthed, role, setRole, data, update };
}

export const splitSlot = (sl) => { const [date, time] = sl.split(' · '); return { date, time }; };
export const sortSessions = (list) => [...list].sort((a, b) => new Date(a.date.split(', ')[1] + ' 2026') - new Date(b.date.split(', ')[1] + ' 2026'));
