'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import QuizHeader from '../components/QuizHeader';
import { ResultsChart } from '../components/ResultsChart';
import { EmailCaptureForm } from '../components/EmailCaptureForm';
import { toolkitVideos } from '@/lib/toolkit-videos';

interface SkillGap {
  gap: string;
  category: string;
  questionId: string;
  remedialVideos: string[];
}

interface CategoryScore {
  category: string;
  correct: number;
  total: number;
  percentage: number;
  gaps: SkillGap[];
}

interface DiagnosticResult {
  id: string;
  totalCorrect: number;
  totalQuestions: number;
  percentage: number;
  categoryScores: CategoryScore[];
  allGaps: SkillGap[];
  prescribedVideos: string[];
  level: string;
  createdAt: string;
}

const CATEGORY_DISPLAY: Record<string, string> = {
  'STANCE_FOUNDATION': 'Stance',
  'DISTANCE/RANGE': 'Distance',
  'HOOK': 'Hooks',
  'Combinations & Flow': 'Combos',
  'Defense - Hands': 'Hand Defense',
  'Defense - Movement': 'Head Movement',
  'Power Generation': 'Power',
  'cross': 'Cross',
  'jab': 'Jab',
  'footwork': 'Footwork',
  'uppercut': 'Uppercut',
};

const LEVEL_CONFIG: Record<string, { title: string; desc: string; cta: string; ctaUrl: string; ctaDesc: string }> = {
  beginner: {
    title: 'Foundation Level',
    desc: "You're at the start of your boxing knowledge journey. The good news? This is where the most rapid improvement happens.",
    cta: 'Start the 21-Day Boxing Challenge',
    ctaUrl: '/checkout-v2?product=21dc',
    ctaDesc: 'Build solid fundamentals with structured daily sessions. Most students see dramatic improvement in just 3 weeks.',
  },
  developing: {
    title: 'Developing Fighter',
    desc: "You understand the basics but there are clear gaps. Focused work on your weak areas will level you up fast.",
    cta: 'Start the 21-Day Boxing Challenge',
    ctaUrl: '/checkout-v2?product=21dc',
    ctaDesc: 'Tighten up your fundamentals and fill the gaps. The 21-Day Challenge is designed for exactly your level.',
  },
  intermediate: {
    title: 'Intermediate Fighter',
    desc: "Solid boxing knowledge. You understand principles, not just techniques. Time to refine the details.",
    cta: 'Explore the Boxing Grading System',
    ctaUrl: '/grading',
    ctaDesc: 'Test yourself against objective standards and track your progression through the grades.',
  },
  advanced: {
    title: 'Ring General',
    desc: "You really know your stuff. Your boxing IQ is high. Marginal gains and personalised coaching are your path forward.",
    cta: 'Book 1-on-1 Coaching',
    ctaUrl: '/coaching-checkout',
    ctaDesc: 'Work directly with our coaches to refine your game and break through plateaus.',
  },
};

// Map quiz categories to toolkit modules
const CATEGORY_TOOLKIT_MODULES: Record<string, string[]> = {
  'STANCE_FOUNDATION': ['foundation'],
  'jab': ['straight_punches'],
  'cross': ['straight_punches'],
  'HOOK': ['bent_arm_punches'],
  'uppercut': ['bent_arm_punches'],
  'Defense - Hands': ['defense_hands'],
  'Defense - Movement': ['defense_movement'],
  'footwork': ['footwork'],
  'DISTANCE/RANGE': ['ranges'],
  'Combinations & Flow': ['combinations'],
  'Power Generation': ['straight_punches', 'foundation'],
};

function getCatDisplay(cat: string) {
  return CATEGORY_DISPLAY[cat] || cat;
}

interface Drill {
  name: string;
  description: string;
  volume: string;
  commonMistakes: string[];
  doingItRight: string[];
}

interface WorkoutBlock {
  title: string;
  drills: Drill[];
  passCriteria: string;
}

