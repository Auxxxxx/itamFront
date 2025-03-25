"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { getHackathonById } from "@/app/lib/services/hackathon-service"
import type { Hackathon } from "@/app/lib/types/hackathon"

interface HackathonPageProps {
  params: {
    id: string
  }
}

export default function HackathonPage({ params }: HackathonPageProps) {
  const { id } = params
  const router = useRouter()
  const [hackathon, setHackathon] = useState<Hackathon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Check if user is logged in and fetch hackathon
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/")
      return
    }
    
    async function fetchHackathon() {
      try {
        const data = await getHackathonById(id)
        setHackathon(data)
      } catch (err) {
        setError("Failed to load hackathon details. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchHackathon()
  }, [id, router])
  
  if (loading) {
    return <div className="container p-4">Loading...</div>
  }
  
  if (error || !hackathon) {
    return <div className="container p-4">{error || "Hackathon not found"}</div>
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/hackathons">Back to hackathons</Link>
      <h1 className="text-2xl mt-4">{hackathon.name}</h1>
      <p className="mt-2">{hackathon.description}</p>
      <div className="mt-4">
        <Link href={`/teams/create?hackathonId=${id}`}>
          <Button>Create Team</Button>
        </Link>
      </div>
    </div>
  )
} 