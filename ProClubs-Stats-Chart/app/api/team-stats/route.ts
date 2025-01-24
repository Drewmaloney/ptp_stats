import { NextResponse } from "next/server"

export async function GET() {
  try {
    const response = await fetch("https://proclubs.ea.com/api/nhl/clubs/search?platform=common-gen5&clubName=PTP", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`EA Sports API responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Raw API Response:", data)
    console.log("Clubs data:", data.clubs)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching Team stats:", error)
    return NextResponse.json({ error: "Failed to fetch team stats" }, { status: 500 })
  }
}

