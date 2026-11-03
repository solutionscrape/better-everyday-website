// POST /api/checkout
// Creates (or updates) the HubSpot contact, then a deal with one line item per cart line.
// Payment: a HubSpot workflow triggered on new website deals emails the payment link
// (see README "HubSpot setup"). Prices come from src/data/catalog.js, never from the client.
//
// Env vars (Netlify → Site configuration → Environment variables):
//   HUBSPOT_ACCESS_TOKEN  required. Private-app token with crm.objects.contacts.write,
//                         crm.objects.deals.write and crm.objects.line_items.write scopes.
//   HUBSPOT_PIPELINE      optional, default "default"
//   HUBSPOT_DEAL_STAGE    optional, default "appointmentscheduled"

import { findItem } from '../../src/data/catalog.js';

const API = 'https://api.hubapi.com';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// HubSpot-defined association type ids.
const DEAL_TO_CONTACT = 3;
const LINE_ITEM_TO_DEAL = 20;

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const clean = (v, max = 200) => String(v ?? '').trim().slice(0, max);

/** Validate and price the order. Returns { lines, total } or { error }. */
export function priceOrder(items) {
  if (!Array.isArray(items) || items.length === 0) return { error: 'Your cart is empty.' };
  if (items.length > 50) return { error: 'Too many items.' };
  const lines = [];
  for (const it of items) {
    const item = findItem(it?.id);
    const qty = Number(it?.qty);
    if (!item) return { error: 'Unknown item: ' + clean(it?.id, 60) };
    if (!Number.isInteger(qty) || qty < 1 || qty > 20) return { error: 'Invalid quantity for ' + item.title };
    let name = item.title;
    if (item.sizes) {
      if (!item.sizes.includes(it.size)) return { error: 'Please choose a valid size for ' + item.title };
      name += ' · Size ' + it.size;
    }
    lines.push({ name, price: item.price, quantity: qty, kind: item.kind });
  }
  const total = lines.reduce((n, l) => n + l.price * l.quantity, 0);
  return { lines, total };
}

async function hs(token, path, body) {
  const res = await fetch(API + path, {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`HubSpot ${path} ${res.status}: ${data.message || 'request failed'}`);
  return data;
}

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'Method not allowed' });

  const token = process.env.HUBSPOT_ACCESS_TOKEN;
  if (!token) return json(503, { error: 'Checkout is not configured yet.' });

  let body;
  try { body = await req.json(); } catch { return json(400, { error: 'Invalid request.' }); }

  const c = body?.customer || {};
  const name = clean(c.name, 120);
  const email = clean(c.email, 254).toLowerCase();
  const phone = clean(c.phone, 40);
  if (!name) return json(400, { error: 'Please add your name.' });
  if (!EMAIL_RE.test(email)) return json(400, { error: 'Please enter a valid email address.' });

  const order = priceOrder(body.items);
  if (order.error) return json(400, { error: order.error });

  const [firstname, ...rest] = name.split(/\s+/);
  const onlyFree = order.total === 0;

  try {
    const contact = await hs(token, '/crm/v3/objects/contacts/batch/upsert', {
      inputs: [{ idProperty: 'email', id: email, properties: { email, firstname, lastname: rest.join(' '), ...(phone ? { phone } : {}) } }],
    });
    const contactId = contact.results?.[0]?.id;
    if (!contactId) throw new Error('HubSpot contact upsert returned no id');

    const deal = await hs(token, '/crm/v3/objects/deals', {
      properties: {
        dealname: (onlyFree ? 'Free chapter request · ' : 'Website order · ') + name,
        amount: String(order.total),
        pipeline: process.env.HUBSPOT_PIPELINE || 'default',
        dealstage: process.env.HUBSPOT_DEAL_STAGE || 'appointmentscheduled',
        description: order.lines.map((l) => `${l.quantity} × ${l.name}`).join('\n'),
      },
      associations: [{ to: { id: contactId }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: DEAL_TO_CONTACT }] }],
    });

    await hs(token, '/crm/v3/objects/line_items/batch/create', {
      inputs: order.lines.map((l) => ({
        properties: { name: l.name, price: String(l.price), quantity: String(l.quantity) },
        associations: [{ to: { id: deal.id }, types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: LINE_ITEM_TO_DEAL }] }],
      })),
    });

    // paymentUrl is null: the HubSpot workflow emails the payment link. If you later create
    // HubSpot payment links or Stripe Checkout sessions here, return the URL and the site redirects.
    return json(200, { ok: true, dealId: deal.id, total: order.total, paymentUrl: null });
  } catch (err) {
    console.error(err);
    return json(502, { error: 'We could not start checkout. Please try again.' });
  }
};

export const config = { path: '/api/checkout' };
