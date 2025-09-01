import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./index.css"; // make sure this imports Tailwind
import { CategoryProvider } from "./contexts/CategoryContext";
import { TodoProvider } from "./contexts/TodoContext";

// Performance optimization: Remove StrictMode in production
const isDevelopment = import.meta.env.DEV;

const root = ReactDOM.createRoot(document.getElementById("root"));

const app = isDevelopment ? (
  <React.StrictMode>
    <CategoryProvider>
      <TodoProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TodoProvider>
    </CategoryProvider>
  </React.StrictMode>
) : (
  <CategoryProvider>
    <TodoProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TodoProvider>
  </CategoryProvider>
);

root.render(app);
