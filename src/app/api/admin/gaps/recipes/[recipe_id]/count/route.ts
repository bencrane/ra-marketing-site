import { NextResponse } from "next/server"
import { API_BASE_URL } from "@/lib/api"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ recipe_id: string }> }
) {
  const { recipe_id } = await params
  const response = await fetch(`${API_BASE_URL}/api/admin/gaps/recipes/${recipe_id}/count`)
  const data = await response.json()
  return NextResponse.json(data)
}
