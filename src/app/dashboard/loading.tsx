export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2.5">
        <div className="h-8 w-60 rounded-xl bg-[#0F1E3D]/10 shimmer" />
        <div className="h-4 w-80 rounded-lg bg-[#0F1E3D]/5 shimmer" />
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 grid-cols-3 sm:grid-cols-3 max-w-2xl">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-2xl border border-[#0F1E3D]/8 bg-white/60 p-4 shadow-sm">
            <div className="h-3 w-16 rounded bg-[#0F1E3D]/10 shimmer" />
            <div className="mt-3 h-5 w-10 rounded bg-[#0F1E3D]/15 shimmer" />
          </div>
        ))}
      </div>

      {/* List / Cards Skeleton */}
      <div className="space-y-4 max-w-4xl pt-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#0F1E3D]/8 bg-white/60 p-5 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1 space-y-3">
                <div className="h-4 w-1/3 rounded bg-[#0F1E3D]/10 shimmer" />
                <div className="h-3.5 w-1/4 rounded bg-[#0F1E3D]/5 shimmer" />
                <div className="h-3 w-1/2 rounded bg-[#0F1E3D]/5 shimmer" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#0F1E3D]/10 shimmer" />
                <div className="h-8 w-8 rounded-lg bg-[#0F1E3D]/10 shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

