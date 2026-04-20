// ─── useProducts.js (Custom Hook) ───────────────────────────────────────────
// This hook fetches all products and categories from the API.
// Any component that needs product data can simply call:
//   const { products, categories, loading, error } = useProducts();
//
// It handles:
//   - Loading state (shows a spinner while fetching)
//   - Error state (shows an error message if the fetch fails)
//   - Abort cleanup (cancels the request if the component unmounts)

// useState  → Store data that can change (products, loading, error)
// useEffect → Run code when the component first appears (fetch data)
import { useState, useEffect } from 'react';

// API functions that talk to the DummyJSON server
import { fetchAllProducts, fetchCategories } from '../services/api';

const useProducts = () => {
  // ─── State Variables ────────────────────────────────────────────────────
  const [products, setProducts] = useState([]);      // Array of all products
  const [categories, setCategories] = useState([]);  // Array of category names
  const [loading, setLoading] = useState(true);      // true while data is being fetched
  const [error, setError] = useState(null);          // Error message if fetch fails

  // ─── Fetch Data on Component Mount ──────────────────────────────────────
  // useEffect with [] (empty dependency array) runs ONCE when the component
  // first appears on screen. It fetches products and categories from the API.
  useEffect(() => {
    // AbortController lets us cancel the fetch request if the component
    // unmounts before the request completes. This prevents:
    //   1. "Network error" messages from cancelled requests
    //   2. Trying to update state on an unmounted component
    const controller = new AbortController();

    const loadData = async () => {
      try {
        setLoading(true);   // Show loading spinner
        setError(null);      // Clear any previous errors

        // Promise.all → Fetch products AND categories at the same time
        // (parallel requests = faster than fetching one after the other)
        // Each function receives the abort signal so we can cancel them
        const [productsData, categoriesData] = await Promise.all([
          fetchAllProducts(controller.signal),
          fetchCategories(controller.signal),
        ]);

        // Only update state if the request wasn't cancelled
        // (prevents updating state after component unmounts)
        if (!controller.signal.aborted) {
          setProducts(productsData);
          setCategories(categoriesData);
        }
      } catch (err) {
        // Only show errors if the request wasn't intentionally cancelled
        if (!controller.signal.aborted) {
          setError(err.message || 'Failed to fetch products');
        }
      } finally {
        // Hide loading spinner (only if request wasn't cancelled)
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };
    loadData();

    // CLEANUP FUNCTION → Runs when the component unmounts (leaves the screen)
    // This cancels any in-flight API requests to prevent errors
    return () => controller.abort();
  }, []); // ← Empty array = run only once on mount

  // Return all state values so components can use them
  return { products, categories, loading, error };
};

export default useProducts;
