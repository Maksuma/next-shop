import z from "zod"

export const editProductSchema = z.object({
  name: z.string().min(1, "Название обязательно для заполнения"),
  description: z.string().optional(),
  price: z.number().positive("Цена должна быть положительным числом"),
  discountPrice: z
    .union([z.number().positive("Цена со скидкой должна быть положительным числом"), z.literal("")])
    .optional(),
  atStock: z.number().int("Количество должно быть целым числом").min(0, "Количество не может быть отрицательным"),
  categoryId: z.number().min(1, "Категория обязательна для выбора"),
  isPopular: z.boolean(),
  images: z.array(z.string()).min(1, "Необходимо добавить хотя бы одно изображение"),
  specifications: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
})

export type EditProductFormValues = z.infer<typeof editProductSchema>
