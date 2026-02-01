import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/api"

export async function GET() {
  const response = await fetch(`${API_BASE_URL}/api/admin/gaps/recipes`)
  const data = await response.json()
  return NextResponse.json(data)
}
