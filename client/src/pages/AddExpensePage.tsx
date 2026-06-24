import { useNavigate } from 'react-router-dom';
import { useTours } from '@/hooks/useTours';
import { ExpenseSheet } from '@/components/expenses/ExpenseSheet';
import { useAddExpense } from '@/hooks/useTours';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useState } from 'react';

export default function AddExpensePage() {
  const navigate = useNavigate();
  const { data: tours, isLoading } = useTours();
  const addExpense = useAddExpense();
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);

  const activeTours = (tours ?? []).filter((t) => !t.endDate);

  if (isLoading) {
    return (
      <div className="px-4 py-6 space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (activeTours.length === 0) {
    return (
      <div className="px-4 py-12 text-center">
        <h1 className="text-xl font-bold mb-2">Quick add</h1>
        <p className="text-muted-foreground mb-4">Create an active tour first to add expenses.</p>
        <Button onClick={() => navigate('/tours')}>Go to tours</Button>
      </div>
    );
  }

  const selectedTour = activeTours.find((t) => t._id === selectedTourId) ?? activeTours[0];

  if (!selectedTourId) {
    return (
      <div className="px-4 py-6">
        <h1 className="text-xl font-bold mb-4">Quick add expense</h1>
        <p className="text-sm text-muted-foreground mb-4">Select a tour:</p>
        <div className="space-y-2">
          {activeTours.map((t) => (
            <Card
              key={t._id}
              className="cursor-pointer hover:border-primary/50"
              onClick={() => setSelectedTourId(t._id)}
            >
              <CardContent className="p-4 font-medium">{t.name}</CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-bold mb-2">Add to {selectedTour.name}</h1>
      <ExpenseSheet
        open={true}
        onOpenChange={(open) => { if (!open) navigate('/tours'); }}
        members={selectedTour.members}
        tourId={selectedTour._id}
        onSave={async (data) => {
          await addExpense.mutateAsync({ tourId: selectedTour._id, ...data });
          toast.success('Expense added!');
          navigate(`/tours/${selectedTour._id}`);
        }}
      />
    </div>
  );
}
