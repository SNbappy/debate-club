export default function GlobalLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-3">
          <div className="h-3 w-28 rounded bg-[#0F1E3D]/10 shimmer" />
          <div className="h-9 sm:h-12 w-64 sm:w-96 rounded-2xl bg-[#0F1E3D]/12 shimmer" />
          <div className="space-y-2 pt-2">
            <div className="h-4 w-full max-w-2xl rounded bg-[#0F1E3D]/5 shimmer" />
            <div className="h-4 w-2/3 max-w-xl rounded bg-[#0F1E3D]/5 shimmer" />
          </div>
        </div>

        {/* Filter Tabs Mock */}
        <div className="flex flex-wrap gap-2 pt-2 border-b border-[#0F1E3D]/5 pb-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-9 w-24 rounded-full bg-[#0F1E3D]/5 border border-[#0F1E3D]/8 shimmer" />
          ))}
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="overflow-hidden rounded-[1.55rem] border border-[#0F1E3D]/10 bg-white shadow-[0_10px_30px_rgba(15,30,61,0.04)]">
              {/* Media Block */}
              <div className="aspect-[4/3] w-full bg-[#0F1E3D]/10 shimmer" />
              {/* Content Block */}
              <div className="p-5 space-y-3 bg-[#FDF8EE]/40">
                <div className="h-3 w-16 rounded bg-[#0F1E3D]/10 shimmer" />
                <div className="h-5 w-3/4 rounded-lg bg-[#0F1E3D]/15 shimmer" />
                <div className="h-3.5 w-5/6 rounded bg-[#0F1E3D]/5 shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
