import { Suspense } from 'react'
import ProClubsChart from './components/ProClubsChart'
import { fetchProClubsData } from './lib/data'

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
}

export default async function HomePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Pro Clubs Player Stats</h1>
      <Suspense fallback={<Loading />}>
        <ProClubsChart />
      </Suspense>
    </div>
  )
}

