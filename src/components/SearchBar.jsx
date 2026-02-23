// src/components/SearchBar.jsx
import { useCallback } from "react";

export default function SearchBar({ value, onChange, placeholder = "Search products..." }) {
  const handleClear = useCallback(() => onChange(""), [onChange]);

  return (
    <div className="relative w-full">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none select-none">
        🔍
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full pl-11 pr-10 py-3 rounded-xl bg-[#111118] border border-[#1e1e2e] text-white placeholder-gray-600 text-sm focus:outline-none focus:border-violet-500/50 transition-colors duration-200"
      />
      {value && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-xl leading-none"
        >
          ×
        </button>
      )}
    </div>
  );
}
