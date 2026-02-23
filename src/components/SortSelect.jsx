// src/components/SortSelect.jsx
export default function SortSelect({ value, onChange }) {
  return (
    <div className="relative w-full sm:w-52">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort products"
        className="w-full appearance-none px-4 py-3 pr-9 rounded-xl bg-[#111118] border border-[#1e1e2e] text-sm text-white focus:outline-none focus:border-violet-500/50 transition-colors duration-200"
      >
        <option value="default">Sort: Default</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="rating-desc">Rating: Best First</option>
        <option value="name-asc">Name: A → Z</option>
      </select>
      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none text-xs">
        ▼
      </span>
    </div>
  );
}
