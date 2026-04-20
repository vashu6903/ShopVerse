// ─── Checkout.jsx ────────────────────────────────────────────────────────────
// The CHECKOUT PAGE — where users complete their order.
//
// Features:
//   1. Shipping form (name, email, address, city, ZIP)
//   2. Payment form (card number, expiry, CVV)
//   3. Order summary sidebar (items, subtotal, tax, shipping, total)
//   4. Form validation using Yup schema + React Hook Form
//   5. Simulated order processing (1.5 second delay)
//   6. Success screen after order is placed
//   7. Empty cart redirect (if cart is empty, show message)
//
// LIBRARIES USED:
//   react-hook-form → Manages form state, validation, and submission
//   yup             → Defines validation rules (required, min length, email format)
//   @hookform/resolvers/yup → Connects yup validation to react-hook-form

// ─── Imports ────────────────────────────────────────────────────────────────

// useState → Track whether the order has been placed
import { useState } from 'react';

// Link → Navigate to other pages
// useNavigate → Programmatic navigation (not used in current code but available)
import { Link, useNavigate } from 'react-router-dom';

// motion → Entrance animations for form sections and success screen
import { motion } from 'framer-motion';

// react-hook-form → Manages form inputs, validation, and submission
// register    → Connects an input to the form (tracks its value and errors)
// handleSubmit → Wraps your submit function with validation checks
// formState   → Contains errors object and isSubmitting boolean
import { useForm } from 'react-hook-form';

// yupResolver → Adapter that connects Yup validation schema to react-hook-form
import { yupResolver } from '@hookform/resolvers/yup';

// yup → Library for defining validation rules in a clean, readable way
import * as yup from 'yup';

// Icons for navigation and success screen
import { FiArrowLeft, FiCheck, FiShoppingBag } from 'react-icons/fi';

// Toast notifications
import { toast } from 'react-toastify';

// Custom hook for cart data
import useCart from '../../hooks/useCart';

// Helper functions for price formatting and calculations
import { formatPrice, calculateTax, calculateTotal } from '../../utils/helpers';

import './Checkout.css';

// ─── Validation Schema ──────────────────────────────────────────────────────
// Yup schema defines the rules each form field must satisfy.
// If a field fails validation, the corresponding error message is shown.
const schema = yup.object().shape({
  // Each field: type → required check → additional validation
  fullName: yup.string().required('Full name is required').min(2, 'Name too short'),
  email: yup.string().required('Email is required').email('Invalid email'),
  address: yup.string().required('Address is required').min(5, 'Address too short'),
  city: yup.string().required('City is required'),
  zipCode: yup.string().required('ZIP code is required').min(4, 'Invalid ZIP'),
  cardNumber: yup.string().required('Card number is required').min(16, 'Invalid card number'),
  expiry: yup.string().required('Expiry date is required'),
  cvv: yup.string().required('CVV is required').min(3, 'Invalid CVV'),
});

