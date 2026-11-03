import { Field, Lede, Plate, PostRow, SectionHeading } from '../ds';
import { LinkButton, metaLabel, h3Style } from '../components/ui.jsx';
import POSTS_RAW from '../data/blog-posts.json';
import { IMG } from '../data/site.js';

export const POSTS = POSTS_RAW.map((p) => ({ ...p, href: '#blog/' + p.slug, meta: p.minutes + ' min read' }));

const Row = ({ post }) => <PostRow title={post.title} excerpt={post.excerpt} date={post.date} category={post.meta} href={post.href} />;

export function BlogIndex() {
  return (
    <>
      <Lede kicker="Better Everyday Blog" title="Notes on Movement, Family and" accent="Progress" deck="Articles by James Anderson, CSCS, on inclusive fitness, ADHD, parenting and building habits that last." />
      <section style={{ padding: '0 var(--gutter) var(--section-y)' }}>
        <div style={{ borderTop: '1px solid var(--border-strong)' }}>
          {POSTS.map((p) => <Row key={p.slug} post={p} />)}
        </div>
      </section>
      <Field tone="tint" kicker="Legacy of Health" title="Read Chapter Two Free" body="The ideas in these articles come together in James's book. Start with the free chapter." image={IMG.book} imageAlt="Legacy of Health book cover" action={{ label: 'Get the free chapter', href: '#store/chapter-2' }} />
    </>
  );
}

const paraStyle = { margin: 0, color: 'var(--text-body)', lineHeight: 1.78, textWrap: 'pretty' };

function Block({ b }) {
  switch (b.t) {
    case 'h':
      return <h2 style={{ ...h3Style, marginTop: '16px' }}>{b.x}</h2>;
    case 'li':
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '10px minmax(0,1fr)', gap: '14px', alignItems: 'baseline' }}>
          <span aria-hidden="true" style={{ width: '6px', height: '6px', background: '#FC1111', display: 'block', transform: 'translateY(-2px)' }} />
          <span style={{ margin: 0, lineHeight: 1.7, color: 'var(--text-body)' }}>{b.x}</span>
        </div>
      );
    case 'q':
      return <blockquote style={{ margin: '8px 0', borderLeft: '3px solid #FC1111', paddingLeft: '20px', fontSize: '1.25rem', lineHeight: 1.55, color: 'var(--text-strong)' }}>{b.x}</blockquote>;
    default:
      return <p style={paraStyle}>{b.x}</p>;
  }
}

export function BlogPost({ post }) {
  const i = POSTS.indexOf(post);
  const more = [POSTS[(i + 1) % POSTS.length], POSTS[(i + 2) % POSTS.length]];
  return (
    <>
      <article>
        <header style={{ padding: 'clamp(44px,6vw,96px) var(--gutter) 32px', display: 'grid', gap: '24px' }}>
          <LinkButton href="#blog">← All articles</LinkButton>
          <span style={metaLabel}>{post.date} · {post.minutes} min read · James Anderson, CSCS</span>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.4rem,5.2vw,4.75rem)', lineHeight: 0.98, letterSpacing: 'var(--tracking-display)', textTransform: 'uppercase', color: 'var(--text-strong)', textWrap: 'balance' }}>
            {post.title}
          </h1>
        </header>
        {post.img ? <Plate data-pos="post" height="clamp(340px,52vw,640px)" number="—" caption="Better Everyday Blog" src={post.img} alt={post.title} /> : null}
        <div style={{ padding: '48px var(--gutter) 64px', display: 'grid', gap: '20px', maxWidth: '72ch', fontSize: '1.0625rem' }}>
          {post.blocks.map((b, k) => <Block key={k} b={b} />)}
        </div>
        <section style={{ padding: '0 var(--gutter) var(--section-y)' }}>
          <SectionHeading number="More" title="Keep reading" />
          <div style={{ paddingTop: '16px' }}>{more.map((p) => <Row key={p.slug} post={p} />)}</div>
        </section>
      </article>
      <Field tone="black" kicker="Work with James" title="Put It Into Practice" body="James builds plans around the person, the family and the week you actually have." action={{ label: 'See coaching options', href: '#services' }} />
    </>
  );
}
