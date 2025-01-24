import { PlayerStatsTable } from "@/app/components/player-stats-table"
import { TeamStatsTable } from "@/app/components/team-stats-table"

export default function Home() {
  return (
    <main className="container mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Pro Clubs Statistics</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Team Stats</h2>
        <TeamStatsTable />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Player Stats</h2>
        <PlayerStatsTable />
      </section>
    </main>
  )
}

