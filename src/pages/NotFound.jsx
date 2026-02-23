// src/pages/NotFound.jsx
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <p className="text-8xl font-black text-white/5 mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>404</p>
      <h1 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>Page Not Found</h1>
      <p className="text-gray-500 text-sm mb-6">This page doesn't exist.</p>
      <button
        onClick={() => navigate("/")}
        className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-sm transition-all hover:scale-[1.02] active:scale-95"
      >
        ← Back to Store
      </button>
    </div>
  );
}
