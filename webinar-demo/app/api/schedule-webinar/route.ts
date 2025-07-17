import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const n8nUrl = process.env.NEXT_PUBLIC_N8N_SCHEDULE_WEBHOOK_URL
  if (!n8nUrl)
    return NextResponse.json({ success: false, message: "Schedule webhook URL not configured" }, { status: 500 })

  const payload = await request.json()
  const n8nRes = await fetch(n8nUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })

  const body = await n8nRes.json().catch(async () => ({
    raw: await n8nRes.text(),
  }))

  return NextResponse.json(body, { status: n8nRes.status })
}
