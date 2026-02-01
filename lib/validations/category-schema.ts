import z from "zod"

export const addCategorySchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  specifications: z.array(z.string()),
  images: z
    .array(z.string())
    .min(1, "Необходимо добавить хотя бы одно изображение")
    .max(1, "Можно добавить только одно изображение"),
})

export type AddCategoryFormValues = z.infer<typeof addCategorySchema>
