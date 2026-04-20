// ─── SearchBar.jsx ───────────────────────────────────────────────────────────
// A SEARCH INPUT component with:
//   - A magnifying glass icon on the left
//   - A text input for typing search queries
//   - A clear (X) button that appears when there's text in the input
//   - A visual "focused" state (highlighted border when clicked)
//
// This is a CONTROLLED COMPONENT — the parent component owns the value,
// and this component just displays it and reports changes back via onChange.

// useState → Track whether the input is focused (clicked into)
import { useState } from 'react';

// Icons: magnifying glass for search, X for clear
import { FiSearch, FiX } from 'react-icons/fi';

import './SearchBar.css';

// ─── SearchBar Component ────────────────────────────────────────────────────
// Props:
//   value       → The current search text (controlled by parent)
//   onChange     → Function to call when the user types (updates parent's state)
//   placeholder → Hint text shown when input is empty (default: "Search products...")
const SearchBar = ({ value, onChange, placeholder = 'Search products...' }) => {
  // Track if the input is focused (user clicked on it)
  // Used to add a visual "highlight" effect to the search bar
  const [focused, setFocused] = useState(false);

  return (
    // Add 'search-bar-focused' class when the input is focused (for styling)
    <div className={`search-bar ${focused ? 'search-bar-focused' : ''}`} id="search-bar">

      {/* Search icon (decorative, non-interactive) */}
      <FiSearch className="search-bar-icon" />

      {/* The actual text input */}
      <input
        type="text"
        value={value}                              // Display the current search text
        onChange={(e) => onChange(e.target.value)}  // Report new text to parent on every keystroke
        placeholder={placeholder}                  // Hint text when empty
        className="search-bar-input"
        onFocus={() => setFocused(true)}            // User clicked into the input
        onBlur={() => setFocused(false)}            // User clicked away from the input
        id="search-input"
      />

      {/* Clear button — only shown when there's text in the input */}
      {/* Clicking it calls onChange('') which clears the search */}
      {value && (
        <button
          className="search-bar-clear"
          onClick={() => onChange('')}  // Clear the search text
          id="search-clear-btn"
        >
          <FiX />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
