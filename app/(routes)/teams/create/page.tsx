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
  name: z.string().min(3, "Название команды должно содержать не менее 3 символов").max(50, "Название команды не должно превышать 50 символов"),
  description: z.string().min(10, "Описание должно содержать не менее 10 символов").max(500, "Описание не должно превышать 500 символов"),
  hackathonId: z.string().min(1, "ID хакатона обязателен")
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
      router.push("/login")
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
        setError("Не удалось загрузить детали хакатона. Пожалуйста, попробуйте позже.")
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
      const userId = localStorage.getItem("userId")
      if (!userId) {
        router.push("/login")
        return
      }
      
      console.log("Submitting form with values:", values)
      
      // Include userId in the team creation payload
      const teamPayload = {
        ...values,
        ownerID: userId,
        members: [{ id: userId, name: "Вы", role: "Владелец" }],
        hacker_ids: [userId]
      }
      
      console.log("Sending team payload:", teamPayload)
      const team = await createTeam(teamPayload)
      
      console.log("Team created successfully:", team)
      if (team.id) {
        // Redirect to the teams list page and force a refresh
        router.push("/hackathons/teams")
        
        // Force reload after a short delay to ensure the new team is fetched
        setTimeout(() => {
          window.location.reload()
        }, 500)
      } else {
        throw new Error("Не получен ID созданной команды")
      }
    } catch (err: any) {
      console.error("Error creating team:", err)
      // Display more specific error if available
      setError(err?.message || "Не удалось создать команду. Пожалуйста, проверьте данные и попробуйте снова.")
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return <div className="container p-4">Загрузка...</div>
  }
  
  if (error && !hackathon) {
    return <div className="container p-4">{error}</div>
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href={`/hackathons/${hackathonId}`} className="text-blue-600 hover:underline mb-4 inline-block">
        ← Назад к хакатону
      </Link>
      
      <Card>
        <CardHeader>
          <CardTitle>Создать новую команду</CardTitle>
          <CardDescription>
            {hackathon ? `Для хакатона: ${hackathon.name}` : ''}
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
                    <FormLabel>Название команды</FormLabel>
                    <FormControl>
                      <Input placeholder="Введите название команды" {...field} />
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
                    <FormLabel>Описание</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Опишите вашу команду и идею проекта" 
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
                  <Button variant="outline">Отмена</Button>
                </Link>
                <Button disabled={submitting}>
                  {submitting ? "Создание..." : "Создать команду"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 