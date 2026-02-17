export interface CourseModule {
  title: string
  lessons: string[]
}

export interface CoursePreview {
  id: string
  title: string
  description: string
  modules: CourseModule[]
  image?: string
  badge?: string
}

export const COURSE_PREVIEW_DATA: CoursePreview[] = [
  {
    id: 'toolkit',
    title: 'Boxing Toolkit',
    description: '59 technique videos covering stance to advanced counters. A reference library you come back to again and again.',
    modules: [
      { title: 'Foundation', lessons: ['Stance', 'Shape & Posture', 'Balance'] },
      { title: 'Footwork', lessons: ['Pivots', 'Pendulum Steps', 'Shuffling'] },
      { title: 'Punches', lessons: ['Jab', 'Cross', 'Hooks', 'Uppercuts'] },
      { title: 'Defence', lessons: ['Blocks & Parries', 'Slips & Rolls', 'Weaving'] },
      { title: 'Combinations', lessons: ['Linking Punches', 'Flow Combos', 'Shadowboxing'] },
      { title: 'Advanced', lessons: ['Feints', 'Check Hook', 'Sparring'] },
    ],
    image: 'https://sb.oracleboxing.com/courses/thumbnails/boxing-toolkit.webp',
  },
  {
    id: 'coaching-calls',
    title: 'Live coaching calls, every day.',
    description: 'Jump on a live call with our coaches any day of the week. Get real-time feedback and stay accountable.',
    modules: [],
    image: 'https://sb.oracleboxing.com/courses/thumbnails/coaching-calls.webp',
  },
  {
    id: 'technique-feedback',
    title: 'Get feedback on your technique',
    description: 'Submit 1 video per week and get detailed feedback from our coaches. Watch your technique improve in real time.',
    modules: [],
    image: 'https://sb.oracleboxing.com/courses/thumbnails/technique-feedback.webp',
  },
  {
    id: 'grading',
    title: 'Work through Grades 1-3',
    description: 'Follow our structured curriculum and get weekly feedback on your progress. Complete 21 days and book your graduation call.',
    modules: [
      { title: 'Grade 1:Fundamentals', lessons: ['Stance & Guard', 'Jab & Cross Mechanics', 'Footwork Fundamentals', 'Relaxation & Form'] },
      { title: 'Grade 2:Building On It', lessons: ['Combinations & Sequencing', 'Head Movement', 'Angles & Positioning', 'Counter-Punching Basics'] },
      { title: 'Grade 3:Advanced', lessons: ['Ring Craft & Generalship', 'Counter-Punching Systems', 'Fight IQ & Pattern Recognition', 'Pressure & Control'] },
    ],
    image: 'https://sb.oracleboxing.com/courses/thumbnails/grade-1.webp',
  },
  {
    id: 'snc',
    title: 'Strength & Conditioning',
    description: 'Exercise breakdowns and technique to get the most out of them whilst avoiding injury. Built specifically for boxers.',
    modules: [
      { title: 'Foundations', lessons: ['Exercise Breakdowns', 'Proper Form', 'Injury Prevention'] },
      { title: 'Boxing-Specific Training', lessons: ['Strength Training', 'Conditioning Protocols', 'Mobility & Recovery'] },
      { title: 'Powerlifting Fundamentals', lessons: ['Squat', 'Bench', 'Deadlift'] },
    ],
    image: 'https://sb.oracleboxing.com/courses/thumbnails/s-and-c.webp',
  },
  {
    id: 'bffp',
    title: 'Boxing from First Principles',
    description: 'Instead of memorising 100 techniques, learn the handful of principles that make all techniques work. 26 lessons across 5 modules.',
    modules: [
      { title: 'SENTIENCE:The Mind of the Fighter', lessons: ['Identity & Paradigm Shift', 'Flow State & Presence', 'Emotional Control & Meditation'] },
      { title: 'ANATOMY:The Wiring of Performance', lessons: ['Nervous System & Fascia', 'Energy Flow & Transfer', 'Relaxation & Tension Control'] },
      { title: 'FORMIS:The Language of Movement', lessons: ['Shape & Stance', 'Striking Mechanics', 'Defence & Distance Control', 'Flow & Default Mode'] },
      { title: 'GAMBIT:The Science of Tactics', lessons: ['Pattern Recognition', 'Positioning & Deception', 'Guard Manipulation', 'Controlling Exchanges'] },
      { title: 'ENGINE:The Physiology of Fighting', lessons: ['Conditioning & Breathing', 'Nervous System Strength', 'Fascial Health & Mobility', 'Recovery & Longevity'] },
    ],
    image: 'https://sb.oracleboxing.com/courses/thumbnails/boxing-first-principles.webp',
    badge: 'Add-on · $147',
  },
]
