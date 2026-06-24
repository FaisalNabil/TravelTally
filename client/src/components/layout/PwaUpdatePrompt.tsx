import { useEffect, useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Button } from '@/components/ui/button';

export function PwaUpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (needRefresh) setDismissed(false);
  }, [needRefresh]);

  if (!needRefresh || dismissed) return null;

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-50 mx-auto max-w-lg rounded-xl border bg-background p-4 shadow-lg"
      role="alert"
    >
      <p className="text-sm font-medium mb-3">A new version is available</p>
      <div className="flex gap-2">
        <Button size="sm" onClick={() => updateServiceWorker(true)}>
          Refresh to update
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setDismissed(true)}>
          Later
        </Button>
      </div>
    </div>
  );
}
