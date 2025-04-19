import { LegalPageLayout } from '@/components/legal/legal-page-layout';

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout 
      title="Cookie Policy" 
      lastUpdated="March 1, 2025"
    >
      <h2>1. What Are Cookies</h2>
      <p>
        Cookies are small text files that are placed on your device when you visit our website. 
        They help us provide you with a better experience and understand how you use our service.
      </p>

      <h2>2. Types of Cookies We Use</h2>
      <h3>Essential Cookies</h3>
      <p>
        Required for the operation of our website. They enable basic functions like page navigation 
        and access to secure areas.
      </p>

      <h3>Analytics Cookies</h3>
      <p>
        Help us understand how visitors interact with our website by collecting and reporting 
        information anonymously.
      </p>

      <h3>Functional Cookies</h3>
      <p>
        Remember your preferences to enhance your experience on our website.
      </p>

      <h2>3. Managing Cookies</h2>
      <p>
        You can control and/or delete cookies as you wish. You can delete all cookies that are 
        already on your computer and you can set most browsers to prevent them from being placed.
      </p>

      <h2>4. Third-Party Cookies</h2>
      <p>
        We use third-party services that may also set cookies on your device. These include:
      </p>
      <ul>
        <li>Analytics services</li>
        <li>Payment processors</li>
        <li>Authentication providers</li>
      </ul>

      <h2>5. Updates to This Policy</h2>
      <p>
        We may update this Cookie Policy from time to time. Any changes will be posted on this page 
        with an updated revision date.
      </p>
    </LegalPageLayout>
  );
} 