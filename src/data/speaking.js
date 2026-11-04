// Speaking page content. James speaks nationally to three audiences:
// 1. nonprofits serving people with disabilities and their families,
// 2. behavioral health and physical health providers (training on his methods),
// 3. high school graduations, schools and youth events (purpose and passion).
// DRAFT: topic wording and takeaways to confirm with James.
// After editing TOPICS, rebuild the topic-sheet PDFs: `npm run topic-pdfs`.

export const AUDIENCES = [
  {
    title: 'Nonprofits serving people with disabilities',
    desc: 'Organizations that support individuals with intellectual and developmental disabilities, autism, Down syndrome and their families. James shows how movement builds strength, confidence and connection, and how to make it part of your programs.',
    examples: 'Disability and advocacy nonprofits · adaptive sports programs · family support organizations · day programs',
  },
  {
    title: 'Behavioral and physical health providers',
    desc: 'Any organization delivering behavioral health or physical health services. James walks your team through the methods he uses every week, so you can add inclusive movement to the care you already give clients with special needs.',
    examples: 'ABA and behavioral therapy centers · physical and occupational therapy practices · mental health agencies · group homes and residential care',
  },
  {
    title: 'Graduations, schools and youth events',
    desc: 'High school commencements, college events and youth gatherings. James speaks about finding your true purpose, following your passion and building a life of service rather than chasing money.',
    examples: 'High school graduations · colleges and universities · youth leadership events · student assemblies',
  },
];

export const TOPICS = [
  {
    id: 'inclusive-environments',
    label: 'Introductory presentation',
    title: 'Creating More Inclusive Fitness Environments',
    desc: 'Why people with intellectual and developmental disabilities are still so underserved in health and fitness, and how any organization can change that. James shows what inclusive fitness looks like in practice and how to bring families and caregivers into the process.',
    audience: 'Nonprofits · recreation and community centers · schools · health and therapy providers',
    takeaways: [
      'Why inclusive fitness is about more than exercise: confidence, independence and connection',
      'How to adapt a space, a session and a coaching style so everyone can take part',
      'Simple first steps your organization can start the following week',
    ],
    pdf: '/speaking/creating-more-inclusive-fitness-environments.pdf',
  },
  {
    id: 'coaching-methods',
    label: 'Staff training',
    title: 'Inclusive Coaching Methods for Your Team',
    desc: 'A working session for behavioral and physical health teams. James shares the methods he uses with his own clients, drawing on his strength and conditioning certification and his background as a Registered Behavior Technician, so your staff can add inclusive movement to the care they already give.',
    audience: 'Behavioral health and ABA providers · physical and occupational therapy teams · residential and day program staff',
    takeaways: [
      'How James adapts exercises in real time to each person’s abilities and goals',
      'Behavioral strategies that keep clients motivated and engaged in movement',
      'How to work alongside parents, caregivers and support staff',
    ],
    pdf: '/speaking/inclusive-coaching-methods-for-your-team.pdf',
  },
  {
    id: 'purpose-over-paycheck',
    label: 'Keynote',
    title: 'Purpose Over Paycheck',
    desc: 'A commencement-style message about choosing a life with meaning. James talks about finding the work you were made for, following your passion even when it is not the easy path, and measuring success by the people you serve rather than the money you make.',
    audience: 'High school graduations · colleges and universities · youth leadership programs',
    takeaways: [
      'How to recognize the work you were made for',
      'Why following your passion is worth it, even when it is not the easy path',
      'How to measure success by the people you serve, not the money you make',
    ],
    pdf: '/speaking/purpose-over-paycheck.pdf',
  },
];

export const FORMATS = [
  'Keynotes and commencement addresses',
  'Staff training and workshops on his inclusive coaching methods',
  'Hands-on movement demonstrations',
  'Conference breakout sessions',
  'Virtual talks and trainings',
  'Panels, podcasts and media interviews',
];

export const SPEAKING_FACTS = [
  { value: 'CSCS', label: 'NSCA certified' },
  { value: 'RBT', label: 'Former behavior technician' },
  { value: 'Author', label: 'Legacy of Health' },
  { value: 'Nationwide', label: 'In person and virtual' },
];

/** Confirmed upcoming events. Add { date: 'YYYY-MM-DD', title, org, location } to show them. */
export const SCHEDULE = [];
export const NOW_BOOKING = 'Now booking 2027 events · in person and virtual';

export const ORG_OPTIONS = ['Nonprofit', 'Behavioral health provider', 'Physical health or therapy provider', 'High school or graduation', 'College or university', 'Co-op or coalition of organizations', 'Conference or association', 'Company', 'Other'];
export const FORMAT_OPTIONS = ['Keynote', 'Graduation or commencement address', 'Staff training or workshop', 'Conference breakout', 'Virtual talk or training', 'Panel, podcast or media', 'Not sure yet'];
export const AUDIENCE_OPTIONS = ['Under 50', '50–250', '250–1,000', '1,000+', 'Not sure yet'];
export const SETTING_OPTIONS = ['In person', 'Virtual', 'Either'];
export const BUDGET_OPTIONS = ['Under $1,000', '$1,000–$2,500', '$2,500–$5,000', '$5,000+', 'Not sure yet'];
