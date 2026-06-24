import { PageLayout } from '@/components/layout/PageLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AboutPage() {
  return (
    <PageLayout title="About">
      <p>
        <strong>Travel Tally</strong> makes group travel expense tracking simple and fair.
        Log costs as you go, split them automatically, and settle up with clarity at the end of your trip.
      </p>
      <h2>Our mission</h2>
      <p>
        No more spreadsheets, awkward calculations, or forgotten receipts.
        Travel Tally gives friend groups a trustworthy way to share costs.
      </p>
      <h2>Built by</h2>
      <div className="flex items-center gap-4 not-prose my-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="/tousif.jpg" alt="Faisal Nabil" />
          <AvatarFallback>FN</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-semibold">Faisal Nabil</p>
          <p className="text-sm text-muted-foreground">Creator &amp; developer</p>
        </div>
      </div>
      <p>
        Questions or feedback?{' '}
        <a href="mailto:tousif.md.amin.faisal@gmail.com">Get in touch</a>.
      </p>
    </PageLayout>
  );
}
