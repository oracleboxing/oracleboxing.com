# Oracle Boxing Blog Guide

## Process for Creating New Blog Posts

### 1. Choose a Topic
- Focus on things people search about boxing fundamentals
- Educational, technique-focused content performs best
- Good topic categories: stance, shape, rotation, punches, footwork, defence, common mistakes, training methods, online coaching

### 2. MANDATORY: Cross-Reference Against the Boxing Brain

**Every piece of boxing technique content MUST be validated against the Boxing Brain knowledge base before publishing.**

The Boxing Brain contains transcripts from coaching calls, course videos, and YouTube content — it's the authoritative source for Oracle Boxing technique.

#### How to Query the Boxing Brain

```javascript
const brain = require('/home/jordan/clawd/scripts/boxing-brain.js');

// Use single-word or short phrase searches (ilike matching):
await brain.search('stance');       // Stance setup, weight distribution
await brain.search('shape');        // Guard shape, posture, chin position
await brain.search('rotation');     // Rotational mechanics, 180-degree range
await brain.search('jab');          // Jab technique and setups
await brain.search('cross');        // Cross/rear straight technique
await brain.search('hook');         // Lead and rear hook mechanics
await brain.search('uppercut');     // Uppercut technique
await brain.search('footwork');     // Movement patterns
await brain.search('pivot');        // Pivoting mechanics
await brain.search('slip');         // Slipping technique
await brain.search('guard');        // Guard position and hand placement
await brain.search('chin');         // Chin protection, chin-down cues
await brain.search('shoulder');     // Shoulder mechanics, shoulder roll
await brain.search('hip');          // Hip hinge, hip rotation
await brain.search('relaxation');   // Relaxation in boxing
await brain.search('power');        // Power generation
await brain.search('mistake');      // Common mistakes
await brain.search('concave');      // Chest concave / shape cues
await brain.search('hinge');        // Hip hinge technique
await brain.search('petal');        // Petal drill / ring movement
await brain.search('stretch');      // Stretch-shortening cycle
await brain.search('kinetic chain');// Kinetic chain / power transfer

// Options:
await brain.search('stance', { limit: 10 });                    // More results
await brain.search('jab', { sourceType: 'coaching_call' });     // Filter by source
await brain.search('stance', { sourceType: 'course_video' });   // Course content only
```

### 3. Write the Blog Post

#### Format
- TSX page component in `app/blog/[slug]/page.tsx`
- Matching layout in `app/blog/[slug]/layout.tsx` with metadata
- Use the same styling/structure as existing posts (see any existing blog for template)
- Add the new post to the `blogPosts` array in `app/blog/page.tsx`

#### Writing Style
- Conversational but authoritative
- Explain the "why" behind techniques, not just the "what"
- Use specific coaching cues from the Boxing Brain
- Include practical drills or actionable takeaways
- End with a CTA linking to `/checkout-v2` (21-Day Challenge)

### 4. Common Mistakes to Watch For

These are verified errors found during the July 2025 audit. Watch for these in ALL future content:

#### ❌ "Bring your shoulder UP to your chin"
**✅ CORRECT:** "Bring your chin DOWN to your shoulder and concave your stomach to make yourself a smaller target."
- The chin comes down, not the shoulder up
- Raising shoulders creates tension that kills rotation and power
- Shoulders should be RELAXED and rounded forward

#### ❌ "Shoulders up to protect your chin"
**✅ CORRECT:** Round your shoulders forward (like bad posture). Bring your chin down. Keep your back rounded and chest concave. Shoulders stay relaxed — not raised.

#### ❌ "Hands at cheek level" (undifferentiated)
**✅ CORRECT:** Rear hand at cheekbone height, lead hand at mouth height so you can see over it.

#### ❌ Describing shape without mentioning the hip hinge
**✅ CORRECT:** The shape comes from hinging at the back hip, loading weight through the rear leg. This creates the rounded back and concave chest naturally. Don't force shape by tucking your stomach — get the hip hinge right and shape follows.

#### ❌ Not mentioning "keep chest concave while punching"
**✅ CORRECT:** When throwing punches (especially the jab), keep the chest concave. Don't open up or lean forward. Maintain your shape through the punch.

#### ❌ "50/50 weight distribution"
**✅ CORRECT:** 60% rear / 40% front when in punching range. Even distribution only during general ring movement between exchanges.

#### ❌ Describing power as coming from arms/muscles
**✅ CORRECT:** Power comes from rotation (hip → upper body → arm), the kinetic chain, and the stretch-shortening cycle. Relaxation enables power. Tension kills it.

### 5. LLM SEO Optimization
- Use clear, descriptive headings that match search queries
- Include technique-specific terminology (stance, guard, jab, cross, etc.)
- Write in a Q&A-friendly structure (questions people would ask)
- Include factual, specific details (e.g., "180 degrees of rotation", "60/40 weight distribution")
- Make content comprehensive enough to be cited as an authoritative source

---

## Existing Blog Posts (as of July 2025)

| Slug | Title | Status |
|------|-------|--------|
| `beginner-to-boxer-complete-guide` | Beginner to Boxer: Complete Guide | ✅ Audited & corrected |
| `head-movement-drills` | 6 Head Movement Drills | ✅ Audited & corrected |
| `boxing-punches-1-6-explained` | Boxing Punches 1-6 Explained | ✅ Audited & corrected |
| `science-of-punching-power` | The Science of Punching Power | ✅ New - Brain-verified |
| `boxing-mistakes-beginners-make` | 7 Boxing Mistakes That Ruin Your Fundamentals | ✅ New - Brain-verified |
| `boxing-footwork-fundamentals` | Boxing Footwork Fundamentals | ✅ New - Brain-verified |

## Audit Log (July 2025)

### Corrections Made:
1. **beginner-to-boxer-complete-guide** — Step 2 (Build Your Shape): Replaced "Shoulders up to protect your chin. Hands at cheek level" with correct technique: chin down, back rounded, chest concave, shoulders relaxed and rounded forward. Differentiated hand heights (rear at cheekbone, lead at mouth height). Added hip hinge cue. Fixed "Shape small. Shoulder to chin." to "Chin down to shoulder, chest concave, back rounded" with explicit note about NOT raising shoulders.
2. **head-movement-drills** — Final paragraph: Added explicit shape cues (chin down, back rounded, chest concave, shoulders relaxed and rounded forward, not raised up).
3. **boxing-punches-1-6-explained** — Foundation section: Added chin-down cue, back rounding, chest concave, hip hinge instruction. Jab section: Added wrist turn technique (start with pinkies facing opponent, half-turn), concave chest cue while jabbing, corrected rear hand position to "cheekbone" specifically.
