'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"

type PlayerStats = {
  name: string
  gamesPlayed: number
  goals: number
  assists: number
  points: number
  plusMinus: number
  shots: number
  shotPct: number
  saves: number
  savesPct: number
  gaa: number
  breakaways: number
  breakawaysSaved: number
  breakawayPct: number
  passes: number
  passesAttempted: number
  passPct: number
  hits: number
  takeaways: number
  interceptions: number
  blocks: number
  faceoffsWon: number
  faceoffsLost: number
  faceoffPct: number
}

export default function ProClubsStats() {
  const [data, setData] = useState<PlayerStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<keyof PlayerStats>('points')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/stats')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        
        const transformedData = Array.isArray(result.members) 
          ? result.members
              .filter((member: any) => member.name !== 'JP0271')
              .map((member: any) => ({
                name: member.name || 'Unknown',
                gamesPlayed: Number(member.gamesPlayed || 0),
                goals: Number(member.goals || 0),
                assists: Number(member.assists || 0),
                points: Number(member.goals || 0) + Number(member.assists || 0),
                plusMinus: Number(member.plusMinus || 0),
                shots: Number(member.shots || 0),
                shotPct: Number(member.shotPct || 0),
                saves: Number(member.saves || 0),
                savesPct: Number(member.savesPct || 0),
                gaa: Number(member.gaa || 0),
                breakaways: Number(member.breakaways || 0),
                breakawaysSaved: Number(member.breakawaysSaved || 0),
                breakawayPct: Number(member.breakawayPct || 0),
                passes: Number(member.passes || 0),
                passesAttempted: Number(member.passesAttempted || 0),
                passPct: Number(member.passPct || 0),
                hits: Number(member.hits || 0),
                takeaways: Number(member.takeaways || 0),
                interceptions: Number(member.interceptions || 0),
                blocks: Number(member.blocks || 0),
                faceoffsWon: Number(member.faceoffsWon || 0),
                faceoffsLost: Number(member.faceoffsLost || 0),
                faceoffPct: Number(member.faceoffPct || 0),
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

  const statCategories = [
    { key: 'gamesPlayed', label: 'Games Played' },
    { key: 'goals', label: 'Goals' },
    { key: 'assists', label: 'Assists' },
    { key: 'points', label: 'Points' },
    { key: 'plusMinus', label: '+/-' },
    { key: 'shots', label: 'Shots' },
    { key: 'shotPct', label: 'Shot %' },
    { key: 'saves', label: 'Saves' },
    { key: 'savesPct', label: 'Save %' },
    { key: 'gaa', label: 'GAA' },
    { key: 'breakaways', label: 'Breakaways' },
    { key: 'breakawaysSaved', label: 'Breakaways Saved' },
    { key: 'breakawayPct', label: 'Breakaway %' },
    { key: 'passes', label: 'Passes' },
    { key: 'passesAttempted', label: 'Passes Attempted' },
    { key: 'passPct', label: 'Pass %' },
    { key: 'hits', label: 'Hits' },
    { key: 'takeaways', label: 'Takeaways' },
    { key: 'interceptions', label: 'Interceptions' },
    { key: 'blocks', label: 'Blocks' },
    { key: 'faceoffsWon', label: 'Faceoffs Won' },
    { key: 'faceoffsLost', label: 'Faceoffs Lost' },
    { key: 'faceoffPct', label: 'Faceoff %' },
  ] as const

  const handleSort = (key: keyof PlayerStats) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    const multiplier = sortDirection === 'asc' ? 1 : -1
    return multiplier * ((a[sortKey] as number) - (b[sortKey] as number))
  })

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Pro Clubs Player Stats</CardTitle>
        <CardDescription>Click column headers to sort</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="text-left p-2 border-b sticky left-0 bg-gray-100">Player</th>
                {statCategories.map(({ key, label }) => (
                  <th 
                    key={key} 
                    className="p-2 border-b cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSort(key as keyof PlayerStats)}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {label}
                      {sortKey === key && (
                        <span className="text-xs">
                          {sortDirection === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedData.map((player, index) => (
                <tr 
                  key={player.name} 
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="p-2 border-b sticky left-0 font-medium" style={{ backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb' }}>
                    {player.name}
                  </td>
                  {statCategories.map(({ key }) => (
                    <td key={key} className="p-2 border-b text-right">
                      {key.toLowerCase().includes('pct') 
                        ? `${player[key as keyof PlayerStats].toFixed(1)}%`
                        : player[key as keyof PlayerStats].toFixed(0)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

