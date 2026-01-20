import { requireAdmin } from "@/lib/auth-guard"
import { moveImagesFromTemp } from "@/utils/move-images-from-temp"
import { slugGenerator } from "@/utils/slug-generator"
import fs from "fs/promises"
import { NextResponse } from "next/server"
import path from "path"

export async function POST(request: Request) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const images = formData.getAll("images") as File[]
    const productName = formData.get("productName") as string | null

    // Создаем основную папку uploads
    const uploadsDir = path.join(process.cwd(), "uploads")
    await fs.mkdir(uploadsDir, { recursive: true })

    // Если указано название продукта, создаем подпапку
    let targetDir = uploadsDir
    let urlPrefix = "/api/uploads"

    if (productName) {
      const productSlug = slugGenerator(productName)
      targetDir = path.join(uploadsDir, productSlug)
      urlPrefix = `/api/uploads/${productSlug}`
      await fs.mkdir(targetDir, { recursive: true })
    }

    // Single file upload
    if (file && file instanceof File && file.size > 0) {
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      const filename = uniqueSuffix + "-" + file.name
      const filepath = path.join(targetDir, filename)

      await fs.writeFile(filepath, buffer)
      return NextResponse.json({ success: true, url: `${urlPrefix}/${filename}` })
    }

    // Multiple files upload
    const savedFiles = []

    for (const image of images) {
      if (image instanceof File && image.size > 0) {
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const filename = uniqueSuffix + "-" + image.name
        const filepath = path.join(targetDir, filename)

        await fs.writeFile(filepath, buffer)
        savedFiles.push({ name: image.name, url: `${urlPrefix}/${filename}` })
      }
    }

    return NextResponse.json({ success: true, files: savedFiles })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ success: false, error: "Upload failed" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "uploads")
    const files = await fs.readdir(uploadsDir, { withFileTypes: true })
    const fileUrls: string[] = []

    for (const file of files) {
      if (file.isDirectory()) {
        // Читаем файлы из подпапок продуктов
        const subDirPath = path.join(uploadsDir, file.name)
        const subFiles = await fs.readdir(subDirPath)
        subFiles.forEach(subFile => {
          fileUrls.push(`/api/uploads/${file.name}/${subFile}`)
        })
      } else {
        // Файлы в корневой папке uploads
        fileUrls.push(`/api/uploads/${file.name}`)
      }
    }

    return NextResponse.json({ files: fileUrls })
  } catch (error) {
    console.error("Get files error:", error)
    return NextResponse.json({ files: [] })
  }
}

// Endpoint для перемещения файлов из временной папки
export async function PUT(request: Request) {
  const session = await requireAdmin()
  if (session instanceof NextResponse) return session

  try {
    const { productName, imageUrls } = await request.json()

    if (!productName || !imageUrls || !Array.isArray(imageUrls)) {
      return NextResponse.json({ success: false, error: "Необходимы productName и imageUrls" }, { status: 400 })
    }

    const updatedUrls = await moveImagesFromTemp(productName, imageUrls)

    return NextResponse.json({ success: true, imageUrls: updatedUrls })
  } catch (error) {
    console.error("Move images error:", error)
    return NextResponse.json({ success: false, error: "Ошибка перемещения файлов" }, { status: 500 })
  }
}
