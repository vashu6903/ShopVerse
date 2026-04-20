// ─── CartItem.jsx ────────────────────────────────────────────────────────────
// Displays a SINGLE ITEM inside the shopping cart page.
// Each CartItem shows:
//   - Product image (clickable, links to product detail)
//   - Product title, category, and unit price
//   - Quantity controls (- and + buttons)
//   - Total price for this item (price × quantity)
//   - Remove button (trash icon) to delete from cart

// ─── Imports ────────────────────────────────────────────────────────────────

// Icons: minus, plus, trash can
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';

// Link → Makes the image/title clickable to navigate to product details
import { Link } from 'react-router-dom';

// motion → Adds animations (slide in/out when items are added/removed)
import { motion } from 'framer-motion';

// useCart → Access updateQuantity and removeFromCart functions
import useCart from '../../hooks/useCart';

// formatPrice → Format number as "$12.99"
import { formatPrice } from '../../utils/helpers';

import './CartItem.css';

// ─── CartItem Component ─────────────────────────────────────────────────────
// Props:
//   item → A cart item object: { id, title, image, price, quantity, category }
const CartItem = ({ item }) => {
  // Get cart functions from context
  const { updateQuantity, removeFromCart } = useCart();

  return (
    // motion.div → Adds smooth entrance/exit animations
    // layout → Enables automatic layout animations when items reorder
    <motion.div
      className="cart-item glass-card"
      layout                                    // Smooth layout transitions
      initial={{ opacity: 0, x: -20 }}          // Start: invisible, shifted left
      animate={{ opacity: 1, x: 0 }}            // Animate to: visible, normal position
      exit={{ opacity: 0, x: 20 }}              // On removal: fade out, shift right
      id={`cart-item-${item.id}`}
    >
      {/* ─── Product Image (clickable) ─────────────────────────── */}
      <Link to={`/products/${item.id}`} className="cart-item-image-wrapper">
        <img src={item.image} alt={item.title} className="cart-item-image" />
      </Link>

      {/* ─── Product Details ───────────────────────────────────── */}
      <div className="cart-item-details">
        {/* Product title (clickable link to detail page) */}
        <Link to={`/products/${item.id}`} className="cart-item-title">
          {item.title}
        </Link>
        {/* Category badge */}
        <span className="cart-item-category badge badge-primary">{item.category}</span>
        {/* Price per unit */}
        <span className="cart-item-unit-price">{formatPrice(item.price)} each</span>
      </div>

      {/* ─── Actions: Quantity Controls, Total, Remove ─────────── */}
      <div className="cart-item-actions">

        {/* Quantity control: [ - ] 2 [ + ] */}
        <div className="quantity-control">
          {/* Decrease quantity button */}
          <button
            className="qty-btn"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}  // Can't go below 1
            id={`qty-minus-${item.id}`}
          >
            <FiMinus />
          </button>

          {/* Current quantity display */}
          <span className="qty-value">{item.quantity}</span>

          {/* Increase quantity button */}
          <button
            className="qty-btn"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            id={`qty-plus-${item.id}`}
          >
            <FiPlus />
          </button>
        </div>

        {/* Total price for this line item (price × quantity) */}
        <span className="cart-item-total">{formatPrice(item.price * item.quantity)}</span>

        {/* Remove from cart button (trash icon) */}
        <button
          className="cart-item-remove"
          onClick={() => removeFromCart(item.id)}
          id={`remove-cart-${item.id}`}
        >
          <FiTrash2 />
        </button>
      </div>
    </motion.div>
  );
};

export default CartItem;
