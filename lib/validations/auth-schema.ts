import { z } from "zod"

const emailSchema = z.email("Некорректный email адрес").min(1, "Email обязателен")

const passwordSchema = z
  .string()
  .min(1, "Пароль обязателен")
  .min(8, "Пароль должен содержать минимум 8 символов")
  .regex(/[A-Z]/, "Пароль должен содержать хотя бы одну заглавную букву")
  .regex(/[a-z]/, "Пароль должен содержать хотя бы одну строчную букву")
  .regex(/[0-9]/, "Пароль должен содержать хотя бы одну цифру")

const nameSchema = z
  .string()
  .min(1, "Имя обязательно")
  .min(2, "Имя должно содержать минимум 2 символа")
  .max(50, "Имя не должно превышать 50 символов")
  .regex(/^[a-zA-Zа-яА-ЯёЁ\s-]+$/, "Имя может содержать только буквы, пробелы и дефис")

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Пароль обязателен"),
})

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })

export const forgotPasswordSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Текущий пароль обязателен"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
  })
  .refine(data => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  })
  .refine(data => data.currentPassword !== data.newPassword, {
    message: "Новый пароль должен отличаться от текущего",
    path: ["newPassword"],
  })

export type LoginForm = z.infer<typeof loginSchema>
export type RegisterForm = z.infer<typeof registerSchema>
export type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordForm = z.infer<typeof resetPasswordSchema>
export type ChangePasswordForm = z.infer<typeof changePasswordSchema>
