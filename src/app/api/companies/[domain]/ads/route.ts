import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/api"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params

  const response = await fetch(`${API_BASE_URL}/api/companies/${encodeURIComponent(domain)}/ads`)
  const data = await response.json()
  return NextResponse.json(data)
}
