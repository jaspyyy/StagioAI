import { LegalPageLayout } from '@/components/legal/legal-page-layout';

export default function RefundPolicyPage() {
  return (
    <LegalPageLayout 
      title="Refund Policy" 
      lastUpdated="March 1, 2025"
    >
      <h2>1. Refund Eligibility</h2>
      <p>
        We offer refunds under the following circumstances:
      </p>
      <ul>
        <li>Technical issues preventing service delivery</li>
        <li>Unsatisfactory results due to AI processing errors</li>
        <li>Double charging or billing errors</li>
        <li>Regardless of your situation, contact us and we will decide if eligible for a refund</li>
      </ul>

      <h2>2. Refund Process</h2>
      <p>
        To request a refund:
      </p>
      <ol>
        <li>Contact our support team</li>
        <li>Provide order/transaction details</li>
        <li>Explain the reason for the refund request</li>
        <li>Include relevant screenshots or examples if applicable</li>
      </ol>

      <h2>3. Processing Time</h2>
      <p>
        Refund requests are typically processed within 3-5 business days. The actual refund may take 
        5-10 business days to appear on your statement, depending on your payment method and financial institution.
      </p>

      <h2>4. Non-Refundable Items</h2>
      <p>
        The following are not eligible for refunds:
      </p>
      <ul>
        <li>Used credits for successfully processed images</li>
        <li>Subscription time already used</li>
        <li>Custom enterprise solutions</li>
      </ul>

      <h2>5. Contact Us</h2>
      <p>
        If you have any questions about our refund policy, please contact our support team at 
        support@stagioai.com.
      </p>
    </LegalPageLayout>
  );
} 