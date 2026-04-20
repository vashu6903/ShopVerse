// ─── useCart.js (Custom Hook) ────────────────────────────────────────────────
// This is a CUSTOM HOOK — a reusable function that lets any component
// access the cart and wishlist data from CartContext.
//
// Instead of writing useContext(CartContext) in every component,
// we just call useCart() — it's cleaner and shorter.
//
// USAGE IN A COMPONENT:
//   const { addToCart, cartItems, getCartCount } = useCart();

// useContext → React hook that reads data from a Context (shared store)
import { useContext } from 'react';

// CartContext → The shared store we created in CartContext.jsx
import { CartContext } from '../context/CartContext';

const useCart = () => {
  // Read the current value from CartContext
  // This gives us access to: cartItems, addToCart, removeFromCart, etc.
  const context = useContext(CartContext);

  // Safety check: if someone uses useCart() outside of <CartProvider>,
  // throw a helpful error instead of silently failing
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  // Return the context object so components can destructure what they need
  // Example: const { addToCart, isInCart } = useCart();
  return context;
};

export default useCart;
