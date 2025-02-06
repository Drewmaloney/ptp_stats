"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import type { PlayerStats } from "@/types/stats"

const formatCellValue = (key: string, value: any) => {
  if (key === "record" || key === "favoritePosition") {
    return value // Return strings as-is
  }
  if (typeof value === "number") {
    if (key.toLowerCase().includes("pct") || key.toLowerCase().includes("pg")) {
      return `${value.toFixed(1)}` // Format percentages and per-game stats to 1 decimal
    }
    return `${value.toFixed(0)}` // Format other numbers with no decimals
  }
  return value || "0" // Fallback for any other cases
}

const formatPosition = (position: string): string => {
  const positionMap: Record<string, string> = {
    leftWing: "LW",
    center: "C",
    defenseMen: "D",
    rightWing: "RW",
  }
  return positionMap[position] || position
}

export function PlayerStatsTable() {
  const [data, setData] = useState<PlayerStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<keyof PlayerStats>("points")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/player-stats")
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const result = await response.json()

        const transformedData = Array.isArray(result.members)
          ? result.members
              .filter((member: any) => member.name !== "JP0271")
              .map((member: any) => ({
                name: member.name || "Unknown",
                favoritePosition: member.favoritePosition || "N/A",
                gamesPlayed: Number(member.gamesplayed || 0),
                record: member.record || "0-0-0",
                winPct: Number(member.winpct || 0),
                goals: Number(member.goals || 0),
                assists: Number(member.assists || 0),
                points: Number(member.goals || 0) + Number(member.assists || 0),
                pointspg: Number(member.pointspg || 0),
                plusMinus: Number(member.plusmin || 0),
                gwg: Number(member.gwg || 0),
                shots: Number(member.shots || 0),
                shotPct: Number(member.shotpct || 0),
                breakaways: Number(member.breakaways || 0),
                passes: Number(member.passes || 0),
                passesAttempted: Number(member.skpassattempts || 0),
                passPct: Number(member.skpasspct || 0),
                hits: Number(member.hits || 0),
                hitspg: Number(member.hitspg || 0),
                takeaways: Number(member.takeaways || 0),
                interceptions: Number(member.interceptions || 0),
                blocks: Number(member.skbs || 0),
                saves: Number(member.glsaves || 0),
                savesPct: Number(member.glsavepct || 0),
                gaa: Number(member.glgaa || 0),
                breakawaysSaved: Number(member.glbrksaves || 0),
                breakawayPct: Number(member.skbreakawaypct || 0),
              }))
          : []

        setData(transformedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
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
    { key: "favoritePosition", label: "Position" },
    { key: "gamesPlayed", label: "Games Played" },
    { key: "record", label: "Record" },
    { key: "winPct", label: "Win %" },
    { key: "goals", label: "Goals" },
    { key: "assists", label: "Assists" },
    { key: "points", label: "Points" },
    { key: "pointspg", label: "Points/Game" },
    { key: "plusMinus", label: "+/-" },
    { key: "gwg", label: "GWG" },
    { key: "shots", label: "Shots" },
    { key: "shotPct", label: "Shot %" },
    { key: "breakaways", label: "Breakaways" },
    { key: "breakawayPct", label: "Breakaway %" },
    { key: "passes", label: "Passes" },
    { key: "passesAttempted", label: "Passes Attempted" },
    { key: "passPct", label: "Pass %" },
    { key: "hits", label: "Hits" },
    { key: "hitspg", label: "Hits/Game" },
    { key: "takeaways", label: "Takeaways" },
    { key: "interceptions", label: "Interceptions" },
    { key: "blocks", label: "Blocks" },
    { key: "saves", label: "Saves" },
    { key: "savesPct", label: "Save %" },
    { key: "gaa", label: "GAA" },
    { key: "breakawaysSaved", label: "Breakaways Saved" },
  ] as const

  const handleSort = (key: keyof PlayerStats) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDirection("desc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1
    if (sortKey === "favoritePosition") {
      return multiplier * a[sortKey].localeCompare(b[sortKey])
    }
    return multiplier * ((a[sortKey] as number) - (b[sortKey] as number))
  })

  return (
    <div className="w-full overflow-hidden rounded-lg border bg-card text-card-foreground">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[1200px]">
          <thead className="bg-muted">
            <tr>
              <th
                className="text-left p-4 border-b sticky left-0 bg-muted z-20"
                style={{
                  boxShadow: "4px 0 6px -2px rgba(0, 0, 0, 0.1)",
                }}
              >
                Player
              </th>
              {statCategories.map(({ key, label }) => (
                <th
                  key={key}
                  className="p-4 border-b cursor-pointer hover:bg-accent"
                  onClick={() => handleSort(key as keyof PlayerStats)}
                >
                  <div className="flex items-center justify-end gap-1 whitespace-nowrap">
                    {label}
                    {sortKey === key && <span>{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((player, index) => (
              <tr key={player.name} className={index % 2 === 0 ? "bg-background" : "bg-muted/50"}>
                <td
                  className="p-4 border-b sticky left-0 font-medium z-10"
                  style={{
                    backgroundColor: `hsl(var(${index % 2 === 0 ? "--background" : "--muted"}))`,
                    boxShadow: "4px 0 6px -2px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  {player.name}
                </td>
                {statCategories.map(({ key }) => (
                  <td key={key} className="p-4 border-b text-right whitespace-nowrap">
                    {key === "favoritePosition"
                      ? formatPosition(player[key as keyof PlayerStats] as string)
                      : formatCellValue(key, player[key as keyof PlayerStats])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

