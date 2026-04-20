// ─── ProductGrid.jsx ─────────────────────────────────────────────────────────
// A simple layout component that arranges ProductCards in a CSS grid.
// If there are no products to display, it shows an "empty state" message.
//
// This is a "container" component — it doesn't have its own logic,
// it just receives data (products) and renders ProductCard components.

// ProductCard → The individual product card component we render for each product
import ProductCard from '../ProductCard/ProductCard';

import './ProductGrid.css';

// Props:
//   products → Array of product objects to display in the grid
const ProductGrid = ({ products }) => {

  // ─── Empty State ────────────────────────────────────────────────────────
  // If no products match the current filters/search, show a friendly message
  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">🔍</div>
        <h3 className="empty-state-title">No products found</h3>
        <p className="empty-state-text">
          Try adjusting your search or filters to find what you're looking for.
        </p>
      </div>
    );
  }

  // ─── Product Grid ──────────────────────────────────────────────────────
  // .map() loops through the products array and creates a ProductCard for each.
  // key={product.id} → React uses this to efficiently track which items changed.
  // index → Passed to ProductCard for staggered entrance animations.
  return (
    <div className="product-grid" id="product-grid">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductGrid;
