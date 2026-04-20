// ─── useWishlist.js (Custom Hook) ───────────────────────────────────────────
// A convenience hook that provides ONLY wishlist-related data and functions.
// It's a subset of the full CartContext — useful when a component only
// needs wishlist features and doesn't care about the cart.
//
// USAGE:
//   const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();

// useContext → React hook to read data from a Context (shared store)
import { useContext } from 'react';

// CartContext → The shared store (contains both cart AND wishlist data)
import { CartContext } from '../context/CartContext';

const useWishlist = () => {
  // Destructure ONLY the wishlist-related values from the context
  // This keeps the component focused — it only gets what it needs
  const { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist } =
    useContext(CartContext);

  // Safety check: make sure this hook is used inside <CartProvider>
  if (!wishlistItems) {
    throw new Error('useWishlist must be used within a CartProvider');
  }

  // Return only wishlist-related data and functions
  return { wishlistItems, addToWishlist, removeFromWishlist, isInWishlist };
};

export default useWishlist;
