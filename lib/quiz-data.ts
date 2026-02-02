// lib/quiz-data.ts
import { QuizQuestion, QuizResponses, DimensionScores, QuizLevel } from './quiz-types';

/** Define the quiz questions and their categories/options. */
export const questions: QuizQuestion[] = [
  {
    id: 1,
    category: 'Technique',
    question: 'How would you describe your jab?',
    options: [
      { label: "I'm not confident I'm doing it correctly", value: 1 },
      { label: 'I can throw it but it lacks snap and purpose', value: 2 },
      { label: "It's sharp — I use it to measure distance and set up shots", value: 3 },
      { label: 'I disguise it, double it up, and use it to control the whole fight', value: 4 },
    ],
  },
  {
    id: 2,
    category: 'Technique',
    question: 'When you throw a cross, where does the power come from?',
    options: [
      { label: 'Mostly my arm and shoulder', value: 1 },
      { label: 'I try to rotate my hips but it feels disconnected', value: 2 },
      { label: 'Hip rotation and rear foot pivot — I can feel the power transfer', value: 3 },
      { label: 'Full kinetic chain from floor to fist, and I can generate power from any position', value: 4 },
    ],
  },
  {
    id: 3,
    category: 'Movement',
    question: 'How do your feet feel when you box?',
    options: [
      { label: 'Heavy and flat — I tend to stand in one spot', value: 1 },
      { label: 'I can move but lose my stance when I punch', value: 2 },
      { label: 'Light on my feet — I maintain balance while punching and moving', value: 3 },
      { label: 'I control distance, cut angles, and pivot to create openings automatically', value: 4 },
    ],
  },
  {
    id: 4,
    category: 'Movement',
    question: 'How do you use angles in your boxing?',
    options: [
      { label: "I mostly stand directly in front of my opponent", value: 1 },
      { label: "I know I should move off-line but forget to in the moment", value: 2 },
      { label: 'I step off to create angles after throwing combinations', value: 3 },
      { label: 'I pivot, use lateral movement to create openings, and attack from different angles constantly', value: 4 },
    ],
  },
  {
    id: 5,
    category: 'Defense',
    question: 'When punches come at you, what do you instinctively do?',
    options: [
      { label: 'Flinch, close my eyes, or turn away', value: 1 },
      { label: 'Shell up and block with my hands', value: 2 },
      { label: 'Slip, roll, or parry — I have a few defensive tools I trust', value: 3 },
      { label: 'I make them miss with minimal movement and counter immediately', value: 4 },
    ],
  },
  {
    id: 6,
    category: 'Defense',
    question: 'How much does your head move when boxing?',
    options: [
      { label: "It stays pretty still — I know that's a problem", value: 1 },
      { label: 'I move it sometimes but forget under pressure', value: 2 },
      { label: 'I naturally slip and weave during exchanges', value: 3 },
      { label: "It's constant and automatic — my head movement sets up counters and makes me hard to hit", value: 4 },
    ],
  },
  {
    id: 7,
    category: 'Offense',
    question: "What does your offense typically look like?",
    options: [
      { label: 'Mostly single punches — jabs and crosses', value: 1 },
      { label: 'I throw 1-2s and basic combos but they feel predictable', value: 2 },
      { label: '3-4 punch combinations with hooks and uppercuts, and I vary them', value: 3 },
      { label: 'I flow between combinations, mix up timing and rhythm, and create openings before I punch', value: 4 },
    ],
  },
  {
    id: 8,
    category: 'Ring IQ',
    question: "When facing an opponent, can you read what they're about to do?",
    options: [
      { label: 'No — everything feels fast and surprising', value: 1 },
      { label: 'I sometimes see big shots coming', value: 2 },
      { label: 'I can read their body language and adjust my strategy mid-round', value: 3 },
      { label: 'I set traps, bait reactions, and control the pace of the fight', value: 4 },
    ],
  },
  {
    id: 9,
    category: 'Ring IQ',
    question: 'When things aren\'t going your way in a round, what do you do?',
    options: [
      { label: 'Panic, freeze up, or just keep doing the same thing', value: 1 },
      { label: 'I try to survive and hope it gets better', value: 2 },
      { label: "I make adjustments — change range, use my jab, or tie up to reset", value: 3 },
      { label: 'I stay calm, identify what they\'re exploiting, and change my approach within seconds', value: 4 },
    ],
  },
  {
    id: 10,
    category: 'Training Habits',
    question: 'How do you currently train boxing?',
    options: [
      { label: 'I watch videos online and practise casually when I can', value: 1 },
      { label: 'I shadow box or hit the bag a few times a week', value: 2 },
      { label: 'I follow a structured programme with focused drills and pad work', value: 3 },
      { label: 'I spar regularly, film myself, review footage, and train with specific goals each session', value: 4 },
    ],
  },
];

