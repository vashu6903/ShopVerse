// ─── Home.jsx ────────────────────────────────────────────────────────────────
// The LANDING PAGE (homepage) of the ShopVerse app.
// This is the first page users see when they visit the site.
//
// It consists of 5 sections:
//   1. Hero Section    → Eye-catching banner with CTA buttons
//   2. Features Strip  → Icons showing benefits (free shipping, secure payment, etc.)
//   3. Categories      → Browse products by category (cards with emojis)
//   4. Featured Products → Top-rated products displayed in a grid
//   5. CTA Section     → "Ready to shop?" call-to-action banner

// ─── Imports ────────────────────────────────────────────────────────────────

// useEffect → Run code after render (sort products by rating)
// useState  → Store the featured products list
import { useEffect, useState } from 'react';

// Link → Navigate to other pages without page refresh
import { Link } from 'react-router-dom';

// motion → Add entrance animations (fade, slide, scale) to sections
import { motion } from 'framer-motion';

// Icons from Feather Icons set
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';

// Swiper → Image/card carousel (imported but used for potential hero slideshow)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

// ProductCard → Reusable card component for displaying products
import ProductCard from '../../components/ProductCard/ProductCard';

// useProducts → Custom hook to fetch all products and categories from the API
import useProducts from '../../hooks/useProducts';

import './Home.css';

// ─── Home Page Component ────────────────────────────────────────────────────
const Home = () => {
  // Fetch products and categories from the API
  // loading = true while fetching, error = error message if fetch fails
  const { products, categories, loading, error } = useProducts();

  // State for the top-rated products (sorted by rating, top 8)
  const [featured, setFeatured] = useState([]);

  // ─── Sort Products by Rating ────────────────────────────────────────────
  // When products are loaded, sort them by rating (highest first)
  // and pick the top 8 as "featured" products
  useEffect(() => {
    if (products.length > 0) {
      // Create a copy with [...products] (don't mutate the original array)
      // Sort by rating in descending order (b - a = highest first)
      // ?. (optional chaining) prevents errors if rating is undefined
      const sorted = [...products].sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
      setFeatured(sorted.slice(0, 8)); // Take the first 8 (top rated)
    }
  }, [products]); // Re-run when products data changes

  // ─── Feature Icons Data ─────────────────────────────────────────────────
  // Array of objects for the "features strip" section
  const features = [
    { icon: <FiTruck />, title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: <FiShield />, title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: <FiShoppingBag />, title: 'Best Deals', desc: 'Exclusive online offers' },
  ];

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="home-page" id="home-page">

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 1: HERO BANNER                                            */}
      {/* The big eye-catching section at the top with headline and buttons  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="hero" id="hero-section">
        <div className="container hero-content">

          {/* Left side: Text content with animation */}
          <motion.div
            className="hero-text"
            initial={{ opacity: 0, x: -50 }}       // Start: invisible, shifted left
            animate={{ opacity: 1, x: 0 }}         // End: visible, normal position
            transition={{ duration: 0.7-0 }}        // Animation duration
          >
            <span className="hero-badge badge badge-accent">✨ New Collection 2026</span>
            <h1 className="hero-title">
              Discover <span className="hero-highlight">Premium</span> Products
            </h1>
            <p className="hero-subtitle">
              Explore thousands of products from top brands. Find the best deals, exclusive collections, and trending items — all in one place.
            </p>

            {/* Call-to-action buttons */}
            <div className="hero-actions">
              <Link to="/products" className="btn btn-primary btn-lg" id="hero-shop-btn">
                Shop Now <FiArrowRight />
              </Link>
              <Link to="/products" className="btn btn-secondary btn-lg" id="hero-explore-btn">
                Explore Categories
              </Link>
            </div>
          </motion.div>

          {/* Right side: Floating product images with scale animation */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}  // Slight delay after text
          >
            <div className="hero-glow"></div> {/* Decorative glow effect */}
            <div className="hero-card-stack">
              {/* Show the first 3 products as floating preview cards */}
              {products.slice(0, 3).map((p, i) => (
                <div key={p.id} className={`hero-floating-card hero-fc-${i}`}>
                  <img src={p.image} alt={p.title} />
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 2: FEATURES STRIP                                         */}
      {/* Icons showing store benefits (shipping, security, returns, deals)  */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="features-strip">
        <div className="container features-grid">
          {features.map((f, i) => (
            <motion.div
              key={i}
              className="feature-item glass-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}   // Animate when scrolled into view
              viewport={{ once: true }}              // Only animate once (not every scroll)
              transition={{ delay: i * 0.1 }}        // Stagger: each card appears slightly after the previous
            >
              <div className="feature-icon">{f.icon}</div>
              <div>
                <h4 className="feature-title">{f.title}</h4>
                <p className="feature-desc">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 3: BROWSE CATEGORIES                                      */}
      {/* Category cards that link to the Products page with a filter        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="home-categories" id="categories-section">
        <div className="container">
          <h2 className="section-title">Browse Categories</h2>
          <p className="section-subtitle">Find your perfect product from our curated categories</p>

          <div className="categories-grid">
            {categories.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {/* Each card links to /products?category=xxx (pre-filtered) */}
                <Link to={`/products?category=${cat}`} className="category-card glass-card" id={`cat-${cat}`}>
                  {/* Emoji based on category name */}
                  <span className="category-emoji">
                    {cat === 'electronics' ? '💻' : cat === 'jewelery' ? '💎' : cat === "men's clothing" ? '👔' : '👗'}
                  </span>
                  {/* Capitalize category name */}
                  <h3 className="category-name">{cat.charAt(0).toUpperCase() + cat.slice(1)}</h3>
                  {/* Count how many products belong to this category */}
                  <span className="category-count">
                    {products.filter(p => p.category === cat).length} items
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 4: TOP RATED / FEATURED PRODUCTS                          */}
      {/* Grid of the 8 highest-rated products                              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="home-featured" id="featured-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Top Rated Products</h2>
              <p className="section-subtitle">Handpicked by our customers</p>
            </div>
            <Link to="/products" className="btn btn-secondary" id="view-all-btn">
              View All <FiArrowRight />
            </Link>
          </div>

          {/* Conditional rendering: show loader, error, or product grid */}
          {loading ? (
            // Still fetching data → show spinner
            <div className="loader-container">
              <div className="loader"></div>
              <span className="loader-text">Loading products...</span>
            </div>
          ) : error ? (
            // Fetch failed → show error message
            <div className="error-container">
              <span className="error-icon">⚠️</span>
              <p className="error-message">{error}</p>
            </div>
          ) : (
            // Data loaded → show featured product cards
            <div className="product-grid" id="featured-grid">
              {featured.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* SECTION 5: CALL TO ACTION (CTA)                                   */}
      {/* A banner encouraging users to start shopping                      */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="home-cta" id="cta-section">
        <div className="container">
          <motion.div
            className="cta-card glass-card"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="cta-title">Ready to start shopping?</h2>
            <p className="cta-text">Browse our complete collection and find your perfect products today.</p>
            <Link to="/products" className="btn btn-accent btn-lg" id="cta-btn">
              Explore All Products <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
