import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonProductItem() {
  return (
    <div className='flex flex-col border border-border rounded-2xl overflow-hidden bg-card'>
      <Skeleton className='aspect-square w-full rounded-none' />
      <div className='flex flex-col gap-2 p-3.5'>
        <Skeleton className='h-4 w-4/5' />
        <Skeleton className='h-4 w-3/5' />
        <div className='flex items-end justify-between mt-1'>
          <div className='flex flex-col gap-1'>
            <Skeleton className='h-5 w-20' />
            <Skeleton className='h-3 w-14' />
          </div>
        </div>
      </div>
    </div>
  )
}
