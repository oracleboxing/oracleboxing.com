"use client"

import Link from "next/link"
import Image from "next/image"
import FooterSection from "@/components/footer-section"

export default function BoxingPunches16Page() {
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
          Boxing Punches 1-6 Explained: Perfect Technique for Beginners
        </h1>

        {/* YouTube Embed */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-10 bg-[#37322F]/5">
          <iframe
            src="https://www.youtube.com/embed/JhkqSCahsNY"
            title="Boxing Punches 1-6 Explained"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        </div>

        {/* Content */}
        <div className="prose-oracle space-y-6 text-[#37322F] text-[17px] leading-[1.75]">
          <p>
            Every punch in boxing is numbered 1 through 6. It&apos;s the universal language of the sport. When a coach calls out &ldquo;1-2&rdquo;, you throw a jab followed by a cross. When they call &ldquo;3-4-5-6&rdquo;, you know exactly what&apos;s coming.
          </p>
          <p>
            But here&apos;s the thing most people get wrong: the punches aren&apos;t six separate techniques. They all come from the same foundation - your stance, your shape, and your rotation. If those three pillars are wrong, it doesn&apos;t matter how fast your hands are. Your punches will lack power, leave you off-balance, and open you up to counters.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Before You Throw: Get the Foundation Right
          </h2>
          <p>
            Everything comes off rotation - from about 0° through to 180°. A jab is a small rotation. A cross is a bigger one. Hooks and uppercuts use different axes entirely. But none of that works if your stance and shape aren&apos;t set up properly.
          </p>
          <p>
            Most beginners set up with their shoulders at the same height and weight distributed 50/50. This looks correct from the outside, but it gives you no built-in defence. Your head sits right on the centre line where it&apos;s easiest to hit. The fix: drop your lead shoulder lower than your rear shoulder, round your back, keep your chest concave, and bring your chin down - not your shoulders up. Hinge at the back hip so your weight loads through the rear leg. This naturally moves your head further away from your opponent and creates a line of defence before you&apos;ve even thrown a punch.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Punch 1: The Jab
          </h2>
          <p>
            The jab is your most important punch. Everything else sets up off of it. From your stance, extend your lead hand straight out while rotating your lead shoulder slightly forward. Start with your pinkies facing your opponent so you only need a half-turn of the wrist as you extend - knuckles rolling down and over onto the target. Your rear hand stays glued to your cheekbone. Keep your chest concave as you jab - don&apos;t open up or lean forward.
          </p>
          <p>
            The power doesn&apos;t come from your arm - it comes from a small push through your lead foot and a subtle rotation of your hips. Keep it snappy. The jab that sits out there too long is the jab that gets you countered. Throw it and bring it straight back.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Punch 2: The Cross
          </h2>
          <p>
            The cross is your rear straight punch and typically your hardest shot. Make sure you&apos;re in the right stance - hips in the right position. Imagine you&apos;re turning through a centre point. Twist your hips through, pivot on your rear foot, and let the hand travel in a straight line to the target.
          </p>
          <p>
            A common mistake: your lead foot needs to stay at a slight angle. If you keep it pointing straight while rotating through with the cross, your knee gets in the way and blocks the rotation. Always check that the lead foot allows free hip movement.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Punch 3: The Lead Hook
          </h2>
          <p>
            The lead hook is where things get interesting. It&apos;s a looping punch that travels on a horizontal arc. There are two schools of thought on hand position: palm facing you (American style, better for inside fighting) or palm facing down (Soviet style, better for long range). Both work - it depends on the distance you fight at.
          </p>
          <p>
            The power comes from your hips rotating and your lead foot pivoting. Your arm stays at roughly 90 degrees. The most common mistake is trying to generate power with the arm instead of the body. Let the rotation do the work. Your arm is just the delivery system.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Punch 4: The Rear Hook
          </h2>
          <p>
            The rear hook is the same mechanics as the lead hook but from the other side. It&apos;s often thrown after a cross when your weight is already shifted forward. The rotation comes from your rear hip driving through and your rear foot pivoting.
          </p>
          <p>
            This punch is devastating when timed correctly because your opponent often won&apos;t see it coming after a straight punch. The key is staying balanced throughout the rotation - don&apos;t over-commit or you&apos;ll end up falling over your front foot with nothing left to defend yourself.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Punch 5: The Lead Uppercut
          </h2>
          <p>
            Push down through your lead foot to create force from the ground. At the same time, rotate your hips and shoulders in that direction. Let your lead shoulder drop slightly. Keep your arm relaxed and tucked in close to your body. As you twist, let the energy travel upward. At the very end, allow the arm to whip up naturally into the uppercut.
          </p>
          <p>
            The uppercut is not an arm punch. You&apos;re not scooping upward with your bicep. The power comes from the legs and hips driving upward through the rotation. If it feels like an arm exercise, something&apos;s off.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Punch 6: The Rear Uppercut
          </h2>
          <p>
            Same principle as the lead uppercut but driven off the rear foot. This is a power shot that works best at close range. Drop slightly on the rear side, rotate your hips upward and through, and let the punch travel on a vertical line.
          </p>
          <p>
            Beginners often want to wind up for this one. Don&apos;t. The less telegraphed it is, the more effective it becomes. If you&apos;re pulling your hand back before throwing, you&apos;re telling your opponent exactly what&apos;s coming.
          </p>

          <h2
            className="text-[#37322F] text-xl md:text-2xl font-semibold mt-10 mb-4"
            style={{ fontFamily: "ClashDisplay, sans-serif" }}
          >
            Putting It All Together
          </h2>
          <p>
            Once you can throw all six punches individually, the real work begins: combining them into fluid combinations. Start simple - 1-2 (jab-cross), then 1-2-3 (jab-cross-lead hook). Use the jab to set up the next punch. For example: jab, jab, cross, hook to the body. Or jab, cross, lead hook, rear uppercut.
          </p>
          <p>
            After each combination, add defences and then flow straight back into the next combo. The jabs at the end of each combination aren&apos;t throwaway punches - they&apos;re tracking shots that set up everything that follows.
          </p>
          <p>
            Most importantly, drill these on the bag. Round after round. The technique has to be automatic before you can use it under pressure. If you&apos;re still thinking about hand position while someone&apos;s throwing back at you, you haven&apos;t drilled enough.
          </p>

          {/* CTA */}
          <div className="mt-14 py-10 px-6 md:px-10 bg-[#37322F]/[0.03] rounded-2xl text-center">
            <h3
              className="text-[#37322F] text-xl md:text-2xl font-semibold mb-3"
              style={{ fontFamily: "ClashDisplay, sans-serif" }}
            >
              Ready to Build Real Technique?
            </h3>
            <p className="text-[#605A57] mb-6 max-w-[500px] mx-auto">
              The 21-Day Boxing Challenge gives you a structured coaching programme to master stance, shape, and rotation - the foundation for every punch.
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
