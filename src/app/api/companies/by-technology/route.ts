import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/api"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const name = searchParams.get("name")

  if (!name) {
    return NextResponse.json({ error: "name parameter required" }, { status: 400 })
  }

  const response = await fetch(`${API_BASE_URL}/api/companies/by-technology?name=${encodeURIComponent(name)}`)
  const data = await response.json()
  return NextResponse.json(data)
}
