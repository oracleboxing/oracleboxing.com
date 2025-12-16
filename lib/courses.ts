export interface Course {
  id: string
  title: string
  price: number
  image: string
  description: string
  stripeUrl?: string
  isRoadmap?: boolean
  isBundle?: boolean
}

export interface Phase {
  id: number
  title: string
  image: string
  focus: string
  outcome: string
  description: string
}

export const courses: Course[] = [
  {
    id: 'boxing-coaching-replays',
    title: 'Boxing Coaching Replays',
    price: 97,
    image: 'https://sb.oracleboxing.com/Website/boxing_clinic.webp',
    description: `💬 140+ Replay Sessions

Weekly calls with Oliver & Toni, covering every layer of the Oracle Boxing system — from jab mechanics and flow drills to kinetic linkage, counterpunching, and footwork integration.

Watch how each concept is applied live. Updated monthly.

**Recent topics (Oct 2025):**
• Liver Shot Setups
• Flow of Boxing
• Kinetic Linkage
• Shifting Mechanics
• Defence + Counter Flow

**Includes:**
All 2024–2025 replays (Jan → Oct) + archives from the Boxing Clinic category.`,
    stripeUrl: 'https://checkout.oracleboxing.com/b/bJe3cw6ROfF17SbcnPgQE2d'
  },
  {
    id: 'boxing-from-first-principles',
    title: 'Boxing Masterclass',
    price: 297,
    image: 'https://sb.oracleboxing.com/Website/optimized/products/bffp_tn.webp',
    description: `**SENTIENCE — The Mind of the Fighter**
Learn how to think, feel, and perform like a boxer. Shift your paradigm for success, build mental clarity, and access flow on command. Understand emotional control, meditation, and how to enter the zone during performance.
*Focus: Identity · Flow State · Presence · Mental Resilience*
*Outcome: Calm, focused, and emotionally stable under pressure.*

**ANATOMY — The Wiring of Performance**
Understand how your body truly works beneath the surface. Study the nervous system, fascia, and energy transfer through the body. Learn how relaxation and tension control create effortless speed and power.
*Focus: Nervous System · Fascia · Energy Flow*
*Outcome: Efficient movement and natural connection between mind and body.*

**FORMIS — The Language of Movement**
Master the mechanics of boxing. Develop shape, stance, striking, defence, distance control, and the flow of movement. Learn to blend offence and defence seamlessly through positioning, feints, and rhythm.
*Focus: Shape · Stance · Flow · Default Mode*
*Outcome: Technical precision and fluid, intelligent movement.*

**GAMBIT — The Science of Tactics**
Learn to think like a strategist in the ring. Understand pattern recognition, positioning, deception, and guard manipulation. Control exchanges by making opponents react to you instead of the other way around.
*Focus: Positioning · Deception · Guard Control · Tactical Awareness*
*Outcome: Ability to outthink and outmaneuver opponents.*

**ENGINE — The Physiology of Fighting**
Build the engine that powers it all. Train breathing, conditioning, nervous system strength, and recovery. Develop fascial health, mobility, and habits for sustained peak performance.
*Focus: Conditioning · Breathing · Relaxation · Health Optimization*
*Outcome: High performance under fatigue with resilience and longevity.*`,
    stripeUrl: 'https://checkout.oracleboxing.com/b/dRmeVeb841Ob8WfafHgQE2e'
  },
  {
    id: 'boxing-roadmap',
    title: 'Boxing Roadmap',
    price: 147,
    image: 'https://sb.oracleboxing.com/Website/optimized/products/phase1.webp',
    description: 'Complete 5-phase boxing training system from fundamentals to mastery.',
    isRoadmap: true,
    stripeUrl: 'https://checkout.oracleboxing.com/b/dRm3cw5NK78v5K33RjgQE2c'
  },
  {
    id: 'complete-bundle',
    title: 'Complete Bundle',
    price: 397,
    image: 'https://sb.oracleboxing.com/Website/optimized/products/bffp_tn.webp',
    description: `**Get everything. Master the complete boxing system from fundamentals to real application.**

**This bundle includes:**
• Boxing Coaching Replays ($97)
• Boxing Masterclass ($297)
• Boxing Roadmap ($147)

**Total value: $541**
**Bundle price: $397**
**You save: $144**

Complete access to the entire Oracle Boxing system — theory, technique, tactics, and live coaching insights.`,
    isBundle: true,
    stripeUrl: 'https://checkout.oracleboxing.com/b/3cI4gAa40eAX5K32NfgQE2f'
  }
]

export const roadmapPhases: Phase[] = [
  {
    id: 1,
    title: 'PHASE I — Fundamentals & Form',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/phase1.webp',
    focus: 'Shape · Rotation · Relaxation · Linking punches',
    outcome: 'Technically clean movement and form.',
    description: `**Build your base.**
Learn stance, weight distribution, relaxation, pivots, and the mechanics of every punch.
By the end, you'll move smoothly, punch correctly, and link basic combos with flow.`
  },
  {
    id: 2,
    title: 'PHASE II — Defence, Range & Sparring Basics',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/phase2.webp',
    focus: 'Range · Defence · Pendulum Steps · Flow',
    outcome: 'Confidence in distance, rhythm, and reactive defence.',
    description: `**Add movement and defence.**
Learn body punching, range control, foot and hand defences, and how to integrate punches with footwork.
Start shadow sparring and understand the flow of boxing.`
  },
  {
    id: 3,
    title: 'PHASE III — Dynamic Footwork & Balance',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/phase3.webp',
    focus: 'Shifting · Drop Steps · Balance · Rotation',
    outcome: 'Mobility and power without losing form.',
    description: `**Learn how to pivot, shift, and plant power with balance.**
Explore step-pivots, pendulum steps, and circular motion.
Begin connecting power and flow through the feet.`
  },
  {
    id: 4,
    title: 'PHASE IV — Defensive Mastery & Feints',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/phase4.webp',
    focus: 'Pulls · Weaves · Lay Back · Feints',
    outcome: 'Fluid defensive reactions and deceptive offence.',
    description: `**Layer your defence.**
Combine trunk, hand, and foot defences seamlessly.
Learn feints to disguise intent and create openings.`
  },
  {
    id: 5,
    title: 'PHASE V — Precision & Application',
    image: 'https://sb.oracleboxing.com/Website/optimized/products/phase5.webp',
    focus: 'Punch Mastery · Stepping · Slipping · Rolling',
    outcome: 'Fully integrated technique ready for sparring and refinement.',
    description: `**Perfect every punch and apply movement to them.**
Master straight, hook, and uppercut mechanics, then add steps, slips, and rolls.
The final polish — technical perfection under movement.`
  }
]
