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

// Explicitly define which keys can be sorted
const SORTABLE_KEYS = ['gamesPlayed', 'goals', 'assists', 'points'] as const
type SortableKey = typeof SORTABLE_KEYS[number]

// Type guard to check if a key is sortable
function isSortableKey(key: string): key is SortableKey {
  return SORTABLE_KEYS.includes(key as SortableKey)
}

export default function ProClubsChart() {
  const [data, setData] = useState<PlayerStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortableKey>('points')

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

  // Type-safe sort function
  const sortedData = [...data].sort((a, b) => {
    if (isSortableKey(sortKey)) {
      const valueA = a[sortKey]
      const valueB = b[sortKey]
      if (typeof valueA === 'number' && typeof valueB === 'number') {
        return (b[sortKey] as number) - (a[sortKey] as number)
      }
    }
    return 0
  })

  const sortButtons = SORTABLE_KEYS.map(key => ({
    key,
    label: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
  }))

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

