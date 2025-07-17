import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  const n8nUrl = process.env.NEXT_PUBLIC_N8N_SCHEDULE_WEBHOOK_URL
  if (!n8nUrl)
    return NextResponse.json({ success: false, message: "Schedule webhook URL not configured" }, { status: 500 })
console.log("caeacdsacddac");
  const n8nRes = await fetch(n8nUrl, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  })

  const body = await n8nRes.json().catch(async () => ({
    raw: await n8nRes.text(),
  }))
  console.log("caeacdsacddac.....",body);


  return NextResponse.json(body, { status: n8nRes.status })
}
