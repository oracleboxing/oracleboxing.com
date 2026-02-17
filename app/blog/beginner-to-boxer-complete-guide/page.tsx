"use client"

import Link from "next/link"
import Image from "next/image"
import FooterSection from "@/components/footer-section"

export default function BeginnerToBoxerGuidePage() {
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
        <p className="text-[#605A57] text-sm mb-4">16 July 2025</p>

        <h1
          className="text-[#37322F] text-section font-semibold tracking-tight mb-8"
        >
          Beginner to Boxer: The Complete Guide to Learning Boxing Online
        </h1>

        {/* YouTube Embed */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10 bg-[#37322F]/5">
          <iframe
            src="https://www.youtube.com/embed/oZOXsO_LN7M"
            title="Beginner to Boxer Complete Guide"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="prose-oracle space-y-6 text-[#37322F] text-title leading-[1.75]">
          <p>
            Most people who want to learn boxing don&apos;t have a talent problem. They don&apos;t have a discipline problem. They have a roadmap problem. There&apos;s so much information available that it actually makes things worse - you watch hundreds of videos, save clips you&apos;ll never revisit, and mistake education for entertainment.
          </p>
          <p>
            This guide strips it back to what actually matters. Whether you&apos;re training at home, at a gym, or through online coaching, this is the path from complete beginner to someone who can actually box.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Step 1: Get Your Stance Right
          </h2>
          <p>
            Everything in boxing starts with how you stand. Your feet should be roughly shoulder-width apart, staggered front to back. Lead foot forward, rear foot back at a slight angle. Knees slightly bent. Weight should not be 50/50 - you want slightly more weight on the rear foot.
          </p>
          <p>
            Why? Because when your weight is back, your head is naturally further from your opponent. You have more room to react. When you&apos;re 50/50 or leaning forward, you&apos;re closer, more exposed, and every exchange becomes a race you&apos;re not ready to win yet.
          </p>
          <p>
            The stance isn&apos;t just where you start - it&apos;s where you return after every punch, every movement, every exchange. If you can&apos;t find your stance instinctively, nothing that comes after will work.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Step 2: Build Your Shape
          </h2>
          <p>
            Shape is how you hold your upper body within your stance. Round your shoulders forward - like you&apos;ve got bad posture. Bring your chin down so it&apos;s tucked and protected. Keep your back rounded and your chest concave - this makes you a smaller target. Rear hand at cheekbone height, lead hand at mouth height so you can see over it. Elbows tucked in front of your body where you can see them.
          </p>
          <p>
            Critically, your lead shoulder should sit lower than your rear shoulder. This isn&apos;t just a guard - it&apos;s built-in defence. When your lead shoulder is lower, your head naturally moves off the centre line. Your opponent has to work harder to line up their punches. To get into this position, hinge at the back hip and make sure the weight goes through the back leg. As one Oracle Boxing coach puts it: &ldquo;When I see someone set up with both shoulders level, I know the jab is going to be easy to land. And everything else comes off the jab.&rdquo;
          </p>
          <p>
            Shape small. Chin down to shoulder, chest concave, back rounded. Don&apos;t bring your shoulders up to your chin - bring your chin down to your shoulder and concave your stomach to make yourself a smaller target. That&apos;s the position you drill until it becomes second nature.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Step 3: Understand Rotation
          </h2>
          <p>
            Every punch in boxing comes from rotation. Your body rotates through roughly 180 degrees - from your fully loaded rear position through to your fully extended lead position. A jab uses a small amount of that range. A cross uses more. Hooks and uppercuts access different axes of rotation.
          </p>
          <p>
            If you&apos;ve got bad fundamentals, it almost always comes down to four things: weight distribution, ability to rotate your body, relaxation, or shape. Rotation ties all of them together.
          </p>
          <p>
            Start with simple rotation drills. Stand in your stance, hands at your sides, and just rotate your body back and forth. Feel your hips drive the movement. Let your arms swing naturally - that loose, whipping motion is exactly what generates power in punches. If you feel stiff, you&apos;re tensing muscles that should be relaxed.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Step 4: Learn the Six Punches
          </h2>
          <p>
            Once stance, shape, and rotation feel natural, you&apos;re ready for the punches. They&apos;re numbered 1 through 6: jab, cross, lead hook, rear hook, lead uppercut, rear uppercut. Each one is a different expression of the same rotational mechanics.
          </p>
          <p>
            Don&apos;t rush this. Spend real time on each punch individually before combining them. The jab alone could take weeks to feel right. That&apos;s normal. A clean, relaxed jab with proper weight transfer is more valuable than a sloppy six-punch combination.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Step 5: Add Defence
          </h2>
          <p>
            Defence isn&apos;t a separate skill you bolt on - it comes from the same positions you&apos;ve already built. When your shape is right, you can slip to the inside by dropping your lead shoulder further. Slip outside by rotating to the rear shoulder. Roll under hooks by bending at the knees. Pull back by shifting weight to the rear foot.
          </p>
          <p>
            The best boxers throughout history don&apos;t think about offence and defence as separate things. They flow blocks, head movement, and punches together to create clean counter-punching opportunities. That flow starts with the same foundation: stance, shape, rotation.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Step 6: Drill, Don&apos;t Just Train
          </h2>
          <p>
            There&apos;s a difference between training and drilling. Training is showing up and doing rounds. Drilling is repeating the same movement with intention until it&apos;s automatic. You need both, but drilling is what accelerates progress.
          </p>
          <p>
            Five drills that mimic fundamental ring movements will level up your boxing faster than random bag work. Footwork patterns (the petal shape around an imaginary ring), punch technique on the bag, shadow boxing with defensive triggers, range management, and combination flow. Repeat these on loop and your ability will improve massively.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Can You Actually Learn Boxing Online?
          </h2>
          <p>
            Yes - but not from YouTube alone. Free content gives you information, not feedback. And without feedback, you can&apos;t correct the mistakes you don&apos;t even know you&apos;re making. You&apos;ll drill bad habits into your muscle memory and wonder why sparring still feels wrong.
          </p>
          <p>
            Online coaching works when you get personalised video feedback on your technique from experienced coaches. You film yourself, submit the footage, and get detailed corrections on what to fix. It&apos;s not about watching someone else box - it&apos;s about having someone watch you and tell you exactly what needs to change.
          </p>
          <p>
            The structure matters too. A clear programme that takes you through stance, shape, rotation, punches, defence, and combinations in the right order - with coaching corrections at every step - produces better outcomes than a gym where one coach is managing thirty people and the most feedback you get is &ldquo;hands up&rdquo; or &ldquo;good job&rdquo;.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            The Roadmap in One Sentence
          </h2>
          <p>
            Stance gives you balance. Shape gives you defence. Rotation gives you power. Everything else - punches, movement, combinations, counter-punching - is built on those three pillars. Get them right and your technique just looks right. Skip them and you&apos;ll always feel like something&apos;s off.
          </p>

          {/* CTA */}
          <div className="mt-14 py-10 px-6 md:px-10 bg-[#37322F]/[0.03] rounded-2xl text-center">
            <h3
              className="text-[#37322F] text-sub font-semibold mb-3"
            >
              Start Your Boxing Journey the Right Way
            </h3>
            <p className="text-[#605A57] mb-6 max-w-[500px] mx-auto">
              The 21-Day Boxing Challenge gives you the structured programme, video coaching, and personal feedback to build proper technique from day one.
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
