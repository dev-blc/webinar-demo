import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const n8nUrl = process.env.NEXT_PUBLIC_N8N_UPLOAD_WEBHOOK_URL
  if (!n8nUrl)
    return NextResponse.json({ success: false, message: "Upload webhook URL not configured" }, { status: 500 })

  // Grab the multipart body (Excel file)
  const formData = await request.formData()
  // Forward the same formData to n8n
  const n8nRes = await fetch(n8nUrl, { method: "POST", body: formData })

  // Return the n8n response untouched
  const contentType = n8nRes.headers.get("content-type") ?? ""
  const body = contentType.includes("application/json") ? await n8nRes.json() : await n8nRes.text()

  // Normalise n8n response so the client always gets {success, webinars}
  let normalised: unknown
  if (Array.isArray(body)) {
    normalised = { success: true, webinars: body }
  } else if (body && typeof body === "object" && "webinars" in body) {
    normalised = body
  } else {
    normalised = { success: false, message: "Unexpected response from n8n", raw: body }
  }

  return NextResponse.json(normalised, { status: n8nRes.status })
}
