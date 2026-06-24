import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, MoreVertical, Plus, Share2, Copy, Pencil, Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  useTour, useSettlements, useIndividualExpenses,
  useEndTour, useReactivateTour, useAddExpense, useUpdateExpense, useDeleteExpense,
} from '@/hooks/useTours';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ExpenseSheet } from '@/components/expenses/ExpenseSheet';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Expense } from '@/types';

export default function TourDetailPage() {
  const { tourId = '' } = useParams();
  const navigate = useNavigate();
  const { data: tour, isLoading, isError } = useTour(tourId);
  const isEnded = !!tour?.endDate;
  const { data: settlements } = useSettlements(tourId, isEnded);
  const { data: individualExpenses } = useIndividualExpenses(tourId, isEnded);

  const [expenseSheetOpen, setExpenseSheetOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [deleteExpense, setDeleteExpense] = useState<Expense | null>(null);

  const endTour = useEndTour(tourId);
  const reactivateTour = useReactivateTour(tourId);
  const addExpense = useAddExpense();
  const updateExpense = useUpdateExpense();
  const deleteExpenseMut = useDeleteExpense();

  const expenses = (tour?.expenses ?? []) as Expense[];
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const perPerson = tour?.members.length ? total / tour.members.length : 0;

  const handleShare = async () => {
    if (!settlements?.length) return;
    const text = settlements
      .map((s) => `${s.fromMember.name} pays ${s.toMember.name} ${formatCurrency(s.amount)}`)
      .join('\n');
    const full = `Travel Tally — ${tour?.name} settlements:\n${text}`;

    if (navigator.share) {
      try {
        await navigator.share({ title: `${tour?.name} settlements`, text: full });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(full);
      toast.success('Settlement summary copied!');
    }
  };

  const handleCopy = async () => {
    if (!settlements?.length) return;
    const text = settlements
      .map((s) => `${s.fromMember.name} pays ${s.toMember.name} ${formatCurrency(s.amount)}`)
      .join('\n');
    await navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 space-y-4" role="status" aria-live="polite">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (isError || !tour) {
    return (
      <div className="px-4 py-12 text-center">
        <p className="text-muted-foreground mb-4">Tour not found</p>
        <Button asChild><Link to="/tours">Back to tours</Link></Button>
      </div>
    );
  }

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/tours')} aria-label="Back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-xl truncate">{tour.name}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(tour.startDate)}</p>
        </div>
        <Badge variant={isEnded ? 'secondary' : 'success'}>{isEnded ? 'Ended' : 'Active'}</Badge>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Tour actions">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!isEnded && (
              <DropdownMenuItem onClick={() => setEndDialogOpen(true)}>
                End tour
              </DropdownMenuItem>
            )}
            {isEnded && (
              <DropdownMenuItem
                onClick={() => reactivateTour.mutateAsync().then(() => toast.success('Tour reactivated'))}
              >
                Reopen tour
              </DropdownMenuItem>
            )}
            {isEnded && settlements && settlements.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" /> Share settlements
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {isEnded && (
        <div className="mb-4 rounded-lg bg-muted px-4 py-2 text-sm text-center">
          Tour ended · {formatDate(tour.endDate!)}
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-6">
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-semibold">{formatCurrency(total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Per person</p>
            <p className="font-semibold">{formatCurrency(perPerson)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <p className="text-xs text-muted-foreground">Expenses</p>
            <p className="font-semibold">{expenses.length}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue={isEnded ? 'settle' : 'expenses'}>
        <TabsList>
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="balances">Balances</TabsTrigger>
          <TabsTrigger value="settle">Settle</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-2">
          {expenses.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="p-6 text-center text-muted-foreground">
                No expenses yet. Tap + to add one.
              </CardContent>
            </Card>
          ) : (
            expenses.map((exp) => (
              <Card key={exp._id}>
                <CardContent className="p-4 flex items-center justify-between gap-2">
                  <div className="flex-1 min-w-0" onClick={() => { if (!isEnded) { setEditingExpense(exp); setExpenseSheetOpen(true); } }}>
                    <p className="font-medium truncate">{exp.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {exp.paidBy.name} · split {exp.involvedMembers.length} ways
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{formatCurrency(exp.amount)}</span>
                    {!isEnded && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Edit expense"
                        onClick={() => { setEditingExpense(exp); setExpenseSheetOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    )}
                    {!isEnded && (
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Delete expense"
                        onClick={() => setDeleteExpense(exp)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="balances" className="space-y-3">
          {isEnded && individualExpenses?.length ? (
            individualExpenses.map((rec) => {
              const diff = rec.paid - rec.shouldHavePaid;
              return (
                <Card key={rec._id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                      <span className="font-medium">{rec.member.name}</span>
                      <span className={diff >= 0 ? 'text-primary' : 'text-coral'}>
                        {diff >= 0 ? '+' : ''}{formatCurrency(diff)}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${Math.min(100, (rec.paid / Math.max(rec.shouldHavePaid, 1)) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Paid {formatCurrency(rec.paid)} · Owed {formatCurrency(rec.shouldHavePaid)}
                    </p>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              {isEnded ? 'No balance data' : 'End the tour to see balances'}
            </p>
          )}
        </TabsContent>

        <TabsContent value="settle" className="space-y-3">
          {isEnded && settlements?.length ? (
            <>
              {settlements.map((s) => (
                <Card key={s._id} className="bg-muted/50">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm">
                      <span className="font-semibold">{s.fromMember.name}</span>
                      {' pays '}
                      <span className="font-semibold">{s.toMember.name}</span>
                    </p>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {formatCurrency(s.amount)}
                    </p>
                  </CardContent>
                </Card>
              ))}
              <div className="flex gap-2">
                <Button className="flex-1" onClick={handleShare}>
                  <Share2 className="h-4 w-4 mr-2" /> Share
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleCopy}>
                  <Copy className="h-4 w-4 mr-2" /> Copy
                </Button>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              {isEnded ? 'No settlements needed — everyone is even!' : 'End the tour to calculate settlements'}
            </p>
          )}
        </TabsContent>
      </Tabs>

      {!isEnded && (
        <Button
          className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg z-30 md:right-[calc(50%-240px+1rem)]"
          size="icon"
          onClick={() => { setEditingExpense(null); setExpenseSheetOpen(true); }}
          aria-label="Add expense"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      <ExpenseSheet
        open={expenseSheetOpen}
        onOpenChange={setExpenseSheetOpen}
        members={tour.members}
        tourId={tourId}
        expense={editingExpense}
        readOnly={isEnded}
        onSave={async (data) => {
          if (editingExpense) {
            await updateExpense.mutateAsync({
              expenseId: editingExpense._id,
              tourId,
              ...data,
            });
            toast.success('Expense updated');
          } else {
            await addExpense.mutateAsync({ tourId, ...data });
            toast.success('Expense added');
          }
        }}
      />

      <Dialog open={endDialogOpen} onOpenChange={setEndDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End this tour?</DialogTitle>
            <DialogDescription>
              This will calculate final settlements and make the tour read-only.
              You can reopen it later if needed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEndDialogOpen(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await endTour.mutateAsync();
                setEndDialogOpen(false);
                toast.success('Tour ended — check the Settle tab');
              }}
            >
              End tour
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteExpense} onOpenChange={() => setDeleteExpense(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete expense?</DialogTitle>
            <DialogDescription>
              This will permanently remove &quot;{deleteExpense?.description}&quot;.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteExpense(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={async () => {
                if (!deleteExpense) return;
                await deleteExpenseMut.mutateAsync({ expenseId: deleteExpense._id, tourId });
                setDeleteExpense(null);
                toast.success('Expense deleted');
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
