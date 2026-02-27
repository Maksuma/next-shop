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
import { QueriesConfig } from "@/config/queries.config"
import { TCategory } from "@/db"
import { EditProductFormValues, editProductSchema } from "@/lib/validations/product-schema"
import { revalidateProducts } from "@/utils/revalidate"
import { truncateText } from "@/utils/truncate-text"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { ImageUploadManager } from "../image-upload-manager"

interface AddProductModalProps {
  categories: TCategory[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductAdded: () => void
}

export function AddProductModal({ categories, open, onOpenChange, onProductAdded }: AddProductModalProps) {
  const form = useForm<EditProductFormValues>({
    resolver: zodResolver(editProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      discountPrice: "",
      atStock: 0,
      categoryId: categories[0]?.id || 1,
      isPopular: false,
      images: [],
      specifications: [],
    },
  })

  useEffect(() => {
    if (open && categories.length > 0) {
      const currentCategoryId = form.getValues("categoryId")
      const category = categories.find(c => c.id === currentCategoryId)
      if (category?.specifications) {
        const specs = category.specifications.map(name => ({ name, value: "" }))
        form.setValue("specifications", specs)
      }
    }
  }, [open, categories, form])

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
    } else {
      form.setValue("specifications", [])
    }
  }

  const onSubmit = async (data: EditProductFormValues) => {
    try {
      const response = await fetch(QueriesConfig.PRODUCT_CREATE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Ошибка при создании продукта")
      }

      toast.success("Продукт успешно создан")
      form.reset()
      onProductAdded()
      onOpenChange(false)
      await revalidateProducts()
    } catch (error) {
      toast.error("Не удалось создать продукт")
      console.error(error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[90vh] overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Добавить продукт</DialogTitle>
          <DialogDescription>Заполните информацию о новом продукте</DialogDescription>
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
                        onChange={e => {
                          const value = e.target.value
                          field.onChange(value === "" ? "" : Number(value))
                        }}
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
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
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
                  {field.value && field.value.length > 0 && (
                    <>
                      <FormLabel>Характеристики</FormLabel>
                      <div className='space-y-3'>
                        {field.value.map((spec, index) => (
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
                      </div>
                    </>
                  )}
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
                      productName={form.watch("name") || "temp-product"}
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
                onClick={() => {
                  onOpenChange(false)
                  form.reset()
                }}
              >
                Отмена
              </Button>
              <Button type='submit' disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Создание...
                  </>
                ) : (
                  "Создать продукт"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
