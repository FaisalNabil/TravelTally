import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { useTours, useCreateTour } from '@/hooks/useTours';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CreateTourDialog } from '@/components/tours/CreateTourDialog';
import { OnboardingTooltip } from '@/components/OnboardingTooltip';
import { formatDate, formatCurrency, getInitials } from '@/lib/utils';
import type { Tour, Expense } from '@/types';

function tourTotal(tour: Tour): number {
  const expenses = tour.expenses as Expense[];
  if (!Array.isArray(expenses)) return 0;
  return expenses.reduce((sum, e) => sum + (typeof e === 'object' ? e.amount : 0), 0);
}

export default function ToursPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'active' | 'ended'>('active');
  const [createOpen, setCreateOpen] = useState(false);
  const { data: tours, isLoading, isError, refetch, isFetching } = useTours();
  const createTour = useCreateTour();

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const filtered = (tours ?? []).filter((t) =>
    filter === 'active' ? !t.endDate : !!t.endDate
  );

  const handleCreate = async (data: { name: string; members: string[]; startDate: Date }) => {
    try {
      const members = data.members.map((name) => ({ name }));
      const tour = await createTour.mutateAsync({
        name: data.name,
        members,
        startDate: data.startDate.toISOString(),
      });
      toast.success('Tour created!');
      setCreateOpen(false);
      navigate(`/tours/${tour._id}`);
    } catch {
      toast.error('Failed to create tour');
    }
  };

  return (
    <div className="px-4 py-6">
      <OnboardingTooltip />
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-muted-foreground">Hi,</p>
          <h1 className="text-2xl font-bold">{firstName}</h1>
        </div>
        <Avatar>
          <AvatarFallback>{getInitials(user?.name ?? 'U')}</AvatarFallback>
        </Avatar>
      </div>

      <div className="flex gap-2 mb-6">
        {(['active', 'ended'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'active' ? 'Active' : 'Ended'}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="ml-auto"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          Refresh
        </Button>
      </div>

      {isLoading && (
        <div className="space-y-3" role="status" aria-live="polite">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      )}

      {isError && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground mb-4">Could not load tours</p>
            <Button onClick={() => refetch()}>Try again</Button>
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" aria-hidden />
            <h2 className="font-semibold text-lg mb-2">
              {filter === 'active' ? 'Plan your first trip' : 'No ended tours yet'}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Create a tour to start tracking shared expenses with friends.
            </p>
            {filter === 'active' && (
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" aria-hidden />
                Create tour
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {filtered.map((tour) => (
          <Card
            key={tour._id}
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => navigate(`/tours/${tour._id}`)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold">{tour.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {formatDate(tour.startDate)}
                    {tour.endDate && ` – ${formatDate(tour.endDate)}`}
                  </p>
                </div>
                <Badge variant={tour.endDate ? 'secondary' : 'success'}>
                  {tour.endDate ? 'Ended' : 'Active'}
                </Badge>
              </div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex -space-x-2">
                  {tour.members.slice(0, 4).map((m) => (
                    <Avatar key={m.memberId} className="h-7 w-7 border-2 border-background">
                      <AvatarFallback className="text-xs">{getInitials(m.name)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {tour.members.length > 4 && (
                    <span className="text-xs text-muted-foreground ml-3 self-center">
                      +{tour.members.length - 4}
                    </span>
                  )}
                </div>
                <span className="text-sm font-medium">{formatCurrency(tourTotal(tour))}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && filter === 'active' && (
        <Button
          className="fixed bottom-24 right-4 h-14 w-14 rounded-full shadow-lg z-30 md:right-[calc(50%-240px+1rem)]"
          size="icon"
          onClick={() => setCreateOpen(true)}
          aria-label="Create new tour"
        >
          <Plus className="h-6 w-6" />
        </Button>
      )}

      <CreateTourDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreate}
        loading={createTour.isPending}
      />
    </div>
  );
}
