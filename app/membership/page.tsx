import { Metadata } from 'next'
import MembershipLandingPage from '@/components/membership/MembershipLandingPage'

export const metadata: Metadata = {
  title: 'Oracle Boxing Membership - Master Boxing with Expert Coaching',
  description: 'Join Oracle Boxing for daily live coaching, expert feedback, and a supportive community. Monthly or annual membership options available.',
  openGraph: {
    title: 'Oracle Boxing Membership',
    description: 'Master boxing with ongoing expert coaching and community support',
    images: [{ url: 'https://sb.oracleboxing.com/Website/optimized/products/boxing_clinic-large.webp' }],
  },
}

export default function MembershipPage() {
  return <MembershipLandingPage />
}
