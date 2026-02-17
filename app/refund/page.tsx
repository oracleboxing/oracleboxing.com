import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Refund Policy',
  description: 'Refund policy for Oracle Boxing courses, memberships, and products. No refunds on digital products, memberships, or coaching.',
  alternates: {
    canonical: '/refund',
  },
}

export default function RefundPage() {
  return (
    <div style={{ backgroundColor: '#FFFFFF', color: '#000000', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 className="text-section" style={{ fontWeight: 'bold', marginBottom: '8px' }}>Refund Policy</h1>
        <p className="text-body" style={{ color: '#666666', marginBottom: '32px' }}>Last Updated: January 2026</p>

        <h2 className="text-sub" style={{ fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>NO REFUNDS FOR DIGITAL COURSES & ADD-ONS</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          All digital course purchases and add-ons are final and non-refundable. This includes:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Boxing from First Principles course</li>
          <li>2025 Call Recording Vault</li>
          <li>Any other digital course or add-on product</li>
        </ul>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          By purchasing a digital product, you acknowledge that you are receiving immediate access to digital content and agree that no refund will be provided.
        </p>

        <h2 className="text-sub" style={{ fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>NO REFUNDS FOR MEMBERSHIPS</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px', fontWeight: 'bold' }}>
          Oracle Boxing does NOT offer refunds for membership purchases under any circumstances.
        </p>

        <h3 className="text-title" style={{ fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Memberships (No Refunds):</h3>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Monthly Membership</li>
          <li>Annual Membership (12 months)</li>
          <li>Any other recurring or one-time membership payment</li>
        </ul>

        <h3 className="text-title" style={{ fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Why No Refunds for Memberships?</h3>
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

        <h3 className="text-title" style={{ fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Your Responsibility to Cancel:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          <strong>It is your responsibility to cancel your membership before it renews if you do not wish to continue.</strong>
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>You can cancel your membership at any time through the Customer Portal or by contacting team@oracleboxing.com</li>
          <li>Cancellations must be submitted BEFORE your next billing date to avoid being charged</li>
          <li>We will NOT refund membership payments if you forget to cancel before renewal</li>
          <li>Upon cancellation, you will retain access through the end of your current paid period</li>
        </ul>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We send renewal reminders, but it remains your responsibility to manage your subscription and cancel if desired.
        </p>

        <h2 className="text-sub" style={{ fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>NO REFUNDS FOR 1-ON-1 COACHING</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          All 1-on-1 coaching purchases are final and non-refundable. Once you book and pay for coaching services, we reserve coach time specifically for you. No refunds will be issued for coaching services.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          If you need to reschedule a coaching session, please contact us as soon as possible. We will work with you to find an alternative time, but we cannot guarantee availability and cannot offer refunds.
        </p>

        <h2 className="text-sub" style={{ fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>NO RETURNS FOR PHYSICAL PRODUCTS</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Physical products, including the Oracle Boxing Tracksuit, are final sale. We do not accept returns or provide refunds for physical merchandise.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Please ensure you select the correct size and review product details carefully before placing your order.
        </p>

        <h2 className="text-sub" style={{ fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>21-DAY CHALLENGE PRIZE</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          The 21-Day Challenge includes a prize opportunity for participants who complete the program requirements. This is a prize, not a guaranteed refund.
        </p>

        <h3 className="text-title" style={{ fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Prize Requirements:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          To be eligible for the 21-Day Challenge prize, participants must complete the following:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Attend at least 2 live coaching calls per week</li>
          <li>Post at least 1 training video per week for review</li>
          <li>Complete the Grade 1 course</li>
          <li>Attend a graduation call</li>
        </ul>

        <h3 className="text-title" style={{ fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Prize Options:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Participants who successfully complete the requirements may be eligible for one of the following prizes:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li><strong>Full refund</strong> of the 21-Day Challenge purchase price, OR</li>
          <li><strong>Credit towards a full membership</strong> - apply your challenge payment towards ongoing membership</li>
        </ul>

        <h3 className="text-title" style={{ fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>Discretionary Approval:</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          <strong>Prize eligibility and approval is entirely at the sole discretion of Oracle Boxing Ltd.</strong> Meeting the above requirements does not guarantee receipt of the prize. The final decision on whether a participant qualifies is made by the Oracle Boxing team based on genuine participation, effort, and engagement with the program.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          This discretionary structure maintains the integrity of the challenge while rewarding authentic commitment.
        </p>

        <h2 className="text-sub" style={{ fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>Special Circumstances</h2>
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

        <h2 className="text-sub" style={{ fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>Disputes and Chargebacks</h2>
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

        <h2 className="text-sub" style={{ fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>Summary of Refund Policy</h2>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li><strong>Digital Courses & Add-ons:</strong> NO REFUNDS - all purchases are final</li>
          <li><strong>Memberships:</strong> NO REFUNDS - customer must cancel before renewal</li>
          <li><strong>1-on-1 Coaching:</strong> NO REFUNDS - all coaching purchases are final</li>
          <li><strong>Physical Products (Tracksuit):</strong> NO RETURNS - all sales are final</li>
          <li><strong>21-Day Challenge:</strong> Prize eligibility (refund or membership credit) at Oracle Boxing Ltd's sole discretion</li>
          <li><strong>Special Circumstances:</strong> Technical/billing issues reviewed case-by-case</li>
        </ul>

        <h2 className="text-sub" style={{ fontWeight: 'bold', marginTop: '48px', marginBottom: '16px' }}>Contact Us</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          For questions about our refund policy or for assistance with billing issues:
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
