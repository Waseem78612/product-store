// src/components/ProductCard.jsx
import { useState, useCallback } from "react";

export default function ProductCard({ product, onEdit, onDelete }) {
  const [imgError,   setImgError]   = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const onImgError = useCallback(() => setImgError(true), []);

  const discount = Math.round(product.discountPercentage || 0);
  const original = discount > 0
    ? (product.price / (1 - discount / 100)).toFixed(2)
    : null;

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${product.title}"?`)) return;
    setDeleting(true);
    await onDelete(product.id);
    setDeleting(false);
  };

  return (
    <article className="group flex flex-col bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden hover:border-violet-500/30 hover:shadow-xl hover:shadow-violet-900/10 transition-all duration-300 animate-fadeUp">

      {/* Image */}
      <div className="relative overflow-hidden bg-[#1a1a2a] aspect-square">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center text-5xl text-gray-700">📦</div>
        ) : (
          <img
            src={product.thumbnail}
            alt={product.title}
            onError={onImgError}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {discount > 0 && (
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-violet-600 text-white text-[11px] font-bold">
            -{discount}%
          </div>
        )}
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 backdrop-blur-sm text-yellow-400 text-[11px] font-semibold">
          ★ {product.rating?.toFixed(1) || "N/A"}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-400">
          {product.category}
        </span>
        <h2 className="text-white font-semibold text-sm leading-snug line-clamp-2 flex-1">
          {product.title}
        </h2>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-white font-black text-lg">${product.price}</span>
          {original && (
            <span className="text-gray-600 text-xs line-through">${original}</span>
          )}
        </div>
        <p className={`text-[11px] font-medium ${
          product.stock > 10 ? "text-emerald-500"
          : product.stock > 0 ? "text-yellow-500"
          : "text-red-500"
        }`}>
          {product.stock > 10 ? "✓ In Stock"
           : product.stock > 0 ? `⚠ Only ${product.stock} left`
           : "✗ Out of Stock"}
        </p>
      </div>

      {/* Edit / Delete buttons */}
      {(onEdit || onDelete) && (
        <div className="flex gap-2 px-4 pb-4">
          {onEdit && (
            <button
              onClick={() => onEdit(product)}
              className="flex-1 py-2 rounded-lg bg-[#1e1e2e] hover:bg-violet-500/20 hover:text-violet-400 text-gray-400 text-xs font-semibold transition-all duration-200 border border-[#2a2a3e] hover:border-violet-500/30"
            >
              ✏️ Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2 rounded-lg bg-[#1e1e2e] hover:bg-red-500/20 hover:text-red-400 text-gray-400 text-xs font-semibold transition-all duration-200 border border-[#2a2a3e] hover:border-red-500/30 disabled:opacity-40"
            >
              {deleting ? "..." : "🗑️ Delete"}
            </button>
          )}
        </div>
      )}
    </article>
  );
}
