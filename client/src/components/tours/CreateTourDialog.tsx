import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface CreateTourDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; members: string[]; startDate: Date }) => void;
  loading?: boolean;
}

export function CreateTourDialog({ open, onOpenChange, onSubmit, loading }: CreateTourDialogProps) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [memberInput, setMemberInput] = useState('');
  const [members, setMembers] = useState<string[]>([]);

  const addMember = () => {
    const trimmed = memberInput.trim();
    if (trimmed && !members.includes(trimmed)) {
      setMembers([...members, trimmed]);
      setMemberInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || members.length === 0) return;
    onSubmit({ name: name.trim(), members, startDate: new Date(startDate) });
    setName('');
    setMembers([]);
    setMemberInput('');
    setStartDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new tour</DialogTitle>
          <DialogDescription>Add your trip details and travel companions.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="tour-name">Tour name</Label>
            <Input
              id="tour-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Bali 2025"
              required
            />
          </div>
          <div>
            <Label htmlFor="start-date">Start date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="member-input">Members</Label>
            <div className="flex gap-2">
              <Input
                id="member-input"
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                placeholder="Add member name"
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addMember())}
              />
              <Button type="button" variant="secondary" onClick={addMember}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {members.map((m) => (
                <Badge key={m} variant="secondary" className="gap-1 pr-1">
                  {m}
                  <button
                    type="button"
                    onClick={() => setMembers(members.filter((x) => x !== m))}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                    aria-label={`Remove ${m}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim() || members.length === 0}>
              {loading ? 'Creating...' : 'Create tour'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
