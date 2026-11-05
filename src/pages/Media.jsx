import { Lede } from '../ds';
import { AsSeenIn, MediaList, NextSteps } from '../components/Media.jsx';

/** Business-site media page: every item with what it means for families, and local coverage first. */
export default function Media() {
  return (
    <>
      <Lede
        kicker="Media · Better Everyday in the news"
        title="Inclusive Fitness,"
        accent="In the News"
        deck="Articles, interviews, videos and appearances featuring James Anderson, CSCS, and what each one means for families looking for coaching that fits."
        primary={{ label: 'Work with James', href: '#services' }}
        secondary={{ label: 'Speaking', href: '#speaking' }}
      />
      <AsSeenIn scope="local" label="As seen in Colorado" note="Our feature “Why Inclusive Fitness Is About More Than Exercise” ran in news outlets across Colorado and all 50 states." />
      <MediaList id="media-list" variant="families" number="Sect. 01" title="Coverage" note="Each item has a short introduction, what it means for families, and a link to read, watch or listen." />
      <NextSteps number="Sect. 02" />
    </>
  );
}
