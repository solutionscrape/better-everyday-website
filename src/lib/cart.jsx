import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);
const KEY = 'be-cart-v1';

function load() {
  try {
    const v = JSON.parse(window.localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(load);
  const [open, setOpen] = useState(false);
  // 'cart' | 'details' | 'done'
  const [step, setStep] = useState('cart');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    try { window.localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* storage unavailable */ }
  }, [lines]);

  const add = useCallback((item) => {
    const key = item.id + '|' + (item.size || '');
    setLines((ls) => (ls.some((l) => l.key === key) ? ls.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)) : [...ls, { ...item, key, qty: 1 }]));
    setStep('cart');
  }, []);

  const setQty = useCallback((key, delta) => {
    setLines((ls) => ls.map((l) => (l.key === key ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0));
  }, []);

  const value = useMemo(() => {
    const count = lines.reduce((n, l) => n + l.qty, 0);
    const total = lines.reduce((n, l) => n + l.qty * l.price, 0);
    return {
      lines, count, total, open, step, order, add, setQty, setStep,
      has: (id) => lines.some((l) => l.id === id),
      openCart: () => { setOpen(true); setStep((s) => (s === 'done' ? 'cart' : s)); },
      closeCart: () => { setOpen(false); setStep((s) => (s === 'done' ? 'cart' : s)); },
      complete: (o) => { setOrder(o); setLines([]); setStep('done'); },
    };
  }, [lines, open, step, order, add, setQty]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
