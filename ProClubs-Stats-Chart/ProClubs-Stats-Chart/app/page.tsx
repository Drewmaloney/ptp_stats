import ProClubsChart from '../components/ProClubsChart'
import { fetchProClubsData } from '../utils/fetchProClubsData'

export default async function Home() {
  const data = await fetchProClubsData()

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Pro Clubs Player Stats</h1>
      <ProClubsChart data={data} />
    </main>
  )
}

