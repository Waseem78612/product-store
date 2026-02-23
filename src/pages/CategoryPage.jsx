// src/pages/CategoryPage.jsx
// Route: /category/:slug
// Full CRUD: view, search, sort, add, edit, delete
import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate }          from "react-router-dom";
import { useProductsByCategory, addProduct, updateProduct, deleteProduct } from "../hooks/useProducts";
import { useProducts }   from "../hooks/useProducts";
import ProductCard       from "../components/ProductCard";
import SkeletonCard      from "../components/SkeletonCard";
import SearchBar         from "../components/SearchBar";
import SortSelect        from "../components/SortSelect";
import ProductModal      from "../components/ProductModal";
import Toast             from "../components/Toast";

export default function CategoryPage() {
  const { slug }   = useParams();
  const navigate   = useNavigate();

  // Products in this category
  const { products, setProducts, loading, error } = useProductsByCategory(slug);
  // All categories for the modal dropdown
  const { categories } = useProducts();

  // Filter/sort state
  const [search, setSearch] = useState("");
  const [sort,   setSort]   = useState("default");

  // Modal state
  const [modalOpen,    setModalOpen]    = useState(false);
  const [editProduct,  setEditProduct]  = useState(null); // null = add mode
  const [saving,       setSaving]       = useState(false);

  // Toast state
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const reset = useCallback(() => { setSearch(""); setSort("default"); }, []);

  // Open modal for Add
  const openAdd = useCallback(() => {
    setEditProduct(null);
    setModalOpen(true);
  }, []);

  // Open modal for Edit
  const openEdit = useCallback((product) => {
    setEditProduct(product);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditProduct(null);
  }, []);

  // ── POST: Add new product ──────────────────────────────────────
  const handleAdd = useCallback(async (formData) => {
    setSaving(true);
    try {
      const newProduct = await addProduct({ ...formData, category: slug });
      // Optimistically add to local state (dummyjson doesn't actually save)
      setProducts((prev) => [newProduct, ...prev]);
      showToast("Product added! (simulated by dummyjson)");
      closeModal();
    } catch {
      showToast("Failed to add product.", "error");
    } finally {
      setSaving(false);
    }
  }, [slug, setProducts, showToast, closeModal]);

  // ── PUT: Update existing product ───────────────────────────────
  const handleUpdate = useCallback(async (formData) => {
    if (!editProduct) return;
    setSaving(true);
    try {
      const updated = await updateProduct(editProduct.id, formData);
      // Update local state optimistically
      setProducts((prev) =>
        prev.map((p) => p.id === editProduct.id ? { ...p, ...updated } : p)
      );
      showToast("Product updated! (simulated by dummyjson)");
      closeModal();
    } catch {
      showToast("Failed to update product.", "error");
    } finally {
      setSaving(false);
    }
  }, [editProduct, setProducts, showToast, closeModal]);

  // ── DELETE: Remove product ─────────────────────────────────────
  const handleDelete = useCallback(async (id) => {
    try {
      await deleteProduct(id);
      // Remove from local state optimistically
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showToast("Product deleted! (simulated by dummyjson)");
    } catch {
      showToast("Failed to delete product.", "error");
    }
  }, [setProducts, showToast]);

  // ── Save router: add or update ────────────────────────────────
  const handleSave = useCallback((formData) => {
    if (editProduct) handleUpdate(formData);
    else             handleAdd(formData);
  }, [editProduct, handleUpdate, handleAdd]);

  // Format slug → readable name
  const categoryName = slug
    ?.split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  // Filter + sort
  const filtered = useMemo(() => {
    let result = [...products];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q));
    }
    switch (sort) {
      case "price-asc":   result.sort((a, b) => a.price - b.price);              break;
      case "price-desc":  result.sort((a, b) => b.price - a.price);              break;
      case "rating-desc": result.sort((a, b) => b.rating - a.rating);            break;
      case "name-asc":    result.sort((a, b) => a.title.localeCompare(b.title)); break;
      default: break;
    }
    return result;
  }, [products, search, sort]);

  const hasFilters = search || sort !== "default";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-gray-500">
        <button onClick={() => navigate("/")} className="hover:text-white transition-colors">
          ← Home
        </button>
        <span>/</span>
        <span className="text-violet-400 font-medium">{categoryName}</span>
      </div>

      {/* Heading + Add button */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-black text-white"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            {categoryName}
          </h2>
          {!loading && (
            <p className="text-gray-500 text-sm mt-1">
              {filtered.length} of {products.length} products
            </p>
          )}
        </div>

        {/* Add Product button */}
        <button
          onClick={openAdd}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-violet-700/20"
        >
          <span>+</span>
          <span className="hidden sm:inline">Add Product</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        {/* Search */}
        <div className="flex-1">
          <SearchBar value={search} onChange={setSearch} placeholder={`Search in ${categoryName}...`} />
        </div>

        {/* Jump to another category */}
        <div className="relative w-full sm:w-52">
          <select
            value={slug}
            onChange={(e) => { navigate(`/category/${e.target.value}`); setSearch(""); setSort("default"); }}
            aria-label="Switch category"
            className="w-full appearance-none px-4 py-3 pr-9 rounded-xl bg-[#111118] border border-[#1e1e2e] text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors duration-200"
          >
            <option value="" disabled>Switch category</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">▼</span>
        </div>

        <SortSelect value={sort} onChange={setSort} />
        {hasFilters && (
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
          <button onClick={() => navigate("/")} className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
            Go Back
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center py-20 gap-3 text-center">
          <span className="text-5xl">🔍</span>
          <p className="text-gray-400">
            {search ? `No products found for "${search}"` : "No products in this category."}
          </p>
          {hasFilters && (
            <button onClick={reset} className="text-violet-400 text-sm hover:underline">Clear filters</button>
          )}
        </div>
      )}

      {/* Product grid with Edit + Delete on each card */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <ProductModal
          product={editProduct}
          categories={categories}
          onSave={handleSave}
          onClose={closeModal}
          saving={saving}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
