import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(null);

// ── Mock logged-in user ───────────────────────────────────────
const MOCK_USER = {
  firstName:   'Kobe',
  middleName:  'Bean',
  lastName:    'Bryant',
  extension:   '',
  email:       'kbbryant@email.com',
  mobile:      '+63 917 123 4567',
  address: {
    street:    '123 Tomas Morato Street',
    barangay:  'Barangay Uno',
    city:      'Quezon City',
    province:  'Metro Manila',
    region:    'National Capital Region (NCR)',
    zip:       '1100',
  },
  joinDate: '2025-01-15',
  avatar: null,
};

export function AppProvider({ children }) {
  // ── Auth state ─────────────────────────────────────────────
  const [user, setUser]         = useState(null);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // ── Cart state ─────────────────────────────────────────────
  const [cartItems, setCartItems] = useState([]);

  // ── Toast notifications ────────────────────────────────────
  const [toasts, setToasts] = useState([]);

  // Rehydrate from sessionStorage on mount (simulated persistence)
  useEffect(() => {
    const saved = sessionStorage.getItem('cf_user');
    if (saved) setUser(JSON.parse(saved));
    const savedCart = sessionStorage.getItem('cf_cart');
    if (savedCart) setCartItems(JSON.parse(savedCart));
    setIsAuthChecked(true);
  }, []);

  useEffect(() => {
    if (user)      sessionStorage.setItem('cf_user', JSON.stringify(user));
    else           sessionStorage.removeItem('cf_user');
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem('cf_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // ── Toast helpers ──────────────────────────────────────────
  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // ── Auth helpers ───────────────────────────────────────────
  const login = useCallback(async (email, password) => {
    // Simulated async auth
    await new Promise(r => setTimeout(r, 800));
    // Accept any non-empty creds, but demo shows the mock user for demo@cocofiber.ph / password
    if (!email || !password) throw new Error('Please fill in all fields.');
    setUser(MOCK_USER);
    showToast(`Welcome back, ${MOCK_USER.firstName}! 🌴`, 'success');
    return MOCK_USER;
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    setCartItems([]);
    showToast('You have been signed out.', 'info');
  }, [showToast]);

  const register = useCallback(async (data) => {
    await new Promise(r => setTimeout(r, 1000));
    const newUser = { ...MOCK_USER, ...data };
    setUser(newUser);
    showToast(`Account created! Welcome, ${data.firstName}! 🎉`, 'success');
    return newUser;
  }, [showToast]);

  const updateProfile = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
    showToast('Profile updated successfully!', 'success');
  }, [showToast]);

  // ── Cart helpers ───────────────────────────────────────────
  const addToCart = useCallback((product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        return prev.map(i =>
          i.id === product.id
            ? { ...i, qty: Math.min(i.qty + qty, product.stock) }
            : i
        );
      }
      return [...prev, { ...product, qty }];
    });
    showToast(`"${product.name}" added to cart 🛒`, 'success');
  }, [showToast]);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(i => i.id !== productId));
    showToast('Item removed from cart.', 'info');
  }, [showToast]);

  const updateQty = useCallback((productId, qty) => {
    if (qty < 1) return;
    setCartItems(prev =>
      prev.map(i => i.id === productId ? { ...i, qty } : i)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Derived cart values
  const cartCount   = cartItems.reduce((s, i) => s + i.qty, 0);
  const cartSubtotal = cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <AppContext.Provider value={{
      // auth
      user, isAuthChecked,
      login, logout, register, updateProfile,
      // cart
      cartItems, cartCount, cartSubtotal,
      addToCart, removeFromCart, updateQty, clearCart,
      // toasts
      toasts, showToast, dismissToast,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
