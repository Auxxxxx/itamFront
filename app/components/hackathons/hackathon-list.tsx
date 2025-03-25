import { HackathonCard } from "./hackathon-card"
import type { Hackathon } from "@/app/lib/types/hackathon"

interface HackathonListProps {
  hackathons: Hackathon[]
}

export function HackathonList({ hackathons }: HackathonListProps) {
  if (hackathons.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No hackathons found</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {hackathons.map((hackathon) => (
        <HackathonCard key={hackathon.id} hackathon={hackathon} />
      ))}
    </div>
  )
} 