// ─── Checkout Page Component ────────────────────────────────────────────────
const Checkout = () => {
  // ─── State & Hooks ──────────────────────────────────────────────────────
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [orderPlaced, setOrderPlaced] = useState(false);  // Tracks if order was submitted
  const navigate = useNavigate();                          // For programmatic navigation

  // ─── Calculate Order Summary ──────────────────────────────────────────
  const subtotal = getCartTotal();
  const tax = calculateTax(subtotal);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = calculateTotal(subtotal, tax, shipping);

  // ─── React Hook Form Setup ────────────────────────────────────────────
  // useForm returns helpers to manage the form:
  //   register     → Function to connect each input to the form
  //   handleSubmit → Wraps onSubmit with validation (won't submit if invalid)
  //   formState    → Contains { errors } object with field-specific error messages
  //                  and { isSubmitting } boolean for loading state
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema), // Connect Yup validation to react-hook-form
  });

  // ─── Form Submission Handler ──────────────────────────────────────────
  // This only runs if ALL form fields pass validation
  const onSubmit = async () => {
    // Simulate processing delay (1.5 seconds)
    // In a real app, you'd send the order data to your backend here
    await new Promise((resolve) => setTimeout(resolve, 1500));

    clearCart();                                    // Empty the cart
    setOrderPlaced(true);                          // Switch to success screen
    toast.success('Order placed successfully! 🎉'); // Show success notification
  };

  // ─── Empty Cart State ─────────────────────────────────────────────────
  // If cart is empty AND order hasn't been placed, show message
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="page-wrapper" id="checkout-page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3 className="empty-state-title">Nothing to checkout</h3>
            <p className="empty-state-text">Add some items to your cart first.</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              <FiShoppingBag /> Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ─── Order Success State ──────────────────────────────────────────────
  // Shown after the order is successfully placed
  if (orderPlaced) {
    return (
      <div className="page-wrapper" id="checkout-page">
        <div className="container">
          <motion.div
            className="order-success"
            initial={{ opacity: 0, scale: 0.8 }}     // Start small and invisible
            animate={{ opacity: 1, scale: 1 }}       // Grow to full size
            transition={{ duration: 0.5 }}
          >
            <div className="success-icon-wrap">
              <FiCheck />  {/* Big checkmark icon */}
            </div>
            <h2 className="success-title">Order Placed!</h2>
            <p className="success-text">
              Thank you for your purchase. Your order has been confirmed and will be delivered soon.
            </p>
            <div className="success-actions">
              <Link to="/products" className="btn btn-primary btn-lg">
                Continue Shopping
              </Link>
              <Link to="/" className="btn btn-secondary btn-lg">
                Go Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // ─── Main Checkout Form ───────────────────────────────────────────────
  return (
    <div className="page-wrapper" id="checkout-page">
      <div className="container">
        {/* Back to Cart link */}
        <Link to="/cart" className="back-link">
          <FiArrowLeft /> Back to Cart
        </Link>

        {/* Page title with entrance animation */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="section-title">Checkout</h1>
          <p className="section-subtitle">Complete your order</p>
        </motion.div>

        <div className="checkout-layout">

          {/* ═══════════════════════════════════════════════════════ */}
          {/* LEFT SIDE: CHECKOUT FORM                               */}
          {/* handleSubmit(onSubmit) → validates first, then calls onSubmit */}
          {/* ═══════════════════════════════════════════════════════ */}
          <form className="checkout-form" onSubmit={handleSubmit(onSubmit)}>

            {/* ─── Shipping Information Section ──────────────────── */}
            <div className="checkout-section glass-card">
              <h3 className="checkout-section-title">Shipping Information</h3>
              <div className="form-grid">

                {/* Full Name Field */}
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    // Add error class if validation failed for this field
                    className={`form-input ${errors.fullName ? 'form-input-error' : ''}`}
                    placeholder="John Doe"
                    // register('fullName') → connects this input to react-hook-form
                    // It tracks the value, validates it, and reports errors
                    {...register('fullName')}
                    id="checkout-name"
                  />
                  {/* Show error message if validation fails */}
                  {errors.fullName && <span className="form-error">{errors.fullName.message}</span>}
                </div>

                {/* Email Field */}
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-input ${errors.email ? 'form-input-error' : ''}`}
                    placeholder="john@example.com"
                    {...register('email')}
                    id="checkout-email"
                  />
                  {errors.email && <span className="form-error">{errors.email.message}</span>}
                </div>

                {/* Address Field (full width) */}
                <div className="form-group form-full">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className={`form-input ${errors.address ? 'form-input-error' : ''}`}
                    placeholder="123 Main Street"
                    {...register('address')}
                    id="checkout-address"
                  />
                  {errors.address && <span className="form-error">{errors.address.message}</span>}
                </div>

                {/* City Field */}
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className={`form-input ${errors.city ? 'form-input-error' : ''}`}
                    placeholder="New York"
                    {...register('city')}
                    id="checkout-city"
                  />
                  {errors.city && <span className="form-error">{errors.city.message}</span>}
                </div>

                {/* ZIP Code Field */}
                <div className="form-group">
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    className={`form-input ${errors.zipCode ? 'form-input-error' : ''}`}
                    placeholder="10001"
                    {...register('zipCode')}
                    id="checkout-zip"
                  />
                  {errors.zipCode && <span className="form-error">{errors.zipCode.message}</span>}
                </div>
              </div>
            </div>

            {/* ─── Payment Details Section ───────────────────────── */}
            <div className="checkout-section glass-card">
              <h3 className="checkout-section-title">Payment Details</h3>
              <div className="form-grid">

                {/* Card Number Field (full width) */}
                <div className="form-group form-full">
                  <label className="form-label">Card Number</label>
                  <input
                    type="text"
                    className={`form-input ${errors.cardNumber ? 'form-input-error' : ''}`}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    {...register('cardNumber')}
                    id="checkout-card"
                  />
                  {errors.cardNumber && <span className="form-error">{errors.cardNumber.message}</span>}
                </div>

                {/* Expiry Date Field */}
                <div className="form-group">
                  <label className="form-label">Expiry Date</label>
                  <input
                    type="text"
                    className={`form-input ${errors.expiry ? 'form-input-error' : ''}`}
                    placeholder="MM/YY"
                    {...register('expiry')}
                    id="checkout-expiry"
                  />
                  {errors.expiry && <span className="form-error">{errors.expiry.message}</span>}
                </div>

                {/* CVV Field */}
                <div className="form-group">
                  <label className="form-label">CVV</label>
                  <input
                    type="text"
                    className={`form-input ${errors.cvv ? 'form-input-error' : ''}`}
                    placeholder="123"
                    maxLength="4"
                    {...register('cvv')}
                    id="checkout-cvv"
                  />
                  {errors.cvv && <span className="form-error">{errors.cvv.message}</span>}
                </div>
              </div>
            </div>

            {/* ─── Submit Button ────────────────────────────────── */}
            {/* disabled={isSubmitting} → Prevents double-clicking while processing */}
            <button
              type="submit"
              className="btn btn-primary btn-lg checkout-submit"
              disabled={isSubmitting}
              id="place-order-btn"
            >
              {/* Show "Processing..." while the order is being submitted */}
              {isSubmitting ? 'Processing...' : `Place Order — ${formatPrice(total)}`}
            </button>
          </form>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* RIGHT SIDE: ORDER SUMMARY                              */}
          {/* Shows what the user is buying and the total cost        */}
          {/* ═══════════════════════════════════════════════════════ */}
          <motion.div
            className="checkout-summary glass-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="summary-title">Order Summary</h3>

            {/* ─── Item List ───────────────────────────────────── */}
            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item.id} className="checkout-item">
                  {/* Product thumbnail with quantity badge */}
                  <div className="checkout-item-img-wrap">
                    <img src={item.image} alt={item.title} />
                    <span className="checkout-item-qty">{item.quantity}</span>
                  </div>
                  {/* Product name and total price */}
                  <div className="checkout-item-info">
                    <span className="checkout-item-name">{item.title.substring(0, 40)}...</span>
                    <span className="checkout-item-price">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* ─── Price Breakdown ──────────────────────────────── */}
            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row summary-total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
