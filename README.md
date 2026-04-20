# Premium E-Commerce Platform

A comprehensive, responsive E-Commerce application built with React and Vite. It provides a full shopping experience, including product exploration, dynamic search and filtering, cart & wishlist management, and a seamless multi-step checkout process.

The application boasts a premium, modern design employing glassmorphism, fluid animations, and a sober yet striking color palette.

## ✨ Features

- **Product Exploration**: View, search, filter, and sort a diverse range of products. Integrated with the Fake Store API.
- **Advanced State Management**: Global cart and wishlist management via React Context API.
- **Streamlined Checkout**: Complete checkout experience with robust form validation using `react-hook-form` and `yup`.
- **Fluid UI Elements**: Interactive carousels, responsive grids, and micro-animations for an engaging user experience.
- **Real-Time Notifications**: Context-aware toast notifications using `react-toastify` for cart events and errors.
- **Optimized Networking**: Implements robust API calls with `axios`, utilizing abort controllers to cancel redundant requests during rapid navigation.

## 🛠️ Technologies Used

- **Framework**: React 19 + Vite
- **Routing**: React Router DOM (v7)
- **State Management**: React Context API
- **Data Fetching**: Axios
- **Form Handling & Validation**: React Hook Form, Yup
- **Styling & Animations**: Vanilla CSS, Framer Motion, Swiper (Carousels)
- **Icons**: React Icons
- **Notifications**: React Toastify

## 📂 Project Structure

```text
src/
├── assets/         # Static assets and images
├── components/     # Reusable UI elements (Navbar, ProductCard, Filters, etc.)
├── context/        # Application-wide state (CartContext)
├── hooks/          # Custom React hooks for abstracted logic
├── pages/          # Top-level views (Home, Products, Cart, Checkout, etc.)
├── services/       # API client configuration and endpoints wrapper
├── utils/          # Helper functions and formatter utilities
├── App.jsx         # Root component containing routing, layout, and providers
└── main.jsx        # Application entry point
```

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### Installation

1. **Navigate to the project directory**
   ```bash
   cd "8)ecommerce-app"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **View the Application**
   Open your browser and navigate to `http://localhost:5173` (or the port specified in your terminal).

## 💡 Architecture & Best Practices

- **Component-Driven**: Functional components ensure maximum reusability and clean architecture.
- **Robust StrictMode Compatibility**: Safely manages external interactions and notifications to prevent duplicates during React 18+ strict development mode.
- **Client-Side Routing**: Single-page application logic offers instantaneous page transitions without full page reloads.

---
*Built with ❤️ utilizing modern React ecosystem standards.*
