import { BOOK_AMAZON_URL } from './catalog.js';

export const SOCIALS = [
  { label: 'Instagram', href: 'https://www.instagram.com/better_everyday_llc/' },
  { label: 'Facebook', href: 'https://www.facebook.com/mybettereveryday' },
  { label: 'Medium', href: 'https://medium.com/@jamesandersonfitness' },
];

/**
 * Publications by and about James, newest or most important first.
 * kind: 'Book' | 'Video' | 'Articles' | 'Feature' | 'Interview' | 'Podcast'
 * TODO: add the Voyage Denver and Broomfield Lifestyle features once their URLs are confirmed
 * (both appear under "As featured in" on mybettereveryday.org).
 */
export const PUBLICATIONS = [
  {
    outlet: 'Amazon · Paperback',
    title: 'Legacy of Health: A Parent’s Guide to Building Strength, Energy, and Longevity for the Next Generation',
    kind: 'Book',
    href: BOOK_AMAZON_URL,
    cta: 'Buy on Amazon',
  },
  {
    outlet: 'YouTube',
    title: 'Fitness Fun at FRIENDS of Broomfield',
    kind: 'Video',
    href: 'https://youtu.be/cS0J61IcJxU',
    cta: 'Watch on YouTube',
  },
  {
    outlet: 'Medium',
    title: 'Articles by James Anderson, CSCS, on fitness, ADHD, parenting and motivation',
    kind: 'Articles',
    href: 'https://medium.com/@jamesandersonfitness',
    cta: 'Read on Medium',
  },
];
