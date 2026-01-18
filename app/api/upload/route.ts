import fs from "fs/promises"
import path from "path"

export async function POST(request: Request) {
  const formData = await request.formData()
  const images = formData.getAll("images") as File[]

  const uploadsDir = path.join(process.cwd(), "uploads")
  await fs.mkdir(uploadsDir, { recursive: true })

  const savedFiles = []

  for (const image of images) {
    if (image instanceof File && image.size > 0) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
      const filename = uniqueSuffix + "-" + image.name
      const filepath = path.join(uploadsDir, filename)

      await fs.writeFile(filepath, buffer)
      savedFiles.push({ name: image.name, url: `/api/uploads/${filename}` })
    }
  }

  return Response.json({ success: true, files: savedFiles })
}

export async function GET() {
  const uploadsDir = path.join(process.cwd(), "uploads")
  const files = await fs.readdir(uploadsDir)
  const fileUrls = files.map(file => `/api/uploads/${file}`)
  return Response.json({ files: fileUrls })
}
