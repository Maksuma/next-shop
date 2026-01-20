import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonProductsFilters() {
  return (
    <div className='flex flex-col sm:flex-row gap-4'>
      <Skeleton className='h-10 flex-1' />
      <Skeleton className='h-10 w-full sm:w-50' />
      <Skeleton className='h-10 w-full sm:w-50' />
    </div>
  )
}
