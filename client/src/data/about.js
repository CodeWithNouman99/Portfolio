// Tile images: drop a photo at src/assets/about/<id>.(jpg|jpeg|png|webp) — it's shown in B&W automatically.
// TODO: about tile photos
export const about = {
  eyebrow: 'About me',
  title: 'Who I Am',
  watermark: 'About',
  intro: 'The person behind the projects.',
  blocks: [
    {
      id: 'who',
      heading: ['Who', 'Am I?'],
      body: "I'm Nouman, a Software Engineering student in Faisalabad. I like owning a problem end to end, from the first sketch to the deployed app, and I'm happiest when something I built saves someone real time.",
    },
    {
      id: 'work',
      heading: ['How I', 'Work'],
      body: 'I start from the problem, not the tool. I break it into small pieces, ship a working version fast, then improve it. Every project lives on GitHub with a clear README so anyone can see how it works.',
    },
  ],
}