// Detailed workout plans per category, modelled on the grading system training plans
function generateWorkoutPlan(weakCategories: CategoryScore[]): WorkoutBlock[] {
  const plans: Record<string, WorkoutBlock> = {
    'STANCE_FOUNDATION': {
      title: 'Stance & Foundation',
      drills: [
        {
          name: 'Proper Defensive Stance Setup',
          description: 'Set up your stance with built-in defensive advantages. Stagger feet shoulder-width apart, rear shoulder dropped below lead shoulder, weight distributed strategically (not 50/50).',
          volume: '3 x 15 reps',
          commonMistakes: ['Keeping 50/50 weight distribution', 'Shoulders at the same height', 'Standing too upright with chest exposed'],
          doingItRight: ['Rear shoulder noticeably lower than lead', 'Weight slightly on back foot', 'Rounded upper back creating smaller target'],
        },
        {
          name: 'Weight Management Drill',
          description: 'From your stance, shift weight deliberately between front and back foot. Feel where your balance point is. Practice loading the back foot (ready to punch) and front foot (ready to pivot).',
          volume: '3 x 1 min each side',
          commonMistakes: ['Shifting weight by leaning instead of sitting', 'Feet moving during weight shifts', 'Losing guard position while shifting'],
          doingItRight: ['Hips drive the weight shift, not the shoulders', 'Feet stay planted throughout', 'Guard stays tight during every transition'],
        },
        {
          name: 'Relaxation Shadow Boxing',
          description: 'Throw very light punches focusing entirely on staying relaxed. Shoulders loose, arms loose, breathing steady. Speed comes from relaxation, not tension.',
          volume: '3 x 2 min rounds',
          commonMistakes: ['Throwing too hard and tensing up', 'Holding breath during combinations', 'Shoulders creeping up toward ears'],
          doingItRight: ['Punches feel effortless and snappy', 'Shoulders stay dropped between every punch', 'Breathing is steady and natural throughout'],
        },
        {
          name: 'Stance Integration Shadow Boxing',
          description: 'Full shadow boxing rounds with focus on maintaining proper stance shape. Rounded back, shoulder drop, weight distribution - all while moving and throwing.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Losing stance shape when throwing combinations', 'Standing upright between punches', 'Weight drifting forward during combos'],
          doingItRight: ['Returning to proper stance after every combination', 'Rounded posture maintained throughout', 'Weight stays on back foot as default position'],
        },
      ],
      passCriteria: 'You can maintain proper stance shape (shoulder drop, weight back, rounded posture) while throwing 3-4 punch combinations without losing balance.',
    },
    'jab': {
      title: 'Jab Technique',
      drills: [
        {
          name: 'Shoulder Protection Jab',
          description: 'Throw the jab with your lead shoulder raised to protect your chin at full extension. Look down the arm like you\'re sighting a rifle. The shoulder acts as a shield.',
          volume: '3 x 15 reps each side',
          commonMistakes: ['Dropping the shoulder on extension, leaving chin exposed', 'Arm fully locked out (should have slight bend)', 'Head staying stationary instead of tucking behind shoulder'],
          doingItRight: ['Lead shoulder touches your chin at full extension', 'Looking down the arm toward target', 'Rear hand stays glued to your cheekbone'],
        },
        {
          name: 'Non-Telegraphed Jab Drill',
          description: 'Stand in front of a mirror. Throw the jab without ANY preparatory movement - no pulling back, no tensing, no weight shift before the punch. It fires from wherever your hand is.',
          volume: '3 x 15 reps each side',
          commonMistakes: ['Pulling hand back before throwing', 'Tensing shoulder or bicep before the punch', 'Dropping the hand before firing up'],
          doingItRight: ['Punch fires directly from guard position with zero telegraph', 'Opponent (mirror) cannot see it coming', 'The first movement is the punch itself, not a wind-up'],
        },
        {
          name: 'Jab Variety Bag Work',
          description: 'Work the bag with different jab types: single stiff jab, double jab, jab to the body, flicker jab. Focus on returning the hand faster than you throw it.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Same speed and power on every jab', 'Hand lingers at full extension', 'Feet not set before jabbing'],
          doingItRight: ['Clear variation between jab types', 'Hand snaps back faster than it goes out', 'Each jab is thrown from a balanced position'],
        },
      ],
      passCriteria: 'You can throw a jab from guard with zero telegraph, shoulder protecting chin, and the hand returns faster than it fires.',
    },
    'cross': {
      title: 'Cross Technique',
      drills: [
        {
          name: 'Hip Rotation Isolation',
          description: 'Hands on hips, no punching. Just rotate your hips from stance position so your belt buckle faces the target. Feel your rear foot pivot on the ball. This is where ALL cross power comes from.',
          volume: '3 x 20 reps',
          commonMistakes: ['Rotating from the shoulders instead of hips', 'Rear heel staying flat on the ground', 'Leaning forward during rotation'],
          doingItRight: ['Hips drive the rotation, shoulders follow', 'Rear foot pivots until heel faces the ceiling', 'Head stays in the same position throughout'],
        },
        {
          name: 'Slow Cross with Freeze',
          description: 'Throw the cross in slow motion (3-4 seconds). Freeze at full extension. Check: rear foot pivoted? Hips facing target? Shoulder protecting chin? Hand straight to target?',
          volume: '3 x 15 reps',
          commonMistakes: ['Arm extends before hips rotate', 'Weight shifts forward past the front foot', 'Rear hand takes a curved path instead of straight'],
          doingItRight: ['Kinetic chain fires in order: foot, hip, torso, arm', 'Weight stays centred, not lurching forward', 'Fist travels in a straight line to the target'],
        },
        {
          name: '1-2 Combination Bag Work',
          description: 'Jab-cross on the bag. Focus on the cross having noticeably more power than the jab through hip rotation, not arm muscle. The snap should be audible.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Cross feels the same power as the jab', 'Pushing the bag instead of snapping through it', 'Losing balance after the cross'],
          doingItRight: ['Clear power difference between jab and cross', 'Bag snaps rather than pushes', 'Returning to stance immediately after the cross'],
        },
      ],
      passCriteria: 'Your cross has visible hip rotation, rear foot pivot, and noticeably more power than your jab without losing balance.',
    },
    'HOOK': {
      title: 'Hook Mechanics',
      drills: [
        {
          name: 'Weight Transfer Direction Drill',
          description: 'From stance, throw a lead hook focusing ONLY on weight transfer direction. Your weight should move from front foot to rear foot (backwards), not forward. Like a hammer thrower pulling the weight around.',
          volume: '3 x 15 reps each side',
          commonMistakes: ['Weight moving forward toward the target', 'Arm swinging wide like a slap', 'Stepping forward as you throw'],
          doingItRight: ['Weight clearly shifts from front foot to rear foot', 'Feeling centripetal force pulling the fist through', 'Stable base with no forward lean after the punch'],
        },
        {
          name: 'Body Hook Palm Orientation',
          description: 'Throw hooks to the body on the bag. Palm should face upward to dig under the ribs. Bend your knees to get the level, don\'t just bend at the waist.',
          volume: '3 x 15 reps each side',
          commonMistakes: ['Palm facing down on body hooks', 'Bending at waist instead of knees to reach body', 'Wrist bending unnaturally to angle the punch'],
          doingItRight: ['Palm faces upward, knuckles dig under the ribs', 'Knee bend brings you to body level', 'Wrist stays straight and aligned with forearm'],
        },
        {
          name: 'Lead Hook to Rear Hook Flow',
          description: 'Throw lead hook immediately followed by rear hook. Focus on the weight rocking back (lead hook) then forward (rear hook) in a smooth rhythm. The body powers both punches, not the arms.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Pausing between the two hooks', 'Using arm strength instead of body rotation', 'Losing stance shape during the combination'],
          doingItRight: ['Smooth weight transfer creates a rocking motion', 'Both hooks feel powered by the body', 'You could keep the rhythm going indefinitely without tiring'],
        },
      ],
      passCriteria: 'Lead hook transfers weight backwards (not forward), body hooks have correct palm-up orientation, and you can flow lead-rear hooks with smooth weight transfer.',
    },
    'uppercut': {
      title: 'Uppercut Technique',
      drills: [
        {
          name: 'Short Uppercut from Guard',
          description: 'From guard position, throw short uppercuts. The hand drops only slightly from guard - this is a SHORT punch. Power comes from bending and straightening the knees, not winding up the arm.',
          volume: '3 x 15 reps each side',
          commonMistakes: ['Dropping the hand to waist level before throwing', 'Winding up by pulling arm back', 'Generating power from arm muscles instead of legs'],
          doingItRight: ['Hand barely leaves guard position before firing up', 'Power comes from a slight knee dip and drive', 'Punch travels 6-8 inches, no more'],
        },
        {
          name: 'Close Range Bag Uppercuts',
          description: 'Stand close to the bag (almost touching). Throw uppercuts at this range. If you need more distance, you\'re doing it wrong - uppercuts are inside punches.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Standing too far from the bag', 'Looping the punch from outside', 'Leaning back to create space'],
          doingItRight: ['Chest is almost touching the bag', 'Punch goes straight up between the guard', 'Body stays compact and centred'],
        },
        {
          name: 'Hook-Uppercut Combination',
          description: 'Throw 3-2 (lead hook to rear uppercut) combination on the bag. The hook pulls your weight to the outside, loading the rear uppercut perfectly.',
          volume: '3 x 2 min rounds',
          commonMistakes: ['Disconnecting the two punches', 'Uppercut becoming a wide looping punch', 'Standing too far away for the uppercut to land'],
          doingItRight: ['Hook naturally loads the uppercut through weight transfer', 'Both punches feel connected as one movement', 'Staying at close range throughout'],
        },
      ],
      passCriteria: 'Uppercuts fire from guard with minimal wind-up, power comes from legs not arms, and you can throw them comfortably at close range.',
    },
    'Defense - Hands': {
      title: 'Hand Defense',
      drills: [
        {
          name: 'Catch Technique',
          description: 'Rear hand at cheekbone height, palm slightly open. The jab lands in your palm - you\'re meeting it, not chasing it. The hand barely moves. Think of it as the punch arriving to you.',
          volume: '3 x 15 reps (with partner or visualised)',
          commonMistakes: ['Reaching out to catch the punch', 'Hand dropping from guard to catch low', 'Closing eyes or flinching on impact'],
          doingItRight: ['Hand stays at cheekbone height, punch comes to it', 'Minimal hand movement - just a small turn to receive', 'Eyes stay open and locked on opponent throughout'],
        },
        {
          name: 'Parry Drill',
          description: 'Against a cross or power shot, use your lead hand to redirect the punch to the side. Small deflection, not a big swipe. You\'re changing the punch\'s direction, not blocking it.',
          volume: '3 x 15 reps each side',
          commonMistakes: ['Big sweeping parry that leaves you open', 'Parrying too early (before the punch is committed)', 'Using too much force instead of redirecting'],
          doingItRight: ['Small, tight parry that barely moves your hand from guard', 'Timing matches the punch - parry as it arrives', 'Punch slides past you, creating an opening to counter'],
        },
        {
          name: 'Body Defence: Elbow Shield',
          description: 'Tuck elbows tight to your ribs, concave your stomach slightly, and lean into incoming body shots rather than away. The elbows and forearms create a shield over the liver and ribs.',
          volume: '3 x 2 min rounds (shadow or partner)',
          commonMistakes: ['Elbows flared out leaving body exposed', 'Leaning away from body shots (makes them land harder)', 'Dropping hands to cover body (exposes head)'],
          doingItRight: ['Elbows stay tight throughout, ribs fully covered', 'Slight lean into body shots absorbs impact', 'Hands stay at head height, elbows protect body'],
        },
        {
          name: 'Block and Counter Shadow Boxing',
          description: 'Shadow box imagining incoming punches. Catch the jab, immediately counter with the cross. Parry the cross, counter with the hook. Every defence becomes an attack.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Defending without countering', 'Pausing between the defence and the counter', 'Losing stance shape while defending'],
          doingItRight: ['Every defensive action flows directly into a counter', 'No gap between defence and attack', 'Stance stays solid throughout defence and counter'],
        },
      ],
      passCriteria: 'You can catch jabs with minimal hand movement, parry crosses with a small redirect, and your elbows naturally protect your body without dropping your hands.',
    },
    'Defense - Movement': {
      title: 'Head Movement',
      drills: [
        {
          name: 'Proper Slip Technique',
          description: 'Slip using HIP ROTATION, not bending at the waist. Your head moves offline because your hips rotate, bringing your torso with it. Imagine a rod going through the top of your head - you rotate around it.',
          volume: '3 x 15 reps each side',
          commonMistakes: ['Bending forward at the waist to slip', 'Head moving but body staying square', 'Losing balance because the slip is too wide'],
          doingItRight: ['Hips drive the slip, head follows naturally', 'Whole upper body rotates as a unit', 'Balance stays centred, ready to counter immediately'],
        },
        {
          name: 'Outside Slip Drill',
          description: 'Practice slipping to the OUTSIDE of the jab (your left vs orthodox opponent). This takes your head away from their power hand. Slip and you\'re in position to counter with the cross.',
          volume: '3 x 15 reps each side',
          commonMistakes: ['Slipping inside where the cross is waiting', 'Slipping too wide and being out of counter range', 'Not rotating hips enough on the slip'],
          doingItRight: ['Head moves outside the jab, away from the rear hand', 'Slip is tight enough to immediately counter', 'Rear hand is loaded and ready after the slip'],
        },
        {
          name: 'Roll vs Weave Drill',
          description: 'Practice both movements separately. Roll: lateral U-shape motion using hip rotation (for hooks). Weave: forward motion with knee bend (for straight punches at close range). They are different movements.',
          volume: '3 x 1 min each movement',
          commonMistakes: ['Mixing up the two movements', 'Using the same motion for both', 'Bending forward at the waist for either one'],
          doingItRight: ['Roll goes side to side with clear hip rotation', 'Weave goes under with knee bend, not waist bend', 'You can clearly distinguish between the two movements'],
        },
        {
          name: 'Defensive Shadow Boxing (No Punching)',
          description: 'Shadow box for full rounds but throw ZERO punches. Only move defensively - slips, rolls, weaves, pivots. This forces you to focus entirely on defensive movement.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Throwing punches out of habit', 'Moving only the head and not the body', 'Flat feet with no footwork between movements'],
          doingItRight: ['Entire round spent on defensive movement only', 'Full body involved in every defensive action', 'Feet are active and repositioning between movements'],
        },
      ],
      passCriteria: 'You can slip using hip rotation (not waist bending), you default to slipping outside the jab, and you understand the difference between a roll and a weave.',
    },
    'footwork': {
      title: 'Footwork',
      drills: [
        {
          name: 'Ball-of-Foot Bounce Drill',
          description: 'Stay on the balls of your feet in your stance, maintaining a slight bounce. Not jumping - just enough that your heels barely leave the floor. This keeps you ready to move in any direction instantly.',
          volume: '3 x 2 min rounds',
          commonMistakes: ['Flat-footed stance', 'Bouncing too high (wasting energy)', 'Weight shifting to heels between movements'],
          doingItRight: ['Heels are slightly off the floor at all times', 'Bounce is subtle, barely visible', 'You can move in any direction instantly from this position'],
        },
        {
          name: 'Push-Step Movement Drill',
          description: 'Move in all 4 directions using push-steps: push off the opposite foot to the direction you want to go. Forward: push off rear foot. Back: push off front foot. Feet never cross.',
          volume: '3 x 2 min rounds',
          commonMistakes: ['Stepping first instead of pushing first', 'Feet crossing over each other', 'Losing stance width during movement'],
          doingItRight: ['Movement starts with a push, not a step', 'Stance width stays consistent throughout', 'You could throw a punch at any point during movement'],
        },
        {
          name: 'Pivot and Angle-Off Drill',
          description: 'Throw a combination, then pivot on your lead foot to change angle. You should end up facing where you were, but from a different position. This is how you avoid being a stationary target.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Pivoting without throwing first', 'Crossing feet during the pivot', 'Not pivoting far enough to actually change angle'],
          doingItRight: ['Combination flows directly into the pivot', 'Lead foot stays planted as the pivot point', 'You end up at a 45-90 degree angle from where you started'],
        },
      ],
      passCriteria: 'You can stay on the balls of your feet for a full round, move in all directions using push-steps, and pivot to change angle after combinations.',
    },
    'DISTANCE/RANGE': {
      title: 'Range Management',
      drills: [
        {
          name: 'Range Identification Drill',
          description: 'With a partner (or bag), practice identifying your three ranges. Long range: only your jab reaches. Mid range: hooks land cleanly. Close range: uppercuts and elbows. Step between each range deliberately.',
          volume: '3 x 2 min rounds',
          commonMistakes: ['Throwing hooks at long range (they can\'t reach properly)', 'Throwing jabs at close range (no room to extend)', 'Not knowing which range you\'re in at any given moment'],
          doingItRight: ['You can name your current range at any time', 'Punch selection matches the range', 'Transitions between ranges are deliberate, not accidental'],
        },
        {
          name: 'Jab-and-Exit Drill',
          description: 'Step into long range, throw 1-2 jabs, immediately step back out of range. The goal is to land and be gone before they can counter. This teaches you to control the distance.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Staying in range after jabbing', 'Stepping too close (into mid range)', 'Exiting too slowly after the jab'],
          doingItRight: ['You\'re in and out before a counter can land', 'Jabs are thrown at maximum extension (true long range)', 'Exit is as fast as the entry'],
        },
        {
          name: 'Range Control Shadow Boxing',
          description: 'Shadow box and consciously manage your range. Spend time at each range, move between them deliberately, and select punches that match where you are.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Staying at one range the entire round', 'Punch selection doesn\'t match current range', 'Moving in and out without purpose'],
          doingItRight: ['You use all three ranges during the round', 'Every punch makes sense for the current range', 'Range changes are deliberate tactical decisions'],
        },
      ],
      passCriteria: 'You can identify which range you\'re in, select appropriate punches for each range, and move in and out of range deliberately.',
    },
    'Combinations & Flow': {
      title: 'Combination Flow',
      drills: [
        {
          name: 'Continuous Rotation Drill',
          description: 'Throw jab-cross-hook-cross in a continuous loop on the bag. Focus on smooth transitions between punches. Each punch should flow from the last through body rotation, not arm effort.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Pausing between punches', 'Resetting to guard between each punch', 'Powering punches with arms instead of rotation'],
          doingItRight: ['Punches flow seamlessly without breaks', 'Body rotation powers every transition', 'You could maintain this rhythm for the entire round'],
        },
        {
          name: '3-4 Punch Combinations on Bag',
          description: 'Throw specific combinations: 1-2-3 (jab-cross-hook), 1-2-3-2 (jab-cross-hook-cross), 1-1-2-3 (double jab-cross-hook). Focus on smooth transitions, not power.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Telegraphing the next punch in the sequence', 'Losing balance partway through the combination', 'Speed dropping off after the first two punches'],
          doingItRight: ['Each punch in the combo has the same snap', 'Balance stays centred throughout the full combination', 'Combinations finish cleanly and you return to guard'],
        },
        {
          name: 'Freestyle Combination Shadow Boxing',
          description: 'Shadow box throwing whatever combinations come naturally. The goal is to be creative - vary punch selection, speed, power, angles. Don\'t repeat the same combo twice in a row.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Falling into the same 1-2 pattern repeatedly', 'Only throwing to the head, never the body', 'Stopping after 2 punches every time'],
          doingItRight: ['Variety in combinations - head and body, different lengths', 'Some combos are 2 punches, some are 5-6', 'Punches flow naturally without pre-planning each combo'],
        },
      ],
      passCriteria: 'You can throw 4+ punch combinations with smooth transitions, varied targets (head and body), without losing balance or rhythm.',
    },
    'Power Generation': {
      title: 'Power Generation',
      drills: [
        {
          name: 'Kinetic Chain Isolation',
          description: 'Throw the cross in stages to feel the kinetic chain: (1) pivot rear foot, (2) rotate hips, (3) rotate torso, (4) extend arm. Do each stage separately, then combine them in sequence. Power starts from the ground.',
          volume: '3 x 15 reps (slow, deliberate)',
          commonMistakes: ['Starting the punch from the arm', 'Skipping the hip rotation stage', 'Back heel staying flat on the ground'],
          doingItRight: ['You can feel each link in the chain firing in order', 'The arm is the LAST thing to move', 'Rear heel is off the ground, pointing at the ceiling'],
        },
        {
          name: 'Relaxation-to-Tension Snap Drill',
          description: 'Stay completely relaxed - loose arms, dropped shoulders. Throw a single power shot, tensing only at the moment of impact, then immediately relax again. Power = relaxation + snap, not constant tension.',
          volume: '3 x 15 reps each hand',
          commonMistakes: ['Staying tense before and after the punch', 'Tensing up during the wind-up', 'Not actually relaxing between punches'],
          doingItRight: ['Arms feel like whips - loose until the snap', 'Tension exists only for a split second at impact', 'You can feel the speed difference vs a tense punch'],
        },
        {
          name: 'Heavy Bag Power Rounds',
          description: 'Work the heavy bag focusing on making it SNAP, not PUSH. A powerful punch makes the bag crack; an arm-heavy punch pushes it away. Listen for the difference.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Pushing the bag (it swings away gently)', 'Using arm strength instead of body rotation', 'No foot pivot on power shots'],
          doingItRight: ['Bag snaps on impact with an audible crack', 'Every power shot involves visible hip rotation', 'Rear foot pivots on crosses and rear hooks'],
        },
        {
          name: 'Power Shadow Boxing',
          description: 'Shadow box throwing single power shots with full commitment. Focus on sitting down on the punch, driving from the ground, and snapping through. Not combinations - individual power shots with reset between each.',
          volume: '3 x 3 min rounds',
          commonMistakes: ['Throwing combinations instead of individual power shots', 'Not resetting stance between punches', 'Power coming from leaning forward'],
          doingItRight: ['Each punch is a committed single shot', 'Full kinetic chain engaged on every punch', 'Balance stays centred, never falling forward'],
        },
      ],
      passCriteria: 'Your power shots use the full kinetic chain (ground up), you can feel the difference between relaxed-snap power and arm-muscle power, and the bag cracks instead of pushes.',
    },
  };

  return weakCategories
    .filter(c => c.percentage < 100)
    .slice(0, 3)
    .map(c => plans[c.category] || {
      title: getCatDisplay(c.category),
      drills: [{
        name: 'Focused Shadow Boxing',
        description: `Shadow box with deliberate focus on ${getCatDisplay(c.category).toLowerCase()}. Every round should have a specific intention.`,
        volume: '3 x 3 min rounds',
        commonMistakes: ['Going through the motions without focus', 'Not having a clear intention for each round'],
        doingItRight: ['Every round has a specific focus', 'You can articulate what you worked on after each round'],
      }],
      passCriteria: `You can demonstrate improved ${getCatDisplay(c.category).toLowerCase()} technique in shadow boxing.`,
    });
}

