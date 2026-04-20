// ─── Footer.jsx ──────────────────────────────────────────────────────────────
// The FOOTER that appears at the bottom of every page.
// It's a static (no state) component that displays:
//   1. Brand name and tagline
//   2. Quick navigation links (Shop, Account sections)
//   3. Copyright info and social media icons

// Link → Navigate to pages without refreshing the browser
import { Link } from 'react-router-dom';

// Icons from react-icons (GitHub, Twitter, Instagram, Heart)
import { FiGithub, FiTwitter, FiInstagram, FiHeart } from 'react-icons/fi';

import './Footer.css';

// ─── Footer Component ───────────────────────────────────────────────────────
// This is a "presentational" component — it just displays static content.
// It has no state, no hooks, no logic — just JSX markup.
const Footer = () => {
  return (
    <footer className="footer" id="main-footer">
      <div className="container footer-inner">

        {/* ─── Brand Section ─────────────────────────────────────── */}
        <div className="footer-brand">
          <span className="brand-icon">🛍️</span>
          <span className="footer-brand-text">ShopVerse</span>
          <p className="footer-tagline">Your premium shopping destination</p>
        </div>

        {/* ─── Quick Links ───────────────────────────────────────── */}
        {/* Organized into columns for a clean layout */}
        <div className="footer-links">
          {/* Shop Links Column */}
          <div className="footer-col">
            <h4 className="footer-col-title">Shop</h4>
            <Link to="/products" className="footer-link">All Products</Link>
            <Link to="/products" className="footer-link">Electronics</Link>
            <Link to="/products" className="footer-link">Clothing</Link>
            <Link to="/products" className="footer-link">Jewelry</Link>
          </div>

          {/* Account Links Column */}
          <div className="footer-col">
            <h4 className="footer-col-title">Account</h4>
            <Link to="/cart" className="footer-link">Cart</Link>
            <Link to="/wishlist" className="footer-link">Wishlist</Link>
            <Link to="/checkout" className="footer-link">Checkout</Link>
          </div>
        </div>

        {/* ─── Bottom Bar (Copyright + Social Icons) ─────────────── */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2026 ShopVerse. Made with <FiHeart className="footer-heart" /> using React
          </p>

          {/* Social media links (currently # placeholder URLs) */}
          <div className="footer-socials">
            <a href="#" className="footer-social-link"><FiGithub /></a>
            <a href="#" className="footer-social-link"><FiTwitter /></a>
            <a href="#" className="footer-social-link"><FiInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
