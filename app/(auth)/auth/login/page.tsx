import { LoginTab } from "@/components/auth/login-tab"
import { RegistrationTab } from "@/components/auth/registration-tab"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginPage() {
  return (
    <Tabs defaultValue='login' className='max-auto w-full my-6 px-4'>
      <TabsList>
        <TabsTrigger value='login'>Вход</TabsTrigger>
        <TabsTrigger value='register'>Регистрация</TabsTrigger>
      </TabsList>
      <Card>
        <TabsContent value='login'>
          <CardHeader className='text-2xl font-bold pt-6'>
            <CardTitle>Вход</CardTitle>
          </CardHeader>
          <CardContent>
            <LoginTab />
          </CardContent>
        </TabsContent>
        <TabsContent value='register'>
          <CardHeader className='text-2xl font-bold pt-6'>
            <CardTitle>Регистрация</CardTitle>
          </CardHeader>
          <CardContent>
            <RegistrationTab />
          </CardContent>
        </TabsContent>
      </Card>
    </Tabs>
  )
}
