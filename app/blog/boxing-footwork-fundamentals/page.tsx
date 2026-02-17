"use client"

import Link from "next/link"
import Image from "next/image"
import FooterSection from "@/components/footer-section"

export default function BoxingFootworkFundamentalsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-[800px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://sb.oracleboxing.com/logo/icon_dark.webp"
              alt="Oracle Boxing"
              width={32}
              height={32}
              className="rounded"
            />
            <span
              className="text-[#37322F] text-title font-semibold tracking-tight"
            >
              Oracle Boxing
            </span>
          </Link>
          <Link
            href="/blog"
            className="text-[#605A57] text-sm hover:text-[#37322F] transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-[800px] mx-auto px-4 py-8 md:py-14">
        <p className="text-[#605A57] text-sm mb-4">18 July 2025</p>

        <h1
          className="text-[#37322F] text-section font-semibold tracking-tight mb-8"
        >
          Boxing Footwork Fundamentals: How to Move Like a Real Boxer
        </h1>

        {/* Content */}
        <div className="prose-oracle space-y-6 text-[#37322F] text-title leading-[1.75]">
          <p>
            Boxing is a game of inches. The difference between getting hit and making your opponent miss is often a tiny step - just enough to take your head off their centre line. Yet footwork is the most neglected skill in boxing. Beginners spend all their time working on punches and almost none on the movement that makes those punches land.
          </p>
          <p>
            Good footwork isn&apos;t about being fast. It&apos;s about being conservative - making small, articulate movements that keep you balanced, in range when you want to be, and out of range when you don&apos;t. The boxers who look effortless in the ring aren&apos;t covering more ground than everyone else. They&apos;re just covering exactly the right amount.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            The Foundation: Your Stance Dictates Your Movement
          </h2>
          <p>
            Everything starts with how you set up. Feet roughly shoulder-width apart, staggered front to back. Lead foot fully planted, rear heel up off the ground, weight loaded roughly 60/40 on the rear leg. Your shins should be vertical - knees above ankles - with a slight bend at the hips and knees. This gives you the spring you need to move in any direction.
          </p>
          <p>
            Two common stance problems destroy your footwork before you even take a step. First: stiff, straight legs. When your knees are locked, you have no spring. You can&apos;t push off quickly, and every movement becomes heavy and slow. Second: flimsy ankles. Your ankles need to be solid and articulate, not floppy. When you step, the movement should be intricate and controlled - not sloppy or lazy. Think precise, small adjustments rather than big dramatic steps.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            The First Rule: Feet First, Then Hands
          </h2>
          <p>
            This is the number one footwork mistake beginners make: they start punching before their feet are in range. They see an opening, launch forward with their fists, and after one or two punches they&apos;re already off balance, out of position, and can&apos;t continue a combination or defend. They end up falling over the front foot with nothing left.
          </p>
          <p>
            The fix is simple in theory but takes discipline to drill: get your feet into range first, then let your hands go. Your feet set the table. Your hands eat the meal. When your feet are in the right position before you start throwing, you can sustain combinations, maintain your balance, and recover to defend. When they&apos;re not, everything falls apart after the first punch.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Basic Movement: Open-Close Stepping
          </h2>
          <p>
            The fundamental boxing step follows an open-close pattern. To move forward: lead foot steps first (open), rear foot follows to close the gap (close). To move backward: rear foot steps first, lead foot follows. To move to your lead side: lead foot steps, rear foot follows. To your rear side: rear foot steps, lead foot follows. The direction you&apos;re going in determines which foot leads.
          </p>
          <p>
            The steps should be small and articulate. This is a game of inches - you want to just miss, just be out of range, just create enough angle. You don&apos;t want to be covering large distances with every step because that takes you out of position and wastes energy. Be as conservative as possible with your movement. Only move as much as you need to.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            The Pivot: Taking Angles Without Covering Distance
          </h2>
          <p>
            The pivot is one of the most important skills in boxing. It lets you change your angle relative to your opponent without moving linearly - you rotate around a point rather than stepping away. Stay on the ball of your foot and rotate 90 degrees. Your lead foot acts as the pivot point while your rear foot swings around.
          </p>
          <p>
            When you pivot, it&apos;s your shoulders that generate the momentum. Twist your shoulders to initiate the turn and the rest of your body follows. This applies to any angle change - pivots, shifts, lateral movements. The rotation starts from the upper body and your feet follow, not the other way around.
          </p>
          <p>
            Common pivot mistakes: coming onto your heels (stay on the balls of your feet), falling off balance as you rotate (pause and check your position after each pivot), and not completing the full 90 degrees (commit to the angle). Practice pivoting to both sides - lead side and rear side - until you can do it without thinking about balance.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            The Petal Drill: Ring Movement Made Automatic
          </h2>
          <p>
            The petal drill is one of the most effective footwork drills in boxing. Imagine your opponent is at the centre of a flower, and you&apos;re tracing the petals around them. Step out at an angle, throw your shots, then come back to the centre. Step out at a different angle, throw, come back. Repeat this around the imaginary ring.
          </p>
          <p>
            The petal shape teaches you to move after every punch. Step out, take an angle, throw, come back in. Step out, take a different angle, throw, come back in. This pattern on repeat builds the habit of never being stationary where your opponent expects you. Even if you&apos;re a pressure fighter who likes to stay close, this skill is essential because you can&apos;t always fight one way. Sometimes you need to adapt - the other person might be stronger, or your usual approach isn&apos;t working.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Range Management: The Invisible Skill
          </h2>
          <p>
            Range management is understanding exactly how far away you need to be from your opponent at any given moment. Too close and you&apos;re in their firing line without being set to throw. Too far and your punches fall short. The right range is where your lead foot is in position to punch from - because that&apos;s your actual range. It&apos;s the foot you&apos;re punching off.
          </p>
          <p>
            Good range management also involves feinting and distance control - small movements in and out, little feints with the feet or hands, giving your opponent different looks. You&apos;re trying to make them throw so you can counter, or make them not throw so you can throw first. This consists of small adjustments: a half-step forward to draw a reaction, a half-step back to create a miss, changing levels by squatting slightly. It&apos;s doing something in between exchanges that lets you eventually control the fight.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Maintaining Your Stance While Moving
          </h2>
          <p>
            The biggest footwork challenge is maintaining your stance structure while you move. Your feet shouldn&apos;t come too close together (you lose stability) or too far apart (you lose mobility). Your rear heel should stay up off the ground. Your weight distribution should stay roughly 60/40 on the rear leg. Your hands should stay up in your guard.
          </p>
          <p>
            When you move, keep your head from turning sideways to follow your body. Your head stays looking straight at your opponent - don&apos;t angle your head to match your torso rotation. And don&apos;t let your hands drop while you step. Maintaining your guard during footwork is a discipline that has to be drilled consciously until it becomes automatic. Move your feet, keep your hands up, keep your chin down, stay on the balls of your feet.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            The Footwork Drill Programme
          </h2>
          <p>
            <strong>Round 1 - Basic movement:</strong> Open-close steps in all four directions. Two steps to your lead side, one step to your rear side. Then swap. Focus on keeping your stance width consistent and your ankles solid.
          </p>
          <p>
            <strong>Round 2 - Pivots:</strong> Pivot 90 degrees to your lead side, then pivot back. Then pivot to your rear side and back. Stay on the balls of your feet. Don&apos;t rush - pause at each position to make sure you&apos;re balanced.
          </p>
          <p>
            <strong>Round 3 - Petal drill:</strong> Trace the petal shape around an imaginary opponent. Step out, angle, come back. Step out to a different angle, come back. Add a jab at each angle change.
          </p>
          <p>
            <strong>Round 4 - Combined:</strong> Shadow box with an emphasis on footwork. After every combination, move. Step off the line, take an angle, reset. Get used to the rhythm of punch-move-punch-move. Never throw without moving after.
          </p>
          <p>
            Do these four rounds as a dedicated footwork session. Over time, the movement becomes instinctive - you won&apos;t think about your feet, they&apos;ll just be in the right place.
          </p>

          {/* CTA */}
          <div className="mt-14 py-10 px-6 md:px-10 bg-[#37322F]/[0.03] rounded-2xl text-center">
            <h3
              className="text-[#37322F] text-sub font-semibold mb-3"
            >
              Move Like a Boxer, Not Just a Puncher
            </h3>
            <p className="text-[#605A57] mb-6 max-w-[500px] mx-auto">
              The 21-Day Boxing Challenge builds your stance, footwork, and movement alongside your punching technique - with coaching feedback to fix what you can&apos;t see yourself.
            </p>
            <Link
              href="/checkout-v2"
              className="inline-block bg-[#37322F] text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-[#49423D] transition-colors"
            >
              Start the 21-Day Challenge →
            </Link>
          </div>
        </div>
      </article>

      <FooterSection />
    </div>
  )
}
