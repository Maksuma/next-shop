import z from "zod"

export const addCategorySchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  specifications: z.array(z.string()),
})

export type AddCategoryFormValues = z.infer<typeof addCategorySchema>
