// Speaking page content.
// Headline, about text, topics, credentials and ideal audiences follow the speaker one-sheet.
// After editing TOPICS, rebuild the topic-sheet PDFs: `npm run topic-pdfs`.

// The three signature topics, from the speaker one-sheet (James_Anderson_Speaker_One_Sheet_Updated.pdf).
export const TOPICS = [
  {
    id: 'behavioral-health',
    label: 'Signature topic',
    title: 'Improving Behavioral Health Through Fitness Interventions',
    desc: 'How structured movement can support emotional regulation, attention, and positive participation for individuals with I/DD.',
    audience: 'I/DD service providers · behavioral health and ABA teams · educators',
    takeaways: ['Practical ways to build supportive, individualized movement routines.'],
    pdf: '/speaking/improving-behavioral-health-through-fitness-interventions.pdf',
  },
  {
    id: 'what-is-inclusive-fitness',
    label: 'Signature topic',
    title: 'What Is Inclusive Fitness and Why Does It Matter?',
    desc: 'An introduction to participation barriers and the value of welcoming people of all abilities into fitness.',
    audience: 'Disability advocacy groups · fitness professionals · community and recreation programs',
    takeaways: ['Ways to adapt activities and create more welcoming environments.'],
    pdf: '/speaking/what-is-inclusive-fitness-and-why-does-it-matter.pdf',
  },
  {
    id: 'healthy-habits',
    label: 'Signature topic',
    title: 'The Importance of Modeling Healthy Habits for Your Children',
    desc: 'How parents and caregivers can lead by example through movement and sustainable daily routines.',
    audience: 'Caregivers · parent groups · family wellness conferences',
    takeaways: ['Realistic strategies for making healthy habits part of family life.'],
    pdf: '/speaking/the-importance-of-modeling-healthy-habits-for-your-children.pdf',
  },
];

export const FORMATS = [
  'Keynotes and conference sessions',
  'Staff training and workshops on his inclusive coaching methods',
  'Hands-on movement demonstrations',
  'Conference breakout sessions',
  'Virtual talks and trainings',
  'Panels, podcasts and media interviews',
];

export const SPEAKER = {
  headline: 'Making Fitness Accessible to Every Body',
  roles: 'Keynote speaker · Author · Inclusive fitness advocate',
  about: 'James Anderson is the founder of Better Everyday Athletics LLC, author of Legacy of Health, and a certified strength and conditioning specialist. He works with individuals with intellectual and developmental disabilities (I/DD), combining individualized exercise programming with behavior-support strategies to build confidence, independence, and lifelong healthy habits.',
};

export const CREDENTIALS = ['NSCA-CSCS', 'NASM-CES', 'ACSM Autism Exercise Specialist', 'ACSM Certified Inclusive Fitness Trainer', 'Former Registered Behavior Technician'];

export const IDEAL_AUDIENCES = ['Disability advocacy groups', 'I/DD service providers', 'Educators', 'Caregivers', 'Fitness professionals', 'Family wellness conferences'];

export const SPEAKING_FACTS = [
  { value: 'NSCA-CSCS', label: 'Strength & conditioning' },
  { value: 'ACSM', label: 'Inclusive fitness & autism exercise' },
  { value: 'Author', label: 'Legacy of Health' },
  { value: '50 states', label: 'Syndicated coverage' },
];

/** Confirmed upcoming events. Add { date: 'YYYY-MM-DD', title, org, location } to show them. */
export const SCHEDULE = [];
export const NOW_BOOKING = 'Now booking 2027 events · in person and virtual';

export const ORG_OPTIONS = ['Disability advocacy group', 'I/DD service provider', 'Behavioral or physical health provider', 'School or education organization', 'Fitness organization', 'Family wellness conference', 'Co-op or coalition of organizations', 'Other conference or association', 'Other'];
export const FORMAT_OPTIONS = ['Keynote', 'Staff training or workshop', 'Conference breakout', 'Virtual talk or training', 'Panel, podcast or media', 'Not sure yet'];
export const AUDIENCE_OPTIONS = ['Under 50', '50–250', '250–1,000', '1,000+', 'Not sure yet'];
export const SETTING_OPTIONS = ['In person', 'Virtual', 'Either'];
export const BUDGET_OPTIONS = ['Under $1,000', '$1,000–$2,500', '$2,500–$5,000', '$5,000+', 'Not sure yet'];
