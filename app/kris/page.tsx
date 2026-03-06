import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import HomepageHeader from '@/components/HomepageHeader'
import FooterSection from '@/components/footer-section'

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

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-x-hidden">
      <HomepageHeader />
      <div className="flex flex-1 pt-[72px]">
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>

        <main className="flex-1 min-w-0">
          <section className="w-full px-4 md:px-8 py-14 md:py-20 border-b border-[rgba(55,50,47,0.12)]">
            <div className="max-w-3xl mx-auto">
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
              {sessions.length === 0 ? (
                <p className="text-body text-[#605A57]">No sessions found.</p>
              ) : (
                <div>
                  {sessions.map((session, index) => (
                    <article
                      key={`${session.sent_at}-${index}`}
                      className="py-8 first:pt-0 border-b border-[rgba(55,50,47,0.12)] last:border-b-0"
                    >
                      <p className="text-body text-[#9CABA8] mb-2">Session {index + 1}</p>
                      <h2 className="text-sub font-normal text-[#37322F] mb-6">
                        {formatSessionDate(session.sent_at)}
                      </h2>

                      {session.summary_html ? (
                        <div
                          className="text-body text-[#605A57] leading-relaxed space-y-4 [&_h2]:text-title [&_h2]:font-semibold [&_h2]:text-[#37322F] [&_h2]:mt-6 [&_h2]:mb-3 [&_p]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_li]:mb-2 [&_strong]:font-semibold [&_strong]:text-[#37322F]"
                          dangerouslySetInnerHTML={{ __html: session.summary_html }}
                        />
                      ) : (
                        <p className="text-body text-[#605A57]">Summary unavailable.</p>
                      )}
                    </article>
                  ))}
                </div>
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
