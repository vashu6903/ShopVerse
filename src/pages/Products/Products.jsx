// ─── Products.jsx ────────────────────────────────────────────────────────────
// The PRODUCTS LISTING PAGE — shows all products with powerful filtering/sorting.
//
// Features:
//   1. Category tab buttons (quick filter at the top)
//   2. Search bar with debounce (waits for user to stop typing)
//   3. Dropdown filters (category, price range, sort order)
//   4. Product grid that updates in real-time based on filters
//   5. URL sync (selected category is saved in the URL query string)
//
// KEY CONCEPT: useMemo
//   The filtered/sorted products are computed using useMemo.
//   useMemo caches the result and only recalculates when the inputs change.
//   This prevents expensive filtering/sorting on every single re-render.

// ─── Imports ────────────────────────────────────────────────────────────────

// useState → Store filter values (search query, category, price range, sort)
// useMemo  → Cache the filtered products list (recalculate only when filters change)
import { useState, useMemo } from 'react';

// useSearchParams → Read/write URL query parameters (e.g., ?category=electronics)
import { useSearchParams } from 'react-router-dom';

// motion → Entrance animations for the page header
import { motion } from 'framer-motion';

// Custom hooks
import useProducts from '../../hooks/useProducts';   // Fetch products from API
import useDebounce from '../../hooks/useDebounce';    // Delay search input

// Components
import SearchBar from '../../components/SearchBar/SearchBar';
import Filters from '../../components/Filters/Filters';
import ProductGrid from '../../components/ProductGrid/ProductGrid';

// Helper function to convert price range string to min/max numbers
import { getPriceRange } from '../../utils/helpers';

import './Products.css';

// ─── Products Page Component ────────────────────────────────────────────────
const Products = () => {
  // ─── Data from API ──────────────────────────────────────────────────────
  const { products, categories, loading, error } = useProducts();

  // ─── URL Search Params ──────────────────────────────────────────────────
  // Read query params from the URL (e.g., /products?category=electronics)
  // This lets us pre-select a category when coming from a category card on Home page
  const [searchParams, setSearchParams] = useSearchParams();

  // ─── Filter State ──────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');                                     // What the user typed
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all'); // From URL or 'all'
  const [priceRange, setPriceRange] = useState('all');                                    // Price filter
  const [sortBy, setSortBy] = useState('default');                                        // Sort order

  // ─── Debounced Search ──────────────────────────────────────────────────
  // Wait 400ms after the user stops typing before filtering
  // This prevents the product list from flickering on every keystroke
  const debouncedSearch = useDebounce(searchQuery);

  // ─── Category Tabs ─────────────────────────────────────────────────────
  // Add 'all' as the first option, then spread the API categories
  const categoryTabs = ['all', ...categories];

  // ─── Filtered & Sorted Products (with Caching) ─────────────────────────
  // useMemo runs this filtering logic ONLY when one of the dependencies changes.
  // Without useMemo, this would run on EVERY render (even unrelated ones).
  const filteredProducts = useMemo(() => {
    // Start with a copy of all products
    let result = [...products];

    // ── Step 1: Filter by Category ──
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // ── Step 2: Filter by Search Query ──
    // Check if product title, description, or category contains the search text
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // ── Step 3: Filter by Price Range ──
    if (priceRange !== 'all') {
      const { min, max } = getPriceRange(priceRange); // Convert '50-100' → { min: 50, max: 100 }
      result = result.filter((p) => p.price >= min && p.price <= max);
    }

    // ── Step 4: Sort ──
    switch (sortBy) {
      case 'price-asc':   // Cheapest first
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':  // Most expensive first
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':      // Highest rated first
        result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
        break;
      case 'name':        // Alphabetical (A → Z)
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:            // No sorting (original order)
        break;
    }

    return result;
  }, [products, selectedCategory, debouncedSearch, priceRange, sortBy]);
  // ↑ Dependencies: only recalculate when any of these values change

  // ─── Category Change Handler ──────────────────────────────────────────
  // Updates both the state AND the URL query parameter
  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      searchParams.delete('category');      // Remove ?category from URL
    } else {
      searchParams.set('category', cat);    // Set ?category=electronics in URL
    }
    setSearchParams(searchParams);          // Apply the URL change
  };

  // ─── Loading State ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="loader-container">
            <div className="loader"></div>
            <span className="loader-text">Loading products...</span>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error State ──────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="error-container">
            <span className="error-icon">⚠️</span>
            <p className="error-message">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main Content ─────────────────────────────────────────────────────
  return (
    <div className="page-wrapper" id="products-page">
      <div className="container">

        {/* Page Title with entrance animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="section-title">All Products</h1>
          <p className="section-subtitle">Discover our complete collection</p>
        </motion.div>

        {/* ─── Category Tab Buttons ──────────────────────────────── */}
        {/* Quick-filter buttons at the top for each category */}
        <div className="category-tabs" id="category-tabs">
          {categoryTabs.map((cat) => (
            <button
              key={cat}
              // Add 'active' class to the currently selected tab
              className={`category-tab ${selectedCategory === cat ? 'category-tab-active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
              id={`tab-${cat}`}
            >
              {/* Display "All Products" for 'all', capitalize others */}
              {cat === 'all' ? 'All Products' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* ─── Search Bar + Product Count ─────────────────────────── */}
        <div className="products-toolbar">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <span className="products-count">
            {/* Show count like "12 products" or "1 product" (singular/plural) */}
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* ─── Dropdown Filters (Category, Price, Sort) ──────────── */}
        <Filters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* ─── Product Grid ──────────────────────────────────────── */}
        {/* Shows filtered products or "no products found" empty state */}
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
};

export default Products;
