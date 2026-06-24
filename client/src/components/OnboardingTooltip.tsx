import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STORAGE_KEY = 'traveltally_onboarding_done';

export function OnboardingTooltip() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setVisible(true);
    }
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-4 relative"
      role="status"
      aria-live="polite"
    >
      <button
        onClick={dismiss}
        className="absolute top-2 right-2 p-1 rounded-md hover:bg-muted"
        aria-label="Dismiss tip"
      >
        <X className="h-4 w-4" />
      </button>
      <p className="font-medium text-sm mb-1">Welcome to Travel Tally!</p>
      <p className="text-sm text-muted-foreground mb-3">
        Tap <strong>+</strong> to create a tour, then add expenses as you travel.
        End the tour when you&apos;re done to see who owes whom.
      </p>
      <Button size="sm" onClick={dismiss}>Got it</Button>
    </div>
  );
}
