import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonProductImageCarousel() {
  return (
    <div className='space-y-4'>
      {/* Main image */}
      <Skeleton className='aspect-square w-full rounded-2xl' />

      {/* Thumbnails */}
      <div className='grid grid-cols-4 gap-3'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className='aspect-square w-full rounded-lg' />
        ))}
      </div>
    </div>
  )
}
