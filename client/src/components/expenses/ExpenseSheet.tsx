import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { getMemberId } from '@/lib/utils';
import type { Member, Expense } from '@/types';

interface ExpenseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  members: Member[];
  tourId: string;
  expense?: Expense | null;
  onSave: (data: {
    paidBy: { memberId: string; name: string };
    amount: number;
    description: string;
    date: string;
    involvedMembers: { memberId: string; name: string }[];
  }) => Promise<void>;
  readOnly?: boolean;
}

export function ExpenseSheet({
  open, onOpenChange, members, expense, onSave, readOnly,
}: ExpenseSheetProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [paidById, setPaidById] = useState('');
  const [involved, setInvolved] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (expense) {
      setAmount(String(expense.amount));
      setDescription(expense.description);
      setDate(new Date(expense.date).toISOString().slice(0, 10));
      setPaidById(getMemberId(expense.paidBy));
      setInvolved(expense.involvedMembers.map(getMemberId));
    } else {
      setAmount('');
      setDescription('');
      setDate(new Date().toISOString().slice(0, 10));
      setPaidById(members[0] ? getMemberId(members[0]) : '');
      setInvolved(members.map(getMemberId));
    }
  }, [expense, members, open]);

  const toggleMember = (id: string) => {
    setInvolved((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payer = members.find((m) => getMemberId(m) === paidById);
    if (!payer || !amount || involved.length === 0) return;

    setSaving(true);
    try {
      await onSave({
        paidBy: { memberId: getMemberId(payer), name: payer.name },
        amount: parseFloat(amount),
        description,
        date: new Date(date).toISOString(),
        involvedMembers: members
          .filter((m) => involved.includes(getMemberId(m)))
          .map((m) => ({ memberId: getMemberId(m), name: m.name })),
      });
      onOpenChange(false);
    } catch {
      toast.error('Failed to save expense');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{expense ? 'Edit expense' : 'Add expense'}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              inputMode="decimal"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="text-2xl font-bold h-14"
              placeholder="0.00"
              required
              disabled={readOnly}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dinner, taxi, hotel..."
              required
              disabled={readOnly}
            />
          </div>
          <div>
            <Label>Paid by</Label>
            <Select value={paidById} onValueChange={setPaidById} disabled={readOnly}>
              <SelectTrigger>
                <SelectValue placeholder="Who paid?" />
              </SelectTrigger>
              <SelectContent>
                {members.map((m) => (
                  <SelectItem key={getMemberId(m)} value={getMemberId(m)}>
                    {m.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Split among</Label>
            <div className="space-y-2 mt-2">
              {members.map((m) => {
                const id = getMemberId(m);
                return (
                  <label key={id} className="flex items-center gap-3 min-h-[44px]">
                    <Checkbox
                      checked={involved.includes(id)}
                      onCheckedChange={() => toggleMember(id)}
                      disabled={readOnly}
                    />
                    <span>{m.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
          <div>
            <Label htmlFor="expense-date">Date</Label>
            <Input
              id="expense-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              disabled={readOnly}
            />
          </div>
          {!readOnly && (
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? 'Saving...' : expense ? 'Update expense' : 'Add expense'}
            </Button>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
}
