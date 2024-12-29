'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type PlayerStats = {
  name: string
  gamesPlayed: number
  goals: number
  assists: number
  points: number
}

export default function ProClubsChart() {
  const [data, setData] = useState<PlayerStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<'gamesPlayed' | 'goals' | 'assists' | 'points'>('points')

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://proclubs.ea.com/api/nhl/members/stats?platform=common-gen5&clubId=34385')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        
        // Transform the API data
        const transformedData = result.members?.map((member: any) => ({
          name: member.name || 'Unknown',
          gamesPlayed: member.gamesPlayed || 0,
          goals: member.goals || 0,
          assists: member.assists || 0,
          points: (member.goals || 0) + (member.assists || 0)
        })) || []
        
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

  const sortedData = [...data].sort((a, b) => b[sortKey] - a[sortKey])

  return (
    <div className="w-full h-[500px]">
      <div className="mb-4 space-x-2">
        <button
          onClick={() => setSortKey('gamesPlayed')}
          className={`px-4 py-2 rounded ${sortKey === 'gamesPlayed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Games Played
        </button>
        <button
          onClick={() => setSortKey('goals')}
          className={`px-4 py-2 rounded ${sortKey === 'goals' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Goals
        </button>
        <button
          onClick={() => setSortKey('assists')}
          className={`px-4 py-2 rounded ${sortKey === 'assists' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Assists
        </button>
        <button
          onClick={() => setSortKey('points')}
          className={`px-4 py-2 rounded ${sortKey === 'points' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        >
          Points
        </button>
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

