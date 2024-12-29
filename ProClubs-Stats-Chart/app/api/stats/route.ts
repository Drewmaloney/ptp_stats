import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(
      'https://proclubs.ea.com/api/nhl/members/stats?platform=common-gen5&clubId=34385',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json',
          'Origin': 'https://www.ea.com'
        },
        cache: 'no-store'
      }
    )

    if (!response.ok) {
      throw new Error(`EA Sports API responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching Pro Clubs data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Pro Clubs data' },
      { status: 500 }
    )
  }
}

