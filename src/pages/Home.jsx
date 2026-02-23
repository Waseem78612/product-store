// src/pages/Home.jsx
import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import SearchBar    from "../components/SearchBar";
import SkeletonCard from "../components/SkeletonCard";

const CAT_EMOJI = {
  "smartphones": "📱", "laptops": "💻", "fragrances": "🌸",
  "skincare": "🧴", "groceries": "🛒", "home-decoration": "🏠",
  "furniture": "🪑", "tops": "👕", "womens-dresses": "👗",
  "womens-shoes": "👠", "mens-shirts": "👔", "mens-shoes": "👞",
  "mens-watches": "⌚", "womens-watches": "⌚", "womens-bags": "👜",
  "womens-jewellery": "💍", "sunglasses": "🕶️", "automotive": "🚗",
  "motorcycle": "🏍️", "lighting": "💡", "vehicle": "🚗",
  "sports-accessories": "⚽", "tablets": "📲", "mobile-accessories": "🔌",
};

const getEmoji = (slug) => CAT_EMOJI[slug] || "📦";

export default function Home() {
  const { products, categories, loading, error } = useProducts();
  const navigate = useNavigate();

  const [search,          setSearch]          = useState("");
  const [selectedCat,     setSelectedCat]     = useState(""); // select dropdown

  // Build category cards with count + thumbnail
  const categoryCards = useMemo(() => {
    return categories.map((cat) => ({
      ...cat,
      count: products.filter((p) => p.category === cat.slug).length,
      thumb: products.find((p) => p.category === cat.slug)?.thumbnail || null,
    }));
  }, [categories, products]);

  // Filter by search text AND selected category dropdown
  const filtered = useMemo(() => {
    let result = categoryCards;
    if (selectedCat) {
      result = result.filter((c) => c.slug === selectedCat);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q));
    }
    return result;
  }, [categoryCards, search, selectedCat]);

  const goTo    = useCallback((slug) => navigate(`/category/${slug}`), [navigate]);
  const reset   = useCallback(() => { setSearch(""); setSelectedCat(""); }, []);
  const hasFilter = search || selectedCat;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Hero */}
      <div className="mb-10 text-center">
        <h2
          className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Shop by <span className="text-violet-400">Category</span>
        </h2>
        <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
          Browse {categories.length} categories with {products.length}+ real products.
        </p>
      </div>

      {/* ── Filters row: search + category select ── */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-10">
        {/* Search */}
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder="Search categories..." />
        </div>

        {/* Category select dropdown */}
        <div className="relative w-full sm:w-56">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            aria-label="Jump to category"
            className="w-full appearance-none px-4 py-3 pr-9 rounded-xl bg-[#111118] border border-[#1e1e2e] text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors duration-200"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</span>
        </div>

        {/* Reset — only when filter active */}
        {hasFilter && (
          <button
            onClick={reset}
            className="px-4 py-3 rounded-xl border border-[#1e1e2e] text-gray-400 text-sm font-medium hover:border-violet-500/40 hover:text-white transition-all whitespace-nowrap"
          >
            Reset ×
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center py-20 gap-3 text-center">
          <span className="text-5xl">⚠️</span>
          <p className="text-gray-400">{error}</p>
          <button onClick={() => window.location.reload()} className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
            Retry
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 15 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Category grid */}
      {!loading && !error && (
        <>
          {/* Result count when filtering */}
          {hasFilter && (
            <p className="text-gray-600 text-xs mb-4 text-center">
              Showing {filtered.length} of {categoryCards.length} categories
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <span className="text-5xl">🔍</span>
              <p className="text-gray-500 mt-3">No categories found</p>
              <button onClick={reset} className="mt-4 text-violet-400 text-sm hover:underline">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => goTo(cat.slug)}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-[#111118] border border-[#1e1e2e] hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-900/15 transition-all duration-300 text-left"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#1a1a2a]">
                    {cat.thumb ? (
                      <img
                        src={cat.thumb}
                        alt={cat.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-70 group-hover:opacity-100"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">
                        {getEmoji(cat.slug)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111118] via-transparent to-transparent" />
                    <div className="absolute top-2 left-2 text-xl">{getEmoji(cat.slug)}</div>
                  </div>
                  <div className="p-3">
                    <p className="text-white font-semibold text-sm capitalize leading-tight">{cat.name}</p>
                    <p className="text-gray-600 text-xs mt-0.5">{cat.count} product{cat.count !== 1 ? "s" : ""}</p>
                  </div>
                  <div className="absolute bottom-3 right-3 text-violet-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-sm">→</div>
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
