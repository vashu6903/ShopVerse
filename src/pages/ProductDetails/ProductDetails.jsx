// ─── ProductDetails.jsx ──────────────────────────────────────────────────────
// The PRODUCT DETAIL PAGE — shows full information about a single product.
// Users reach this page by clicking a product card (URL: /products/:id).
//
// Features:
//   - Large product image with thumbnail previews
//   - Full title, description, category, rating, and price
//   - Quantity selector (- and + buttons)
//   - "Add to Cart" and "Add to Wishlist" buttons
//   - Back button to return to the Products page
//   - Loading spinner and error handling

// ─── Imports ────────────────────────────────────────────────────────────────

// useState  → Store product data, loading state, quantity
// useEffect → Fetch product data when the page loads
import { useState, useEffect } from 'react';

// useParams → Read the :id from the URL (e.g., /products/5 → id = "5")
// Link      → Navigate without page refresh
import { useParams, Link } from 'react-router-dom';

// motion → Entrance animation for the product detail card
import { motion } from 'framer-motion';

// Icons for buttons and UI elements
import { FiShoppingCart, FiHeart, FiArrowLeft, FiStar, FiMinus, FiPlus } from 'react-icons/fi';
import { FaHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

// API function to fetch a single product by ID
import { fetchProductById } from '../../services/api';

// Custom hook for cart/wishlist operations
import useCart from '../../hooks/useCart';

// Helper functions for price formatting and star rating
import { formatPrice, getStarRating } from '../../utils/helpers';

import './ProductDetails.css';

// ─── ProductDetails Component ───────────────────────────────────────────────
const ProductDetails = () => {
  // ─── Read Product ID from URL ───────────────────────────────────────────
  // If the URL is /products/5, then id = "5"
  const { id } = useParams();

  // ─── State ──────────────────────────────────────────────────────────────
  const [product, setProduct] = useState(null);    // The product data (null = not loaded yet)
  const [loading, setLoading] = useState(true);    // Loading spinner
  const [error, setError] = useState(null);        // Error message
  const [quantity, setQuantity] = useState(1);     // Selected quantity (default: 1)

  // Get cart/wishlist functions from context
  const { addToCart, isInCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();

  // ─── Fetch Product Data ─────────────────────────────────────────────────
  // Runs when the component mounts or when the id in the URL changes
  useEffect(() => {
    // AbortController → Cancel the fetch if the user navigates away
    // This prevents "network error" messages from orphaned requests
    const controller = new AbortController();

    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        // Fetch product data from the API, passing the abort signal
        const data = await fetchProductById(id, controller.signal);
        // Only update state if the request wasn't cancelled
        if (!controller.signal.aborted) {
          setProduct(data);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          setError('Failed to load product details');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    loadProduct();
    window.scrollTo(0, 0); // Scroll to the top of the page

    // Cleanup: cancel the fetch if the component unmounts
    return () => controller.abort();
  }, [id]); // ← Re-run when the product id changes

  // ─── Loading State ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="loader-container">
            <div className="loader"></div>
            <span className="loader-text">Loading product details...</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────────
  if (error || !product) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error || 'Product not found'}</p>
            <Link to="/products" className="btn btn-primary">
              <FiArrowLeft /> Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Derived Values ────────────────────────────────────────────────────
  // Check if this product is in wishlist/cart (returns true/false)
  const inWishlist = isInWishlist(product.id);
  const inCart = isInCart(product.id);
  // Convert numeric rating to star icons array
  const stars = getStarRating(product.rating?.rate || 0);

  // ─── Event Handlers ────────────────────────────────────────────────────

  // Add product to cart with the selected quantity
  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  // Toggle wishlist: add if not in wishlist, remove if already in wishlist
  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  // ─── Main Content ─────────────────────────────────────────────────────
  return (
    <div className="page-wrapper" id="product-details-page">
      <div className="container">
        {/* Back navigation link */}
        <Link to="/products" className="back-link" id="back-to-products">
          <FiArrowLeft /> Back to Products
        </Link>

        {/* Product detail card with entrance animation */}
        <motion.div
          className="product-detail glass-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ─── Left Side: Product Images ──────────────────────── */}
          <div className="pd-image-section">
            {/* Main product image */}
            <div className="pd-image-main">
              <img src={product.image} alt={product.title} className="pd-image" />
            </div>
            {/* Thumbnail previews (showing same image 3 times as placeholder) */}
            <div className="pd-image-thumbs">
              {[1, 2, 3].map((i) => (
                <div key={i} className="pd-thumb active">
                  <img src={product.image} alt={`View ${i}`} />
                </div>
              ))}
            </div>
          </div>

          {/* ─── Right Side: Product Information ────────────────── */}
          <div className="pd-info-section">
            {/* Category badge */}
            <span className="badge badge-primary">{product.category}</span>

            {/* Product title */}
            <h1 className="pd-title">{product.title}</h1>

            {/* Star rating */}
            <div className="pd-rating">
              <div className="stars">
                {stars.map((star, i) => (
                  <span key={i} className="star-icon star-lg">
                    {star === 'full' ? <FaStar /> : star === 'half' ? <FaStarHalfAlt /> : <FaRegStar />}
                  </span>
                ))}
              </div>
              <span className="pd-rating-text">
                {product.rating?.rate} ({product.rating?.count} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="pd-price">{formatPrice(product.price)}</div>

            {/* Description */}
            <p className="pd-description">{product.description}</p>

            {/* ─── Quantity Selector ───────────────────────────── */}
            <div className="pd-quantity">
              <span className="pd-qty-label">Quantity</span>
              <div className="quantity-control">
                {/* Decrease button (min 1) */}
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span className="qty-value">{quantity}</span>
                {/* Increase button */}
                <button
                  className="qty-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <FiPlus />
                </button>
              </div>
            </div>

            {/* ─── Action Buttons (Add to Cart / Wishlist) ─────── */}
            <div className="pd-actions">
              {/* Add to Cart button — changes style when already in cart */}
              <button
                className={`btn btn-lg ${inCart ? 'btn-success' : 'btn-primary'}`}
                onClick={handleAddToCart}
                id="pd-add-to-cart"
              >
                <FiShoppingCart />
                {inCart ? 'Added to Cart' : 'Add to Cart'}
              </button>

              {/* Wishlist toggle button — changes icon when wishlisted */}
              <button
                className={`btn btn-icon btn-lg ${inWishlist ? 'btn-accent' : 'btn-secondary'}`}
                onClick={handleWishlist}
                id="pd-wishlist-btn"
              >
                {inWishlist ? <FaHeart /> : <FiHeart />}
              </button>
            </div>

            {/* ─── Extra Info (Shipping, Returns) ──────────────── */}
            <div className="pd-meta">
              <div className="pd-meta-item">
                <span className="pd-meta-label">Free shipping</span>
                <span className="pd-meta-value">On orders over $50</span>
              </div>
              <div className="pd-meta-item">
                <span className="pd-meta-label">Returns</span>
                <span className="pd-meta-value">30-day easy returns</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
