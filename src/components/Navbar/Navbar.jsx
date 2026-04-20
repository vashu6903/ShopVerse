// ─── Navbar.jsx ──────────────────────────────────────────────────────────────
// The NAVIGATION BAR that appears at the top of every page.
// It provides:
//   1. Brand logo/name (links to home)
//   2. Navigation links (Home, Products, Wishlist, Cart)
//   3. Icon buttons for wishlist and cart (with item count badges)
//   4. A mobile hamburger menu for small screens

// ─── Imports ────────────────────────────────────────────────────────────────

// useState → Store whether the mobile menu is open or closed
import { useState } from 'react';

// Link     → Navigate to a page without refreshing (like <a> but for React)
// NavLink  → Same as Link, but adds an "active" class when the link matches the current URL
// useLocation → Gives us the current URL path (e.g., "/products")
import { Link, NavLink, useLocation } from 'react-router-dom';

// Icons from react-icons library (Feather icons set)
import { FiShoppingCart, FiHeart, FiMenu, FiX, FiSearch } from 'react-icons/fi';

// motion → Adds smooth animations to elements (fade, slide, etc.)
// AnimatePresence → Handles exit animations when elements are removed from the DOM
import { motion, AnimatePresence } from 'framer-motion';

// useCart → Our custom hook to access cart data (item count, wishlist count)
import useCart from '../../hooks/useCart';

import './Navbar.css';

// ─── Navbar Component ───────────────────────────────────────────────────────
const Navbar = () => {
  // Track whether the mobile menu is open (true) or closed (false)
  const [mobileOpen, setMobileOpen] = useState(false);

  // Get cart count and wishlist data from the shared context
  const { getCartCount, wishlistItems } = useCart();

  // Get the current URL path (used for highlighting active nav link)
  const location = useLocation();

  // Array of navigation links — makes it easy to loop and render them
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/wishlist', label: 'Wishlist' },
    { path: '/cart', label: 'Cart' },
  ];

  return (
    <nav className="navbar" id="main-navbar">
      <div className="container navbar-inner">

        {/* ─── Brand Logo ──────────────────────────────────────────── */}
        {/* Clicking the logo takes the user back to the Home page */}
        <Link to="/" className="navbar-brand" id="navbar-brand">
          <span className="brand-icon">🛍️</span>
          <span className="brand-text">ShopVerse</span>
        </Link>

        {/* ─── Desktop Navigation Links ────────────────────────────── */}
        {/* These links are visible on larger screens (hidden on mobile via CSS) */}
        <div className="navbar-links-desktop">
          {/* .map() loops through the navLinks array and creates a <NavLink> for each */}
          {navLinks.map((link) => (
            <NavLink
              key={link.path}       // Unique key for React's list rendering
              to={link.path}        // Where the link navigates to
              className={({ isActive }) =>
                // NavLink gives us `isActive` — true when the URL matches this link
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
              id={`nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* ─── Action Buttons (Wishlist, Cart, Mobile Toggle) ──────── */}
        <div className="navbar-actions">

          {/* Wishlist icon with badge showing number of saved items */}
          <Link to="/wishlist" className="navbar-icon-btn" id="nav-wishlist-btn">
            <FiHeart />
            {/* Show badge only if there are items in the wishlist */}
            {/* && is a shorthand for: if (condition) then show this */}
            {wishlistItems.length > 0 && (
              <span className="icon-badge">{wishlistItems.length}</span>
            )}
          </Link>

          {/* Cart icon with badge showing total item count */}
          <Link to="/cart" className="navbar-icon-btn" id="nav-cart-btn">
            <FiShoppingCart />
            {getCartCount() > 0 && (
              <span className="icon-badge">{getCartCount()}</span>
            )}
          </Link>

          {/* Hamburger menu button (only visible on mobile via CSS) */}
          {/* Toggles between ☰ (menu) and ✕ (close) icons */}
          <button
            className="navbar-toggle"
            onClick={() => setMobileOpen(!mobileOpen)} // Toggle open/closed
            id="navbar-toggle"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* ─── Mobile Navigation Menu ──────────────────────────────────── */}
      {/* AnimatePresence → Keeps the element in the DOM during exit animations */}
      <AnimatePresence>
        {/* Only render the mobile menu when mobileOpen is true */}
        {mobileOpen && (
          <motion.div
            className="navbar-mobile"
            initial={{ opacity: 0, height: 0 }}        // Start: hidden
            animate={{ opacity: 1, height: 'auto' }}   // Animate to: visible
            exit={{ opacity: 0, height: 0 }}           // Exit: collapse back
            transition={{ duration: 0.3 }}             // Animation takes 0.3 seconds
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `mobile-nav-link ${isActive ? 'mobile-nav-active' : ''}`
                }
                onClick={() => setMobileOpen(false)} // Close menu after clicking a link
              >
                {link.label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
