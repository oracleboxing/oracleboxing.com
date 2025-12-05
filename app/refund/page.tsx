import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund policy for Oracle Boxing courses and memberships. 30-day money-back guarantee on digital courses. No refunds on memberships.',
  alternates: {
    canonical: '/refund',
  },
}

export default function RefundPage() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#FFFFFF', color: '#000000', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Refund Policy</h1>
        <p style={{ fontSize: '14px', color: '#666666', marginBottom: '32px' }}>Last Updated: November 2025</p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>30-Day Money-Back Guarantee for Digital Courses</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Oracle Boxing offers a 30-day money-back guarantee for digital course purchases bought by themselves. If you are not satisfied with your standalone course purchase for any reason, you can request a full refund within 30 days of purchase—no questions asked.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Courses Covered by 30-Day Guarantee:</h3>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Boxing Masterclass (purchased standalone)</li>
          <li>Boxing Roadmap (purchased standalone)</li>
          <li>Oracle Boxing Bundle (purchased standalone)</li>
          <li>Any other individual digital course product purchased by itself</li>
        </ul>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>What's NOT Covered by the Guarantee:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          The 30-day money-back guarantee does NOT apply to:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li><strong>Lifetime access upgrades</strong> added to course purchases</li>
          <li><strong>Order bumps or add-ons</strong> purchased alongside courses (e.g., 6-Week Membership add-on, Recordings Vault add-on)</li>
          <li><strong>Additional products added during checkout</strong></li>
          <li><strong>Any content included as part of the 6-Week Challenge</strong></li>
        </ul>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          <strong>Important:</strong> Only the standalone course purchase itself is covered by the 30-day guarantee. Any add-ons, upgrades, or order bumps selected during checkout are final sale and non-refundable.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>How to Request a Refund:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          To request a refund for a standalone digital course, email us at <strong>team@oracleboxing.com</strong> within 30 days of your purchase date. Include your order number or purchase confirmation email. We will process your refund promptly, typically within 5-10 business days.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>NO REFUNDS FOR MEMBERSHIPS</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px', fontWeight: 'bold' }}>
          Oracle Boxing does NOT offer refunds for membership purchases under any circumstances.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Memberships (No Refunds):</h3>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Monthly Membership</li>
          <li>Quarterly Membership (3 months)</li>
          <li>6-Month Membership</li>
          <li>Annual Membership (12 months)</li>
          <li>Any other recurring or one-time membership payment</li>
        </ul>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Why No Refunds for Memberships?</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Oracle Boxing actively budgets and makes critical business decisions based on expected membership revenue. This includes:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Scheduling coaching calls and allocating coach time</li>
          <li>Planning community resources and support</li>
          <li>Maintaining platform infrastructure and services</li>
          <li>Making financial commitments to third-party services</li>
        </ul>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Because we rely on membership revenue for operational planning, all membership payments are final and non-refundable.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Your Responsibility to Cancel:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          <strong>It is your responsibility to cancel your membership before it renews if you do not wish to continue.</strong>
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>You can cancel your membership at any time by contacting team@oracleboxing.com</li>
          <li>Cancellations must be submitted BEFORE your next billing date to avoid being charged</li>
          <li>We will NOT refund membership payments if you forget to cancel before renewal</li>
          <li>Upon cancellation, you will retain access through the end of your current paid period</li>
        </ul>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We send renewal reminders, but it remains your responsibility to manage your subscription and cancel if desired.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>NO REFUNDS FOR 1-ON-1 COACHING</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          All 1-on-1 coaching purchases are final and non-refundable. Once you book and pay for coaching services, we reserve coach time specifically for you. No refunds will be issued for coaching services.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          If you need to reschedule a coaching session, please contact us as soon as possible. We will work with you to find an alternative time, but we cannot guarantee availability and cannot offer refunds.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>6-WEEK CHALLENGE REFUND (DISCRETIONARY)</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          The 6-Week Challenge operates under a different guarantee structure. Refund approval is determined at the sole discretion of Oracle Boxing Ltd.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Completion Requirements:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          To be considered for a potential refund, participants should complete the following over the 6-week period:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Attend at least 2 live coaching calls per week (or watch the replays)</li>
          <li>Post at least 1 training video per week for feedback</li>
          <li>Complete all 5 core course lessons from the Boxing Masterclass</li>
          <li>Join at least 2 community check-in calls</li>
        </ul>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Discretionary Approval:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Meeting the above requirements does not guarantee a refund. The final decision on whether a participant has "won" the challenge and qualifies for a refund is made entirely at Oracle Boxing Ltd's discretion.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We reserve the right to approve or deny refund requests based on genuine participation, effort, and engagement with the program. This discretionary structure maintains the integrity of the challenge while rewarding authentic commitment.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          For complete details about the 6-Week Challenge guarantee, please see our Guarantee page.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>Special Circumstances</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          While our policies are clearly stated above, we understand that exceptional circumstances may arise. If you believe you have a special case, such as:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Technical issues preventing access to purchased content</li>
          <li>Duplicate charges or billing errors</li>
          <li>Unauthorized charges on your account</li>
          <li>Other extraordinary technical or billing circumstances</li>
        </ul>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Please contact our support team at team@oracleboxing.com with detailed documentation. We will review your case individually. However, please note that "special circumstances" do not include forgetting to cancel a membership or changing your mind about a purchase.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>Disputes and Chargebacks</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          If you have any concern about a charge or believe there has been a billing error, please contact us directly at team@oracleboxing.com BEFORE initiating a chargeback with your bank or credit card company.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We are committed to resolving billing issues quickly and fairly. Most issues can be resolved within 24-48 hours when you contact us directly.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px', fontWeight: 'bold' }}>
          Initiating a chargeback without first attempting to resolve the issue with us may result in:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Immediate suspension of your account</li>
          <li>Permanent loss of access to all courses, memberships, and community</li>
          <li>Inability to make future purchases from Oracle Boxing</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>Refund Processing Time</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          For approved refunds (digital courses within 30 days or special circumstances):
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Refunds are processed within 5-10 business days of approval</li>
          <li>Refunds are issued to the original payment method used for purchase</li>
          <li>Depending on your bank or card issuer, it may take an additional 5-10 business days for the refund to appear in your account</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>Summary of Refund Policy</h2>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li><strong>Digital Courses:</strong> 30-day money-back guarantee, no questions asked</li>
          <li><strong>Memberships:</strong> NO REFUNDS under any circumstances - customer must cancel before renewal</li>
          <li><strong>1-on-1 Coaching:</strong> NO REFUNDS - all coaching purchases are final</li>
          <li><strong>6-Week Challenge:</strong> Discretionary refund based on completion and Oracle Boxing Ltd's sole judgment</li>
          <li><strong>Special Circumstances:</strong> Technical/billing issues reviewed case-by-case</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>Contact Us</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          For questions about our refund policy, to request a refund, or for assistance with billing issues:
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          <strong>Oracle Boxing Ltd</strong><br />
          Unit 5 Artillery 88<br />
          Artillery Road<br />
          BA22 8RP<br />
          United Kingdom<br />
          Email: team@oracleboxing.com<br />
          Response Time: Within 24 hours
        </p>
      </div>
    </div>
  )
}
