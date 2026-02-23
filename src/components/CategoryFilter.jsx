// src/components/CategoryFilter.jsx
export default function CategoryFilter({ categories, selected, onChange }) {
  return (
    <div className="relative w-full sm:w-56">
      <select
        value={selected}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Filter by category"
        className="w-full appearance-none px-4 py-3 pr-9 rounded-xl bg-[#111118] border border-[#1e1e2e] text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors duration-200"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>
      {/* Dropdown arrow */}
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">
        ▼
      </span>
    </div>
  );
}
