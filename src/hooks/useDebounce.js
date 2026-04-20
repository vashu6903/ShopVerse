// ─── useDebounce.js (Custom Hook) ───────────────────────────────────────────
// DEBOUNCING = Waiting for the user to STOP typing before doing something.
//
// Without debounce: Every single keystroke triggers a filter/search → laggy!
//   "s" → filter, "sh" → filter, "shi" → filter, "shir" → filter, "shirt" → filter
//
// With debounce (400ms delay): Only the FINAL value triggers the filter.
//   User types "shirt" → waits 400ms → filter runs ONCE with "shirt"
//
// USAGE:
//   const debouncedSearch = useDebounce(searchQuery, 400);
//   // debouncedSearch updates 400ms after the user stops typing

// useState  → Store the debounced (delayed) value
// useEffect → Set up and clean up the delay timer
import { useState, useEffect } from 'react';

// value → The value to debounce (e.g., what the user typed)
// delay → How long to wait (in milliseconds) after the last change
//          Default is 400ms
const useDebounce = (value, delay = 400) => {
  // This state holds the "delayed" version of the value
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Start a timer: after `delay` ms, update the debounced value
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // CLEANUP: If the value changes BEFORE the timer finishes,
    // cancel the old timer. This is the key to debouncing!
    // A new timer will start on the next render.
    return () => clearTimeout(timer);
  }, [value, delay]); // Re-run this effect whenever value or delay changes

  // Return the debounced value (updates only after the user stops changing it)
  return debouncedValue;
};

export default useDebounce;
