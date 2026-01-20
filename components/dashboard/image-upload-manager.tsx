"use client"

import { Button } from "@/components/ui/button"
import { DndContext, DragEndEvent, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { GripVertical, Loader2, Trash2, Upload } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

interface ImageItem {
  id: string
  url: string
  order: number
}

interface ImageUploadManagerProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  productName?: string // Название продукта для создания папки
}

interface SortableImageProps {
  image: ImageItem
  onRemove: (id: string) => void
}

function SortableImage({ image, onRemove }: SortableImageProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: image.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='group relative aspect-square overflow-hidden rounded-lg border border-gray-200 bg-gray-50'
    >
      <Image src={image.url} alt={image.id} fill sizes='(max-width: 768px) 100vw, 16vw' className='object-cover' />

      <div className='absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100'>
        <Button
          type='button'
          size='icon'
          variant='secondary'
          className='h-8 w-8 cursor-grab active:cursor-grabbing'
          {...attributes}
          {...listeners}
        >
          <GripVertical className='h-4 w-4' />
        </Button>
        <Button type='button' size='icon' variant='destructive' className='h-8 w-8' onClick={() => onRemove(image.id)}>
          <Trash2 className='h-4 w-4' />
        </Button>
      </div>

      {/* Order badge */}
      <div className='absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-white'>
        {image.order + 1}
      </div>
    </div>
  )
}

export function ImageUploadManager({ images, onChange, maxImages = 10, productName }: ImageUploadManagerProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [imageItems, setImageItems] = useState<ImageItem[]>(
    images.map((url, index) => ({
      id: `${url}-${index}`,
      url,
      order: index,
    })),
  )

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
  )

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (imageItems.length + acceptedFiles.length > maxImages) {
        toast.error(`Можно загрузить максимум ${maxImages} изображений`)
        return
      }

      setIsUploading(true)

      try {
        const uploadPromises = acceptedFiles.map(async file => {
          const formData = new FormData()
          formData.append("file", file)

          // Добавляем название продукта, если оно есть
          if (productName) {
            formData.append("productName", productName)
          }

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            throw new Error(`Ошибка загрузки ${file.name}`)
          }

          const data = await response.json()
          return data.url
        })

        const uploadedUrls = await Promise.all(uploadPromises)

        const newImageItems: ImageItem[] = uploadedUrls.map((url, index) => ({
          id: `${url}-${Date.now()}-${index}`,
          url,
          order: imageItems.length + index,
        }))

        const updatedItems = [...imageItems, ...newImageItems]
        setImageItems(updatedItems)
        onChange(updatedItems.map(item => item.url))

        toast.success(`Загружено изображений: ${uploadedUrls.length}`)
      } catch (error) {
        console.error("Upload error:", error)
        toast.error("Ошибка при загрузке изображений")
      } finally {
        setIsUploading(false)
      }
    },
    [imageItems, maxImages, onChange, productName],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: maxImages - imageItems.length,
    disabled: isUploading || imageItems.length >= maxImages,
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = imageItems.findIndex(item => item.id === active.id)
      const newIndex = imageItems.findIndex(item => item.id === over.id)

      const reorderedItems = arrayMove(imageItems, oldIndex, newIndex).map((item, index) => ({
        ...item,
        order: index,
      }))

      setImageItems(reorderedItems)
      onChange(reorderedItems.map(item => item.url))
    }
  }

  const handleRemove = (id: string) => {
    const filteredItems = imageItems
      .filter(item => item.id !== id)
      .map((item, index) => ({
        ...item,
        order: index,
      }))

    setImageItems(filteredItems)
    onChange(filteredItems.map(item => item.url))
  }

  return (
    <div className='space-y-4'>
      {/* Dropzone */}
      {imageItems.length < maxImages && (
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
            isDragActive
              ? "border-blue-500 bg-blue-50"
              : isUploading
                ? "border-gray-300 bg-gray-50"
                : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input {...getInputProps()} />
          <div className='flex flex-col items-center gap-2'>
            {isUploading ? (
              <>
                <Loader2 className='h-10 w-10 animate-spin text-gray-400' />
                <p className='text-sm text-gray-600'>Загрузка изображений...</p>
              </>
            ) : isDragActive ? (
              <>
                <Upload className='h-10 w-10 text-blue-500' />
                <p className='text-sm font-medium text-blue-600'>Отпустите файлы для загрузки</p>
              </>
            ) : (
              <>
                <Upload className='h-10 w-10 text-gray-400' />
                <p className='text-sm font-medium text-gray-700'>Перетащите изображения или нажмите для выбора</p>
                <p className='text-xs text-gray-500'>
                  PNG, JPG, JPEG, WEBP до {maxImages} изображений (Осталось: {maxImages - imageItems.length})
                </p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Grid with DnD */}
      {imageItems.length > 0 && (
        <div>
          <p className='mb-2 text-sm font-medium text-gray-700'>
            Изображения ({imageItems.length}/{maxImages})
          </p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={imageItems.map(item => item.id)} strategy={rectSortingStrategy}>
              <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
                {imageItems.map(image => (
                  <SortableImage key={image.id} image={image} onRemove={handleRemove} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      )}

      {imageItems.length === 0 && <p className='text-center text-sm text-gray-500'>Изображения не загружены</p>}
    </div>
  )
}
