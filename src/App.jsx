// src/App.jsx
// Handles routing + shared Navbar/Footer layout
import { Routes, Route, useLocation, NavLink } from "react-router-dom";
import { useEffect } from "react";
import Home         from "./pages/Home";
import CategoryPage from "./pages/CategoryPage";
import NotFound     from "./pages/NotFound";

// Scroll to top on every route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function Navbar() {
  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-[#1e1e2e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo — always goes home */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🛍️</span>
          <span
            className="text-lg sm:text-xl font-black text-white tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Product<span className="text-violet-400">Store</span>
          </span>
        </NavLink>

        {/* Nav links */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200
              ${isActive ? "text-violet-400" : "text-gray-500 hover:text-white"}`
            }
          >
            Categories
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#1e1e2e] py-6 text-center mt-12">
      <p className="text-gray-700 text-xs">
        Data from{" "}
        <a href="https://dummyjson.com" target="_blank" rel="noopener noreferrer" className="text-violet-500 hover:text-violet-400 transition-colors">
          dummyjson.com
        </a>
        {" "}· Built with React + Axios + React Router
      </p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8e8]">
      <ScrollToTop />
      <Navbar />
      <main>
        <Routes>
          <Route path="/"                  element={<Home />}         />
          <Route path="/category/:slug"    element={<CategoryPage />} />
          <Route path="*"                  element={<NotFound />}     />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
