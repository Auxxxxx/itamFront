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
import { getTeamById, createTeam } from "@/app/lib/services/team-service"
import type { Team } from "@/app/lib/types/team"

const formSchema = z.object({
  name: z.string().min(3, "Название команды должно содержать не менее 3 символов").max(50, "Название команды не должно превышать 50 символов"),
  description: z.string().min(10, "Описание должно содержать не менее 10 символов").max(500, "Описание не должно превышать 500 символов"),
  hackathonId: z.string().min(1, "ID хакатона обязателен")
})

type FormValues = z.infer<typeof formSchema>

export default function EditTeamPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const teamId = params.id
  
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      hackathonId: ""
    }
  })
  
  // Check if user is logged in and fetch team details
  useEffect(() => {
    const userId = localStorage.getItem("userId")
    if (!userId) {
      router.push("/login")
      return
    }
    
    async function fetchTeam() {
      try {
        const data = await getTeamById(teamId)
        setTeam(data)
        
        // Set form values
        form.reset({
          name: data.name,
          description: data.description || "",
          hackathonId: data.hackathonId
        })
      } catch (err) {
        setError("Не удалось загрузить детали команды. Пожалуйста, попробуйте позже.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTeam()
  }, [teamId, router, form])
  
  async function onSubmit(values: FormValues) {
    setError(null)
    setSubmitting(true)
    
    try {
      // For now, just update locally then redirect back
      // In a real implementation, this would call an updateTeam API
      
      // Redirect back to team page
      router.push(`/teams/${teamId}`)
    } catch (err) {
      setError("Не удалось обновить команду. Пожалуйста, попробуйте позже.")
      console.error(err)
      setSubmitting(false)
    }
  }
  
  if (loading) {
    return <div className="container p-4">Загрузка...</div>
  }
  
  if (error && !team) {
    return <div className="container p-4">{error}</div>
  }
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Link href={`/teams/${teamId}`} className="text-blue-600 hover:underline mb-4 inline-block">
        ← Назад к команде
      </Link>
      
      <Card>
        <CardHeader>
          <CardTitle>Редактировать команду</CardTitle>
          <CardDescription>
            Обновите информацию о вашей команде
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
                <Button
                  variant="outline"
                  onClick={() => router.push(`/teams/${teamId}`)}
                  className="hover:bg-gray-100"
                >
                  Отмена
                </Button>
                <Button 
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  type="submit"
                >
                  {submitting ? "Сохранение..." : "Сохранить изменения"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
} 