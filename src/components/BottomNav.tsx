'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCartStore } from '@/store/cart';

const NAV_ITEMS = [
  { icon: '🏠', label: 'Home',    path: '/' },
  { icon: '🔍', label: 'Search',  path: '/search' },
  { icon: '🛒', label: 'Cart',    path: '/cart' },
  { icon: '❤️', label: 'Wishlist', path: '/wishlist' },
  { icon: '👤', label: 'Profile', path: '/profile' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const cartCount = useCartStore(s => s.count());

  // Hide on admin, checkout, product detail CTA pages
  if (pathname.startsWith('/admin') || pathname.startsWith('/checkout')) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex justify-around items-center py-3 z-50"
      style={{
        background: 'rgba(13,13,18,0.97)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid var(--border-subtle)',
        paddingBottom: 'max(12px, env(safe-area-inset-bottom))',
      }}>
      {NAV_ITEMS.map(item => {
        const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
        return (
          <button key={item.label}
            onClick={() => router.push(item.path)}
            className="flex flex-col items-center gap-0.5 relative px-2">
            <span className="text-xl relative">
              {item.icon}
              {item.label === 'Cart' && cartCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                  style={{ background: 'var(--accent-gold)', color: '#000', fontSize: '9px' }}>
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </span>
            <span className="text-xs transition-colors"
              style={{ color: isActive ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
              {item.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                style={{ background: 'var(--accent-gold)' }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
