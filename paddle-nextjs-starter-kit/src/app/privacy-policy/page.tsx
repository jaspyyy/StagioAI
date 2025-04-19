import { LegalPageLayout } from '@/components/legal/legal-page-layout';

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout 
      title="Privacy Policy" 
      lastUpdated="March 1, 2025"
    >
      <h2>1. Information We Collect</h2>
      <p>
        We collect information that you provide directly to us, including:
      </p>
      <ul>
        <li>Account information (name, email, password)</li>
        <li>Payment information</li>
        <li>Images uploaded for virtual staging</li>
        <li>Usage data and preferences</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>
        We use the collected information to:
      </p>
      <ul>
        <li>Provide and improve our AI virtual staging service</li>
        <li>Process payments and maintain your account</li>
        <li>Send service updates and marketing communications</li>
        <li>Analyze and optimize our service performance</li>
      </ul>

      <h2>3. Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect your personal information. 
        Your data is encrypted in transit and at rest.
      </p>

      <h2>4. Data Retention</h2>
      <p>
        We retain your information for as long as your account is active or as needed to provide services. 
        You can request data deletion at any time.
      </p>

      <h2>5. Your Rights</h2>
      <p>
        You have the right to:
      </p>
      <ul>
        <li>Access your personal data</li>
        <li>Correct inaccurate data</li>
        <li>Request data deletion</li>
        <li>Object to data processing</li>
        <li>Export your data</li>
      </ul>
    </LegalPageLayout>
  );
} 