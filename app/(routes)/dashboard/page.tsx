"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"

export default function DashboardPage() {
  const router = useRouter()
  
  // Check if user is logged in
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/")
    }
  }, [router])
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome to Hackathon Platform</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Hackathons</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Browse available hackathons and create teams</p>
            <Link href="/hackathons" passHref>
              <Button>View Hackathons</Button>
            </Link>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>My Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Manage your teams and see their progress</p>
            <Link href="/teams" passHref>
              <Button>View My Teams</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 