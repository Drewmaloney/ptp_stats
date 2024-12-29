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

type NumericKeys = 'gamesPlayed' | 'goals' | 'assists' | 'points'

export default function ProClubsChart() {
  const [data, setData] = useState<PlayerStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<NumericKeys>('points')

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        
        if (result.error) {
          throw new Error(result.error)
        }

        // Transform the API data with explicit number conversions
        const transformedData: PlayerStats[] = (result.members || []).map((member: any) => ({
          name: String(member.name || 'Unknown'),
          gamesPlayed: Number(member.gamesPlayed || 0),
          goals: Number(member.goals || 0),
          assists: Number(member.assists || 0),
          points: Number(member.goals || 0) + Number(member.assists || 0)
        }))
        
        if (transformedData.length === 0) {
          throw new Error('No player data available')
        }

        setData(transformedData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading player statistics...</p>
        </div>
      </div>
    )
  }

  if (error || !data.length) {
    return (
      <div className="flex justify-center items-center min-h-[400px] p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
          <p className="text-red-600">{error || 'No player statistics available'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const sortedData = [...data].sort((a, b) => {
    return Number(b[sortKey]) - Number(a[sortKey])
  })

  const sortButtons: Array<{ key: NumericKeys; label: string }> = [
    { key: 'gamesPlayed', label: 'Games Played' },
    { key: 'goals', label: 'Goals' },
    { key: 'assists', label: 'Assists' },
    { key: 'points', label: 'Points' }
  ]

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6 space-x-2 flex flex-wrap gap-2">
        {sortButtons.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSortKey(key)}
            className={`px-4 py-2 rounded-md transition-colors ${
              sortKey === key 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#4B5563' }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              tick={{ fill: '#4B5563' }}
              tickLine={{ stroke: '#E5E7EB' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '0.375rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            />
            <Bar 
              dataKey={sortKey} 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

