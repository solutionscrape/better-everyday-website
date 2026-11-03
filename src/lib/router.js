import { useEffect, useState } from 'react';

// Hash routes, matching the prototype: #home, #services (alias #memberships),
// #contact, #blog[/slug], #store[/id], #portal[/tab]. #book and #packages scroll to sections on Home.
const PAGES = { services: 'services', memberships: 'services', contact: 'contact', blog: 'blog', store: 'store', portal: 'portal' };
const ANCHORS = new Set(['#book', '#packages', '#memberships']);

export function parseHash(hash) {
  const [base, sub] = hash.replace(/^#/, '').split('/');
  return { page: PAGES[base] || 'home', sub: sub ? decodeURIComponent(sub) : null, hash };
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
    const el = ANCHORS.has(route.hash) && document.getElementById(route.hash.slice(1));
    window.scrollTo(0, el ? el.getBoundingClientRect().top + window.scrollY : 0);
  }, [route]);
  return route;
}
