// ─── helpers.js (Utility Functions) ─────────────────────────────────────────
// This file contains small, reusable "helper" functions used across the app.
// They handle formatting, calculations, and data transformations.
// None of these are React-specific — they're plain JavaScript functions.

// ─── Format Price ───────────────────────────────────────────────────────────
// Converts a number to a dollar string with 2 decimal places.
// Example: formatPrice(12.5) → "$12.50"
// .toFixed(2) ensures exactly 2 decimal places
export const formatPrice = (price) => {
  return `$${price.toFixed(2)}`;
};

// ─── Calculate Tax ──────────────────────────────────────────────────────────
// Calculates the tax amount based on a subtotal and tax rate.
// Default tax rate is 8% (0.08).
// Example: calculateTax(100) → 8.00 (8% of $100)
export const calculateTax = (subtotal, taxRate = 0.08) => {
  return subtotal * taxRate;
};

// ─── Calculate Total ────────────────────────────────────────────────────────
// Adds subtotal + tax + shipping to get the final total.
// Example: calculateTotal(100, 8, 5.99) → 113.99
export const calculateTotal = (subtotal, tax, shipping = 0) => {
  return subtotal + tax + shipping;
};

// ─── Truncate Text ──────────────────────────────────────────────────────────
// Shortens long text and adds "..." at the end.
// Used for product titles that are too long to display in a card.
// Example: truncateText("This is a very long product title", 20)
//          → "This is a very long ..."
export const truncateText = (text, maxLength = 80) => {
  if (text.length <= maxLength) return text; // Short enough, return as-is
  return text.substring(0, maxLength) + '...'; // Cut and add ellipsis
};

// ─── Get Star Rating ────────────────────────────────────────────────────────
// Converts a numeric rating (e.g., 3.5) into an array of star types.
// Used to render star icons (★★★½☆) in the UI.
//
// Example: getStarRating(3.5) → ['full', 'full', 'full', 'half', 'empty']
//   - 3 full stars (Math.floor(3.5) = 3)
//   - 1 half star (0.5 remainder ≥ 0.5)
//   - 1 empty star (to fill up to 5 total)
export const getStarRating = (rate) => {
  const stars = [];                           // Array to hold star types
  const fullStars = Math.floor(rate);         // Integer part (e.g., 3 from 3.5)
  const hasHalf = rate - fullStars >= 0.5;    // Is the decimal part ≥ 0.5?

  for (let i = 0; i < fullStars; i++) stars.push('full');  // Add full stars
  if (hasHalf) stars.push('half');                          // Add half star if needed
  while (stars.length < 5) stars.push('empty');             // Fill rest with empty stars

  return stars; // Returns array like: ['full', 'full', 'full', 'half', 'empty']
};

// ─── Get Price Range ────────────────────────────────────────────────────────
// Converts a price range string into min/max numbers for filtering.
// Used by the Filters component to filter products by price.
//
// Example: getPriceRange('50-100') → { min: 50, max: 100 }
// Example: getPriceRange('1000+')  → { min: 1000, max: Infinity }
export const getPriceRange = (range) => {
  switch (range) {
    case '0-50': return { min: 0, max: 50 };
    case '50-100': return { min: 50, max: 100 };
    case '100-500': return { min: 100, max: 500 };
    case '500-1000': return { min: 500, max: 1000 };
    case '1000+': return { min: 1000, max: Infinity }; // Infinity = no upper limit
    default: return { min: 0, max: Infinity };          // 'all' → show everything
  }
};
