// src/components/ProductModal.jsx
// Used for both Add New Product (POST) and Edit Product (PUT)
import { useState, useEffect, useCallback } from "react";

const EMPTY = {
  title:       "",
  price:       "",
  category:    "",
  description: "",
  stock:       "",
  thumbnail:   "",
};

export default function ProductModal({ product, categories, onSave, onClose, saving }) {
  const isEdit = Boolean(product); // true = edit, false = add
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  // Pre-fill form when editing
  useEffect(() => {
    if (product) {
      setForm({
        title:       product.title       || "",
        price:       product.price       || "",
        category:    product.category    || "",
        description: product.description || "",
        stock:       product.stock       || "",
        thumbnail:   product.thumbnail   || "",
      });
    } else {
      setForm(EMPTY);
    }
  }, [product]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.title.trim())    errs.title    = "Title is required";
    if (!form.price)           errs.price    = "Price is required";
    if (isNaN(form.price))     errs.price    = "Price must be a number";
    if (!form.category.trim()) errs.category = "Category is required";
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock) || 0,
    });
  };

  // Close on backdrop click
  const onBackdrop = (e) => { if (e.target === e.currentTarget) onClose(); };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center px-4 py-8"
      onClick={onBackdrop}
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit product" : "Add new product"}
    >
      <div className="w-full max-w-lg bg-[#111118] border border-[#1e1e2e] rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-fadeUp">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e2e]">
          <h2 className="text-white font-black text-lg" style={{ fontFamily: "'Syne',sans-serif" }}>
            {isEdit ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-2xl leading-none"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        {/* Note about dummyjson */}
        <div className="mx-6 mt-4 px-4 py-2.5 rounded-xl bg-amber-500/8 border border-amber-500/20 text-amber-400 text-xs">
          ⚠️ dummyjson simulates the response — data is not actually saved to the server. Perfect for learning!
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate className="p-6 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Title *
            </label>
            <input
              id="title" name="title" type="text"
              value={form.title} onChange={handleChange}
              placeholder="Product title"
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e] text-white placeholder-gray-700 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            />
            {errors.title && <p className="text-red-400 text-xs">{errors.title}</p>}
          </div>

          {/* Price + Stock */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="price" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Price ($) *
              </label>
              <input
                id="price" name="price" type="number" min="0" step="0.01"
                value={form.price} onChange={handleChange}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e] text-white placeholder-gray-700 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
              {errors.price && <p className="text-red-400 text-xs">{errors.price}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="stock" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                Stock
              </label>
              <input
                id="stock" name="stock" type="number" min="0"
                value={form.stock} onChange={handleChange}
                placeholder="0"
                className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e] text-white placeholder-gray-700 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
              />
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="category" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Category *
            </label>
            <select
              id="category" name="category"
              value={form.category} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e] text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-400 text-xs">{errors.category}</p>}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Description
            </label>
            <textarea
              id="description" name="description" rows={3}
              value={form.description} onChange={handleChange}
              placeholder="Product description..."
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e] text-white placeholder-gray-700 text-sm resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Thumbnail URL */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="thumbnail" className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Thumbnail URL
            </label>
            <input
              id="thumbnail" name="thumbnail" type="url"
              value={form.thumbnail} onChange={handleChange}
              placeholder="https://..."
              className="w-full px-4 py-3 rounded-xl bg-[#0a0a0f] border border-[#1e1e2e] text-white placeholder-gray-700 text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-[#1e1e2e] text-gray-400 text-sm font-semibold hover:text-white hover:border-white/15 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold transition-all disabled:opacity-50"
            >
              {saving ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
