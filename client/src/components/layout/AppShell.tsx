import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { OfflineBanner } from './OfflineBanner';
import { PwaUpdatePrompt } from './PwaUpdatePrompt';

export function AppShell() {
  return (
    <div className="mx-auto min-h-dvh max-w-lg flex flex-col">
      <OfflineBanner />
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <BottomNav />
      <PwaUpdatePrompt />
    </div>
  );
}
