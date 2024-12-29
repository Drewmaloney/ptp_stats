export async function fetchProClubsData() {
  const response = await fetch('https://proclubs.ea.com/api/nhl/members/stats?platform=common-gen5&clubId=34385')
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  return response.json()
}

