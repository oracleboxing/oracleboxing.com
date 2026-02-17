'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  question: string
  answer: string
}

interface CourseFAQProps {
  courseType?: 'bffp' | 'roadmap' | 'vault' | 'bundle'
}

const bffpFaqData: FAQItem[] = [
  {
    question: "What is Boxing Masterclass?",
    answer: "Boxing Masterclass (BFFP) is Oracle Boxing's flagship course - a complete, step-by-step framework for mastering boxing from the ground up. It teaches the real fundamentals most boxers never learn properly, built around a scientific and first-principles approach."
  },
  {
    question: "Who is this course for?",
    answer: `• Beginners or late starters who want to learn boxing properly at their own pace
• Self-taught boxers who want to fix bad habits and understand the why behind technique
• Coaches who want a structured, science-based foundation to improve their teaching
• Anyone who wants to move, think, and perform like a real boxer - not just hit pads`
  },
  {
    question: "What's included in the standalone version?",
    answer: `• Full access to the complete Boxing Masterclass video course
• 6 months of on-demand access (lifetime for bundle purchases)
• HD video lessons, technical breakdowns, and guided demonstrations
• Downloadable resources, lesson summaries, and practical assignments

⚠️ Note: This standalone purchase does not include community access, live calls, or feedback. Those are available through the Full Access Membership.`
  },
  {
    question: "What will I learn inside the course?",
    answer: `The course is structured around six principles that form the foundation of all boxing skill:

• Sentience - The Mind of the Fighter: mindset, flow state, and emotional control.
• Anatomy - The Wiring of Performance: nervous system, fascia, and body connection.
• FORMIS - The Language of Movement: stance, footwork, defence, and transitions.
• GAMB1T - The Science of Tactics: positioning, pattern recognition, and deception.
• Engine - The Physiology of Fighting: breathing, conditioning, and energy systems.
• Mentorship - The Final Principle: discipline, leadership, and long-term mastery.

Each principle builds on the last, guiding you toward complete technical and mental control.`
  },
  {
    question: "How is it delivered?",
    answer: "All lessons are pre-recorded and hosted on Oracle Boxing's secure online platform. You can stream them on desktop or mobile anytime, anywhere."
  },
  {
    question: "How long does it take to complete?",
    answer: "The course is self-paced - most students complete it within 6–10 weeks by studying 3–5 lessons per week. You can revisit any module as often as you like during your access period."
  },
  {
    question: "Is this the same content used in the 6-Week Challenge or Membership?",
    answer: "Yes - this is the core curriculum that both the 6-Week Challenge and Membership build upon. The standalone version gives you the entire educational system, without coaching or community features."
  },
  {
    question: "Do I need any equipment?",
    answer: `No gym required. You just need:

• A phone to watch and film yourself (optional)
• Basic gear: gloves, wraps, and space for shadowboxing`
  },
  {
    question: "Is coaching or feedback included?",
    answer: "Not in the standalone version. However, you can upgrade anytime to the Full Access Membership or 1-on-1 Coaching to get live calls, community access, and feedback from coaches."
  },
  {
    question: "How do I access the course after purchase?",
    answer: "After checkout, you'll receive an email with your login link and credentials. Log in using the same email used at purchase to access the Boxing Masterclass course instantly."
  },
  {
    question: "Can I rewatch lessons after finishing?",
    answer: "Yes - you can revisit lessons anytime within your access period (6 months for standalone, lifetime for bundle or membership purchases)."
  },
  {
    question: "Who teaches the course?",
    answer: "The course is taught by Oliver Betts (founder), who together blend decades of boxing experience with biomechanics, neuroscience, and first-principles performance training."
  },
  {
    question: "What results can I expect?",
    answer: `You'll develop:

• Real technical understanding of every movement and position
• Sharper form, balance, and rhythm
• Faster progress and fewer bad habits
• Confidence and calm under pressure`
  },
  {
    question: "How do I contact support?",
    answer: "For access or technical help, email team@oracleboxing.com - we usually reply within 24 hours (Mon–Fri)."
  }
]

