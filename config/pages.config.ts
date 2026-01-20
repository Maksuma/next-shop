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

  static PRODUCT_DETAILS(slug: string) {
    return `/products/${slug}`
  }

  // admin
  static readonly DASHBOARD = "/dashboard"
  static readonly DASHBOARD_PRODUCTS = "/dashboard/products"
}
