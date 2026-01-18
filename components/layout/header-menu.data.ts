import { PagesConfig } from "@/config/pages.config"
import { Heart, Package, ShoppingBasket, User } from "lucide-react"

export const headerMenu = [
  {
    title: "Заказы",
    icon: Package,
    href: PagesConfig.ORDERS,
  },
  {
    title: "Избранное",
    icon: Heart,
    href: PagesConfig.FAVORITES,
  },
  {
    title: "Корзина",
    icon: ShoppingBasket,
    href: PagesConfig.CART,
  },
  {
    title: "Войти",
    icon: User,
    href: PagesConfig.LOGIN,
  },
]
