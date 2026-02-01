"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { QueriesConfig } from "@/config/queries.config"
import { TCategory } from "@/db"
import { addCategorySchema } from "@/lib/validations/category-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { ImageUploadManager } from "../image-upload-manager"

type EditCategoryFormValues = z.infer<typeof addCategorySchema>

interface EditCategoryModalProps {
  category: TCategory
  open: boolean
  onOpenChange: (open: boolean) => void
  onCategoryUpdated: () => void
}

export function EditCategoryModal({ category, open, onOpenChange, onCategoryUpdated }: EditCategoryModalProps) {
  const [specifications, setSpecifications] = useState<string[]>(category.specifications || [])
  const [newSpec, setNewSpec] = useState("")

  const form = useForm<EditCategoryFormValues>({
    resolver: zodResolver(addCategorySchema),
    defaultValues: {
      name: category.name,
      specifications: category.specifications || [],
      images: [category.image],
    },
  })

  useEffect(() => {
    setSpecifications(category.specifications || [])
    form.reset({
      name: category.name,
      specifications: category.specifications || [],
      images: [category.image],
    })
  }, [category, form])

  const addSpecification = () => {
    if (newSpec.trim()) {
      const updated = [...specifications, newSpec.trim()]
      setSpecifications(updated)
      form.setValue("specifications", updated)
      setNewSpec("")
    }
  }

  const removeSpecification = (index: number) => {
    const updated = specifications.filter((_, i) => i !== index)
    setSpecifications(updated)
    form.setValue("specifications", updated)
  }

  const onSubmit = async (data: EditCategoryFormValues) => {
    try {
      const response = await fetch(QueriesConfig.CATEGORY_UPDATE(category.id), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          specifications: specifications.length > 0 ? specifications : null,
          images: data.images,
        }),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Ошибка при обновлении категории")
      }

      toast.success("Категория успешно обновлена")
      onCategoryUpdated()
      onOpenChange(false)
    } catch (error) {
      toast.error("Не удалось обновить категорию")
      console.error(error)
    }
  }

  const onDelete = async () => {
    try {
      const response = await fetch(QueriesConfig.CATEGORY_DELETE(category.id), {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Ошибка при удалении категории")
      }

      toast.success("Категория удалена")
      onCategoryUpdated()
      onOpenChange(false)
    } catch (error) {
      toast.error("Не удалось удалить категорию")
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-xl max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Редактировать категорию</DialogTitle>
          <DialogDescription>Внесите изменения в информацию о категории</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название *</FormLabel>
                  <FormControl>
                    <Input placeholder='Введите название категории' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>Характеристики</FormLabel>
              <div className='flex gap-2 mt-2'>
                <Input
                  placeholder='Название характеристики'
                  value={newSpec}
                  onChange={e => setNewSpec(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSpecification()
                    }
                  }}
                />
                <Button type='button' onClick={addSpecification} size='icon' variant='outline'>
                  <Plus className='w-4 h-4' />
                </Button>
              </div>

              {specifications.length > 0 && (
                <div className='mt-3 space-y-2'>
                  {specifications.map((spec, index) => (
                    <div key={index} className='flex items-center gap-2 p-2 bg-gray-50 rounded'>
                      <span className='flex-1 text-sm'>{spec}</span>
                      <Button
                        type='button'
                        size='icon'
                        variant='ghost'
                        onClick={() => removeSpecification(index)}
                        className='h-6 w-6'
                      >
                        <X className='w-4 h-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <FormField
              control={form.control}
              name='images'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Изображения *</FormLabel>
                  <FormControl>
                    <ImageUploadManager
                      images={field.value}
                      onChange={field.onChange}
                      maxImages={1}
                      productName={form.watch("name")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='gap-2'>
              <Button type='button' variant='destructive' onClick={onDelete}>
                Удалить
              </Button>
              <div className='flex-1' />
              <Button type='button' variant='outline' onClick={() => onOpenChange(false)}>
                Отмена
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Сохранить
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
