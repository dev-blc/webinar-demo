"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  Play,
  Database,
  Mail,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock,
  Copy,
  ExternalLink,
  Send,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ApiResponse {
  status: number
  data: any
  timestamp: string
  duration: number
}

interface WebinarData {
  webinar_id?: string
  id?: string
  webinar_name?: string
  name?: string
  date: string
  time: string
  presenter?: {
    name: string
    email: string
    phone: string
  }
  presenterName?: string
  presenterEmail?: string
  presenterPhone?: string
  attendee?: {
    name: string
    email: string
    phone: string
  }
  attendeeName?: string
  attendeeEmail?: string
  attendeePhone?: string
  zoom?: {
    meeting_id: string
    join_url: string
    host_url: string
    password: string
  }
  zoomLink?: string
  google_meet?: {
    event_id: string
    meet_link: string
    calendar_link: string
  }
  meetLink?: string
  created_at?: string
}

export default function DemoPage() {
  // Base URL for API calls, now pointing to the Next.js proxy routes
  const [baseUrl, setBaseUrl] = useState("") // Empty string means relative path, e.g., /api/upload-webinars
  const [responses, setResponses] = useState<Record<string, ApiResponse>>({})
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [webinars, setWebinars] = useState<WebinarData[]>([])
  const [activeTab, setActiveTab] = useState("upload")
  const { toast } = useToast()
  const [fileInputKey, setFileInputKey] = useState(0)
  const [bulkReminderResults, setBulkReminderResults] = useState<Record<string, ApiResponse>>({})

  const executeRequest = async (endpoint: string, method: string, body?: any, isFormData = false) => {
    const startTime = Date.now()
    setLoading((prev) => ({ ...prev, [endpoint]: true }))

    try {
      const options: RequestInit = {
        method,
        headers: isFormData ? {} : { "Content-Type": "application/json" },
      }

      if (body) {
        options.body = isFormData ? body : JSON.stringify(body)
      }

      // Construct the URL to call the Next.js proxy route
      const url = `${baseUrl}/api/${endpoint}`

      const response = await fetch(url, options)

      let data
      try {
        data = await response.json()
        console.log("data",data)
      } catch {
        data = { raw: await response.text() }
      }

      const duration = Date.now() - startTime

      const apiResponse: ApiResponse = {
        status: response.status,
        data,
        timestamp: new Date().toISOString(),
        duration,
      }

      setResponses((prev) => ({ ...prev, [endpoint]: apiResponse }))

      // Update webinars state based on response from upload or get webinars
      if (endpoint === "upload-webinars" || endpoint === "webinars") {
        // Corrected endpoint name
        let extractedWebinars: WebinarData[] = []

        if (Array.isArray(data)) {
          extractedWebinars = data
        } else if (data.webinars && Array.isArray(data.webinars)) {
          extractedWebinars = data.webinars
        } else if (data.success && Array.isArray(data.data)) {
          extractedWebinars = data.data
        } else if (data && typeof data === "object" && !Array.isArray(data)) {
          extractedWebinars = [data]
        }

        if (extractedWebinars.length > 0) {
          setWebinars(extractedWebinars)
        }
      }

      toast({
        title: "Request Completed",
        description: `${method} /api/${endpoint} - ${response.status} (${duration}ms)`,
      })

      return apiResponse
    } catch (error) {
      const duration = Date.now() - startTime
      const apiResponse: ApiResponse = {
        status: 0,
        data: { error: error instanceof Error ? error.message : "Network error" },
        timestamp: new Date().toISOString(),
        duration,
      }

      setResponses((prev) => ({ ...prev, [endpoint]: apiResponse }))

      toast({
        title: "Request Completed",
        description: `${method} /api/${endpoint} - Network issue (${duration}ms)`,
      })

      return apiResponse
    } finally {
      setLoading((prev) => ({ ...prev, [endpoint]: false }))
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("data", file)

    // Corrected endpoint name to match the proxy route
    await executeRequest("upload-webinars", "POST", formData, true)
  }

  const sendBulkReminders = async () => {
    if (webinars.length === 0) {
      toast({
        title: "No webinars found",
        description: "Please upload webinar data first",
      })
      return
    }

    setLoading((prev) => ({ ...prev, "bulk-reminders": true }))
    setBulkReminderResults({})

    const results: Record<string, ApiResponse> = {}
    let successCount = 0
    const totalCount = webinars.length

    toast({
      title: "Sending bulk reminders",
      description: `Processing ${totalCount} webinars...`,
    })

    for (const webinar of webinars) {
      const webinarId = getWebinarId(webinar)
      if (webinarId && webinarId !== "N/A") {
        try {
          // Call the send-reminders proxy route with the webinar_id in the body
          const result = await executeRequest("send-reminders", "POST", { webinar_id: webinarId }, false)
          results[webinarId] = result
          if (result.status >= 200 && result.status < 300) {
            successCount++
          }
        } catch (error) {
          results[webinarId] = {
            status: 0,
            data: { error: "Failed to send reminder" },
            timestamp: new Date().toISOString(),
            duration: 0,
          }
        }
      }
    }

    setBulkReminderResults(results)
    setLoading((prev) => ({ ...prev, "bulk-reminders": false }))

    toast({
      title: "Bulk reminders completed",
      description: `${successCount}/${totalCount} reminders sent successfully`,
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({ title: "Copied to clipboard" })
  }

  const clearAllData = () => {
    setResponses({})
    setWebinars([])
    setBulkReminderResults({})
    setFileInputKey((prev) => prev + 1)
    const webinarIdInput = document.getElementById("webinar-id") as HTMLInputElement
    if (webinarIdInput) {
      webinarIdInput.value = "WEB001"
    }
    toast({ title: "Data cleared", description: "All responses and webinar data have been cleared" })
  }

  const triggerFileUpload = () => {
    const input = document.getElementById("excel-file") as HTMLInputElement
    input?.click()
  }

  const ResponseCard = ({ endpoint, title }: { endpoint: string; title: string }) => {
    const response = responses[endpoint]
    if (!response) return null

    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-sm">
            <span>Response: {title}</span>
            <div className="flex items-center gap-2">
              <Badge variant={response.status >= 200 && response.status < 300 ? "default" : "secondary"}>
                {response.status || "Network"}
              </Badge>
              <Badge variant="outline">{response.duration}ms</Badge>
              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(JSON.stringify(response.data, null, 2))}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-64">
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </CardContent>
      </Card>
    )
  }

  const getWebinarId = (webinar: WebinarData) => webinar.webinar_id || webinar.id || "N/A"
  const getWebinarName = (webinar: WebinarData) => webinar.description || webinar.name || "Unnamed Webinar"
  const getAttendeeEmail = (webinar: WebinarData) => webinar.attendees[0]?.email || webinar.attendeeEmail || "N/A"

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">Webinar Management API Demo</h1>
          <p className="text-muted-foreground">Interactive demo for testing your n8n webinar management workflows</p>
        </div>
        <Button variant="outline" onClick={clearAllData} className="flex items-center gap-2 bg-transparent">
          <XCircle className="h-4 w-4" />
          Clear All Data
        </Button>
      </div>

      {/* Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>
            The base URL is now relative to your application. API calls will be made to `/api/[endpoint]`.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="base-url">Base URL (This field is now informational, calls are relative)</Label>
              <Input
                id="base-url"
                value={baseUrl || "Relative to app root"} // Display informational text
                onChange={(e) => setBaseUrl(e.target.value)} // Keep for user to see, but it's not used for actual calls
                disabled // Disable input as it's no longer directly used for API calls
              />
            </div>
            <div className="flex items-end">
              {/* Test connection to /api/webinars (or any other API route) */}
              <Button onClick={() => executeRequest("webinars", "GET")} disabled={loading["webinars"]}>
                Test Connection
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "upload" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            1. Upload Excel
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            2. List Webinars
          </button>
          <button
            onClick={() => setActiveTab("reminders")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "reminders" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            3. Send Reminders
          </button>
          <button
            onClick={() => setActiveTab("results")}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === "results" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
          >
            4. View Results
          </button>
        </div>

        {/* Upload Excel */}
        {activeTab === "upload" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Excel File
              </CardTitle>
              <CardDescription>
                Upload an Excel file with webinar details. This will parse the file and create Zoom/Meet sessions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="excel-file">Excel File (.xlsx, .xls)</Label>
                <Input
                  key={fileInputKey}
                  id="excel-file"
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={loading["upload-webinars"]} // Corrected endpoint name
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={triggerFileUpload}
                  disabled={loading["upload-webinars"]} // Corrected endpoint name
                  className="flex items-center gap-2"
                >
                  {loading["upload-webinars"] ? (
                    <Clock className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  {responses["upload-webinars"] ? "Re-upload File" : "Upload & Process"} {/* Corrected endpoint name */}
                </Button>

                {responses["upload-webinars"] && (
                  <Button
                    variant="outline"
                    onClick={triggerFileUpload}
                    disabled={loading["upload-webinars"]} // Corrected endpoint name
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <Upload className="h-4 w-4" />
                    Choose Different File
                  </Button>
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>
                  <strong>Expected Excel format:</strong>
                </p>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>Webinar ID, Name, Date, Time</li>
                  <li>Presenter Name, Email, Phone</li>
                  <li>Attendee Name, Email, Phone</li>
                </ul>
              </div>
              <ResponseCard endpoint="upload-webinars" title="Upload Excel" /> {/* Corrected endpoint name */}
            </CardContent>
          </Card>
        )}

        {/* List Webinars */}
        {activeTab === "list" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Get All Webinars
              </CardTitle>
              <CardDescription>Retrieve all scheduled webinars with their meeting links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => executeRequest("webinars", "GET")} // Corrected endpoint name
                disabled={loading["webinars"]} // Corrected endpoint name
                className="flex items-center gap-2"
              >
                {loading["webinars"] ? (
                  <Clock className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                Fetch Webinars
              </Button>
              {webinars.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Webinars ({webinars.length})</h3>
                  <div className="grid gap-4">
                    {webinars.map((webinar, index) => (
                      <Card key={getWebinarId(webinar) || index} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium">{getWebinarName(webinar)}</h4>
                            <p className="text-sm text-muted-foreground">
                              {getWebinarId(webinar)} • {webinar?.start?.dateTime}
                            </p>
                          </div>
                          <Badge variant="outline">{getWebinarId(webinar)}</Badge>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium">Attendee E-Mail</p>
                            <p className="text-muted-foreground">{getAttendeeEmail(webinar)}</p>
                          </div>
                        </div>

                        {(webinar.hangoutLink) && (
                          <div className="mt-3 pt-3 border-t space-y-2">
                            {(webinar.hangoutLink) && (
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary">Meet</Badge>
                                <a
                                  href={webinar.hangoutLink || "#"}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline flex items-center gap-1"
                                >
                                  Join Meeting <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              <ResponseCard endpoint="webinars" title="Get Webinars" /> {/* Corrected endpoint name */}
            </CardContent>
          </Card>
        )}

        {/* Send Reminders */}
        {activeTab === "reminders" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Send Reminders
              </CardTitle>
              <CardDescription>Send email and WhatsApp reminders for webinars</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bulk Reminders Section */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  Send Reminders to All Webinars
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send email and WhatsApp reminders to all presenters and attendees for all uploaded webinars.
                </p>
                <div className="flex items-center gap-4">
                  <Button
                    onClick={sendBulkReminders}
                    disabled={loading["bulk-reminders"] || webinars.length === 0}
                    className="flex items-center gap-2"
                  >
                    {loading["bulk-reminders"] ? (
                      <Clock className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
                        <MessageCircle className="h-4 w-4" />
                      </>
                    )}
                    Send All Reminders ({webinars.length})
                  </Button>
                  {webinars.length === 0 && <p className="text-sm text-muted-foreground">Upload webinar data first</p>}
                </div>

                {/* Bulk Results */}
                {Object.keys(bulkReminderResults).length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium mb-2">Bulk Reminder Results:</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {Object.entries(bulkReminderResults).map(([webinarId, result]) => (
                        <div key={webinarId} className="flex items-center justify-between text-sm p-2 bg-white rounded">
                          <span>{webinarId}</span>
                          <Badge variant={result.status >= 200 && result.status < 300 ? "default" : "secondary"}>
                            {result.status >= 200 && result.status < 300 ? "Sent" : "Failed"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Individual Reminder Section */}
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-4">Send Individual Reminder</h3>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="webinar-id">Webinar ID</Label>
                    <Input id="webinar-id" placeholder="e.g., WEB001" defaultValue="WEB001" />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        const webinarId = (document.getElementById("webinar-id") as HTMLInputElement)?.value
                        if (webinarId) {
                          executeRequest("send-reminders", "POST", { webinar_id: webinarId })
                        }
                      }}
                      disabled={loading["send-reminders"]}
                      className="flex items-center gap-2"
                    >
                      {loading["send-reminders"] ? (
                        <Clock className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Mail className="h-4 w-4" />
                          <MessageCircle className="h-4 w-4" />
                        </>
                      )}
                      Send Single Reminder
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => executeRequest("send-reminders", "POST", { webinar_id: "WEB999" })}
                      disabled={loading["send-reminders"]}
                    >
                      Test Error Case
                    </Button>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p>
                      <strong>This will send:</strong>
                    </p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Email reminders to presenter and attendee</li>
                      <li>WhatsApp messages to both participants</li>
                      <li>Personalized content with meeting links</li>
                    </ul>
                  </div>
                </div>

                <ResponseCard endpoint="send-reminders" title="Send Individual Reminder" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Summary */}
        {activeTab === "results" && (
          <Card>
            <CardHeader>
              <CardTitle>API Test Results</CardTitle>
              <CardDescription>Summary of all API calls and responses</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(responses).length === 0 && Object.keys(bulkReminderResults).length === 0 ? (
                <p className="text-muted-foreground">No API calls made yet. Start testing from the other tabs.</p>
              ) : (
                <div className="space-y-4">
                  {/* Main API Results */}
                  {Object.entries(responses).map(([endpoint, response]) => (
                    <div key={endpoint} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-3">
                        {response.status >= 200 && response.status < 300 ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-orange-600" />
                        )}
                        <div>
                          <p className="font-medium">/api/{endpoint}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(response.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={response.status >= 200 && response.status < 300 ? "default" : "secondary"}>
                          {response.status || "Network"}
                        </Badge>
                        <Badge variant="outline">{response.duration}ms</Badge>
                      </div>
                    </div>
                  ))}

                  {/* Bulk Reminder Results */}
                  {Object.keys(bulkReminderResults).length > 0 && (
                    <div className="border-t pt-4">
                      <h3 className="font-semibold mb-3">Bulk Reminder Results</h3>
                      {Object.entries(bulkReminderResults).map(([webinarId, result]) => (
                        <div key={webinarId} className="flex items-center justify-between p-3 border rounded mb-2">
                          <div className="flex items-center gap-3">
                            {result.status >= 200 && result.status < 300 ? (
                              <CheckCircle className="h-5 w-5 text-green-600" />
                            ) : (
                              <XCircle className="h-5 w-5 text-orange-600" />
                            )}
                            <div>
                              <p className="font-medium">Reminder: {webinarId}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(result.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={result.status >= 200 && result.status < 300 ? "default" : "secondary"}>
                              {result.status || "Network"}
                            </Badge>
                            <Badge variant="outline">{result.duration}ms</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
