export class PagesConfig {
  // auth
  static readonly LOGIN = "/auth/login"
  static readonly FORGOT_PASSWORD = "/auth/forgot-password"
  static readonly RESET_PASSWORD = "/auth/reset-password"

  // user
  static readonly HOME = "/"
  static readonly PROFILE = "/profile"
  static readonly CART = "/cart"
  static readonly ORDERS = "/orders"
  static readonly FAVORITES = "/favorites"
  static readonly CATEGORY = "/category"
  static readonly PRODUCT = "/product"

  static CATEGORY_DETAILS(slug: string) {
    return `/category/${slug}`
  }

  static PRODUCT_DETAILS(slug: string) {
    return `/product/${slug}`
  }

  // admin
  static readonly DASHBOARD = "/dashboard"
  static readonly DASHBOARD_PRODUCTS = "/dashboard/products"
  static readonly DASHBOARD_CATEGORIES = "/dashboard/categories"
  static readonly DASHBOARD_ORDERS = "/dashboard/orders"
  static readonly DASHBOARD_USERS = "/dashboard/users"
  static readonly DASHBOARD_SETTINGS = "/dashboard/settings"
}
