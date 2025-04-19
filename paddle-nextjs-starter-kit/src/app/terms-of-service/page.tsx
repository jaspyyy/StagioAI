import { LegalPageLayout } from '@/components/legal/legal-page-layout';

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout 
      title="Terms of Service" 
      lastUpdated="March 1, 2025"
    >
      <h2>1. Service Agreement</h2>
      <p>
        By using our AI virtual staging service, you agree to these Terms of Service. The service 
        is provided "as is" and we reserve the right to modify or discontinue it at any time.
      </p>

      <h2>2. Account Terms</h2>
      <p>
        To use our service, you must:
      </p>
      <ul>
        <li>Create a valid account with accurate information</li>
        <li>Be at least 18 years old</li>
        <li>Maintain account security</li>
        <li>Accept responsibility for all activity under your account</li>
      </ul>

      <h2>3. Payment Terms</h2>
      <p>
        Our service operates on the following payment terms:
      </p>
      <ul>
        <li>Subscription fees are billed in advance</li>
        <li>All fees are non-refundable except as specified in our Refund Policy</li>
        <li>Prices may change with 30 days notice</li>
      </ul>

      <h2>4. Usage Guidelines</h2>
      <p>
        When using our service, you agree to:
      </p>
      <ul>
        <li>Only upload images you have rights to use</li>
        <li>Not use the service for illegal purposes</li>
        <li>Not attempt to reverse engineer the AI system</li>
        <li>Not exceed usage limits or abuse the service</li>
      </ul>

      <h2>5. Intellectual Property</h2>
      <p>
        You retain rights to your original images. We grant you a license to use AI-generated 
        modifications according to your subscription plan. The AI technology and service remain 
        our exclusive property.
      </p>

      <h2>6. Termination</h2>
      <p>
        We may suspend or terminate your account for:
      </p>
      <ul>
        <li>Violation of these terms</li>
        <li>Fraudulent activity</li>
        <li>Non-payment</li>
        <li>Extended period of inactivity</li>
      </ul>
    </LegalPageLayout>
  );
} 