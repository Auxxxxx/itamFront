"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/app/components/ui/form"
import { Input } from "@/app/components/ui/input"
import { Textarea } from "@/app/components/ui/textarea"
import { getHackathonById, addWinningSolution } from "@/app/lib/services/hackathon-service"
import { getTeams } from "@/app/lib/services/team-service"
import type { Hackathon } from "@/app/lib/types/hackathon"
import type { Team } from "@/app/lib/types/team"

const formSchema = z.object({
  teamId: z.string().min(1, "Выберите команду-победителя"),
  solutionUrl: z.string().url("Введите корректный URL решения"),
  description: z.string().min(10, "Описание должно быть не менее 10 символов").max(500, "Описание не должно превышать 500 символов")
})

type FormValues = z.infer<typeof formSchema>

export default function AddWinningSolutionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const hackathonId = params.id
  
  const [hackathon, setHackathon] = useState<Hackathon | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamId: "",
      solutionUrl: "",
      description: ""
    }
  })
  
  // Check if user is logged in and fetch hackathon and team details
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/login")
      return
    }
    
    async function fetchData() {
      try {
        const [hackathonData, teamsData] = await Promise.all([
          getHackathonById(hackathonId),
          getTeams()
        ])
        
        setHackathon(hackathonData)
        
        // Filter teams for this hackathon
        const hackathonTeams = teamsData.filter(team => team.hackathonId === hackathonId)
        setTeams(hackathonTeams)
      } catch (err) {
        setError("Не удалось загрузить данные. Пожалуйста, попробуйте позже.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [hackathonId, router])
  
  async function onSubmit(values: FormValues) {
    setError(null)
    setSubmitting(true)
    
    try {
      await addWinningSolution(hackathonId, values)
      router.push(`/hackathons/${hackathonId}`)
    } catch (err) {
      setError("Не удалось добавить победное решение. Пожалуйста, попробуйте позже.")
      console.error(err)
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
          <CardTitle>Добавить победное решение</CardTitle>
          <CardDescription>
            {hackathon ? `Для хакатона: ${hackathon.name}` : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="teamId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Команда-победитель</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Выберите команду</option>
                        {teams.map(team => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="solutionUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL решения</FormLabel>
                    <FormControl>
                      <Input placeholder="https://github.com/команда/проект" {...field} />
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
                    <FormLabel>Описание решения</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Опишите победное решение и его преимущества" 
                        className="min-h-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {error && <p className="text-sm text-red-500">{error}</p>}
              
              <div className="flex justify-end gap-4">
                <Link href={`/hackathons/${hackathonId}`}>
                  <Button type="button" variant="outline">Отмена</Button>
                </Link>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Сохранение..." : "Сохранить решение"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 