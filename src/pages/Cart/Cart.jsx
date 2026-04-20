// ─── Cart.jsx ────────────────────────────────────────────────────────────────
// The SHOPPING CART PAGE — shows all items the user has added to their cart.
//
// Features:
//   - List of cart items (with quantity controls and remove buttons)
//   - Order summary sidebar (subtotal, tax, shipping, total)
//   - Free shipping notification (when subtotal > $50)
//   - "Clear All" button to empty the entire cart
//   - "Proceed to Checkout" link
//   - Empty state with a link to start shopping

// ─── Imports ────────────────────────────────────────────────────────────────

// Link → Navigate to checkout or continue shopping pages
import { Link } from 'react-router-dom';

// motion → Entrance animations for the page
// AnimatePresence → Handles exit animations when cart items are removed
import { motion, AnimatePresence } from 'framer-motion';

// Icons for buttons and empty state
import { FiShoppingCart, FiTrash2, FiShoppingBag } from 'react-icons/fi';

// CartItem → Component that renders a single cart item row
import CartItem from '../../components/CartItem/CartItem';

// useCart → Access cart data and functions from context
import useCart from '../../hooks/useCart';

// Helper functions for price calculations
import { formatPrice, calculateTax, calculateTotal } from '../../utils/helpers';

import './Cart.css';

// ─── Cart Page Component ────────────────────────────────────────────────────
const Cart = () => {
  // Get cart data and functions from context
  const { cartItems, clearCart, getCartTotal } = useCart();

  // ─── Calculate Order Summary ──────────────────────────────────────────
  const subtotal = getCartTotal();                  // Sum of (price × quantity) for all items
  const tax = calculateTax(subtotal);               // 8% tax
  const shipping = subtotal > 50 ? 0 : 5.99;       // Free shipping on orders over $50
  const total = calculateTotal(subtotal, tax, shipping); // Final total

  return (
    <div className="page-wrapper" id="cart-page">
      <div className="container">

        {/* Page Header with animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="section-title">Shopping Cart</h1>
          <p className="section-subtitle">
            {/* Dynamic subtitle: "You have 3 items" or "Your cart is empty" */}
            {cartItems.length > 0
              ? `You have ${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} in your cart`
              : 'Your cart is empty'}
          </p>
        </motion.div>

        {/* ─── Conditional Rendering ─────────────────────────────── */}
        {/* Show empty state OR cart contents based on whether cart has items */}
        {cartItems.length === 0 ? (
          // ── Empty Cart State ──
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3 className="empty-state-title">Your cart is empty</h3>
            <p className="empty-state-text">
              Looks like you haven't added any products yet. Start browsing to find something you love!
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              <FiShoppingBag /> Start Shopping
            </Link>
          </div>
        ) : (
          // ── Cart with Items ──
          <div className="cart-layout">

            {/* ─── Left: Cart Items List ─────────────────────────── */}
            <div className="cart-items-section">
              <div className="cart-items-header">
                <h3 className="cart-items-count">{cartItems.length} Items</h3>
                {/* Button to remove ALL items from cart */}
                <button className="btn btn-sm btn-danger" onClick={clearCart} id="clear-cart-btn">
                  <FiTrash2 /> Clear All
                </button>
              </div>

              {/* AnimatePresence → Enables exit animations when items are removed */}
              <AnimatePresence>
                {/* Render a CartItem component for each item in the cart */}
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </AnimatePresence>
            </div>

            {/* ─── Right: Order Summary Sidebar ──────────────────── */}
            <motion.div
              className="cart-summary glass-card"
              initial={{ opacity: 0, x: 20 }}      // Start: invisible, shifted right
              animate={{ opacity: 1, x: 0 }}        // Slide in from the right
              transition={{ delay: 0.2 }}
            >
              <h3 className="summary-title">Order Summary</h3>

              <div className="summary-rows">
                {/* Subtotal row */}
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>

                {/* Tax row */}
                <div className="summary-row">
                  <span>Tax (8%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>

                {/* Shipping row */}
                <div className="summary-row">
                  <span>Shipping</span>
                  {/* Show "FREE" if shipping is 0, otherwise show the price */}
                  <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>

                {/* Free shipping celebration message */}
                {shipping === 0 && (
                  <div className="summary-free-shipping">
                    🎉 You qualify for free shipping!
                  </div>
                )}

                <div className="summary-divider"></div>

                {/* Total row (bold) */}
                <div className="summary-row summary-total">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout button */}
              <Link to="/checkout" className="btn btn-primary btn-lg cart-checkout-btn" id="checkout-btn">
                Proceed to Checkout
              </Link>

              {/* Continue shopping link */}
              <Link to="/products" className="btn btn-secondary cart-continue-btn" id="continue-shopping-btn">
                <FiShoppingBag /> Continue Shopping
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