function ResultsContent() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [unlocked, setUnlocked] = useState(false);
  const [capturedName, setCapturedName] = useState('');
  const [capturedEmail, setCapturedEmail] = useState('');
  const [waitlistJoined, setWaitlistJoined] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) { setLoading(false); return; }

    // Try sessionStorage first
    try {
      const raw = sessionStorage.getItem('ob-diagnostic-result');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.id === id) {
          setResult(data);
          setLoading(false);
          return;
        }
      }
    } catch {}

    // Fall back to server
    fetch(`/api/quiz/get-result?id=${encodeURIComponent(id)}`)
      .then(r => r.json())
      .then(data => {
        if (data.result) {
          const serverResult = { ...data.result, id };
          setResult(serverResult);
          // Cache in sessionStorage for this session
          try { sessionStorage.setItem('ob-diagnostic-result', JSON.stringify(serverResult)); } catch {}
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
        <QuizHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-neutral-500 text-xl">Loading results...</div>
        </main>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
        <QuizHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-neutral-500 text-xl">Result not found</div>
        </main>
      </div>
    );
  }

  const levelConfig = LEVEL_CONFIG[result.level] || LEVEL_CONFIG.beginner;
  const weakCategories = result.categoryScores.filter(c => c.percentage < 100).sort((a, b) => a.percentage - b.percentage);

  // Radar chart data
  const chartData = result.categoryScores.map(c => ({
    skill: getCatDisplay(c.category),
    score: c.percentage,
  }));

  // Workout plan
  const workoutPlan = generateWorkoutPlan(weakCategories);

  const handleEmailCapture = async (name: string, email: string) => {
    // Save email capture + SendGrid + Slack
    await fetch('/api/quiz/capture-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: result.id, name, email }),
    }).catch(() => {});
    setCapturedName(name);
    setCapturedEmail(email);
    setUnlocked(true);
  };

  const handleJoinWaitlist = async () => {
    if (waitlistLoading || waitlistJoined) return;
    setWaitlistLoading(true);
    try {
      await fetch('/api/quiz/join-waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: capturedName, email: capturedEmail }),
      });
      setWaitlistJoined(true);
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch {
      setWaitlistLoading(false);
    }
  };

  // EMAIL GATE VIEW
  if (!unlocked) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
        <QuizHeader />
        <main className="flex-grow flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            {/* Score + blurred preview */}
            <div className="bg-white border border-neutral-200 shadow-sm rounded-xl p-6 mb-6 relative overflow-hidden">
              <div className="text-center mb-5">
                <h2 className="text-2xl font-bold">{levelConfig.title} · {result.percentage}%</h2>
              </div>

              {/* Blurred preview */}
              <div className="relative">
                <div className="blur-[6px] pointer-events-none select-none">
                  <div className="space-y-2.5">
                    {result.categoryScores.map(cat => (
                      <div key={cat.category} className="flex items-center gap-3">
                        <span className="text-xs font-medium text-neutral-700 w-24 text-right">{getCatDisplay(cat.category)}</span>
                        <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                          <div className="h-full bg-neutral-800 rounded-full" style={{ width: `${cat.percentage}%` }} />
                        </div>
                        <span className="text-xs text-neutral-500 w-8">{cat.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Lock overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-sm rounded-lg px-4 py-2 shadow-sm border border-neutral-200">
                    <p className="text-sm font-medium text-neutral-700 flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Unlock your full breakdown
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Email capture */}
            <div className="bg-white border border-neutral-200 shadow-sm p-6 rounded-xl text-center">
              <h3 className="text-base font-semibold mb-1">Get your full results</h3>
              <p className="text-neutral-500 text-xs mb-4">
                Skill radar, gap analysis, and a personalised training plan.
              </p>
              <EmailCaptureForm onSubmit={handleEmailCapture} />
              <p className="mt-3 text-xs text-neutral-400">No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // FULL RESULTS VIEW
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F5] text-neutral-900">
      <QuizHeader />
      <main className="flex-grow px-4 py-10">
        <div className="max-w-2xl mx-auto space-y-8">

          {/* Level & Score */}
          <section className="text-center">
            <h1 className="text-2xl sm:text-3xl font-bold">{levelConfig.title} · {result.percentage}%</h1>
            <p className="mt-3 text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">{levelConfig.desc}</p>
          </section>

          {/* Radar Chart */}
          <section className="bg-white border border-neutral-200 shadow-sm p-6 rounded-xl">
            <ResultsChart data={chartData} maxScore={100} />
          </section>

          {/* Training Plan */}
          {workoutPlan.length > 0 && (
            <section className="space-y-6">
              <div className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold">Your Training Plan</h2>
                <p className="text-sm text-neutral-500 mt-1">Based on your weakest areas. Do each workout 2-3 times per week.</p>
              </div>

              {workoutPlan.map((block, i) => (
                <div key={i} className="bg-white border border-neutral-200 shadow-sm rounded-xl overflow-hidden">
                  {/* Workout header */}
                  <div className="bg-[#37322F] text-white px-5 py-3">
                    <h3 className="font-bold text-sm uppercase tracking-wider">Workout {i + 1}: {block.title}</h3>
                  </div>

                  {/* Drills */}
                  <div className="divide-y divide-neutral-100">
                    {block.drills.map((drill, j) => (
                      <div key={j} className="p-5">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h4 className="font-bold text-neutral-900 text-sm">{drill.name}</h4>
                          <span className="text-xs font-medium text-neutral-500 bg-neutral-100 px-2 py-1 rounded-md whitespace-nowrap flex-shrink-0">{drill.volume}</span>
                        </div>
                        <p className="text-sm text-neutral-600 leading-relaxed mb-3">{drill.description}</p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1.5">Common Mistakes</p>
                            <ul className="space-y-1">
                              {drill.commonMistakes.map((m, k) => (
                                <li key={k} className="flex items-start gap-1.5 text-xs text-neutral-500">
                                  <span className="text-red-400 mt-0.5 flex-shrink-0">✗</span>
                                  <span>{m}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1.5">Doing It Right</p>
                            <ul className="space-y-1">
                              {drill.doingItRight.map((d, k) => (
                                <li key={k} className="flex items-start gap-1.5 text-xs text-neutral-500">
                                  <span className="text-green-500 mt-0.5 flex-shrink-0">✓</span>
                                  <span>{d}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pass criteria */}
                  <div className="bg-neutral-50 px-5 py-3 border-t border-neutral-100">
                    <p className="text-xs text-neutral-600">
                      <span className="font-semibold text-neutral-700">✅ Pass when:</span> {block.passCriteria}
                    </p>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Recommended Videos - based on weak categories from Boxing Toolkit */}
          {(() => {
            const seen = new Set<string>();
            const videos: { id: string; title: string }[] = [];
            weakCategories.forEach(cat => {
              const modules = CATEGORY_TOOLKIT_MODULES[cat.category] || [];
              modules.forEach(mod => {
                toolkitVideos
                  .filter(v => v.module === mod)
                  .forEach(v => {
                    if (!seen.has(v.id)) {
                      seen.add(v.id);
                      videos.push({ id: v.id, title: v.title });
                    }
                  });
              });
            });
            if (videos.length === 0) return null;
            return (
              <section className="bg-white border border-neutral-200 shadow-sm rounded-xl p-5 sm:p-6">
                <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-1">Boxing Toolkit Videos For You</h2>
                <p className="text-xs text-neutral-400 mb-4">Hand-picked from our course based on your results.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {videos.slice(0, 6).map(video => (
                    <a
                      key={video.id}
                      href={`https://youtube.com/watch?v=${video.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl hover:bg-neutral-100 transition border border-neutral-100"
                    >
                      <img
                        src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                        alt={video.title}
                        className="w-24 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <span className="text-sm text-neutral-700 font-medium leading-tight">
                        {video.title}
                      </span>
                    </a>
                  ))}
                </div>
              </section>
            );
          })()}

          {/* CTA */}
          <section className="bg-[#37322F] text-[#F5F5F5] p-6 sm:p-8 rounded-xl text-center">
            <p className="text-sm uppercase tracking-wider text-neutral-400 mb-2">Re-opening 22nd February</p>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Our Infamous 21-Day Boxing Challenge</h2>
            <p className="text-neutral-400 max-w-md mx-auto mb-5 text-sm leading-relaxed">Sign up to the waitlist and see the full details about the challenge.</p>
            {waitlistJoined ? (
              <div className="inline-flex items-center gap-2 text-green-400 font-semibold px-6 py-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                You&apos;re on the list! Redirecting...
              </div>
            ) : (
              <button
                onClick={handleJoinWaitlist}
                disabled={waitlistLoading}
                className="inline-flex items-center gap-2 bg-white text-[#37322F] font-semibold px-6 py-3 rounded-lg hover:bg-neutral-100 transition-colors disabled:opacity-50"
              >
                {waitlistLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Joining...
                  </>
                ) : (
                  'Join the Waitlist'
                )}
              </button>
            )}
          </section>

          {/* Retake */}
          <div className="text-center pb-4">
            <a href="/quiz/take" className="text-sm text-neutral-400 hover:text-neutral-600 transition">
              Retake the test
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function DiagnosticResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col bg-[#F5F5F5]">
        <QuizHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-neutral-500 text-xl">Loading results...</div>
        </main>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  );
}
