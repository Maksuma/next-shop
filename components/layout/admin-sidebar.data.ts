import { PagesConfig } from "@/config/pages.config"
import { FolderTree, LayoutDashboard, Package, Settings, ShoppingCart, Users } from "lucide-react"

export const sidebarItems = [
  {
    title: "Обзор",
    href: PagesConfig.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    title: "Товары",
    href: PagesConfig.DASHBOARD_PRODUCTS,
    icon: Package,
  },
  {
    title: "Категории",
    href: PagesConfig.DASHBOARD_CATEGORIES,
    icon: FolderTree,
  },
  {
    title: "Заказы",
    href: PagesConfig.DASHBOARD_ORDERS,
    icon: ShoppingCart,
  },
  {
    title: "Пользователи",
    href: PagesConfig.DASHBOARD_USERS,
    icon: Users,
  },
  {
    title: "Настройки",
    href: PagesConfig.DASHBOARD_SETTINGS,
    icon: Settings,
  },
]
