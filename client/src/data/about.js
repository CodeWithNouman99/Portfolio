// Home "Who I Am" section (sections/About.jsx): a statement whose second line rotates through `phrases`,
// then the principles in a row. Numbers (01, 02, …) come from the order.
export const about = {
  eyebrow: 'About me',
  title: 'Who I Am',
  watermark: 'About',
  intro: 'The person behind the projects.',
  statement: {
    lead: 'I build things that',
    phrases: ['save hours every week.', 'run 24/7 on their own.', 'answer customers on WhatsApp.', 'actually ship.'],
    // How long each phrase stays before the next one slides up
    intervalMs: 2500,
  },
  principles: [
    'Start from the problem, not the tool.',
    'Ship a working version fast, then improve it.',
    'Every project gets a README anyone can follow.',
  ],
}
