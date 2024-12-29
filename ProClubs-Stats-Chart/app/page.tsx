import ProClubsChart from '@/components/ProClubsChart'

export default function Home() {
  return (
    <main className="container mx-auto p-4 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Pro Clubs Player Stats</h1>
      <ProClubsChart />
    </main>
  )
}

