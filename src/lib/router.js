import { useEffect, useState } from 'react';

// Hash routes, matching the prototype: #home, #services (alias #memberships),
// #speaking (aliases #about, #speaking-engagements), #contact, #blog[/slug],
// #store[/id], #portal[/tab].
// #book and #packages scroll to sections on Home; #speaking/<section> scrolls to
// the element with id "speaking-<section>" on the Speaking page.
const PAGES = {
  services: 'services',
  memberships: 'services',
  speaking: 'speaking',
  about: 'speaking',
  'speaking-engagements': 'speaking',
  contact: 'contact',
  blog: 'blog',
  store: 'store',
  portal: 'portal',
};
const ANCHORS = new Set(['#book', '#packages', '#memberships']);
const SECTION_PAGES = new Set(['speaking']);

export function parseHash(hash) {
  const [base, sub] = hash.replace(/^#/, '').split('/');
  return { page: PAGES[base] || 'home', sub: sub ? decodeURIComponent(sub) : null, hash };
}

function anchorFor(route) {
  if (ANCHORS.has(route.hash)) return document.getElementById(route.hash.slice(1));
  if (SECTION_PAGES.has(route.page) && route.sub) return document.getElementById(route.page + '-' + route.sub);
  return null;
}

export function useHashRoute() {
  const [route, setRoute] = useState(() => parseHash(window.location.hash));
  useEffect(() => {
    const onHash = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  // After each route renders, scroll to the in-page anchor or back to the top.
  useEffect(() => {
    const el = anchorFor(route);
    window.scrollTo(0, el ? el.getBoundingClientRect().top + window.scrollY : 0);
  }, [route]);
  return route;
}
