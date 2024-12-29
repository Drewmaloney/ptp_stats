'use client'

import { useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

type ProClubsData = {
  name: string
  gamesPlayed: number
  goals: number
  assists: number
  points: number
}

type ProClubsChartProps = {
  data: ProClubsData[]
}

export default function ProClubsChart({ data }: ProClubsChartProps) {
  const [sortKey, setSortKey] = useState<keyof ProClubsData>('points')

  const sortedData = [...data].sort((a, b) => b[sortKey] - a[sortKey])

  const sortButtons: { key: keyof ProClubsData; label: string }[] = [
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

