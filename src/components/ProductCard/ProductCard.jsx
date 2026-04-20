// ─── ProductCard.jsx ─────────────────────────────────────────────────────────
// A REUSABLE CARD component that displays a single product's info.
// Used in the product grid on the Home page and Products page.
//
// Each card shows:
//   - Product image with wishlist heart button
//   - Category badge
//   - Product title (truncated if too long)
//   - Star rating
//   - Price and Add to Cart button
//
// The entire card is clickable and links to the product's detail page.

// ─── Imports ────────────────────────────────────────────────────────────────

// Link → Makes the whole card clickable, navigating to /products/:id
import { Link } from 'react-router-dom';

// Icons: outline icons (Fi prefix) and filled icons (Fa prefix)
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// motion → Adds entrance animation (fade in + slide up)
import { motion } from 'framer-motion';

// useCart → Access cart/wishlist functions from the shared context
import useCart from '../../hooks/useCart';

// Helper functions for formatting and display
import { formatPrice, truncateText, getStarRating } from '../../utils/helpers';

import './ProductCard.css';

// ─── ProductCard Component ──────────────────────────────────────────────────
// Props:
//   product → The product object { id, title, price, image, category, rating }
//   index   → Position in the grid (used to stagger animations)
const ProductCard = ({ product, index = 0 }) => {
  // Get cart/wishlist functions from context
  const { addToCart, isInCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  // Check if this product is already in wishlist/cart
  // These return true or false (boolean values)
  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);

  // ─── Event Handlers ─────────────────────────────────────────────────────

  // Toggle wishlist: add if not in wishlist, remove if already in wishlist
  const handleWishlist = (e) => {
    e.preventDefault();      // Prevent the Link from navigating
    e.stopPropagation();     // Prevent the click from bubbling up to parent elements
    if (inWishlist) {
      removeFromWishlist(product.id);  // Already wishlisted → remove it
    } else {
      addToWishlist(product);          // Not wishlisted → add it
    }
  };

  // Add product to cart (quantity defaults to 1)
  const handleAddToCart = (e) => {
    e.preventDefault();      // Prevent the Link from navigating
    e.stopPropagation();     // Prevent click bubbling
    addToCart(product);      // Add this product to the cart
  };

  // Convert numeric rating to array of star types for rendering
  // e.g., 3.5 → ['full', 'full', 'full', 'half', 'empty']
  // The ?. (optional chaining) prevents errors if rating is undefined
  const stars = getStarRating(product.rating?.rate || 0);

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    // motion.div → Animated wrapper
    // Each card fades in and slides up, with a small delay based on its position
    <motion.div
      initial={{ opacity: 0, y: 30 }}                    // Start: invisible, 30px below
      animate={{ opacity: 1, y: 0 }}                     // End: visible, normal position
      transition={{ duration: 0.4, delay: index * 0.05 }} // Staggered delay per card
    >
      {/* The entire card is a Link to the product's detail page */}
      <Link to={`/products/${product.id}`} className="product-card glass-card" id={`product-card-${product.id}`}>

        {/* ─── Image Section ──────────────────────────────────────── */}
        <div className="product-card-image-wrapper">
          {/* loading="lazy" → Browser only loads image when it's about to appear on screen */}
          <img src={product.image} alt={product.title} className="product-card-image" loading="lazy" />

          {/* Wishlist heart button (positioned over the image) */}
          <button
            className={`product-wishlist-btn ${inWishlist ? 'wishlisted' : ''}`}
            onClick={handleWishlist}
            id={`wishlist-btn-${product.id}`}
          >
            {/* Show filled heart if wishlisted, outline heart if not */}
            {inWishlist ? <FaHeart /> : <FiHeart />}
          </button>

          {/* Category badge (e.g., "electronics", "beauty") */}
          <span className="badge badge-primary product-category-badge">
            {product.category}
          </span>
        </div>

        {/* ─── Card Body (Title, Rating, Price) ───────────────────── */}
        <div className="product-card-body">
          {/* Product title (cut to 50 characters max) */}
          <h3 className="product-card-title">{truncateText(product.title, 50)}</h3>

          {/* Star rating display */}
          <div className="product-card-rating">
            <div className="stars">
              {/* Loop through stars array and render the appropriate icon */}
              {stars.map((star, i) => (
                <span key={i} className="star-icon">
                  {/* Ternary chain: full → ★, half → ½★, empty → ☆ */}
                  {star === 'full' ? <FaStar /> : star === 'half' ? <FaStarHalfAlt /> : <FaRegStar />}
                </span>
              ))}
            </div>
            {/* Review count in parentheses */}
            <span className="rating-count">({product.rating?.count || 0})</span>
          </div>

          {/* ─── Footer: Price + Add to Cart Button ───────────────── */}
          <div className="product-card-footer">
            <span className="product-card-price">{formatPrice(product.price)}</span>
            <button
              // Change button style based on whether item is already in cart
              className={`btn btn-sm ${inCart ? 'btn-success' : 'btn-primary'}`}
              onClick={handleAddToCart}
              id={`add-cart-btn-${product.id}`}
            >
              <FiShoppingCart />
              {inCart ? 'In Cart' : 'Add'}  {/* Button text changes based on cart state */}
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
