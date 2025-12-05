import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Guarantee',
  description: '30-day money-back guarantee on all digital courses. Learn about our 6-Week Challenge guarantee and refund policies.',
  alternates: {
    canonical: '/guarantee',
  },
}

export default function Guarantee() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#FFFFFF', color: '#000000', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Our Guarantee</h1>
        <p style={{ fontSize: '14px', color: '#666666', marginBottom: '32px' }}>Last Updated: November 2025</p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>30-Day Money-Back Guarantee for Courses</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We stand behind the quality of our digital courses. If you purchase any of our courses by themselves and are not satisfied, you can request a full refund within 30 days of purchase—no questions asked.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Courses Covered by This Guarantee:</h3>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Boxing Masterclass (purchased standalone)</li>
          <li>Boxing Roadmap (purchased standalone)</li>
          <li>Oracle Boxing Bundle (purchased standalone)</li>
          <li>Any other individual digital course product purchased by itself</li>
        </ul>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>What's NOT Covered:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          The 30-day money-back guarantee does NOT apply to:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li><strong>Lifetime access upgrades</strong> added to course purchases</li>
          <li><strong>Order bumps or add-ons</strong> purchased alongside courses</li>
          <li><strong>Additional products added during checkout</strong></li>
        </ul>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Only the standalone course purchase itself is covered by the 30-day guarantee. Any add-ons, upgrades, or order bumps are final sale.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>How to Request a Refund:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Simply email us at <strong>team@oracleboxing.com</strong> within 30 days of your purchase date with your order information. We will process your refund promptly.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Important Exclusions:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          This 30-day money-back guarantee does NOT apply to:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li><strong>Memberships</strong> (monthly, quarterly, 6-month, or annual subscriptions)</li>
          <li><strong>1-on-1 Coaching</strong> services</li>
          <li><strong>6-Week Challenge</strong> (see separate guarantee below)</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>6-Week Challenge Guarantee</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          The 6-Week Challenge operates under a different guarantee structure designed to reward committed participants.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>How It Works:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          When you join the 6-Week Challenge for $197, you gain access to:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Full access to the Boxing Masterclass</li>
          <li>Lifetime access to the Boxing Roadmap</li>
          <li>6 weeks of live coaching calls with Oliver & Toni</li>
          <li>Private Skool community access</li>
          <li>Personalized video feedback</li>
        </ul>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Completion Requirements:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          To be eligible for a potential refund, participants should complete the following over the 6-week period:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Attend at least 2 live coaching calls per week (or watch the replays)</li>
          <li>Post at least 1 training video per week for feedback</li>
          <li>Complete all 5 core course lessons from the Boxing Masterclass</li>
          <li>Join at least 2 community check-in calls</li>
        </ul>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Guarantee Terms:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Refund approval for the 6-Week Challenge is determined at the sole discretion of Oracle Boxing Ltd. While we track participant engagement and completion of the above requirements, the final decision on whether a participant has "won" the challenge rests entirely with our team.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          This discretionary structure ensures that we reward genuine effort and engagement while maintaining the integrity of the program. We reserve the right to deny refund requests that do not demonstrate authentic participation and commitment.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Why This Guarantee Exists:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          The 6-Week Challenge guarantee is designed to remove risk for committed learners. You win by gaining valuable boxing knowledge and skills—potentially for free. We win by earning your trust and helping you achieve real results.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Our goal is to ensure you engage fully with the material and community, maximizing your learning and transformation.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>Questions or Concerns?</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          If you have any questions about our guarantee policies or would like to request a refund, please contact us:
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          <strong>Oracle Boxing Ltd</strong><br />
          Unit 5 Artillery 88<br />
          Artillery Road<br />
          BA22 8RP<br />
          United Kingdom<br />
          Email: team@oracleboxing.com
        </p>

        <p style={{ lineHeight: '1.6', marginTop: '32px', paddingTop: '32px', borderTop: '1px solid #e5e5e5', fontStyle: 'italic', color: '#666666' }}>
          We are committed to your success and satisfaction. Our guarantees reflect our confidence in the quality of our programs and our commitment to supporting your boxing journey.
        </p>
      </div>
    </div>
  )
}
