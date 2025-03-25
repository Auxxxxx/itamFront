"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { createTeam } from "@/app/lib/services/team-service"
import { getHackathonById } from "@/app/lib/services/hackathon-service"
import type { Hackathon } from "@/app/lib/types/hackathon"

const formSchema = z.object({
  name: z.string().min(3, "Team name must be at least 3 characters").max(50, "Team name cannot exceed 50 characters"),
  description: z.string().min(10, "Description must be at least 10 characters").max(500, "Description cannot exceed 500 characters"),
  hackathonId: z.string().min(1, "Hackathon ID is required")
})

type FormValues = z.infer<typeof formSchema>

export default function CreateTeamPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const hackathonId = searchParams.get("hackathonId") || ""
  
  const [hackathon, setHackathon] = useState<Hackathon | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      hackathonId
    }
  })
  
  // Check if user is logged in and fetch hackathon details
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/")
      return
    }
    
    if (!hackathonId) {
      router.push("/hackathons")
      return
    }
    
    async function fetchHackathon() {
      try {
        const data = await getHackathonById(hackathonId)
        setHackathon(data)
      } catch (err) {
        setError("Failed to load hackathon details. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchHackathon()
  }, [hackathonId, router])
  
  async function onSubmit(values: FormValues) {
    setError(null)
    setSubmitting(true)
    
    try {
      const team = await createTeam(values)
      router.push(`/teams/${team.id}`)
    } catch (err) {
      setError("Failed to create team. Please try again later.")
      console.error(err)
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return <div className="container p-4">Loading...</div>
  }
  
  if (error && !hackathon) {
    return <div className="container p-4">{error}</div>
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href={`/hackathons/${hackathonId}`} className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Hackathon
      </Link>
      
      <Card>
        <CardHeader>
          <CardTitle>Create a New Team</CardTitle>
          <CardDescription>
            {hackathon ? `For ${hackathon.name}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your team name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe your team and project idea" 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <input type="hidden" {...form.register("hackathonId")} />
              
              {error && <p className="text-sm text-red-500">{error}</p>}
              
              <div className="flex justify-end gap-4">
                <Link href={`/hackathons/${hackathonId}`}>
                  <Button type="button" variant="outline">Cancel</Button>
                </Link>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Team"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 