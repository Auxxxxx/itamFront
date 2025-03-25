"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/app/components/ui/button"
import { getTeams } from "@/app/lib/services/team-service"
import type { Team } from "@/app/lib/types/team"

export default function TeamsPage() {
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/")
      return
    }
    
    async function fetchTeams() {
      try {
        const data = await getTeams(userId)
        setTeams(data)
      } catch (err) {
        setError("Failed to load teams")
      } finally {
        setLoading(false)
      }
    }
    
    fetchTeams()
  }, [router])
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  
  return (
    <div className="container p-4">
      <h1 className="text-2xl mb-4">My Teams</h1>
      
      {teams.length === 0 ? (
        <div>
          <p>You haven't joined any teams yet.</p>
          <Link href="/hackathons">
            <Button>Browse Hackathons</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {teams.map(team => (
            <div key={team.id} className="p-4 border rounded">
              <h2>{team.name}</h2>
              <p>{team.description}</p>
              <Link href={`/teams/${team.id}`}>
                <Button>View Details</Button>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 