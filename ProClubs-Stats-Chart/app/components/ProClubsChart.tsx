'use client'

import { useEffect, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

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
  const [sortKey, setSortKey] = useState<keyof PlayerStats>('points')

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        
        // Transform the API data into the correct format
        const transformedData = Array.isArray(result.members) 
          ? result.members.map((member: any) => ({
              name: member.name || 'Unknown',
              gamesPlayed: member.gamesPlayed || 0,
              goals: member.goals || 0,
              assists: member.assists || 0,
              points: (member.goals || 0) + (member.assists || 0)
            }))
          : []
        
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
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    )
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Data Available</CardTitle>
          <CardDescription>No player statistics found</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const sortedData = [...data].sort((a, b) => b[sortKey] - a[sortKey])

  const sortButtons: { key: keyof PlayerStats; label: string }[] = [
    { key: 'gamesPlayed', label: 'Games Played' },
    { key: 'goals', label: 'Goals' },
    { key: 'assists', label: 'Assists' },
    { key: 'points', label: 'Points' },
  ]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pro Clubs Player Stats</CardTitle>
        <CardDescription>Sort by different statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {sortButtons.map(({ key, label }) => (
            <Button
              key={key}
              onClick={() => setSortKey(key)}
              variant={sortKey === key ? 'default' : 'outline'}
            >
              {label}
            </Button>
          ))}
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sortedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey={sortKey} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

