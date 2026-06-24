import { PageLayout } from '@/components/layout/PageLayout';
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent } from '@/components/ui/card';

const faqs = [
  {
    q: 'How is expense settlement calculated?',
    a: 'Travel Tally totals what each member paid and what they should have paid based on shared expenses. It then finds the minimum number of payments needed to settle all debts.',
    example: [
      { name: 'Alice', paid: 50, owed: 30 },
      { name: 'Bob', paid: 20, owed: 50 },
      { name: 'Charlie', paid: 40, owed: 40 },
    ],
  },
  {
    q: 'What situations can Travel Tally be used in?',
    a: 'Group travels, road trips, camping, sports clubs, shared apartments, and any scenario where friends split costs.',
  },
  {
    q: 'How can I edit tour members?',
    a: 'Open your tour and use the edit option from the tour menu. Members linked to a payment cannot be removed until that expense is updated.',
  },
  {
    q: 'Can I use Travel Tally offline?',
    a: 'You can view cached data offline after installing the app. Adding expenses requires an internet connection.',
  },
];

export default function FAQPage() {
  return (
    <PageLayout title="FAQ">
      <Accordion type="single" collapsible className="w-full not-prose">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`item-${i}`}>
            <AccordionTrigger>{faq.q}</AccordionTrigger>
            <AccordionContent>
              <p className="mb-3">{faq.a}</p>
              {faq.example && (
                <div className="space-y-2">
                  {faq.example.map((row) => (
                    <Card key={row.name}>
                      <CardContent className="p-3 flex justify-between text-sm">
                        <span className="font-medium">{row.name}</span>
                        <span className="text-muted-foreground">
                          Paid ${row.paid} · Owed ${row.owed}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </PageLayout>
  );
}
