import type { ReactNode } from 'react';

// Admin layout — no bottom nav (separate from shop)
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
