import { ProductImageCarousel } from "@/components/product/ProductImageCarousel"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { PagesConfig } from "@/config/pages.config"
import { priceFormat } from "@/utils/price-firmat"
import { getProductByName } from "@/utils/server-fetch"
import { Check, ShoppingCart, X } from "lucide-react"
import Link from "next/link"

export default async function ProductPage({ params }: { params: Promise<{ productName: string }> }) {
  const { productName } = await params
  const product = await getProductByName(productName)

  const hasDiscount = product.discountPrice && product.discountPrice > 0
  const finalPrice = hasDiscount ? product.discountPrice : product.price
  const discountPercent = hasDiscount ? Math.round(((product.price - product.discountPrice!) / product.price) * 100) : 0

  return (
    <div className='container mx-auto px-4 py-8 max-w-7xl'>
      {/* Breadcrumb */}
      <div className='text-sm text-gray-500 mb-6'>
        <Link href={PagesConfig.HOME} className='hover:text-gray-900 cursor-pointer'>
          Главная
        </Link>
        <span className='mx-2'>/</span>
        <Link href={PagesConfig.CATEGORY} className='hover:text-gray-900 cursor-pointer'>
          Категория
        </Link>
        <span className='mx-2'>/</span>
        <span className='text-gray-900 font-medium'>{product.name}</span>
      </div>

      <div className='grid lg:grid-cols-2 gap-8 lg:gap-12'>
        {/* Галерея изображений */}
        <ProductImageCarousel
          images={product.images}
          productName={product.name}
          hasDiscount={hasDiscount}
          discountPercent={discountPercent}
        />

        {/* Информация о продукте */}
        <div className='space-y-6'>
          <div>
            <h1 className='text-3xl lg:text-4xl font-bold text-gray-900 mb-3'>{product.name}</h1>
            {product.rating > 0 && (
              <div className='flex items-center gap-2 text-sm text-gray-600'>
                <div className='flex items-center gap-1'>
                  <span className='text-yellow-500'>★</span>
                  <span className='font-medium'>{(product.rating / 10).toFixed(1)}</span>
                </div>
                <span>•</span>
                <span>{product.reviewsCount} отзывов</span>
              </div>
            )}
          </div>

          {/* Цена */}
          <div className='flex items-baseline gap-3'>
            <span className='text-4xl font-bold text-gray-900'>{priceFormat(finalPrice!)} ₽</span>
            {hasDiscount && <span className='text-2xl text-gray-400 line-through'>{priceFormat(product.price)} ₽</span>}
          </div>

          {/* Наличие */}
          <div className='flex items-center gap-2'>
            {product.atStock > 0 ? (
              <>
                <Check className='w-5 h-5 text-green-500' />
                <span className='text-green-700 font-medium'>В наличии: {product.atStock} шт</span>
              </>
            ) : (
              <>
                <X className='w-5 h-5 text-red-500' />
                <span className='text-red-700 font-medium'>Нет в наличии</span>
              </>
            )}
          </div>

          {/* Описание */}
          {product.description && (
            <div className='border-t border-b py-6'>
              <h2 className='text-lg font-semibold mb-3'>Описание</h2>
              <p className='text-gray-600 leading-relaxed'>{product.description}</p>
            </div>
          )}

          {/* Характеристики */}
          {product.specifications && product.specifications.length > 0 && (
            <Card className='p-6'>
              <h2 className='text-lg font-semibold mb-4'>Характеристики</h2>
              <div className='space-y-3'>
                {product.specifications.map((spec, index) => (
                  <div key={index} className='flex justify-between py-2 border-b last:border-0'>
                    <span className='text-gray-600'>{spec.name}</span>
                    <span className='font-medium text-gray-900'>{spec.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Кнопка добавить в корзину */}
          <div className='bottom-4 bg-white pt-4 space-y-3'>
            <Button size='lg' className='w-full text-lg h-14' disabled={product.atStock === 0}>
              <ShoppingCart className='w-5 h-5 mr-2' />
              {product.atStock > 0 ? "Добавить в корзину" : "Нет в наличии"}
            </Button>
            <Button size='lg' variant='outline' className='w-full text-lg h-14' disabled={product.atStock === 0}>
              Купить в один клик
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