/** Category descriptions for dimension-level feedback */
export const dimensionDescriptions: Record<string, {
  name: string;
  low: string;
  mid: string;
  high: string;
}> = {
  'Technique': {
    name: 'Technique',
    low: 'Your fundamental mechanics need attention. Focus on drilling your jab, cross, and basic combinations with proper form before adding complexity. Slow, intentional repetition is key.',
    mid: 'Your technique has a solid foundation. Now focus on refining the details — hand return speed, weight transfer timing, and making each punch purposeful rather than just correct.',
    high: 'Your technical ability is advanced. You generate power efficiently and have a versatile punch arsenal. Keep refining through varied sparring and studying fighters with styles different from yours.',
  },
  'Movement': {
    name: 'Footwork & Movement',
    low: "You're likely stationary or losing your stance when you move. Start with basic footwork drills — step-drag, pivots, and maintaining your stance while moving forward and back.",
    mid: 'You can move and stay balanced, but your angles and distance management need work. Practise pivoting off the jab, stepping off to the side after combinations, and controlling range.',
    high: "Your footwork is a weapon. You control distance, create angles, and move your opponent where you want them. Focus on efficiency — making every step count and conserving energy.",
  },
  'Defense': {
    name: 'Defensive Skills',
    low: "Defence is about trust and reps. Start by drilling catch-and-block patterns, then gradually add slips. Film yourself and watch whether your hands stay up under pressure.",
    mid: "You have defensive awareness but it breaks down under pressure. Focus on making head movement and slipping habitual through slow, focused partner drills. Defence should be reflexive, not reactive.",
    high: "Your defensive skills are strong. You make opponents miss and capitalise. Refine your counter-punching timing and work on defensive variety so opponents can't time you.",
  },
  'Offense': {
    name: 'Offensive Firepower',
    low: "You're likely throwing arm punches without much setup. Focus on the jab-cross first, then build 3-punch combinations. Every combination should start with a setup and end with an exit.",
    mid: 'You can put punches together, but your offence may be predictable. Work on varying rhythm, mixing up your combinations, and attacking the body as well as the head.',
    high: "Your offence is dangerous and varied. You create openings before you punch and flow naturally. Push yourself by working with slicker opponents who force you to be more creative.",
  },
  'Ring IQ': {
    name: 'Ring IQ & Fight Sense',
    low: "Boxing IQ develops with experience. For now, focus on understanding range — when you're in danger, when you can attack, and when to reset. Watch fights analytically, not just for entertainment.",
    mid: "You're starting to think in the ring rather than just react. Keep developing your ability to read opponents by sparring different styles and studying fight breakdowns.",
    high: "You think several moves ahead and control fights strategically. To keep growing, study advanced tactics — feinting patterns, body language deception, and how elite fighters impose their game plans.",
  },
  'Training Habits': {
    name: 'Training Habits',
    low: "Consistency is the foundation of improvement. Try to establish a regular training schedule — even 3 sessions per week will accelerate your progress dramatically. Follow a structured programme rather than freestyling.",
    mid: "You train regularly which is great. Take it up a level by filming yourself, setting specific goals for each session, and getting regular feedback from a coach or structured programme.",
    high: "Your training approach is disciplined and goal-oriented. Make sure you're periodising your training, managing recovery, and continually challenging yourself with harder sparring partners.",
  },
};

