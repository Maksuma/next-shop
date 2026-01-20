import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonProductItem() {
  return (
    <div className='border rounded p-4 shadow-sm flex flex-col'>
      <Skeleton className='w-full h-[200px]' />
      <div className='mt-4 flex-1 flex flex-col justify-between'>
        <div>
          <Skeleton className='h-6 w-3/4 mb-2' />
          <Skeleton className='h-4 w-full mb-1' />
          <Skeleton className='h-4 w-5/6' />
        </div>
        <Skeleton className='mt-2 h-7 w-24' />
      </div>
    </div>
  )
}
