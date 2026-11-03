import { Eyebrow, Field, Lede, Plate, ProgramRow, Quote, SectionHeading, Split, StatRow, TextLink } from '../ds';
import { IMG } from '../data/site.js';

const bodyP = { margin: 0, fontSize: '1.03125rem', lineHeight: 1.7, color: 'var(--text-body)', textWrap: 'pretty' };
const h2 = { margin: 0, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-h2-size)', lineHeight: 'var(--text-h2-lh)', letterSpacing: 'var(--tracking-heading)', textTransform: 'uppercase', color: 'var(--text-strong)' };

export default function Home() {
  return (
    <>
      <Lede
        kicker="Adaptive coaching & family support · Boulder County"
        title="Strength and Confidence for All"
        accent="Abilities"
        deck="James Anderson, CSCS, coaches kids, adults and seniors of all abilities. Sessions are built around the person in front of him, at their pace, with family and caregivers welcome."
        primary={{ label: 'Work With James', href: '#services' }}
        secondary={{ label: 'Read the free chapter', href: '#book' }}
      />
      <Plate
        data-pos="hero"
        number="01"
        src={IMG.hero}
        alt="A coach in a Better Everyday Athletics shirt high-fives a smiling participant in a wheelchair on a soccer field at sunset"
        caption="Adaptive soccer session · Broomfield, Colorado"
      />
      <StatRow
        items={[
          { value: '100+', label: 'Clients coached' },
          { value: '15+', label: 'Years in practice' },
          { value: 'CSCS', label: 'NSCA certified' },
          { value: 'Every', label: 'Ability level welcome' },
        ]}
      />
      <section style={{ padding: 'var(--section-y) var(--gutter)' }}>
        <SectionHeading number="Sect. 01" title="Ways to work with James" note="Start with one session a week. Add more when it feels right. Every plan can change as you do." />
        <ProgramRow
          number="01"
          featured
          title="1:1 Personalized Coaching"
          description="In-person sessions where James coaches form, adjusts in real time and keeps each workout within reach."
          price="$90"
          priceNote={<span>per session<br />10-session package</span>}
          action={{ label: 'See packages', href: '#memberships' }}
        />
        <ProgramRow
          number="02"
          title="Adaptive & Inclusive Training"
          description="Coaching for youth and adults with intellectual and developmental disabilities, shaped with the people who know them best."
          price="All abilities"
          priceNote="Families · caregivers"
          action={{ label: 'Talk to James', href: '#contact' }}
        />
        <ProgramRow
          number="03"
          title="Virtual Programming"
          description="A weekly plan you follow on your own schedule, reviewed and adjusted by James as you progress."
          price="Anywhere"
          priceNote="Self-directed"
          action={{ label: 'Details', href: '#services' }}
        />
      </section>
      <Split data-pos="james" image={IMG.james} imageAlt="James Anderson on a field at sunset with a young player">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '46ch' }}>
          <Eyebrow>Meet your coach</Eyebrow>
          <h2 style={h2}>James Anderson, CSCS</h2>
          <p style={bodyP}>James is an NSCA Certified Strength &amp; Conditioning Specialist and a former Registered Behavior Technician. He brings both to every session: sound training, and the patience to meet each person where they are.</p>
          <p style={bodyP}>His approach is simple. If you get a little better every day, you will get where you are going.</p>
          <TextLink href="#contact">Ask James a question</TextLink>
        </div>
      </Split>
      <section style={{ padding: 'var(--section-y) var(--gutter)' }}>
        <SectionHeading number="Sect. 02" title="Everyday triumphs" note="Real stories from real participants." />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(320px,100%),1fr))', gap: '32px', paddingTop: '40px' }}>
          <Quote
            variant="lead"
            quote="He has the patience, temperament, kindness, poise, responsibility, reliability, respect, and fun-loving nature needed to be an excellent role model."
            author="Michael Kirkland"
            role="Sports Buddies Team Lead, Big Brothers Big Sisters of Colorado"
          />
          <div style={{ borderLeft: '1px solid #343944', paddingLeft: '24px', display: 'grid', gap: '24px', alignContent: 'start' }}>
            <Quote variant="margin" quote="Our son had a blast working with Coach James and has a newfound appreciation for his physical health." author="Joella W." />
            <Quote variant="margin" quote="James is much more than a fitness trainer—he is a positive male role model in my son’s life." author="Jen G." />
          </div>
        </div>
      </section>
      <Plate
        data-pos="kite"
        height="clamp(340px,56vw,720px)"
        number="02"
        src={IMG.kite}
        alt="A child on a parent's shoulders flies a kite at sunset, a wheelchair resting in the grass nearby"
        caption="Progress, not perfection"
      />
      <div id="book">
        <Field
          tone="tint"
          kicker="Legacy of Health"
          title="A Parent's Guide to Strength, Energy and Longevity"
          body="Read chapter two free. It is a practical place to start building healthy habits as a family."
          image={IMG.book}
          imageAlt="Legacy of Health book cover"
          action={{ label: 'Read chapter two free', href: '#store/chapter-2' }}
        />
      </div>
    </>
  );
}
