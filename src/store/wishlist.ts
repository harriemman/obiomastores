import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  image: string;
  brand?: string;
}

interface WishlistStore {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (id: string) => void;
  toggle: (item: WishlistItem) => void;
  has: (id: string) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => set(s => ({ items: s.items.find(i => i.id === item.id) ? s.items : [...s.items, item] })),
      remove: (id) => set(s => ({ items: s.items.filter(i => i.id !== id) })),
      toggle: (item) => get().has(item.id) ? get().remove(item.id) : get().add(item),
      has: (id) => get().items.some(i => i.id === id),
    }),
    { name: 'luxe-wishlist' }
  )
);