const roadmapFaqData: FAQItem[] = [
  {
    question: "What is the Boxing Roadmap?",
    answer: "The Boxing Roadmap is a 5-phase training program designed to give you a clear, structured path to skill progression. It shows you exactly what to work on each week - no guesswork, no random drills - just a proven blueprint to build real boxing fundamentals."
  },
  {
    question: "Who is this course for?",
    answer: `• Beginners who want a clear starting point and fast improvement
• Intermediate boxers who want structure and focus in their training
• Self-taught boxers who need to fill technical gaps and fix bad habits
• Anyone training alone who wants a professional training plan`
  },
  {
    question: "What's included in the standalone version?",
    answer: `• Full access to the complete Boxing Roadmap course (5 phases / ~20 weeks)
• Detailed lesson videos (10+ per phase)
• Structured 12-round training templates per skill area
• Weekly focus and progression notes
• Downloadable practice checklists and homework tasks

⚠️ Note: The standalone version does not include live coaching calls, video feedback, or community access. Those are available through the Full Access Membership or 6-Week Challenge.`
  },
  {
    question: "How does the program work?",
    answer: "Each phase of the Roadmap builds upon the last - covering footwork, defence, combinations, rhythm, range, and ring awareness. You'll follow the weekly plan, watch the corresponding lessons, and practice each round as outlined in the templates."
  },
  {
    question: "How long does it take to complete?",
    answer: "The full roadmap takes around 5 months (20 weeks) to complete if followed as structured. However, you can move at your own pace - faster or slower depending on your training schedule."
  },
  {
    question: "Is the Boxing Roadmap beginner-friendly?",
    answer: "Yes. The course starts from foundational concepts and gradually layers in advanced drills and tactical thinking. It's designed so even complete beginners can follow along and see rapid improvement."
  },
  {
    question: "What's the difference between the Roadmap and Boxing Masterclass (BFFP)?",
    answer: `• BFFP teaches the deep theory, biomechanics, and principles of boxing - the why.
• The Roadmap gives you the weekly how - the step-by-step practice plan that turns that theory into habit.

Many boxers take both: BFFP for understanding, and the Roadmap for consistent daily structure.`
  },
  {
    question: "What equipment do I need?",
    answer: `Basic boxing gear only:

• Gloves, wraps, and comfortable space for training or shadowboxing
• A phone or camera if you want to record your progress (optional)`
  },
  {
    question: "Is coaching or feedback included?",
    answer: "No, not in the standalone version. You can upgrade to the Full Access Membership or 1-on-1 Coaching for personal feedback, live calls, and deeper accountability."
  },
  {
    question: "How do I access the course after purchase?",
    answer: "You'll get an instant email with your login link and access instructions. Log in using the same email you used at checkout to unlock the Boxing Roadmap in your portal."
  },
  {
    question: "Can I rewatch lessons after finishing?",
    answer: "Yes - you'll keep full access for life."
  },
  {
    question: "Who teaches the course?",
    answer: "The program is taught by Oliver Betts (founder of Oracle Boxing) - using the same system that's helped hundreds of students master their form and build real boxing skill."
  },
  {
    question: "What results can I expect?",
    answer: `You'll gain:

• A clear structure for training and progression
• Better movement, form, and control week by week
• Stronger understanding of what to focus on each session
• Real, visible improvement in your boxing ability within weeks`
  },
  {
    question: "How do I contact support?",
    answer: "Email team@oracleboxing.com for access or technical questions. We usually reply within 24 hours (Mon–Fri)."
  }
]

