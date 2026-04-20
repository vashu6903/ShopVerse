// ─── Filters.jsx ─────────────────────────────────────────────────────────────
// A FILTER PANEL component with three dropdown menus:
//   1. Category filter  → Show only products from a specific category
//   2. Price range filter → Show only products within a price range
//   3. Sort option      → Reorder products by price, rating, or name
//
// This is a CONTROLLED COMPONENT — the parent (Products page) owns all the
// filter state, and this component just displays dropdowns and reports changes.

import './Filters.css';

// ─── Filters Component ──────────────────────────────────────────────────────
// Props (all provided by the parent Products page):
//   categories        → Array of category names from the API
//   selectedCategory  → Currently selected category ('all' or a category name)
//   onCategoryChange  → Function to call when user selects a category
//   priceRange        → Currently selected price range ('all', '0-50', etc.)
//   onPriceRangeChange → Function to call when user selects a price range
//   sortBy            → Current sort option ('default', 'price-asc', etc.)
//   onSortChange      → Function to call when user selects a sort option
const Filters = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
}) => {
  // ─── Price Range Options ────────────────────────────────────────────────
  // Each option has a `value` (used in code) and `label` (shown to user)
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: '0-50', label: '$0 – $50' },
    { value: '50-100', label: '$50 – $100' },
    { value: '100-500', label: '$100 – $500' },
    { value: '500-1000', label: '$500 – $1000' },
    { value: '1000+', label: '$1000+' },
  ];

  // ─── Sort Options ──────────────────────────────────────────────────────
  const sortOptions = [
    { value: 'default', label: 'Default' },
    { value: 'price-asc', label: 'Price: Low → High' },
    { value: 'price-desc', label: 'Price: High → Low' },
    { value: 'rating', label: 'Top Rated' },
    { value: 'name', label: 'A – Z' },
  ];

  return (
    <div className="filters" id="filters-panel">

      {/* ─── Category Dropdown ─────────────────────────────────── */}
      <div className="filter-group">
        <label className="filter-label">Category</label>
        <select
          className="filter-select"
          value={selectedCategory}                        // Currently selected value
          onChange={(e) => onCategoryChange(e.target.value)} // Report new selection to parent
          id="filter-category"
        >
          <option value="all">All Categories</option>
          {/* Loop through categories from API and create an <option> for each */}
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {/* Capitalize first letter: "electronics" → "Electronics" */}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* ─── Price Range Dropdown ──────────────────────────────── */}
      <div className="filter-group">
        <label className="filter-label">Price Range</label>
        <select
          className="filter-select"
          value={priceRange}
          onChange={(e) => onPriceRangeChange(e.target.value)}
          id="filter-price"
        >
          {priceRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* ─── Sort By Dropdown ──────────────────────────────────── */}
      <div className="filter-group">
        <label className="filter-label">Sort By</label>
        <select
          className="filter-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          id="filter-sort"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filters;
