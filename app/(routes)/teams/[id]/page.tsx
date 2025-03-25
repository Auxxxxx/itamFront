"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { getTeamById } from "@/app/lib/services/team-service"
import type { Team } from "@/app/lib/types/team"

interface TeamPageProps {
  params: {
    id: string
  }
}

export default function TeamPage({ params }: TeamPageProps) {
  const { id } = params
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/")
      return
    }
    
    async function fetchTeam() {
      try {
        const data = await getTeamById(id)
        setTeam(data)
      } catch (err) {
        setError("Failed to load team details")
      } finally {
        setLoading(false)
      }
    }
    
    fetchTeam()
  }, [id, router])
  
  if (loading) return <div>Loading...</div>
  if (error || !team) return <div>{error || "Team not found"}</div>
  
  return (
    <div className="container p-4">
      <Link href="/teams">Back to teams</Link>
      <h1 className="text-2xl mt-4">{team.name}</h1>
      <p className="mt-2">{team.description}</p>
      
      <div className="mt-6">
        <h2 className="text-xl mb-2">Team Members</h2>
        <ul className="space-y-2">
          {team.members.map(member => (
            <li key={member.id} className="p-2 border rounded">
              {member.name || member.id}
              {member.id === team.leaderId && " (Team Leader)"}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mt-6">
        <Link href={`/hackathons/${team.hackathonId}`}>
          <Button>View Hackathon</Button>
        </Link>
      </div>
    </div>
  )
} 