const vaultFaqData: FAQItem[] = [
  {
    question: "What is the Boxing Clinic?",
    answer: "The Boxing Clinic is Oracle Boxing's on-demand replay library - a collection of recorded live coaching calls, workshops, and sparring reviews led by Oliver, Toni, and guest coaches. It's designed to help you learn through real examples, corrections, and student transformations."
  },
  {
    question: "Who is the Boxing Clinic for?",
    answer: `• Boxers who want to study real coaching sessions and see feedback applied in real time.
• Challenge graduates and course students who want extra training insights.
• Anyone who learns best by watching others being coached.`
  },
  {
    question: "What's included?",
    answer: `• Full replay archive of live coaching calls and workshops (updated weekly)
• Technique breakdowns and corrections from real student footage
• Tactical sessions covering topics like range control, rhythm, and sparring IQ
• Q&A segments where coaches answer common training questions
• Lifetime access to all uploaded recordings`
  },
  {
    question: "How are the replays organised?",
    answer: `All sessions are tagged and sorted by topic - for example:

• Footwork & Movement
• Defence & Reactions
• Combos & Rhythm
• Sparring Reviews
• Mindset & Flow
• Conditioning & Recovery

You can easily search by theme or coach to find what you need.`
  },
  {
    question: "How long are the sessions?",
    answer: "Most replays run between 45–90 minutes, depending on the topic. Each session is timestamped so you can jump directly to specific corrections or drills."
  },
  {
    question: "How often are new sessions added?",
    answer: "New replays are uploaded every week after each live coaching call. You'll always have the latest material, including guest sessions and tactical breakdowns."
  },
  {
    question: "Is coaching or feedback included?",
    answer: "No, this product is strictly watch-only. You can study the sessions, take notes, and apply the lessons yourself. If you'd like feedback on your own videos, upgrade to the Full Access Membership or 1-on-1 Coaching."
  },
  {
    question: "Do I need previous experience?",
    answer: "No - beginners, intermediates, and even coaches can benefit. Watching real corrections accelerates learning and sharpens your eye for technique."
  },
  {
    question: "How do I access the replays?",
    answer: "After purchase, you'll get an instant email with your login link. Sign in using your purchase email to unlock the Boxing Clinic inside your Oracle Boxing dashboard."
  },
  {
    question: "Can I download the videos?",
    answer: "The replays are available for streaming only to protect student privacy and intellectual property. You can, however, bookmark or timestamp key lessons for your own notes."
  },
  {
    question: "Who teaches the sessions?",
    answer: "Primarily Oliver Betts and Coach Toni, with guest appearances from Coach Dave and advanced Oracle Boxing members. Each coach brings a unique angle - from biomechanics to pro-level ring IQ."
  },
  {
    question: "How do I get the most out of it?",
    answer: `• Watch 1–2 replays per week and take notes on recurring corrections.
• Pause and shadowbox along with the drills.
• Keep a training journal of key takeaways to apply in your next session.`
  },
  {
    question: "How do I contact support?",
    answer: "Email team@oracleboxing.com for any login or access questions. Replies usually arrive within 24 hours (Mon–Fri)."
  }
]

