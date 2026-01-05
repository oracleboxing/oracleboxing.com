import { Suspense } from 'react'
import FooterSection from '@/components/footer-section'
import { SuccessContent } from '@/components/SuccessContent'

export const metadata = {
  title: 'Purchase Successful',
  description: 'Your order has been confirmed',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string }>
}) {
  const { session_id } = await searchParams

  if (!session_id) {
    return (
      <div className="min-h-screen bg-[#FFFCF5] flex overflow-x-hidden">
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>
        <main className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#37322F]">Invalid session</h1>
              <p className="text-[rgba(73,66,61,0.90)] mt-2">Please check your confirmation email for the correct link.</p>
            </div>
          </div>
          <FooterSection />
        </main>
        <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-l border-[rgba(55,50,47,0.12)]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFCF5] flex overflow-x-hidden">
      <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-r border-[rgba(55,50,47,0.12)]"></div>
      <main className="flex-1 min-w-0 flex flex-col">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center py-20">
            <div className="text-[rgba(73,66,61,0.90)]">Loading...</div>
          </div>
        }>
          <SuccessContent sessionId={session_id} />
        </Suspense>
        <FooterSection />
      </main>
      <div className="hidden sm:block sm:w-4 md:w-8 lg:w-12 flex-shrink-0 border-l border-[rgba(55,50,47,0.12)]"></div>
    </div>
  )
}
