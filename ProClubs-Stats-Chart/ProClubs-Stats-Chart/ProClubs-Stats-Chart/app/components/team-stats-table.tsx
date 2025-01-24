"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import type { TeamStats } from "@/types/stats"

// type TeamStats = {
//   name: string
//   seasons: number
//   wins: number
//   losses: number
//   ties: number
//   otl: number
//   goals: number
//   goalsAgainst: number
//   record: string
//   rankingPoints: string
//   promotions: string
//   relegations: string
//   bestDivision: number
//   currentDivision: number
//   divGroupsWon: string
//   leaguesWon: string
//   titlesWon: string
//   starLevel: string
// }

export function TeamStatsTable() {
  const [data, setData] = useState<TeamStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/team-stats")
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const result = await response.json()

        // Get the first (and only) club from the object using Object.values
        const clubData = Object.values(result)[0] as any

        if (!clubData) {
          throw new Error("No club data found")
        }

        setData({
          name: clubData.name || "Unknown",
          seasons: Number(clubData.seasons) || 0,
          wins: Number(clubData.wins) || 0,
          losses: Number(clubData.losses) || 0,
          ties: Number(clubData.ties) || 0,
          otl: Number(clubData.otl) || 0,
          goals: Number(clubData.goals) || 0,
          goalsAgainst: Number(clubData.goalsAgainst) || 0,
          record: clubData.record || "0-0-0",
          rankingPoints: clubData.rankingPoints || "0",
          promotions: clubData.promotions || "0",
          relegations: clubData.relegations || "0",
          bestDivision: Number(clubData.bestDivision) || 0,
          currentDivision: Number(clubData.currentDivision) || 0,
          divGroupsWon: clubData.divGroupsWon || "0",
          leaguesWon: clubData.leaguesWon || "0",
          titlesWon: clubData.titlesWon || "0",
          starLevel: clubData.starLevel || "0",
        })
      } catch (err) {
        console.error("Error fetching team data:", err)
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <Card className="w-full mb-8">
        <CardContent className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return (
      <Card className="w-full mb-8">
        <CardHeader>
          <CardTitle>No Team Data Available</CardTitle>
          <CardDescription>No team statistics found</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {data.name}
          <span className="text-sm font-normal bg-accent text-accent-foreground px-2 py-1 rounded">
            ⭐ Level {data.starLevel}
          </span>
        </CardTitle>
        <CardDescription>
          Division {data.currentDivision} (Best: Division {data.bestDivision})
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Season Record */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Season Record</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Record:</div>
              <div className="text-right font-medium">{data.record}</div>
              <div>Wins:</div>
              <div className="text-right font-medium">{data.wins}</div>
              <div>Losses:</div>
              <div className="text-right font-medium">{data.losses}</div>
              <div>OT Losses:</div>
              <div className="text-right font-medium">{data.otl}</div>
              <div>Win %:</div>
              <div className="text-right font-medium">
                {((data.wins / Math.max(1, data.wins + data.losses + data.otl)) * 100).toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Scoring */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Scoring</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Goals For:</div>
              <div className="text-right font-medium">{data.goals}</div>
              <div>Goals Against:</div>
              <div className="text-right font-medium">{data.goalsAgainst}</div>
              <div>Goal Differential:</div>
              <div className="text-right font-medium">{data.goals - data.goalsAgainst}</div>
              <div>Goals Per Game:</div>
              <div className="text-right font-medium">
                {(data.goals / Math.max(1, data.wins + data.losses + data.otl)).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">Achievements</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>Seasons:</div>
              <div className="text-right font-medium">{data.seasons}</div>
              <div>Titles Won:</div>
              <div className="text-right font-medium">{data.titlesWon}</div>
              <div>Leagues Won:</div>
              <div className="text-right font-medium">{data.leaguesWon}</div>
              <div>Division Titles:</div>
              <div className="text-right font-medium">{data.divGroupsWon}</div>
              <div>Promotions:</div>
              <div className="text-right font-medium">{data.promotions}</div>
              <div>Relegations:</div>
              <div className="text-right font-medium">{data.relegations}</div>
              <div>Ranking Points:</div>
              <div className="text-right font-medium">{data.rankingPoints}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

