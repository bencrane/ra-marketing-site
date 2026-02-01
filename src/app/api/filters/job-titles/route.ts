import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q") || ""

  const url = q
    ? `${API_BASE_URL}/api/filters/job-titles?q=${encodeURIComponent(q)}`
    : `${API_BASE_URL}/api/filters/job-titles`

  const response = await fetch(url)
  const data = await response.json()
  return NextResponse.json(data)
}
