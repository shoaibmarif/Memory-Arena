export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How do I play?',
    answer:
      'Tap a card to turn it over, then tap a second one. If the two pictures match, they stay face up. If they don’t, both flip back and it’s your job to remember where they were. Clear the board by finding every pair.',
  },
  {
    question: 'What’s the difference between the modes?',
    answer:
      'Classic is the standard game with a score. The Daily Arena is one board a day, the same for everyone. Time Attack gives you a clock that grows with every pair. Survival shows the whole board first and gives you three hearts. Zen has no clock and no score at all.',
  },
  {
    question: 'What is a slip?',
    answer:
      'A slip is a mismatch you could have avoided: you picked a card you had already seen and it was the wrong one, or you already knew where the partner was and missed it. Turning over a card you have never seen is never a slip. In Survival, every slip costs a heart.',
  },
  {
    question: 'How are stars worked out?',
    answer:
      'Stars compare your moves with the number of pairs. Someone with a perfect memory, who still has to turn over unknown cards at random, needs about 1.61 moves per pair on average. Stay under 1.75 for three stars and under 2.4 for two.',
  },
  {
    question: 'How does the Daily Arena work?',
    answer:
      'Everyone gets the same 5 × 4 board each day, with the same cards in the same places, and a new one arrives at midnight in your time zone. You get one scored run. Win on consecutive days to build a streak, then share your result without giving the board away.',
  },
  {
    question: 'How do ranks and XP work?',
    answer:
      'Every game earns XP: your final score in scored modes, and 20 XP per pair in Zen. Collect enough and you move up from Rookie through Bronze, Silver, Gold, Platinum and Diamond to Legend. Your rank shows in the top bar and on your profile page.',
  },
  {
    question: 'Is it free? Does it work on phones?',
    answer:
      'It’s completely free with no ads or sign-up. It works on phones, tablets and computers, and you can play with a keyboard too: the arrow keys move between cards and Enter or Space turns one over.',
  },
  {
    question: 'Where is my progress saved?',
    answer:
      'In your browser, on this device. There’s no account and nothing is uploaded, so your rank and stats won’t follow you to another phone or computer, and clearing your browser data removes them.',
  },
  {
    question: 'Is it good for kids?',
    answer:
      'Yes. There’s a page made for younger players with a small board, animal cards and no clock or score, so nobody feels rushed. Memory card games are a classic for children because the rules take seconds to learn.',
  },
];
