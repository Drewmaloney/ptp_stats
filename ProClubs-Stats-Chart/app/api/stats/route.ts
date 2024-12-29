import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(
      'https://proclubs.ea.com/api/nhl/members/stats?platform=common-gen5&clubId=34385',
      {
        headers: {
          'User-Agent': 'ProClubs-Stats/1.0',
        },
        next: { revalidate: 60 } // Cache for 1 minute
      }
    )

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    // Ensure we have a valid response structure
    if (!data || !data.members) {
      return NextResponse.json({ members: [] })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching Pro Clubs data:', error)
    return NextResponse.json(
      { members: [], error: 'Failed to fetch Pro Clubs data' },
      { status: 500 }
    )
  }
}

