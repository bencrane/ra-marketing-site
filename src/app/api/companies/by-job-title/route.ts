import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get("title")

  if (!title) {
    return NextResponse.json({ error: "title parameter required" }, { status: 400 })
  }

  const response = await fetch(`${API_BASE_URL}/api/companies/by-job-title?title=${encodeURIComponent(title)}`)
  const data = await response.json()
  return NextResponse.json(data)
}
