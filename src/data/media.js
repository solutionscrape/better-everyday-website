// Every article, interview, podcast, video and appearance, in one repeatable format.
// The business site shows each item with its `families` note; the speaking page shows the
// same item with its `speaking` note. See docs/ADDING-MEDIA.md for how to add a new one.
//
// Fields
//   id         lowercase-with-dashes, unique
//   type       'Feature story' | 'Article' | 'Interview' | 'Podcast' | 'Video' | 'Appearance' | 'Book' | 'Articles'
//   outlet     publication, program or show name
//   title      headline or episode/program name
//   date       ISO date (YYYY-MM-DD) or null if unknown
//   intro      short original introduction (1–2 sentences, our words, not copied from the piece)
//   families   what the coverage means to families (business site)
//   speaking   how it relates to James's talks and what an audience can learn (speaking page)
//   topics     ids from TOPICS in src/data/speaking.js this item supports
//   action     { label, href } the main link: read / listen / watch
//   more       optional extra link { label, href }
//   youtube    optional YouTube video id to embed a clip
//   audio      optional direct audio/podcast link (shown as "Listen")
//   placements optional syndication data from `npm run import-placements` (see placements/)
//   hide / rename  optional curation of placement outlets shown on the site (rename can also fix city/state)

import { BOOK_AMAZON_URL } from './catalog.js';
import inclusiveFitness from './placements/inclusive-fitness-more-than-exercise.json';

export const MEDIA = [
  {
    id: 'inclusive-fitness-more-than-exercise',
    type: 'Feature story',
    outlet: 'National syndication · NewsUSA',
    title: 'Why Inclusive Fitness Is About More Than Exercise',
    date: '2026-08-24',
    intro: 'Better Everyday’s feature on why fitness for people with disabilities matters beyond the workout itself. It was picked up by 2,622 news outlets across all 50 states.',
    families: 'Inclusive fitness is becoming a national conversation. The kind of coaching James offers here in Colorado, built around the person and welcoming to families and caregivers, is being recognized as something every community needs.',
    speaking: 'This feature introduces the core idea of James’s talk “Creating More Inclusive Fitness Environments”: exercise for people with disabilities is about more than the workout. Audiences learn what that looks like in practice and how to start.',
    topics: ['inclusive-environments'],
    action: { label: 'Read the article', href: 'https://www.stltoday.com/online_features/fashion_beauty_fitness/article_ea9ca692-bb27-5310-8fe4-b208643fadc7.html' },
    placements: inclusiveFitness,
    // Curation: keep real news outlets; hide campus classifieds, market-data and off-topic sites.
    hide: [/campusave\.com/, /\/markets\/stocks\.php/, /coloradocannabistimes/, /pcrecordtimes/, /cariboucurrent/],
    rename: {
      'Gunn Is on Times': { outlet: 'Gunnison Country Times', state: 'CO' },
      'The Leader - Limon': 'The Limon Leader',
      'StarTribune': 'Star Tribune',
      'Madison': 'Madison.com',
      'The Daily Sentinel': 'The Daily Sentinel (Grand Junction)',
    },
  },
  {
    id: 'friends-of-broomfield-video',
    type: 'Video',
    outlet: 'YouTube · FRIENDS of Broomfield',
    title: 'Fitness Fun at FRIENDS of Broomfield',
    date: null,
    intro: 'James coaches a fitness class at FRIENDS of Broomfield twice a week, a partnership that grew from his passion for serving individuals with special needs, a community he saw was underserved in health and fitness.',
    families: 'See what a group session looks like: everyone moving at their own level, with plenty of encouragement and fun.',
    speaking: 'This is the work behind the talks. Provider teams see the same adaptive coaching methods James teaches in his staff sessions, in a real class.',
    topics: ['inclusive-environments', 'coaching-methods'],
    action: { label: 'Watch the video', href: 'https://youtu.be/cS0J61IcJxU' },
    youtube: 'cS0J61IcJxU',
  },
  {
    id: 'legacy-of-health',
    type: 'Book',
    outlet: 'Amazon · Paperback',
    title: 'Legacy of Health: A Parent’s Guide to Building Strength, Energy, and Longevity for the Next Generation',
    date: null,
    intro: 'James’s book for parents on building healthy habits that carry into the next generation.',
    families: 'Practical, realistic habits for the whole family. Chapter two is free to read.',
    speaking: 'The book is the foundation of James’s message on purpose and leaving a legacy, the heart of “Purpose Over Paycheck”.',
    topics: ['purpose-over-paycheck'],
    action: { label: 'Buy on Amazon', href: BOOK_AMAZON_URL },
    more: { label: 'Read chapter two free', href: '#store/chapter-2' },
  },
  {
    id: 'medium-articles',
    type: 'Articles',
    outlet: 'Medium',
    title: 'Articles by James Anderson, CSCS',
    date: null,
    intro: 'James writes about fitness, ADHD, parenting and motivation.',
    families: 'Short, practical reads on staying active as a family, ADHD and keeping motivation going.',
    speaking: 'A sample of how James explains movement, mindset and motivation to a general audience.',
    topics: ['coaching-methods', 'purpose-over-paycheck'],
    action: { label: 'Read on Medium', href: 'https://medium.com/@jamesandersonfitness' },
  },
];

const visible = (item) => (p) => !(item.hide || []).some((re) => re.test(p.url));
// rename values are a new outlet name, or an object of corrected fields ({ outlet, city, state }).
const named = (item) => (p) => {
  const fix = (item.rename || {})[p.outlet];
  return typeof fix === 'string' ? { ...p, outlet: fix } : { ...p, ...fix };
};

/** Curated Colorado / Denver-market placements for an item (business site). */
export const localPlacements = (item) => (item.placements?.colorado || []).filter(visible(item)).map(named(item));
/** Curated national placements for an item (speaking page). */
export const nationalPlacements = (item) => (item.placements?.national || []).filter(visible(item)).map(named(item));

/** All curated placements across media, deduplicated by outlet, for the "As seen in" strips. */
export function seenIn(scope) {
  const pick = scope === 'local' ? localPlacements : nationalPlacements;
  const seen = new Map();
  for (const item of MEDIA) for (const p of pick(item)) if (!seen.has(p.outlet)) seen.set(p.outlet, p);
  return [...seen.values()];
}

export const formatDate = (iso) => (iso ? new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '');
