export default function AdminLoading() {
  return (
    <div className="space-y-6 lg:space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2.5">
        <div className="h-8 w-48 rounded-xl bg-[#0F1E3D]/10 shimmer" />
        <div className="h-4 w-96 rounded-lg bg-[#0F1E3D]/5 shimmer" />
      </div>

      {/* Stats Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl border border-[#0F1E3D]/8 bg-white p-5 shadow-sm">
            <div className="h-3.5 w-24 rounded bg-[#0F1E3D]/10 shimmer" />
            <div className="mt-4 flex items-center justify-between">
              <div className="h-7 w-12 rounded bg-[#0F1E3D]/15 shimmer" />
              <div className="h-5 w-5 rounded-lg bg-[#0F1E3D]/10 shimmer" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Area / List View Skeleton */}
      <div className="rounded-[28px] border border-[#0F1E3D]/10 bg-[#FFFDF8] p-6 shadow-[0_18px_50px_rgba(15,30,61,0.08)] sm:p-7 lg:p-8 space-y-6">
        {/* Mock Filter / Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#0F1E3D]/5 pb-5">
          <div className="h-10 w-72 rounded-xl bg-[#0F1E3D]/5 border border-[#0F1E3D]/8 shimmer" />
          <div className="flex gap-2">
            <div className="h-10 w-24 rounded-xl bg-[#0F1E3D]/5 border border-[#0F1E3D]/8 shimmer" />
            <div className="h-10 w-24 rounded-xl bg-[#0F1E3D]/5 border border-[#0F1E3D]/8 shimmer" />
          </div>
        </div>

        {/* Mock Data Rows */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 rounded-2xl border border-[#0F1E3D]/6 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {/* Profile Circle or Icon Box */}
                <div className="size-11 rounded-2xl bg-[#0F1E3D]/10 shimmer shrink-0" />
                {/* Text Lines */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="h-4 w-1/4 rounded bg-[#0F1E3D]/12 shimmer" />
                  <div className="h-3 w-1/3 rounded bg-[#0F1E3D]/6 shimmer" />
                </div>
              </div>
              
              {/* Actions Box */}
              <div className="flex items-center gap-2">
                <div className="h-9 w-20 rounded-xl bg-[#0F1E3D]/8 shimmer" />
                <div className="h-9 w-9 rounded-xl bg-[#0F1E3D]/5 shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
