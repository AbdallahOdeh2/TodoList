import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
// Lazy load all pages
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CategoryEditor = lazy(() => import("./pages/CategoryEditor"));
const EditCategory = lazy(() => import("./pages/EditCategory"));
const EditTask = lazy(() => import("./pages/EditTask"));
const AddTask = lazy(() => import("./pages/AddTask"));

// Loading component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-800">
    <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-blue-400"></div>
  </div>
);

export default function App() {
  return (
    <div>
      <ScrollToTop />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-task" element={<AddTask />} />
          <Route path="/edit-category/:id" element={<EditCategory />} />
          <Route path="/edit-task/:id" element={<EditTask />} />
          <Route path="/categories" element={<CategoryEditor />} />
        </Routes>
      </Suspense>
    </div>
  );
}
