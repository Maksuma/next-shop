"use client"

import { authClient } from "@/lib/auth-client"
import { RegisterForm, registerSchema } from "@/lib/validations/auth-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { LoadingSwap } from "../ui/loading-swap"
import { PasswordInput } from "../ui/password-input"

export function RegistrationTab() {
  const router = useRouter()
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function handleRegistration(data: RegisterForm) {
    authClient.signUp.email(
      { ...data, callbackURL: "/" },
      {
        onError: error => {
          toast.error(
            error.error.status === 422 ? "Пользователь с таким email уже существует" : "Ошибка при регистрации",
          )
        },
        onSuccess: () => {
          router.push("/")
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(handleRegistration)}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Почта</FormLabel>
              <FormControl>
                <Input type='email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Подтверждение пароля</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type='submit' className='w-full mt-4' disabled={form.formState.isSubmitting}>
          <LoadingSwap isLoading={form.formState.isSubmitting}>Зарегистрироваться</LoadingSwap>
        </Button>
      </form>
    </Form>
  )
}
