import { Suspense } from 'react'
import ProClubsChart from '../components/ProClubsChart'
import { fetchProClubsData } from '../utils/fetchProClubsData'

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-red-500 text-center">
        <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default async function Home() {
  try {
    const data = await fetchProClubsData()

    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Pro Clubs Player Stats</h1>
        <Suspense fallback={<Loading />}>
          <ProClubsChart data={data} />
        </Suspense>
      </main>
    )
  } catch (error) {
    return (
      <main className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6 text-center">Pro Clubs Player Stats</h1>
        <ErrorMessage message={error instanceof Error ? error.message : 'An unexpected error occurred'} />
      </main>
    )
  }
}

