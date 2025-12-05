import type { Metadata} from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Oracle Boxing. Learn how we collect, use, and protect your personal information, cookies, and data security practices.',
  alternates: {
    canonical: '/privacy',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPolicy() {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#FFFFFF', color: '#000000', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>Privacy Policy</h1>
        <p style={{ fontSize: '14px', color: '#666666', marginBottom: '32px' }}>Last Updated: November 2025</p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>1. Introduction</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Oracle Boxing Ltd ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website oracleboxing.com and purchase our products or services.
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          <strong>Oracle Boxing Ltd</strong><br />
          Unit 5 Artillery 88<br />
          Artillery Road<br />
          BA22 8RP<br />
          United Kingdom<br />
          Email: team@oracleboxing.com
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>2. Information We Collect</h2>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>2.1 Personal Information</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          When you make a purchase or interact with our website, we may collect:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Name (first and last)</li>
          <li>Email address</li>
          <li>Phone number</li>
          <li>Billing and shipping address (if applicable)</li>
          <li>Payment information (processed securely through Stripe)</li>
        </ul>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>2.2 Automatically Collected Information</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We automatically collect certain information when you visit our website:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>IP address and approximate location (via CloudFlare geolocation)</li>
          <li>Browser type and version</li>
          <li>Device information</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring website addresses</li>
          <li>UTM parameters and marketing attribution data</li>
        </ul>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>2.3 Cookies and Tracking Technologies</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We use cookies and similar tracking technologies to enhance your experience and analyze website usage:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li><strong>Session Cookies:</strong> Track your session ID and browsing activity</li>
          <li><strong>Attribution Cookies:</strong> Track first-touch and last-touch marketing attribution, including UTM parameters, referral sources, and timestamps</li>
          <li><strong>Facebook Pixel:</strong> We use Facebook Pixel and Conversions API to track page views, add-to-cart events, checkout initiation, and purchases for advertising purposes</li>
          <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
        </ul>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          You can control cookie preferences through our cookie banner or your browser settings. However, disabling cookies may limit your ability to use certain features of our website.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>3. How We Use Your Information</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We use the information we collect to:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Process and fulfill your orders</li>
          <li>Deliver digital course content and membership access</li>
          <li>Send you purchase confirmations and course access instructions</li>
          <li>Provide customer support and respond to your inquiries</li>
          <li>Improve our website, products, and services</li>
          <li>Analyze marketing effectiveness and attribution</li>
          <li>Send marketing communications (with your consent)</li>
          <li>Prevent fraud and ensure website security</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>4. Third-Party Services and Data Sharing</h2>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>4.1 Payment Processing</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We use Stripe to process payments. Stripe collects and processes your payment information in accordance with their privacy policy. We do not store complete credit card information on our servers.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>4.2 Course Delivery and Automation</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We use Make.com (formerly Integromat) to automate course delivery and customer onboarding. When you complete a purchase, your information (name, email, phone, purchased products, and order details) is sent to Make.com webhooks to trigger automated delivery of course access, community invitations, and welcome emails.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>4.3 Facebook Pixel and Advertising</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We use Facebook Pixel and Facebook Conversions API to track user behavior and conversions for advertising purposes. This includes tracking page views, add-to-cart events, checkout initiation, and completed purchases. Facebook may use this data to serve you targeted advertisements. You can opt out of personalized advertising through your Facebook ad settings.
        </p>

        <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginTop: '24px', marginBottom: '12px' }}>4.4 Analytics</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We may use analytics services to understand how users interact with our website and improve user experience.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>5. Skool Community Content Rights</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          If you are a member and participate in our private Skool community at https://skool.com/boxing, the following terms apply:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>By submitting content (including but not limited to videos, posts, comments, images, or any other information) to our Skool community, you grant Oracle Boxing Ltd the right to use, reproduce, modify, distribute, and display that content for any purpose, including marketing, promotional materials, testimonials, case studies, and educational content.</li>
          <li>We reserve the right to use community content across any of our platforms, websites, social media, or marketing materials.</li>
          <li>While we are open to considering requests to remove specific content, all removal decisions are made at our sole discretion.</li>
          <li>You represent and warrant that you own or have the necessary rights to any content you submit and that such content does not violate any third-party rights.</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>6. Data Security</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>7. Data Retention</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. This includes:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Maintaining your account and providing access to purchased courses</li>
          <li>Complying with legal, tax, and accounting obligations</li>
          <li>Resolving disputes and enforcing our agreements</li>
        </ul>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>8. Your Rights (GDPR and UK Data Protection)</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          If you are located in the European Union or United Kingdom, you have the following rights under GDPR and UK data protection laws:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you</li>
          <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data</li>
          <li><strong>Right to Erasure:</strong> Request deletion of your personal data (subject to legal obligations)</li>
          <li><strong>Right to Restriction:</strong> Request restriction of processing in certain circumstances</li>
          <li><strong>Right to Data Portability:</strong> Request transfer of your data to another service</li>
          <li><strong>Right to Object:</strong> Object to processing of your data for marketing purposes</li>
          <li><strong>Right to Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
        </ul>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          To exercise any of these rights, please contact us at team@oracleboxing.com.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>9. Marketing Communications</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          With your consent, we may send you marketing emails about our products, services, and special offers. You can opt out of marketing communications at any time by:
        </p>
        <ul style={{ lineHeight: '1.6', marginBottom: '16px', marginLeft: '20px' }}>
          <li>Clicking the "unsubscribe" link in any marketing email</li>
          <li>Contacting us at team@oracleboxing.com</li>
        </ul>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Note: Even if you opt out of marketing emails, we will still send you transactional emails related to your purchases and account.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>10. International Data Transfers</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Your information may be transferred to and processed in countries other than your country of residence. We ensure that appropriate safeguards are in place to protect your data in accordance with this Privacy Policy and applicable data protection laws.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>11. Children's Privacy</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>12. Changes to This Privacy Policy</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the updated policy on our website with a new "Last Updated" date. Your continued use of our services after such changes constitutes acceptance of the updated Privacy Policy.
        </p>

        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '32px', marginBottom: '16px' }}>13. Contact Us</h2>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
        </p>
        <p style={{ lineHeight: '1.6', marginBottom: '16px' }}>
          <strong>Oracle Boxing Ltd</strong><br />
          Unit 5 Artillery 88<br />
          Artillery Road<br />
          BA22 8RP<br />
          United Kingdom<br />
          Email: team@oracleboxing.com
        </p>
      </div>
    </div>
  )
}
