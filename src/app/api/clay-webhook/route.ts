import { NextRequest, NextResponse } from "next/server"

const CLAY_WEBHOOK_URL = "https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-30cc564d-a53b-438c-9b43-6b56eb12f773"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const response = await fetch(CLAY_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    const data = await response.text()

    return NextResponse.json({ success: true, data }, { status: response.status })
  } catch (error) {
    console.error("Clay webhook error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send to Clay" },
      { status: 500 }
    )
  }
}
