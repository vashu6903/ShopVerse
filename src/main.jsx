// ─── main.jsx ────────────────────────────────────────────────────────────────
// This is the ENTRY POINT of the entire React application.
// Think of it as the "ignition key" that starts the app.
// It finds the HTML element with id="root" and renders
// the <App /> component inside it.

// StrictMode → A development helper that warns you about potential problems
// in your code. It doesn't render anything visible on screen.
// NOTE: StrictMode runs certain things TWICE in development (like useEffect)
// to help catch bugs. This is normal and doesn't happen in production.
import { StrictMode } from 'react'

// createRoot → The modern way to connect React to the HTML page.
// It "roots" your React component tree into a real DOM element.
import { createRoot } from 'react-dom/client'

// Global CSS styles that apply to the entire app
import './index.css'

// The main App component that contains everything
import App from './App.jsx'

// Step 1: Find the <div id="root"> in index.html
// Step 2: Create a React root inside it
// Step 3: Render the App component wrapped in StrictMode
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
