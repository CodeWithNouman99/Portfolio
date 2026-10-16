// image: path under src/assets/ (e.g. 'certifications/oracle.png'). Missing files are skipped.
export const certifications = {
  eyebrow: 'Credentials',
  title: 'Certifications',
  watermark: 'Certified',
  card: {
    eyebrow: 'Verified Skills',
    note: 'Industry-recognised credentials from Oracle, Microsoft and LinkedIn Learning.',
    hint: 'Hover a certificate to preview it, click to enlarge.',
  },
  items: [
    {
      id: 'C01',
      title: 'Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate',
      issuer: 'Oracle University',
      date: '2025',
      note: 'Valid until Aug 2027',
      image: 'certifications/oracle.png',
      verifyUrl: null, // TODO: verify link
    },
    {
      id: 'C02',
      title: 'Career Essentials in Software Development',
      issuer: 'Microsoft & LinkedIn Learning',
      date: 'Mar 2025',
      type: 'Learning Path',
      skills: ['Programming', 'Software Development'],
      image: 'certifications/microsoft.png',
      verifyUrl: null, // TODO: verify link
    },
  ],
}
