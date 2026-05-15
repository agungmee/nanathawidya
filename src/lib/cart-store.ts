import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

function cartItemKey(item: { productId: string; variant?: string }): string {
  return item.variant ? `${item.productId}::${item.variant}` : item.productId;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items;
        const key = cartItemKey(item);
        const existing = items.find((i) => cartItemKey(i) === key);
        if (existing) {
          set({
            items: items.map((i) =>
              cartItemKey(i) === key
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (productId, variant) => {
        const key = variant ? `${productId}::${variant}` : productId;
        set({ items: get().items.filter((i) => cartItemKey(i) !== key) });
      },

      updateQuantity: (productId, quantity, variant) => {
        const key = variant ? `${productId}::${variant}` : productId;
        set({
          items: get().items.map((i) =>
            cartItemKey(i) === key ? { ...i, quantity: Math.max(1, quantity) } : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: "nanathawidya-cart",
      partialize: (state) => ({ items: state.items }),
    }
  )
);
