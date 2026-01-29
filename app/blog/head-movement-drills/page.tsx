"use client"

import Link from "next/link"
import Image from "next/image"
import FooterSection from "@/components/footer-section"

export default function HeadMovementDrillsPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full py-6 px-4">
        <div className="max-w-[800px] mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://sb.oracleboxing.com/Website/icon.webp"
              alt="Oracle Boxing"
              width={32}
              height={32}
              className="rounded"
            />
            <span
              className="text-[#37322F] text-lg font-semibold tracking-tight"
              style={{ fontFamily: "ClashDisplay, sans-serif" }}
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
          className="text-[#37322F] text-3xl md:text-[44px] md:leading-[1.15] font-semibold tracking-tight mb-8"
          style={{ fontFamily: "ClashDisplay, sans-serif" }}
        >
          6 Head Movement Drills That Will Make You Impossible to Hit
        </h1>

        {/* YouTube Embed */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10 bg-[#37322F]/5">
          <iframe
            src="https://www.youtube.com/embed/HVTTZI_7Lvw"
            title="6 Head Movement Drills"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="prose-oracle space-y-6 text-[#37322F] text-[17px] leading-[1.75]">
          <p>
            Most beginners think head movement is about speed. It&apos;s not. It&apos;s about positioning. If your stance and shape are set up correctly, your head is already harder to hit before you move it at all. Head movement just builds on that.
          </p>
          <p>
            Here&apos;s the problem: if your natural stance keeps your head on the centre line with your shoulders at the same height, every exchange becomes a timing race. And beginners always lose that race. They haven&apos;t developed the relaxation or coordination yet. The solution isn&apos;t to move faster — it&apos;s to set up a position where you&apos;re harder to hit by default, and then add movement on top of that.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Why Your Shape Matters More Than Your Reflexes
          </h2>
          <p>
            When your lead shoulder is lower than your rear shoulder, your head naturally sits further from your opponent. Your shape becomes harder to line up against. You can close distance much safer than if you were standing square. That&apos;s your first layer of defence — and it&apos;s built into your stance before you&apos;ve even started moving.
          </p>
          <p>
            Every head movement technique below assumes you&apos;re starting from this position. If you skip the shape, the drills won&apos;t work properly. Your head will be too exposed, your balance will be off, and you&apos;ll develop bad habits that get punished in sparring.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Drill 1: The Slip
          </h2>
          <p>
            A slip moves your head off the centre line to avoid a straight punch. You&apos;re not ducking — you&apos;re rotating your shoulders so your head moves to one side. Slip inside (towards your lead side) to go under a jab. Slip outside (towards your rear side) to avoid a cross.
          </p>
          <p>
            The key: your weight shifts to the foot on the side you&apos;re slipping to, and you pivot from the hips. Your head doesn&apos;t drop down — it moves laterally. If you find yourself bending at the waist, you&apos;re doing it wrong. The rotation happens in the hips and shoulders.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Drill 2: The Roll
          </h2>
          <p>
            The roll takes your head underneath a hook. You bend at the knees — not the waist — and trace a U-shape under the incoming punch. Roll to the lead side to go under a rear hook. Roll to the rear side to go under a lead hook.
          </p>
          <p>
            This is where the three-axis system comes into play. You&apos;re moving through different rotational axes as you roll underneath. Come up on the opposite side ready to fire back. From a roll under a hook, you&apos;re now loaded up on the opposite hip — perfect position for a counter hook or uppercut.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Drill 3: The Pull
          </h2>
          <p>
            The pull is the simplest defensive movement. Shift your weight back to your rear foot so your head moves out of range. Your feet don&apos;t move — you&apos;re just sitting back on the rear leg.
          </p>
          <p>
            The pull works best against straight punches at the edge of range. It&apos;s also a great setup for a counter cross, because as you pull back, your rear hand is loaded and ready to fire as your opponent falls short.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Drill 4: Slip-Slip Combination
          </h2>
          <p>
            Once you can slip in isolation, chain two together. Slip inside to avoid the jab, then immediately slip outside to avoid the cross. This mimics what actually happens in a fight — punches come in combinations, not one at a time.
          </p>
          <p>
            Practice this slowly at first. The common mistake is rushing through both slips and losing your balance on the second one. Each slip should leave you in a stable position, ready to fire back or slip again.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Drill 5: Slip and Counter
          </h2>
          <p>
            This is where defence becomes offence. Slip the jab to the inside and fire a cross over the top. Or slip outside and throw the lead hook. The defensive movement loads your body up for the counter — you don&apos;t need to add anything extra.
          </p>
          <p>
            As you slip, you&apos;re already rotating into the counter punch. That&apos;s why this feels natural once your fundamentals are clean. You&apos;re not defending and then punching — you&apos;re doing both in the same motion. Blocks, head movement, and punches flow together to create clean counter-punching opportunities.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Drill 6: Shadow Boxing with Movement Triggers
          </h2>
          <p>
            This is the integration drill. Shadow box normally — throw your jab, cross, combinations — but after every combination, add a defensive movement. Throw the 1-2, then slip-slip. Throw the 1-2-3, then roll under. Throw the cross, then pull back.
          </p>
          <p>
            The petal drill works well here too: move around an imaginary ring in a petal shape. Step out, take an angle, throw, defend, come back in. Getting used to moving after every punch makes you exponentially harder to hit because you&apos;re never standing still where your opponent expects you to be.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            How to Train These Drills
          </h2>
          <p>
            Start with isolation. Spend a full round on just slips. Then a round on rolls. Then a round on pulls. Once each feels comfortable, start combining them in shadow boxing.
          </p>
          <p>
            The goal isn&apos;t to look flashy. The goal is to make these movements automatic. When someone throws at you in sparring, you shouldn&apos;t have to think about which defence to use. Your body should react based on what it&apos;s drilled. That only happens with volume and repetition.
          </p>
          <p>
            And remember — all of this starts with the right shape. If you&apos;re standing square with your shoulders level and your weight 50/50, no amount of head movement will save you. Get the foundation right first. Then the movement becomes the easy part.
          </p>

          {/* CTA */}
          <div className="mt-14 py-10 px-6 md:px-10 bg-[#37322F]/[0.03] rounded-2xl text-center">
            <h3
              className="text-[#37322F] text-xl md:text-2xl font-semibold mb-3"
              style={{ fontFamily: "ClashDisplay, sans-serif" }}
            >
              Learn the Shape That Makes Defence Easy
            </h3>
            <p className="text-[#605A57] mb-6 max-w-[500px] mx-auto">
              Head movement only works when your stance and shape are right. The 21-Day Challenge builds the foundation so your defensive movement becomes instinctive.
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
