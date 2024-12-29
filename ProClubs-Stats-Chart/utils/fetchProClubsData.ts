export async function fetchProClubsData() {
  const response = await fetch('/api/stats')
  if (!response.ok) {
    throw new Error('Failed to fetch data')
  }
  const data = await response.json()
  
  // Transform the data if needed
  if (data.error) {
    throw new Error(data.error)
  }

  return data
}

