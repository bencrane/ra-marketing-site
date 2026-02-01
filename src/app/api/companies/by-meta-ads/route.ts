import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const queryString = searchParams.toString()

  const url = queryString
    ? `${API_BASE_URL}/api/companies/by-meta-ads?${queryString}`
    : `${API_BASE_URL}/api/companies/by-meta-ads`

  const response = await fetch(url)
  const data = await response.json()
  return NextResponse.json(data)
}
