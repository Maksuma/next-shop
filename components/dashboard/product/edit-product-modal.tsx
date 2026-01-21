"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TCategory, TProduct } from "@/db"
import { EditProductFormValues, editProductSchema } from "@/lib/validations/product-schema"
import { truncateText } from "@/utils/truncate-text"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ImageUploadManager } from "../image-upload-manager"

interface EditProductModalProps {
  product: TProduct
  categories: TCategory[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductUpdated: () => void
}

export function EditProductModal({ product, categories, open, onOpenChange, onProductUpdated }: EditProductModalProps) {
  const form = useForm<EditProductFormValues>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: product.name,
      description: product.description || "",
      price: product.price,
      discountPrice: product.discountPrice || "",
      atStock: product.atStock,
      categoryId: product.categoryId,
      isPopular: product.isPopular,
      images: product.images,
      specifications: product.specifications || [],
    },
  })

  useEffect(() => {
    form.reset({
      name: product.name,
      description: product.description || "",
      price: product.price,
      discountPrice: product.discountPrice || "",
      atStock: product.atStock,
      categoryId: product.categoryId,
      isPopular: product.isPopular,
      images: product.images,
      specifications: product.specifications || [],
    })
  }, [product, form])

  const handleCategoryChange = (newCategoryId: number) => {
    form.setValue("categoryId", newCategoryId)

    const category = categories.find(c => c.id === newCategoryId)
    if (category?.specifications) {
      const currentSpecs = form.getValues("specifications") || []
      const newSpecs = category.specifications.map(name => {
        const existing = currentSpecs.find(s => s.name === name)
        return existing || { name, value: "" }
      })
      form.setValue("specifications", newSpecs)
    }
  }

  const onSubmit = async (data: EditProductFormValues) => {
    try {
      const response = await fetch(`/api/product/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Ошибка при обновлении продукта")
      }

      toast.success("Продукт успешно обновлен")
      onProductUpdated()
      onOpenChange(false)
    } catch (error) {
      toast.error("Не удалось обновить продукт")
      console.error(error)
    }
  }

  const onDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/product/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Ошибка при удалении продукта")
      }

      toast.success("Продукт удален")
      onProductUpdated()
      onOpenChange(false)
    } catch (error) {
      toast.error("Не удалось удалить продукт")
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Редактировать продукт</DialogTitle>
          <DialogDescription>Внесите изменения в информацию о продукте</DialogDescription>
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
                    <Input placeholder='Введите название продукта' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Введите описание продукта' rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена *</FormLabel>
                    <FormControl>
                      <Input
                        inputMode='numeric'
                        placeholder='0'
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='discountPrice'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена со скидкой</FormLabel>
                    <FormControl>
                      <Input
                        inputMode='numeric'
                        placeholder='0'
                        {...field}
                        value={field.value || ""}
                        onChange={e => field.onChange(e.target.value === "" ? "" : Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <FormField
                control={form.control}
                name='atStock'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Количество на складе *</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='0'
                        min='0'
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='categoryId'
                render={({ field }) => {
                  const selectedCategory = categories.find(c => c.id === field.value)
                  return (
                    <FormItem>
                      <FormLabel>Категория *</FormLabel>
                      <Select
                        onValueChange={value => handleCategoryChange(Number(value))}
                        value={field.value?.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Выберите категорию'>
                              {selectedCategory ? truncateText(selectedCategory.name, 20) : "Выберите категорию"}
                            </SelectValue>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories
                            .filter(c => c.id !== undefined)
                            .map(category => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )
                }}
              />
            </div>

            <FormField
              control={form.control}
              name='isPopular'
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <div className='space-y-1 leading-none'>
                    <FormLabel>Популярный товар</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='specifications'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Характеристики</FormLabel>
                  {field.value?.map((spec, index) => (
                    <div key={index} className='space-y-2'>
                      <FormLabel className='text-sm font-normal'>{spec.name}</FormLabel>
                      <Input
                        placeholder={`Введите ${spec.name.toLowerCase()}`}
                        value={spec.value}
                        onChange={e => {
                          const updatedSpecs = [...(field.value || [])]
                          updatedSpecs[index].value = e.target.value
                          field.onChange(updatedSpecs)
                        }}
                      />
                    </div>
                  ))}
                </FormItem>
              )}
            />

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
                      maxImages={10}
                      productName={form.watch("name")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Отмена
              </Button>
              <Button
                type='button'
                variant='destructive'
                onClick={async () => {
                  await onDelete(product.id)
                }}
                disabled={form.formState.isSubmitting}
              >
                Удалить
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                Сохранить изменения
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
