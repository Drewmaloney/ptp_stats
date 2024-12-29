'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface PlayerStats {
  name: string
  gamesPlayed: number
  goals: number
  assists: number
  points: number
}

// Only allow sorting by numeric fields
type NumericKeys = {
  [K in keyof PlayerStats]: PlayerStats[K] extends number ? K : never
}[keyof PlayerStats]

export default function ProClubsChart() {
  const [data, setData] = useState<PlayerStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<NumericKeys>('points')

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://proclubs.ea.com/api/nhl/members/stats?platform=common-gen5&clubId=34385')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        
        // Transform the API data
        const transformedData: PlayerStats[] = (result.members || []).map((member: any) => ({
          name: member.name || 'Unknown',
          gamesPlayed: Number(member.gamesPlayed) || 0,
          goals: Number(member.goals) || 0,
          assists: Number(member.assists) || 0,
          points: Number(member.goals || 0) + Number(member.assists || 0)
        }))
        
        setData(transformedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-[400px]">Loading...</div>
  }

  if (error || !data.length) {
    return <div className="flex justify-center items-center min-h-[400px]">{error || 'No data available'}</div>
  }

  // Sort function that explicitly handles numeric values
  const sortedData = [...data].sort((a, b) => {
    const numA = Number(a[sortKey])
    const numB = Number(b[sortKey])
    return numB - numA
  })

  const sortButtons = [
    { key: 'gamesPlayed' as const, label: 'Games Played' },
    { key: 'goals' as const, label: 'Goals' },
    { key: 'assists' as const, label: 'Assists' },
    { key: 'points' as const, label: 'Points' }
  ]

  return (
    <div className="w-full h-[500px]">
      <div className="mb-4 space-x-2">
        {sortButtons.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSortKey(key)}
            className={`px-4 py-2 rounded ${
              sortKey === key ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={sortedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey={sortKey} fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

