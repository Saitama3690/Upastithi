import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Ensure the DOM is loaded before rendering
document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    console.error("❌ Root element not found! Make sure you have <div id='root'></div> in index.html.");
    return;
  }

  createRoot(rootElement).render(
    // <React.StrictMode>
      <App />
    // </React.StrictMode>
  );
});
