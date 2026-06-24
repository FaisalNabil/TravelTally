import { PageLayout } from '@/components/layout/PageLayout';

export default function PrivacyPolicyPage() {
  return (
    <PageLayout title="Privacy Policy">
      <p className="text-muted-foreground text-sm mb-4">Last updated: {new Date().toLocaleDateString()}</p>
      <h2>Information we collect</h2>
      <p>
        When you sign in with Google, we receive your name, email, and Google account ID.
        We use this to authenticate you and associate your tours with your account.
      </p>
      <h2>How we use your data</h2>
      <p>
        Your tour and expense data is stored securely and used solely to provide the Travel Tally service.
        We do not sell your personal information to third parties.
      </p>
      <h2>Data retention</h2>
      <p>
        Your data is retained as long as your account is active. You may request deletion by contacting us.
      </p>
      <h2>Contact</h2>
      <p>
        Questions? Email{' '}
        <a href="mailto:tousif.md.amin.faisal@gmail.com">tousif.md.amin.faisal@gmail.com</a>.
      </p>
    </PageLayout>
  );
}
