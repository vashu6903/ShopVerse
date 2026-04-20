// ─── App.jsx ─────────────────────────────────────────────────────────────────
// This is the ROOT COMPONENT of the app. It sets up:
//   1. Routing (which page to show based on the URL)
//   2. Global state (CartProvider makes cart data available everywhere)
//   3. Layout (Navbar at top, page content in middle, Footer at bottom)
//   4. Toast notifications (pop-up messages for user feedback)

// ─── Imports ────────────────────────────────────────────────────────────────

// Router → Enables client-side routing (navigation without full page reloads)
// Routes → Container for all the route definitions
// Route  → Maps a URL path to a specific component/page
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ToastContainer → Renders the pop-up notification area on screen
// Must be placed once in the app; all toast.success(), toast.error() etc.
// will automatically appear inside this container
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Toast styling

// CartProvider → Wraps the app to provide cart/wishlist data to all components
import CartProvider from './context/CartContext';

// Layout components that appear on every page
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

// Page components — each one is a full page in the app
import Home from './pages/Home/Home';                       // Landing page
import Products from './pages/Products/Products';           // Product listing
import ProductDetails from './pages/ProductDetails/ProductDetails'; // Single product view
import Cart from './pages/Cart/Cart';                       // Shopping cart
import Wishlist from './pages/Wishlist/Wishlist';           // Saved/liked items
import Checkout from './pages/Checkout/Checkout';           // Order form

import './App.css'; // App-level styles

// ─── App Component ──────────────────────────────────────────────────────────
function App() {
  return (
    // Router → Listens to URL changes and renders the matching page
    <Router>
      {/* CartProvider → Makes cart/wishlist state available to ALL child components */}
      <CartProvider>
        <div className="app">
          {/* Navbar is always visible at the top of every page */}
          <Navbar />

          {/* Main content area — changes based on the current URL */}
          <main className="main-content">
            <Routes>
              {/* Each Route maps a URL path → a page component */}
              {/* path="/"           → Home page (exact match) */}
              {/* path="/products"    → Products listing page */}
              {/* path="/products/:id"→ Product detail page (:id is dynamic, e.g. /products/5) */}
              {/* path="/cart"        → Shopping cart page */}
              {/* path="/wishlist"    → Wishlist page */}
              {/* path="/checkout"    → Checkout/payment page */}
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </main>

          {/* Footer is always visible at the bottom of every page */}
          <Footer />
        </div>

        {/* ToastContainer → Where pop-up notifications appear */}
        {/* position="bottom-right" → Toasts show up in the bottom-right corner */}
        {/* autoClose={2500} → Each toast disappears after 2.5 seconds */}
        {/* theme="dark" → Dark-themed toast notifications */}
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </CartProvider>
    </Router>
  );
}

export default App;
