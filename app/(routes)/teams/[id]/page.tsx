"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Team } from "@/app/lib/types/team"
import { getTeamById } from "@/app/lib/services/team-service"

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function fetchTeam() {
      try {
        const data = await getTeamById(params.id)
        setTeam(data)
      } catch (err) {
        setError("Не удалось загрузить детали команды. Пожалуйста, попробуйте позже.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTeam()
  }, [params.id])
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <p>Загрузка деталей команды...</p>
        </div>
      </div>
    )
  }
  
  if (error || !team) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Команда не найдена</h1>
          <p className="mb-6">{error || "Запрашиваемая команда не существует или была удалена."}</p>
          <Link href="/teams" className="text-blue-600 hover:underline">
            Вернуться к списку команд
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/teams" className="text-blue-600 hover:underline inline-flex items-center">
          ← Назад к командам
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold mb-4">{team.name}</h1>
        <p className="text-lg text-gray-700 mb-6">{team.description}</p>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Участники команды</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.members.map((member) => (
              <div 
                key={member.id} 
                className="bg-gray-50 p-4 rounded-md"
              >
                <div className="font-medium">{member.name}</div>
                {member.role && (
                  <div className="text-sm text-gray-500">{member.role}</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex space-x-4">
          <Link
            href={`/hackathons/${team.hackathonId}`}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md"
          >
            Перейти к хакатону
          </Link>
          <Link
            href={`/teams/${team.id}/invite`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Пригласить участников
          </Link>
        </div>
      </div>
    </div>
  )
} 