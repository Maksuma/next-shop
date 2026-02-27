"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface ProductImageCarouselProps {
  images: string[]
  productName: string
  hasDiscount: boolean | 0 | null
  discountPercent?: number
}

export function ProductImageCarousel({ images, productName, hasDiscount, discountPercent }: ProductImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % images.length)
  }

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length)
  }

  const goToImage = (index: number) => {
    setCurrentIndex(index)
  }

  return (
    <div className='space-y-4'>
      {/* Главное изображение */}
      <div className='relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group'>
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={image}
              alt={`${productName} - ${index + 1}`}
              fill
              className='object-cover'
              priority={index === 0}
            />
          </div>
        ))}

        {hasDiscount && discountPercent && (
          <div className='absolute top-4 right-4 bg-red-500 text-white px-3 py-1.5 rounded-full font-semibold text-sm z-10'>
            -{discountPercent}%
          </div>
        )}

        {images.length > 1 && (
          <>
            {/* Кнопки навигации */}
            <Button
              variant='secondary'
              size='icon'
              className='absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity'
              onClick={goToPrevious}
            >
              <ChevronLeft className='w-5 h-5' />
            </Button>
            <Button
              variant='secondary'
              size='icon'
              className='absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity'
              onClick={goToNext}
            >
              <ChevronRight className='w-5 h-5' />
            </Button>

            {/* Индикаторы */}
            <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-white w-6" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Миниатюры */}
      {images.length > 1 && (
        <div className='grid grid-cols-4 gap-3'>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden transition-all ${
                index === currentIndex ? "ring-2 ring-blue-500 opacity-100" : "opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={image} alt={`${productName} - миниатюра ${index + 1}`} fill className='object-cover' />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
