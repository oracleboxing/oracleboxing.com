// lib/quiz-data.ts
import { QuizQuestion, QuizResponses, DimensionScores, QuizLevel } from './quiz-types';

/** Define the quiz questions and their categories/options. */
export const questions: QuizQuestion[] = [
  {
    id: 1,
    category: 'Technique',
    question: 'When you stand in your boxing stance, where is most of your weight?',
    options: [
      { label: 'Evenly 50/50 on both feet', value: 1 },
      { label: 'Mostly on my back foot', value: 2 },
      { label: 'Slightly more on my lead foot', value: 3 },
      { label: "I shift weight depending on what I'm doing", value: 4 },
    ],
  },
  {
    id: 2,
    category: 'Technique',
    question: 'How would you describe your jab?',
    options: [
      { label: "I'm not sure I'm doing it right", value: 1 },
      { label: 'I can throw it but it feels weak', value: 2 },
      { label: "It's solid, I use it to set things up", value: 3 },
      { label: 'I use multiple types of jabs for different situations', value: 4 },
    ],
  },
  {
    id: 3,
    category: 'Movement',
    question: 'When you move around, how do your feet feel?',
    options: [
      { label: 'Heavy and flat-footed', value: 1 },
      { label: 'I can move but I lose my balance when punching', value: 2 },
      { label: 'I can move and punch without losing balance', value: 3 },
      { label: 'I cut angles and control distance with my feet', value: 4 },
    ],
  },
  {
    id: 4,
    category: 'Defense',
    question: 'When punches come at you, what do you instinctively do?',
    options: [
      { label: 'Close my eyes or turn away', value: 1 },
      { label: 'Try to block with my hands', value: 2 },
      { label: 'Slip or roll under punches sometimes', value: 3 },
      { label: 'I make them miss and counter immediately', value: 4 },
    ],
  },
  {
    id: 5,
    category: 'Offense',
    question: "What's the longest combination you throw comfortably?",
    options: [
      { label: 'I mostly throw single punches', value: 1 },
      { label: '1-2 (jab-cross) is my go-to', value: 2 },
      { label: 'I throw 3-4 punch combos with hooks and uppercuts', value: 3 },
      { label: 'I flow between 4-6+ punch combos and vary them', value: 4 },
    ],
  },
  {
    id: 6,
    category: 'Defense',
    question: 'How much does your head move when you\'re boxing?',
    options: [
      { label: 'Barely at all - I know I should move it more', value: 1 },
      { label: 'I move it sometimes but forget under pressure', value: 2 },
      { label: 'I naturally slip and weave during exchanges', value: 3 },
      { label: 'My head movement is automatic and sets up my counters', value: 4 },
    ],
  },
  {
    id: 7,
    category: 'Offense',
    question: "Where does your punching power come from?",
    options: [
      { label: 'Mostly my arms', value: 1 },
      { label: "I try to rotate my body but it's hard", value: 2 },
      { label: 'Hip rotation and weight transfer - I can feel it connect', value: 3 },
      { label: 'Full kinetic chain from feet through hips, I pivot naturally', value: 4 },
    ],
  },
  {
    id: 8,
    category: 'Ring IQ',
    question: "When facing an opponent, can you tell what they're about to throw?",
    options: [
      { label: 'No, everything surprises me', value: 1 },
      { label: 'Sometimes I see big shots coming', value: 2 },
      { label: 'I can read their body language and adjust', value: 3 },
      { label: 'I set traps and bait specific reactions', value: 4 },
    ],
  },
  {
    id: 9,
    category: 'Movement',
    question: 'How do you use angles in your boxing?',
    options: [
      { label: 'I mostly stand in front of my opponent', value: 1 },
      { label: 'I know I should move off-line but forget', value: 2 },
      { label: 'I step off to create angles after combos', value: 3 },
      { label: 'I pivot, use angles to create openings, and attack from multiple axes', value: 4 },
    ],
  },
  {
    id: 10,
    category: 'Training Habits',
    question: 'How do you currently train boxing?',
    options: [
      { label: 'I watch YouTube and try things in the mirror', value: 1 },
      { label: 'I do shadow boxing or heavy bag a few times a week', value: 2 },
      { label: 'I follow a structured program with drills', value: 3 },
      { label: 'I spar regularly and review my own footage', value: 4 },
    ],
  },
];

/** Define the level thresholds and descriptions. */
export const levels: QuizLevel[] = [
  {
    name: 'Level 1 – Foundation',
    min: 10,
    max: 15,
    description: 'You have the basics down: stance, guard, and fundamental punches. Focus on building solid technique and consistency.',
  },
  {
    name: 'Level 2 – Developing',
    min: 16,
    max: 24,
    description: 'You can link combos and understand defense, but there\'s room to tighten flow and power. Let\'s sharpen those skills.',
  },
  {
    name: 'Level 3 – Fighter',
    min: 25,
    max: 32,
    description: 'You\'re comfortable in the ring: angles, counters, and combinations feel natural. Time to refine strategy and ring IQ.',
  },
  {
    name: 'Level 4 – Ring General',
    min: 33,
    max: 40,
    description: 'You\'re operating at a high level: ring generalship, deception, and flow state are second nature. Seek advanced principles-based training.',
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
  // initialize sums
  const scores: DimensionScores = {};
  let total = 0;

  // accumulate per-category scores
  questions.forEach((q) => {
    const val = responses[q.id] || 0;
    total += val;
    scores[q.category] = (scores[q.category] || 0) + val;
  });

  // find level
  const level = levels.find((lv) => total >= lv.min && total <= lv.max) || levels[0];

  return { scores, total, level };
}