const bundleFaqData: FAQItem[] = [
  {
    question: "What is Oracle Boxing Bundle?",
    answer: "Oracle Boxing Bundle is the complete bundle of all Oracle Boxing courses - a full system that teaches boxing from the ground up through movement, tactics, and mindset. It's the ultimate package for anyone who wants to learn real boxing from first principles."
  },
  {
    question: "What's included in the bundle?",
    answer: `You get full access to:

• Boxing Masterclass (BFFP) - The foundation of technical skill and understanding.
• Boxing Roadmap - Your 5-phase training plan to apply what you learn, week by week.
• Boxing Clinic - Replay library of live coaching calls, corrections, and real sparring analysis.
• Recordings Vault - Exclusive technical archives and behind-the-scenes training sessions.

Each course builds on the other to give you a complete, structured system - theory, application, and examples - all in one place.`
  },
  {
    question: "Who is Oracle Boxing Bundle for?",
    answer: `• Boxers who want to master the fundamentals properly - not just train for fitness.
• Intermediate fighters who feel stuck and want to rebuild their form and IQ.
• Coaches looking for a unified, principle-based system to improve their teaching.
• Anyone serious about developing real skill, precision, and understanding.`
  },
  {
    question: "How does it work?",
    answer: `Once purchased, you'll unlock all courses instantly inside your Oracle Boxing portal. You can:

• Start with Boxing Masterclass to learn the system
• Follow the Boxing Roadmap to structure your training
• Watch Boxing Clinic sessions to see real corrections applied
• Revisit the Recordings Vault to study advanced lessons and drills

You'll have everything needed to progress like a coached fighter, even if you train alone.`
  },
  {
    question: "How long will it take to complete?",
    answer: "That depends on your pace. Most boxers take 4–6 months to work through the entire system. Each course is self-paced, and you'll have lifetime access to revisit and refine your skills."
  },
  {
    question: "Is this suitable for beginners?",
    answer: "Yes. The system was designed to help complete beginners build strong foundations - and help experienced fighters rebuild weak ones. You'll move from theory to application step by step."
  },
  {
    question: "What's the difference between this and the 6-Week Challenge or Membership?",
    answer: `• The 6-Week Challenge is a short-term accountability program with live coaching and a refund guarantee.
• The Full Access Membership includes all courses plus live calls, feedback, and community features.
• Oracle Boxing Bundle Bundle is courses only - lifetime access to the full educational system, without coaching or community.`
  },
  {
    question: "Do I need equipment?",
    answer: "Just the basics - gloves, wraps, and a safe space to train or shadowbox. A phone or camera helps if you want to film and analyse your form."
  },
  {
    question: "Who teaches the system?",
    answer: "All lessons are taught by Oliver Betts (founder), Coach Toni, and Coach Dave - blending old-school craft with modern performance science."
  },
  {
    question: "How do I access everything after purchase?",
    answer: "After checkout, you'll receive an instant email with your login link. Log in using your purchase email to access all included courses in your dashboard."
  },
  {
    question: "What results can I expect?",
    answer: `By following the system, you'll:

• Build flawless movement and form
• Understand the why behind every punch and defensive reaction
• Sharpen your boxing IQ and confidence
• Learn to train smarter, not harder`
  },
  {
    question: "Can I upgrade later to get live coaching?",
    answer: "Yes - you can upgrade anytime to the Full Access Membership or 1-on-1 Coaching to add live calls, feedback, and mentorship on top of your bundle."
  },
  {
    question: "How do I contact support?",
    answer: "Email team@oracleboxing.com for any technical or billing questions. We reply within 24 hours (Mon–Fri)."
  }
]

export function CourseFAQ({ courseType = 'bffp' }: CourseFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  // Select the appropriate FAQ data based on course type
  const getFaqData = () => {
    switch (courseType) {
      case 'roadmap':
        return roadmapFaqData
      case 'vault':
        return vaultFaqData
      case 'bundle':
        return bundleFaqData
      case 'bffp':
      default:
        return bffpFaqData
    }
  }

  const faqData = getFaqData()

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-white py-8 sm:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-12">
          <h2 className="text-hero font-bold text-gray-900 mb-2 sm:mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-title text-gray-600 max-w-2xl mx-auto">
            Everything you need to know about our boxing courses
          </p>
        </div>

        <div className="space-y-2 sm:space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-3 py-2.5 sm:px-6 sm:py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-title font-semibold text-gray-900 pr-2 sm:pr-4">
                  {item.question}
                </span>
                <div
                  className="flex-shrink-0 transition-transform duration-150"
                  style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}
                >
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                </div>
              </button>

              {openIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="overflow-hidden"
                >
                  <div className="px-3 pb-2.5 pt-0 sm:px-6 sm:pb-5">
                    <div className="text-body text-gray-600 whitespace-pre-line leading-relaxed">
                      {item.answer}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
