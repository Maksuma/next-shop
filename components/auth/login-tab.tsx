"use client"

import { authClient } from "@/lib/auth-client"
import { LoginForm, loginSchema } from "@/lib/validations/auth-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { Button } from "../ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { Input } from "../ui/input"
import { LoadingSwap } from "../ui/loading-swap"
import { PasswordInput } from "../ui/password-input"

export function LoginTab() {
  const router = useRouter()
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function handleLogin(data: LoginForm) {
    authClient.signIn.email(
      { ...data, callbackURL: "/" },
      {
        credentials: "include",
        onError: error => {
          toast.error(error.error.status === 401 ? "Неверные учетные данные" : "Ошибка при входе")
        },
        onSuccess: () => {
          router.push("/")
        },
      },
    )
  }

  return (
    <Form {...form}>
      <form className='space-y-4' onSubmit={form.handleSubmit(handleLogin)}>
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

        <Button type='submit' className='w-full mt-4' disabled={form.formState.isSubmitting}>
          <LoadingSwap isLoading={form.formState.isSubmitting}>Войти</LoadingSwap>
        </Button>
      </form>
    </Form>
  )
}
