"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { HackathonList } from "@/app/components/hackathons/hackathon-list"
import type { Hackathon } from "@/app/lib/types/hackathon"
import { getHackathons } from "@/app/lib/services/hackathon-service"

export default function HackathonsPage() {
  const router = useRouter()
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Check if user is logged in
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/")
      return
    }
    
    // Fetch hackathons
    async function fetchHackathons() {
      try {
        const data = await getHackathons()
        setHackathons(data)
      } catch (err) {
        setError("Failed to load hackathons. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchHackathons()
  }, [router])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Hackathons</h1>
      <p className="text-gray-600 mb-8">Browse available hackathons and create teams</p>
      
      {loading ? (
        <div className="text-center py-10">
          <p>Loading hackathons...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <HackathonList hackathons={hackathons} />
      )}
    </div>
  )
} 