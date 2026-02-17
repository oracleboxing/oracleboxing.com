"use client"

import Link from "next/link"
import Image from "next/image"
import FooterSection from "@/components/footer-section"

export default function BoxingMistakesBeginnersPage() {
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
          7 Boxing Mistakes That Ruin Your Fundamentals (And How to Fix Them)
        </h1>

        {/* Content */}
        <div className="prose-oracle space-y-6 text-[#37322F] text-title leading-[1.75]">
          <p>
            You&apos;ve probably heard the common beginner mistakes before: keep your elbows in, don&apos;t tense your arms, don&apos;t leave your chin in the air, don&apos;t open your chest. But the real mistakes that ruin your fundamentals are more subtle than that. They&apos;re the ones you don&apos;t even realise you&apos;re making, and the ones most coaches never mention.
          </p>
          <p>
            If you&apos;ve got what people call &ldquo;bad fundamentals&rdquo;, it almost always comes down to four root causes: weight distribution, ability to rotate your body, relaxation, or shape. These seven mistakes all trace back to those four pillars.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Mistake 1: Hips Creeping Forward When You Punch
          </h2>
          <p>
            This is the most common fundamental error and almost nobody talks about it. As you rotate to throw a punch, your hips should stay hinged back. But what actually happens with most beginners is their hips extend forward as they rotate. They go from a bent, loaded position to an upright, extended position mid-punch.
          </p>
          <p>
            Why it matters: when your hips are extended at the point of impact, there&apos;s no structural support behind the punch. If someone pushed your knuckles back, you&apos;d just fall backwards. There&apos;s no tension in the anterior chain. Instead, push your hips backwards as you rotate. Now there&apos;s genuine resistance behind your fist. The punch has weight behind it because your body is structurally supporting the impact.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Mistake 2: Standing Too Upright
          </h2>
          <p>
            A straight, upright posture makes you a bigger target and removes your built-in defence. When your back is straight and your chest is open, your head sits exposed on the centre line and every punch your opponent throws has a clear path.
          </p>
          <p>
            The fix: round your upper back. Keep your chest concave. Think about having &ldquo;bad posture&rdquo; - shoulders rounded forward, back slightly curved, chin tucked down. This makes you a smaller target, brings your elbows naturally in front of your body, and creates a shape that&apos;s genuinely hard to line up against. Don&apos;t force it by tucking in your stomach or tilting your pelvis - just relax your back and let it round naturally from the hip hinge position.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Mistake 3: Raising Your Shoulders to Protect Your Chin
          </h2>
          <p>
            This is one of the most widespread bad cues in boxing. &ldquo;Bring your shoulder up to your chin&rdquo; sounds right but creates tension in exactly the wrong place. Raised shoulders restrict your rotation, kill the stretch-shortening cycle that generates snap, and tire you out within minutes.
          </p>
          <p>
            The correct technique is the opposite: bring your chin down to your shoulder. Relax the muscles in your neck and let your head sit forward naturally. You&apos;re looking through your eyebrows. Your shoulders stay relaxed and rounded forward - not raised up. Combined with a concave chest and rounded back, this creates a much smaller target without any of the tension that ruins your mechanics.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Mistake 4: Distributing Weight 50/50
          </h2>
          <p>
            Equal weight distribution between both feet feels balanced, but it&apos;s actually one of the worst positions you can be in when punching or defending. When your weight is 50/50, your head sits directly on the centre line - the easiest place to hit. You have no built-in defensive angle, and you&apos;re equally exposed to shots from both sides.
          </p>
          <p>
            The fix: keep roughly 60% of your weight on your rear foot and 40% on your lead foot when in punching range. This naturally moves your head further from your opponent, creates a defensive angle, and loads your rear hip for power shots. When you&apos;re moving around the ring between exchanges, your weight can be more even - but as soon as you enter punching range, sit back over that rear leg.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Mistake 5: Rotating Around Only One Axis
          </h2>
          <p>
            Most beginners only rotate on one plane - turning their hips and shoulders left and right on a horizontal axis. This means they can throw straight punches and maybe a basic hook, but their movement looks stiff and one-dimensional. They&apos;re easy to read and easy to hit because their body can only go in two directions.
          </p>
          <p>
            Your body actually moves through three rotational axes. The centre line (where you throw combinations), the lead side (where you can slip, throw lead hooks and uppercuts, load counters), and the rear side (where you can shoulder roll, throw rear hooks and uppercuts, defend). Learning to move between these three positions - dropping to the lead side, coming back through centre, shifting to the rear side - is what transforms you from a stiff beginner into a fluid boxer.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Mistake 6: Tensing Through the Entire Punch
          </h2>
          <p>
            Beginners clench their fists, lock their arms, flex their shoulders, and try to muscle through every punch. This constant tension has three devastating effects: it drains your energy exponentially faster, it slows down every movement, and it kills the whip-like snap that generates real power.
          </p>
          <p>
            In boxing, you want to be in a parasympathetic state - your body almost completely relaxed. The only moment of tension is the split second of impact. Before and after that moment, everything is loose. Think about throwing light punches with perfect technique rather than hard punches with brute force. If it feels like an arm exercise, something is wrong. The body does the work. The arm is just the delivery system. Relaxation is a skill - it takes deliberate practice to unlearn the instinct to tense up.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            Mistake 7: Falling Over the Front Foot After Combinations
          </h2>
          <p>
            This happens when you commit too much forward momentum into your punches. You get into range, start throwing, and after one or two punches you&apos;re already off balance, leaning forward, with your weight dumped over your front foot. Your combination dies, you can&apos;t defend, and you&apos;re stuck in no-man&apos;s land.
          </p>
          <p>
            The root cause is usually one of two things: your feet aren&apos;t getting into range before you start punching, or your weight shifts too far forward during the combination. The fix is to get your feet set first, then let your hands go. And maintain that hip hinge throughout. If your hips stay loaded over the rear leg, you can sustain multi-punch combinations without losing balance, and you always have the ability to recover, defend, or throw more.
          </p>

          <h2
            className="text-[#37322F] text-sub font-semibold mt-10 mb-4"
          >
            How to Actually Fix These
          </h2>
          <p>
            All seven mistakes share a common theme: they&apos;re not things you can fix by trying harder. You can&apos;t just &ldquo;remember&rdquo; to keep your hips back or relax your shoulders while someone is throwing punches at you. These have to be drilled into your body until they become automatic.
          </p>
          <p>
            The drill is simple: slow, deliberate repetition. Shadow box in front of a mirror at half speed. Film yourself on your phone and watch it back. Get feedback from someone who knows what to look for. One round at a time, one correction at a time. The technique has to be automatic before you can use it under pressure. That&apos;s why structured coaching - where someone watches your movement and tells you exactly what to fix - accelerates progress faster than anything else.
          </p>

          {/* CTA */}
          <div className="mt-14 py-10 px-6 md:px-10 bg-[#37322F]/[0.03] rounded-2xl text-center">
            <h3
              className="text-[#37322F] text-sub font-semibold mb-3"
            >
              Fix Your Fundamentals With Expert Coaching
            </h3>
            <p className="text-[#605A57] mb-6 max-w-[500px] mx-auto">
              The 21-Day Boxing Challenge gives you personalised video coaching so you can identify and fix the mistakes you don&apos;t even know you&apos;re making.
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
