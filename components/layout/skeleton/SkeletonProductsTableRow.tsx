import { Skeleton } from "@/components/ui/skeleton"
import { TableCell, TableRow } from "@/components/ui/table"

export default function SkeletonProductsTableRow() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className='w-16 h-16 rounded-md' />
      </TableCell>
      <TableCell>
        <div className='space-y-2'>
          <Skeleton className='h-4 w-32' />
          <Skeleton className='h-3 w-48' />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-24' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-20' />
      </TableCell>
      <TableCell>
        <Skeleton className='h-4 w-16' />
      </TableCell>
      <TableCell className='text-center'>
        <div className='flex justify-center'>
          <Skeleton className='h-6 w-12 rounded-full' />
        </div>
      </TableCell>
      <TableCell className='text-center'>
        <div className='flex justify-center'>
          <Skeleton className='h-9 w-36' />
        </div>
      </TableCell>
    </TableRow>
  )
}
