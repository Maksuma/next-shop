import fs from "fs/promises"
import path from "path"
import { slugGenerator } from "./slug-generator"

export async function moveImagesFromTemp(productName: string, imageUrls: string[]): Promise<string[]> {
  const uploadsDir = path.join(process.cwd(), "uploads")
  const tempDir = path.join(uploadsDir, "temp-product")
  const productSlug = slugGenerator(productName)
  const productDir = path.join(uploadsDir, productSlug)

  const hasTempFiles = imageUrls.some(url => url.includes("/temp-product/"))
  if (!hasTempFiles) {
    return imageUrls
  }

  await fs.mkdir(productDir, { recursive: true })

  const updatedUrls: string[] = []

  for (const url of imageUrls) {
    if (url.includes("/temp-product/")) {
      // Извлекаем имя файла
      const filename = url.split("/").pop()!
      const oldPath = path.join(tempDir, filename)
      const newPath = path.join(productDir, filename)

      try {
        await fs.access(oldPath)
        await fs.rename(oldPath, newPath)
        updatedUrls.push(`/api/uploads/${productSlug}/${filename}`)
      } catch (error) {
        console.error(`Ошибка перемещения файла ${filename}:`, error)
        updatedUrls.push(url)
      }
    } else {
      updatedUrls.push(url)
    }
  }

  try {
    const remainingFiles = await fs.readdir(tempDir)
    if (remainingFiles.length === 0) {
      await fs.rmdir(tempDir)
    }
  } catch (error) {
    console.error("Ошибка при удалении временной папки:", error)
  }

  return updatedUrls
}
