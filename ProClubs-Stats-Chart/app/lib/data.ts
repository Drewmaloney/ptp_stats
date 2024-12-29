export async function fetchProClubsData() {
  try {
    const response = await fetch('https://proclubs.ea.com/api/nhl/members/stats?platform=common-gen5&clubId=34385', {
      headers: {
        'User-Agent': 'ProClubs-Stats/1.0',
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return null
  }
}

