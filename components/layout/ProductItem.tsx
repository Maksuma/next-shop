import { PagesConfig } from "@/config/pages.config"
import { TProduct } from "@/db"
import { priceFormat } from "@/utils/price-firmat"
import { Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function ProductItem(props: TProduct) {
  const hasDiscount = !!props.discountPrice

  return (
    <Link href={PagesConfig.PRODUCT_DETAILS(props.linkName)} aria-label={props.name}>
      <article className='group relative flex flex-col h-full border border-border rounded-2xl overflow-hidden bg-card hover:shadow-md transition-shadow duration-200'>
        {/* Image */}
        <div className='relative aspect-square overflow-hidden bg-muted'>
          <Image
            src={props.images[0]}
            alt={props.name}
            fill
            className='object-cover group-hover:scale-105 transition-transform duration-300'
            sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
          />
          {hasDiscount && (
            <span className='absolute top-2.5 left-2.5 bg-destructive text-destructive-foreground text-[11px] font-semibold px-2 py-0.5 rounded-full leading-tight text-white'>
              Скидка {Math.round(((props.price - props.discountPrice!) / props.price) * 100)}%
            </span>
          )}
          {props.atStock === 0 && (
            <div className='absolute inset-0 bg-background/60 flex items-center justify-center'>
              <span className='text-sm font-medium text-muted-foreground'>Нет в наличии</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className='flex flex-col flex-1 gap-2 p-3.5'>
          <h2 className='text-sm font-medium leading-snug line-clamp-2 text-foreground'>{props.name}</h2>

          {props.rating > 0 && (
            <div className='flex items-center gap-1'>
              <Star className='w-3.5 h-3.5 fill-amber-400 text-amber-400' />
              <span className='text-xs text-muted-foreground font-medium'>{props.rating}</span>
              {props.reviewsCount > 0 && <span className='text-xs text-muted-foreground'>({props.reviewsCount})</span>}
            </div>
          )}

          <div className='flex items-end justify-between mt-auto pt-1'>
            <div className='flex flex-col'>
              {hasDiscount ? (
                <>
                  <span className='text-base font-bold text-foreground'>{priceFormat(props.discountPrice!)}</span>
                  <span className='text-xs text-muted-foreground line-through leading-none'>
                    {priceFormat(props.price)}
                  </span>
                </>
              ) : (
                <span className='text-base font-bold text-foreground'>{priceFormat(props.price)}</span>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}
