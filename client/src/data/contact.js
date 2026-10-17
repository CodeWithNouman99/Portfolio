export const contact = {
  eyebrow: "Let's Connect",
  title: 'Get In Touch',
  watermark: 'Connect',
  subtitle: "Have a role, a project or an idea? Let's talk.",
  form: {
    submit: 'Send Message',
    sending: 'Sending…',
    error: 'Something went wrong. Email me directly instead.',
  },
  // Live Automation Tracker shown in the form card after a successful submit
  tracker: {
    eyebrow: 'Live Automation',
    title: 'Your message is moving through my automation…',
    steps: [
      'Received by the server',
      'Saved to the database (MongoDB)',
      'Sent to my n8n workflow',
      'AI read your message',
      'Nouman has been notified by email',
    ],
    enquiry: 'enquiry', // chip text: "<Type> enquiry"
    skipped: 'Skipped',
    queued: 'Queued, Nouman will be notified shortly',
    thanks: (firstName) =>
      `Thanks ${firstName}! This whole flow ran automatically, built with n8n + Gemini.`,
    another: 'Send another message',
    howBuilt: "How it's built",
  },
  // Used instead of the tracker text while no n8n workflow is connected on the server
  trackerOffline: {
    eyebrow: 'Message received',
    title: 'Your message is in.',
    thanks: (firstName) => `Thanks ${firstName}! Your message is saved. I'll reply by email soon.`,
  },
}

export const footer = {
  center: 'Personal portfolio / 2026',
  copyright: '© 2026 Nouman Aslam. All rights reserved.',
}
