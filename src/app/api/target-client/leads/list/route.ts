import { NextRequest, NextResponse } from "next/server"

const API_URL = "https://api.revenueinfra.com/run/target-client/leads/list"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: `API error: ${response.status}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error proxying target-client leads list:", error)
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    )
  }
}
