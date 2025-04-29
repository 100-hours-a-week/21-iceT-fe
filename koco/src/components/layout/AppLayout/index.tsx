// src/layouts/AppLayout.tsx
import { Outlet } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex justify-center">
      <main className="w-full max-w-xl bg-background">
        <Outlet />
      </main>
    </div>
  );
}
