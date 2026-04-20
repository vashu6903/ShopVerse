// ─── Wishlist.jsx ────────────────────────────────────────────────────────────
// The WISHLIST PAGE — shows all products the user has "liked" / saved.
//
// Features:
//   - Grid of wishlist items with product info
//   - "Add to Cart" button on each item
//   - "Remove" button to un-wishlist an item
//   - Star rating display
//   - Empty state when no items are saved
//   - Clickable images/titles linking to product detail page

// ─── Imports ────────────────────────────────────────────────────────────────

// Link → Navigate to product detail pages or products page
import { Link } from 'react-router-dom';

// motion → Entrance animations for each wishlist card
import { motion } from 'framer-motion';

// Icons for cart, trash, and heart
import { FiShoppingCart, FiTrash2, FiHeart } from 'react-icons/fi';

// useCart → Access wishlist data and cart functions
import useCart from '../../hooks/useCart';

// Helper functions for formatting
import { formatPrice, truncateText, getStarRating } from '../../utils/helpers';

// Star icons (filled, half, empty) for the rating display
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

import './Wishlist.css';

// ─── Wishlist Page Component ────────────────────────────────────────────────
const Wishlist = () => {
  // Get wishlist items and cart functions from context
  const { wishlistItems, removeFromWishlist, addToCart, isInCart } = useCart();

  return (
    <div className="page-wrapper" id="wishlist-page">
      <div className="container">

        {/* Page Header with entrance animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="section-title">My Wishlist</h1>
          <p className="section-subtitle">
            {/* Dynamic subtitle showing item count or empty message */}
            {wishlistItems.length > 0
              ? `${wishlistItems.length} saved item${wishlistItems.length !== 1 ? 's' : ''}`
              : 'Your wishlist is empty'}
          </p>
        </motion.div>

        {/* ─── Conditional: Empty or With Items ──────────────────── */}
        {wishlistItems.length === 0 ? (
          // ── Empty Wishlist State ──
          <div className="empty-state">
            <div className="empty-state-icon">💜</div>
            <h3 className="empty-state-title">No saved items</h3>
            <p className="empty-state-text">
              Start adding products to your wishlist to save them for later.
            </p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Browse Products
            </Link>
          </div>
        ) : (
          // ── Wishlist Grid ──
          <div className="wishlist-grid">
            {/* Loop through each wishlist item */}
            {wishlistItems.map((item, index) => {
              // Check if this item is already in the cart
              const inCart = isInCart(item.id);
              // Get star rating array for this item
              const stars = getStarRating(item.rating?.rate || 0);

              return (
                <motion.div
                  key={item.id}
                  className="wishlist-item glass-card"
                  initial={{ opacity: 0, y: 20 }}                // Start: invisible, below
                  animate={{ opacity: 1, y: 0 }}                 // Animate to: visible
                  transition={{ delay: index * 0.05 }}            // Stagger each card
                  id={`wishlist-item-${item.id}`}
                >
                  {/* ─── Product Image (clickable) ──────────────── */}
                  <Link to={`/products/${item.id}`} className="wishlist-image-wrapper">
                    <img src={item.image} alt={item.title} className="wishlist-image" />
                  </Link>

                  {/* ─── Product Info ───────────────────────────── */}
                  <div className="wishlist-info">
                    {/* Title (truncated to 60 chars, clickable) */}
                    <Link to={`/products/${item.id}`} className="wishlist-title">
                      {truncateText(item.title, 60)}
                    </Link>

                    {/* Category badge */}
                    <span className="badge badge-primary">{item.category}</span>

                    {/* Star rating */}
                    <div className="wishlist-rating">
                      <div className="stars">
                        {stars.map((star, i) => (
                          <span key={i} className="star-icon">
                            {star === 'full' ? <FaStar /> : star === 'half' ? <FaStarHalfAlt /> : <FaRegStar />}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Price */}
                    <span className="wishlist-price">{formatPrice(item.price)}</span>
                  </div>

                  {/* ─── Action Buttons ─────────────────────────── */}
                  <div className="wishlist-actions">
                    {/* Add to Cart button (changes if already in cart) */}
                    <button
                      className={`btn btn-sm ${inCart ? 'btn-success' : 'btn-primary'}`}
                      onClick={() => addToCart(item)}
                      id={`wl-add-cart-${item.id}`}
                    >
                      <FiShoppingCart />
                      {inCart ? 'In Cart' : 'Add to Cart'}
                    </button>

                    {/* Remove from wishlist button */}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => removeFromWishlist(item.id)}
                      id={`wl-remove-${item.id}`}
                    >
                      <FiTrash2 /> Remove
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
