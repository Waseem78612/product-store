// src/components/SkeletonCard.jsx
// Shown while products are loading — better UX than a spinner alone
export default function SkeletonCard() {
  return (
    <div className="flex flex-col bg-[#111118] border border-[#1e1e2e] rounded-2xl overflow-hidden">
      <div className="aspect-square shimmer-bg" />
      <div className="p-4 flex flex-col gap-3">
        <div className="h-3 w-1/3 rounded-full shimmer-bg" />
        <div className="h-4 w-full rounded-full shimmer-bg" />
        <div className="h-4 w-3/4 rounded-full shimmer-bg" />
        <div className="h-6 w-1/4 rounded-full shimmer-bg mt-1" />
      </div>
    </div>
  );
}
