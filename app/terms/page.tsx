import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Oracle Boxing digital courses, memberships, and coaching services. Read our policies on refunds, content usage, and user responsibilities.',
  alternates: {
    canonical: '/terms',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function TermsPage() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#FFFFFF', color: '#000000', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Terms of Service</h1>
        <p style={{ fontSize: '14px', color: '#666666', marginBottom: '32px' }}>Last Updated: November 2025</p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>1. Acceptance of Terms</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          By accessing and using Oracle Boxing's digital course platform, memberships, and services, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services or purchase our products.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          These terms constitute a legally binding agreement between you and Oracle Boxing Ltd.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>2. Service Description</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Oracle Boxing provides online boxing training services including:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Boxing Masterclass - Comprehensive boxing course covering theory, technique, and tactics</li>
          <li>Boxing Roadmap - 5-phase structured training system with workouts and progression</li>
          <li>Oracle Boxing Bundle - Complete course package</li>
          <li>Memberships (monthly, quarterly, 6-month, annual) - Recurring access to live coaching, community, and all courses</li>
          <li>6-Week Challenge - Intensive 6-week program with coaching and course access</li>
          <li>1-on-1 Coaching - Personalized coaching services</li>
          <li>Access to our private Skool community platform at https://skool.com/boxing</li>
          <li>Weekly live coaching calls with Oliver & Toni</li>
          <li>Personalized video feedback on your training</li>
          <li>Digital course materials and video content</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>3. Digital Content License</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Upon purchase, you are granted a non-exclusive, non-transferable license to access and use the digital course content for personal use only. You may not:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Share, distribute, or resell course materials</li>
          <li>Copy or reproduce content for commercial purposes</li>
          <li>Share your account credentials with others</li>
          <li>Download content for redistribution or unauthorized use</li>
          <li>Create derivative works based on our content without written permission</li>
          <li>Use our content for any purpose other than personal education and training</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>4. Skool Community Content Rights</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          If you participate in our private Skool community at https://skool.com/boxing, the following terms apply:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>By submitting any content (including videos, posts, comments, images, or any other information) to our Skool community, you grant Oracle Boxing Ltd an irrevocable, perpetual, worldwide, royalty-free license to use, reproduce, modify, adapt, publish, translate, distribute, and display that content in any media.</li>
          <li>We may use community content for marketing purposes, promotional materials, testimonials, case studies, educational content, social media posts, advertisements, or any other purpose at our sole discretion.</li>
          <li>You retain ownership of your content, but grant us the rights described above.</li>
          <li>While we are open to considering requests to remove specific content, all removal decisions are made at our sole discretion. We are under no obligation to remove content upon request.</li>
          <li>You represent and warrant that you own or have the necessary rights to any content you submit and that such content does not violate any third-party rights or applicable laws.</li>
          <li>You agree not to submit any content that is unlawful, defamatory, harassing, abusive, or otherwise objectionable.</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>5. User Responsibilities</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>You agree to:</p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Provide accurate and complete information during purchase and registration</li>
          <li>Maintain the confidentiality of your account credentials and login information</li>
          <li>Respect other community members, coaches, and Oracle Boxing staff</li>
          <li>Not share or redistribute course materials in any form</li>
          <li>Train safely and within your physical capabilities</li>
          <li>Consult with a qualified healthcare provider before beginning any fitness or boxing training program</li>
          <li>Follow all community guidelines and code of conduct</li>
          <li>Not engage in any activity that could harm or disrupt our services or other users</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>6. Membership Terms</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          If you purchase a membership (monthly, quarterly, 6-month, or annual):
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Your membership will automatically renew at the end of each billing period unless you cancel.</li>
          <li>You can cancel your membership at any time through your account settings or by contacting team@oracleboxing.com.</li>
          <li>Cancellations must be made before your next renewal date to avoid being charged for the next period.</li>
          <li>You are responsible for canceling your membership before it renews. We do not provide refunds for membership payments, even if you forget to cancel.</li>
          <li>Upon cancellation, you will retain access to membership benefits until the end of your current paid period.</li>
          <li>We reserve the right to modify membership pricing with 30 days notice to active members.</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>7. Health and Safety Disclaimer</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Boxing is a physical activity that carries inherent risks. By participating in our programs, you acknowledge that:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>You are physically capable of participating in boxing training and have no medical conditions that would prevent safe participation</li>
          <li>You will follow all safety guidelines and recommendations provided in our courses</li>
          <li>Oracle Boxing Ltd, its coaches, and representatives are not liable for any injuries, damages, or health issues sustained during or as a result of training</li>
          <li>You should consult a qualified physician or healthcare provider before starting any new exercise or training program</li>
          <li>You assume all risks associated with boxing training and physical exercise</li>
          <li>You will use proper equipment and train in a safe environment</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>8. Intellectual Property</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          All content provided through Oracle Boxing, including but not limited to videos, course materials, training programs, written content, graphics, logos, and software, is protected by copyright, trademark, and other intellectual property laws. This content is owned by or licensed to Oracle Boxing Ltd.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          You may not reproduce, distribute, modify, create derivative works, publicly display, or in any way exploit any of our content without explicit written permission from Oracle Boxing Ltd. Unauthorized use may result in termination of your access and legal action.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>9. Refund and Guarantee Policy</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Our refund and guarantee policies vary by product type:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li><strong>Digital Courses:</strong> 30-day money-back guarantee, no questions asked</li>
          <li><strong>Memberships:</strong> No refunds under any circumstances (see our Refund Policy for details)</li>
          <li><strong>1-on-1 Coaching:</strong> No refunds</li>
          <li><strong>6-Week Challenge:</strong> Discretionary guarantee based on completion (see our Guarantee page for details)</li>
        </ul>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Please review our complete Refund Policy and Guarantee pages for detailed information.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>10. Account Termination</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We reserve the right to suspend or terminate your account and access to our services at any time, with or without notice, for any reason, including but not limited to:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Violation of these Terms of Service</li>
          <li>Sharing account credentials or course materials</li>
          <li>Abusive or inappropriate behavior toward other members or staff</li>
          <li>Fraudulent payment or chargeback disputes</li>
          <li>Any activity that we determine to be harmful to our business or community</li>
        </ul>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Termination of your account does not entitle you to a refund of any payments made.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>11. Limitation of Liability</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Oracle Boxing Ltd provides training guidance and education but makes no guarantees regarding individual results. Your results may vary based on your effort, dedication, physical condition, and other factors.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          To the maximum extent permitted by law, Oracle Boxing Ltd's total liability is limited to the amount you paid for the specific service in question. We are not liable for any indirect, incidental, consequential, special, or punitive damages, including but not limited to loss of profits, data, or goodwill.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>12. Disclaimer of Warranties</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Our services are provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that our services will be uninterrupted, error-free, or completely secure. You use our services at your own risk.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>13. Governing Law</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          These Terms of Service are governed by and construed in accordance with the laws of England and Wales, United Kingdom. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of England and Wales.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>14. Modifications to Terms</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We reserve the right to modify these Terms of Service at any time. We will notify users of material changes by posting the updated terms on our website with a new "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the modified terms.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          It is your responsibility to review these terms periodically for updates.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>15. Severability</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          If any provision of these Terms of Service is found to be invalid or unenforceable, the remaining provisions shall remain in full force and effect.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>16. Entire Agreement</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          These Terms of Service, together with our Privacy Policy, Refund Policy, and Guarantee page, constitute the entire agreement between you and Oracle Boxing Ltd regarding your use of our services.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>17. Contact Information</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          For questions about these Terms of Service or our services, please contact us:
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          <strong>Oracle Boxing Ltd</strong><br />
          Unit 5 Artillery 88<br />
          Artillery Road<br />
          BA22 8RP<br />
          United Kingdom<br />
          Email: team@oracleboxing.com<br />
          Website: https://oracleboxing.com
        </p>
      </div>
    </div>
  )
}
