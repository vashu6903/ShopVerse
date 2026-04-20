// ─── api.js ──────────────────────────────────────────────────────────────────
// This file handles all communication with the external API (DummyJSON).
// Think of it as the "messenger" between our app and the server.
//
// It fetches product data from the internet and transforms (reshapes) the
// response into a format that our app components expect.
//
// Each function accepts an optional `signal` parameter (AbortSignal).
// This lets us cancel in-flight requests when the user navigates away,
// preventing "network error" messages.

// ─── Imports ────────────────────────────────────────────────────────────────

// axios → A popular library for making HTTP requests (like fetch, but with more features)
import axios from 'axios';

// ─── Configuration ──────────────────────────────────────────────────────────

// Base URL for all API requests — every endpoint starts with this
const BASE_URL = 'https://dummyjson.com';

// Create a reusable axios instance with default settings
// baseURL → All requests will start with this URL (e.g., GET https://dummyjson.com/products)
// timeout → If the server doesn't respond within 10 seconds (10000ms), the request fails
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// ─── API Functions ──────────────────────────────────────────────────────────

// Fetch all products (limited to 30 for performance)
// signal → AbortSignal to cancel the request if the component unmounts
export const fetchAllProducts = async (signal) => {
  // Make a GET request to /products?limit=30
  const response = await api.get('/products?limit=30', { signal });

  // The API returns data in DummyJSON's format, but our components
  // expect a different shape. So we transform each product:
  // - p.thumbnail → product.image (main display image)
  // - p.rating    → product.rating.rate (nested format)
  // - p.stock     → product.rating.count (we repurpose stock as review count)
  return response.data.products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.thumbnail,                    // Use thumbnail as the main image
    images: p.images || [p.thumbnail],     // Array of all images, fallback to thumbnail
    rating: {
      rate: p.rating,                      // Numeric rating (e.g., 4.5)
      count: p.stock || 0,                 // Stock count used as review count
    },
  }));
};

// Fetch a single product by its ID
// id → The product's unique identifier (e.g., 1, 2, 3...)
// signal → AbortSignal to cancel if user navigates away
export const fetchProductById = async (id, signal) => {
  const response = await api.get(`/products/${id}`, { signal });
  const p = response.data; // Single product object (not an array)

  // Transform to our standard format (same shape as fetchAllProducts)
  return {
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.thumbnail,
    images: p.images || [p.thumbnail],
    rating: {
      rate: p.rating,
      count: p.stock || 0,
    },
  };
};

// Fetch list of all available product categories
// Returns an array of strings like ["electronics", "beauty", "furniture", ...]
export const fetchCategories = async (signal) => {
  const response = await api.get('/products/category-list', { signal });
  // Only return the first 8 categories to keep the UI clean
  return response.data.slice(0, 8);
};

// Fetch products that belong to a specific category
// category → The category name (e.g., "electronics", "beauty")
export const fetchProductsByCategory = async (category, signal) => {
  const response = await api.get(`/products/category/${category}`, { signal });

  // Transform each product to our standard format
  return response.data.products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
    category: p.category,
    image: p.thumbnail,
    images: p.images || [p.thumbnail],
    rating: {
      rate: p.rating,
      count: p.stock || 0,
    },
  }));
};

// Export the axios instance so other parts of the app can use it if needed
export default api;
