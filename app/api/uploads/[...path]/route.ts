import fs from "fs"
import { NextRequest } from "next/server"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: pathSegments } = await params
    const filePath = path.join(process.cwd(), "uploads", ...pathSegments)

    if (!fs.existsSync(filePath)) {
      return new Response("File not found", { status: 404 })
    }

    const fileBuffer = fs.readFileSync(filePath)

    const ext = path.extname(filePath).toLowerCase()
    const contentType =
      {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
      }[ext] || "application/octet-stream"

    return new Response(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error serving file:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
