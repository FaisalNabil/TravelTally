import { PageLayout } from '@/components/layout/PageLayout';

export default function TermsOfServicePage() {
  return (
    <PageLayout title="Terms of Service">
      <p className="text-muted-foreground text-sm mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      <h2>Acceptance</h2>
      <p>By using Travel Tally, you agree to these terms of service.</p>
      <h2>Service description</h2>
      <p>
        Travel Tally helps groups track and split shared travel expenses.
        Settlement calculations are provided as a convenience and should be verified by users.
      </p>
      <h2>User responsibilities</h2>
      <p>
        You are responsible for the accuracy of expense entries and member information you provide.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        Travel Tally is provided &quot;as is&quot; without warranties. We are not liable for disputes
        arising from expense splits or settlement amounts.
      </p>
      <h2>Contact</h2>
      <p>
        <a href="mailto:tousif.md.amin.faisal@gmail.com">tousif.md.amin.faisal@gmail.com</a>
      </p>
    </PageLayout>
  );
}
