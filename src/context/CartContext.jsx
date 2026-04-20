// ─── Imports ────────────────────────────────────────────────────────────────
// createContext  → Creates a "global store" that any component can access
// useState      → Lets us store and update data (like cart items) in the component
// useEffect     → Runs code when certain data changes (like saving to localStorage)
// useCallback   → Memorizes functions so they don't get recreated on every render
// useRef        → Holds a mutable value that persists across renders without causing re-renders
import { createContext, useState, useEffect, useCallback, useRef } from 'react';

// toast → Shows small notification pop-ups (success, error, info, etc.)
import { toast } from 'react-toastify';

// ─── Create the Context ─────────────────────────────────────────────────────
// Think of Context as a "shared storage box" that any component in the app
// can reach into and grab data from, without passing props manually.
export const CartContext = createContext();

// ─── CartProvider Component ─────────────────────────────────────────────────
// This component wraps the entire app and provides cart/wishlist data
// to all child components. Any component inside <CartProvider> can use
// the useCart() hook to access cart functions and data.
const CartProvider = ({ children }) => {

  // ─── State: Cart Items ──────────────────────────────────────────────────
  // useState with a function (lazy initializer) → runs only on first render.
  // It checks localStorage for previously saved cart items.
  // If found, it loads them; otherwise, starts with an empty array [].
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    return saved ? JSON.parse(saved) : [];
  });

  // ─── State: Wishlist Items ──────────────────────────────────────────────
  // Same pattern as cart — load wishlist from localStorage on first render.
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('wishlistItems');
    return saved ? JSON.parse(saved) : [];
  });

  // ─── Refs: Instant Access to Current State ──────────────────────────────
  // WHY REFS? In React's StrictMode (development), setState updater functions
  // run TWICE. If we put toast() inside an updater, it shows 2 pop-ups!
  //
  // Refs solve this: they always hold the latest value of our state.
  // We read from refs in our function body (which only runs ONCE per click),
  // so toast only fires once. The updater still handles the actual state change.
  const cartRef = useRef(cartItems);
  const wishlistRef = useRef(wishlistItems);

  // ─── Sync Cart to localStorage & Ref ────────────────────────────────────
  // Every time cartItems changes, this effect:
  //   1. Updates the ref so it always has the latest cart data
  //   2. Saves cart to localStorage so it persists across page refreshes
  useEffect(() => {
    cartRef.current = cartItems;
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]); // ← dependency array: runs only when cartItems changes

  // ─── Sync Wishlist to localStorage & Ref ────────────────────────────────
  // Same as above, but for wishlist items.
  useEffect(() => {
    wishlistRef.current = wishlistItems;
    localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  // ═══════════════════════════════════════════════════════════════════════════
  // CART FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Add to Cart ────────────────────────────────────────────────────────
  // Adds a product to the cart. If it's already there, increases its quantity.
  // `quantity` defaults to 1 if not specified.
  const addToCart = useCallback((product, quantity = 1) => {
    // Step 1: Check if product already exists in cart using the REF
    // (not inside setState, so this runs only ONCE per click)
    const existing = cartRef.current.find((item) => item.id === product.id);

    // Step 2: Update the cart state
    setCartItems((prev) => {
      // "prev" is the current array of cart items (provided by React)
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        // Product already in cart → increase its quantity
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Product is new → add it to the cart with the specified quantity
      // The spread (...) copies all product properties and adds a quantity field
      return [...prev, { ...product, quantity }];
    });

    // Step 3: Show a toast notification (placed OUTSIDE the updater
    // so it fires only once, even in StrictMode)
    if (existing) {
      toast.info(`Updated "${product.title}" quantity in cart`);
    } else {
      toast.success(`Added "${product.title}" to cart`);
    }
  }, []); // ← empty dependency array: function is created once and reused

  // ─── Remove from Cart ──────────────────────────────────────────────────
  // Removes a product from the cart by its ID.
  const removeFromCart = useCallback((productId) => {
    // Read from ref to get the item's title for the toast message
    const item = cartRef.current.find((i) => i.id === productId);

    // Filter out the item with the matching ID (keeps everything else)
    setCartItems((prev) => prev.filter((item) => item.id !== productId));

    // Show removal notification
    if (item) {
      toast.warn(`Removed "${item.title}" from cart`);
    }
  }, []);

  // ─── Update Quantity ───────────────────────────────────────────────────
  // Changes the quantity of a specific item in the cart.
  // Won't allow quantity below 1.
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return; // Guard: don't allow 0 or negative quantities

    setCartItems((prev) =>
      prev.map((item) =>
        // Find the matching item and update its quantity; leave others unchanged
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  // ─── Clear Cart ────────────────────────────────────────────────────────
  // Empties the entire cart by setting it to an empty array.
  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.info('Cart cleared');
  }, []);

  // ─── Get Cart Total Price ──────────────────────────────────────────────
  // Calculates the total price of all items in the cart.
  // reduce() loops through each item and accumulates: price × quantity
  const getCartTotal = useCallback(() => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0 // ← starting value for the total
    );
  }, [cartItems]); // ← recalculates when cartItems changes

  // ─── Get Cart Item Count ──────────────────────────────────────────────
  // Returns the total number of items (including quantities) in the cart.
  // Example: 2 shirts + 3 pants = 5 total items
  const getCartCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  // ═══════════════════════════════════════════════════════════════════════════
  // WISHLIST FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════════════

  // ─── Add to Wishlist ───────────────────────────────────────────────────
  // Adds a product to the wishlist. If already there, shows an info message.
  const addToWishlist = useCallback((product) => {
    // Check if product is already in wishlist using the REF
    const alreadyExists = wishlistRef.current.some((item) => item.id === product.id);

    // If already wishlisted, just notify the user and stop
    if (alreadyExists) {
      toast.info('Already in wishlist');
      return; // ← early return: don't add again
    }

    // Add product to wishlist
    setWishlistItems((prev) => {
      // Double-check inside updater (safety net for race conditions)
      if (prev.find((item) => item.id === product.id)) {
        return prev; // already exists, return unchanged array
      }
      return [...prev, product]; // add new product to end of array
    });

    toast.success(`Added "${product.title}" to wishlist`);
  }, []);

  // ─── Remove from Wishlist ──────────────────────────────────────────────
  // Removes a product from the wishlist by its ID.
  const removeFromWishlist = useCallback((productId) => {
    // Read item details from ref for the toast message
    const item = wishlistRef.current.find((i) => i.id === productId);

    // Filter out the item (keep everything except the matching ID)
    setWishlistItems((prev) => prev.filter((item) => item.id !== productId));

    if (item) {
      toast.warn(`Removed "${item.title}" from wishlist`);
    }
  }, []);

  // ─── Check if Product is in Wishlist ──────────────────────────────────
  // Returns true/false. Used by components to show filled/outline heart icon.
  // .some() returns true if at least one item matches the condition.
  const isInWishlist = useCallback(
    (productId) => {
      return wishlistItems.some((item) => item.id === productId);
    },
    [wishlistItems] // ← recalculates when wishlistItems changes
  );

  // ─── Check if Product is in Cart ──────────────────────────────────────
  // Returns true/false. Used by components to show "In Cart" vs "Add" button.
  const isInCart = useCallback(
    (productId) => {
      return cartItems.some((item) => item.id === productId);
    },
    [cartItems]
  );

  // ─── Provide Data to All Child Components ─────────────────────────────
  // The `value` object contains everything that child components can access
  // via the useCart() hook. Any component wrapped inside <CartProvider>
  // can call these functions or read this data.
  return (
    <CartContext.Provider
      value={{
        cartItems,          // Array of items in the cart
        wishlistItems,      // Array of items in the wishlist
        addToCart,           // Function to add a product to cart
        removeFromCart,      // Function to remove a product from cart
        updateQuantity,      // Function to change item quantity
        clearCart,           // Function to empty the entire cart
        getCartTotal,        // Function to get total price
        getCartCount,        // Function to get total item count
        addToWishlist,       // Function to add a product to wishlist
        removeFromWishlist,  // Function to remove from wishlist
        isInWishlist,        // Function to check if product is wishlisted
        isInCart,            // Function to check if product is in cart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
