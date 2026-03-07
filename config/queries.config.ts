const baseUrl = process.env.NEXT_PUBLIC_BASE_URL

if (!baseUrl) {
  throw new Error("BASE_URL is not defined in environment variables")
}

export class QueriesConfig {
  // products
  static readonly PRODUCT_LIST = `${baseUrl}/api/products`
  static readonly PRODUCT_DELETE = (id: string | number) => `${baseUrl}/api/products/${id}`
  static readonly PRODUCT_CREATE = `${baseUrl}/api/products`
  static readonly PRODUCT_UPDATE = (id: string | number) => `${baseUrl}/api/products/${id}`
  static readonly PRODUCT_DETAILS = (id: string | number) => `${baseUrl}/api/products/${id}`
  static readonly PRODUCTS_IN_CATEGORIES = (id: string | number) => `${baseUrl}/api/products?categoryId=${id}`
  static readonly PRODUCT_BY_SLUG = (slug: string) => `${baseUrl}/api/products/${slug}`

  // categories
  static readonly CATEGORY_LIST = `${baseUrl}/api/categories`
  static readonly CATEGORY_BY_SLUG = (slug: string) => `${baseUrl}/api/categories/${slug}`
  static readonly CATEGORY_DELETE = (id: string | number) => `${baseUrl}/api/categories/${id}`
  static readonly CATEGORY_CREATE = `${baseUrl}/api/categories`
  static readonly CATEGORY_UPDATE = (id: string | number) => `${baseUrl}/api/categories/${id}`
  static readonly CATEGORY_DETAILS = (id: string | number) => `${baseUrl}/api/categories/${id}`
  // upload
  static readonly UPLOAD_IMAGE = `${baseUrl}/api/upload`
  static readonly UPLOADS = `${baseUrl}/api/uploads`

  // user
  static readonly USER_SESSION = `${baseUrl}/api/auth/get-session`

  // cart
  static readonly CART = `${baseUrl}/api/cart`
  static readonly CART_ADD_ITEM = `${baseUrl}/api/cart/items`
  static readonly CART_UPDATE_ITEM = (id: number) => `${baseUrl}/api/cart/items/${id}`
  static readonly CART_REMOVE_ITEM = (id: number) => `${baseUrl}/api/cart/items/${id}`
  static readonly CART_CLEAR = `${baseUrl}/api/cart`

  // checkout
  static readonly CHECKOUT_CREATE_SESSION = `${baseUrl}/api/checkout/create-session`
  static readonly CHECKOUT_VERIFY_SESSION = (sessionId: string) =>
    `${baseUrl}/api/checkout/verify-session?session_id=${sessionId}`
  static readonly ORDERS = `${baseUrl}/api/checkout/orders`
  static readonly ORDER_DETAILS = (id: string) => `${baseUrl}/api/checkout/orders/${id}`
}