/** Define the level thresholds, descriptions, and CTAs. */
export const levels: QuizLevel[] = [
  {
    name: 'Foundation',
    min: 10,
    max: 15,
    description: "You're at the beginning of your boxing journey. You've got the basic idea of stance, guard, and fundamental punches, but the foundations need to be drilled until they're second nature.",
    detailedAdvice: "The good news? This is where the most rapid improvement happens. With the right structure, you'll be amazed at how quickly things click. Your priority right now is building solid technical habits — proper stance, a sharp jab, and basic defensive awareness. Don't rush to spar or add complexity. Master the fundamentals and everything else becomes easier.",
    ctaText: 'Start the 21-Day Boxing Challenge',
    ctaUrl: '/checkout-v2?product=21dc',
    ctaDescription: "Our 21-Day Challenge is designed exactly for your level. It takes you from zero to confident with daily guided sessions that build proper habits from day one. You'll develop your jab, cross, basic combos, footwork, and defensive fundamentals — all in just 3 weeks.",
    emoji: '🥊',
    color: '#6B7280',
  },
  {
    name: 'Developing',
    min: 16,
    max: 24,
    description: "You understand the basics and can put punches together, but there are gaps in your game that hold you back. Your technique, movement, or defence need tightening.",
    detailedAdvice: "You're past the beginner stage — you know what a jab is and how combinations work. But knowing and executing under pressure are different things. Your focus should be on closing the gaps: if your footwork is behind your hands, drill movement. If your defence breaks down, spend dedicated time on slips and rolls. Structured, progressive training is what separates developing boxers from fighters.",
    ctaText: 'Start the 21-Day Boxing Challenge',
    ctaUrl: '/checkout-v2?product=21dc',
    ctaDescription: "The 21-Day Challenge will tighten up your fundamentals and fill in the gaps. It's structured to take boxers at your level and make every aspect of their game sharper — from technique to footwork to defensive awareness. In 21 days, you'll feel like a different boxer.",
    emoji: '🥊',
    color: '#D97706',
  },
  {
    name: 'Fighter',
    min: 25,
    max: 32,
    description: "You're competent in the ring — your combinations flow, your defence is solid, and you can read opponents. Now it's about strategy, refinement, and fight IQ.",
    detailedAdvice: "You've got the tools. The question is whether you're using them strategically. At your level, improvement comes from studying the game at a deeper level — understanding principles rather than just techniques. Why does a certain combination work? How do you impose your style on different opponents? How do you turn defence into offence seamlessly? This is where boxing becomes chess.",
    ctaText: 'Explore the Boxing Grading System',
    ctaUrl: '/grading',
    ctaDescription: "The Oracle Boxing Grading System gives you a structured path from where you are to mastery. Test yourself against objective standards, identify exactly what to work on, and track your progression through the grades. It's the roadmap for serious boxers.",
    emoji: '🔥',
    color: '#DC2626',
  },
  {
    name: 'Ring General',
    min: 33,
    max: 40,
    description: "You operate at a high level — ring generalship, fight IQ, and technical mastery are part of your game. You control fights and adapt in real time.",
    detailedAdvice: "You don't need more techniques — you need marginal gains. At your level, improvement comes from personalised coaching, detailed fight analysis, and being pushed by someone who can see what you can't. The difference between good and elite is often invisible without an expert eye. Principles-based training, advanced game planning, and deep tactical work are your path forward.",
    ctaText: 'Book 1-on-1 Coaching',
    ctaUrl: '/coaching-checkout',
    ctaDescription: "At your level, personalised coaching is the highest-leverage investment you can make. Work directly with Oracle Boxing coaches to refine your game, develop advanced strategies, and break through plateaus that self-training can't solve.",
    emoji: '👑',
    color: '#7C3AED',
  },
];

/**
 * Calculate dimension scores, total score, and determine level.
 */
export function calculateResults(responses: QuizResponses): {
  scores: DimensionScores;
  total: number;
  level: QuizLevel;
} {
  const scores: DimensionScores = {};
  let total = 0;

  questions.forEach((q) => {
    const val = responses[q.id] || 0;
    total += val;
    scores[q.category] = (scores[q.category] || 0) + val;
  });

  const level = levels.find((lv) => total >= lv.min && total <= lv.max) || levels[0];

  return { scores, total, level };
}
