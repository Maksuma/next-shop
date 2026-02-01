import { QueriesConfig } from "@/config/queries.config"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path: pathSegments } = await params
    const imagePath = pathSegments.join("/")
    console.log("Fetching image from backend:", `${imagePath}`)

    const response = await fetch(`${QueriesConfig.UPLOADS}/${imagePath}`)

    if (!response.ok) {
      return new NextResponse("File not found", { status: 404 })
    }

    const fileBuffer = await response.arrayBuffer()
    const contentType = response.headers.get("Content-Type") || "application/octet-stream"

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch (error) {
    console.error("Error serving file:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
