// src/components/Toast.jsx
// Small success/error notification that auto-hides
import { useEffect } from "react";

export default function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      role="alert"
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold animate-fadeUp
        ${type === "success"
          ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
          : "bg-red-500/15 border border-red-500/30 text-red-400"}`}
    >
      <span>{type === "success" ? "✅" : "❌"}</span>
      {message}
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity text-base leading-none">×</button>
    </div>
  );
}
