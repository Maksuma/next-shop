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
  // categories
  static readonly CATEGORY_LIST = `${baseUrl}/api/categories`
  static readonly CATEGORY_DELETE = (id: string | number) => `${baseUrl}/api/categories/${id}`
  static readonly CATEGORY_CREATE = `${baseUrl}/api/categories`
  static readonly CATEGORY_UPDATE = (id: string | number) => `${baseUrl}/api/categories/${id}`
  static readonly CATEGORY_DETAILS = (id: string | number) => `${baseUrl}/api/categories/${id}`
  // upload
  static readonly UPLOAD_IMAGE = `${baseUrl}/api/upload`
  static readonly UPLOADS = `${baseUrl}/api/uploads`
}
