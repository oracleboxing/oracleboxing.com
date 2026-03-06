import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import FooterSection from '@/components/footer-section'
import { SessionTimeline } from './SessionTimeline'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Kris's Coaching Journey",
  description: "A chronological timeline of Kris's 1-on-1 coaching sessions with Coach Toni.",
}

type CoachingSession = {
  sent_at: string
  summary_html: string | null
}

const SUPABASE_URL = 'https://cyifqhjdsniiitssqkrt.supabase.co'

function formatSessionDate(value: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

function extractTitle(html: string | null): string {
  if (!html) return 'Coaching Session'
  // Get the first <p> content after <h2>Session Summary</h2>
  const match = html.match(/<h2>Session Summary<\/h2>\s*<p>(.*?)<\/p>/s)
  if (match?.[1]) {
    // Strip any HTML tags from the extracted text
    return match[1].replace(/<[^>]*>/g, '').trim()
  }
  return 'Coaching Session'
}

function removeSessionSummary(html: string): string {
  // Remove the "Session Summary" h2 and its following <p> since we use it as the title
  return html.replace(/<h2>Session Summary<\/h2>\s*<p>.*?<\/p>/s, '').trim()
}

async function getKrisSessions(): Promise<CoachingSession[]> {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SERVICE_KEY is not set')
  }

  const supabase = createClient(SUPABASE_URL, serviceRoleKey)

  const { data, error } = await supabase
    .from('coaching_email_log')
    .select('sent_at, summary_html')
    .in('attendee_name', ['Kristopher Saville', 'Mr Kristopher M Saville'])
    .order('sent_at', { ascending: true })

  if (error) {
    throw new Error(`Failed to load coaching sessions: ${error.message}`)
  }

  return (data ?? []) as CoachingSession[]
}

export default async function KrisJourneyPage() {
  const sessions = await getKrisSessions()
  const firstSession = sessions.at(0)
  const lastSession = sessions.at(-1)

  const sessionData = sessions.map((session, index) => ({
    number: index + 1,
    date: formatSessionDate(session.sent_at),
    title: extractTitle(session.summary_html),
    contentHtml: session.summary_html ? removeSessionSummary(session.summary_html) : null,
  }))

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <div className="flex flex-1">
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>

        <main className="flex-1 min-w-0">
          <section className="w-full px-4 md:px-8 py-14 md:py-20 border-b border-[rgba(55,50,47,0.12)]">
            <div className="max-w-3xl mx-auto">
              <a href="/" className="inline-block mb-8">
                <img
                  src="https://sb.oracleboxing.com/logo/long_dark.webp"
                  alt="Oracle Boxing"
                  className="h-5 w-auto"
                />
              </a>
              <h1 className="text-section font-normal text-[#37322F]">Kris&apos;s Journey</h1>
              <p className="mt-4 text-body text-[#605A57] leading-relaxed">
                {sessions.length} sessions with Coach Toni
                {firstSession && lastSession ? (
                  <span>
                    {' '}
                    ({formatSessionDate(firstSession.sent_at)} - {formatSessionDate(lastSession.sent_at)})
                  </span>
                ) : null}
              </p>
            </div>
          </section>

          <section className="w-full px-4 md:px-8 py-10 md:py-14">
            <div className="max-w-3xl mx-auto">
              {sessionData.length === 0 ? (
                <p className="text-body text-[#605A57]">No sessions found.</p>
              ) : (
                <SessionTimeline sessions={sessionData} />
              )}
            </div>
          </section>

          <FooterSection />
        </main>

        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-l border-[rgba(55,50,47,0.12)]"></div>
      </div>
    </div>
  )
}
