"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Hackathon } from "@/app/lib/types/hackathon"
import type { Team } from "@/app/lib/types/team"
import { getHackathonById } from "@/app/lib/services/hackathon-service"
import { getTeamsByHackathonId } from "@/app/lib/services/team-service"
import { Users, PlusCircle, RefreshCw } from "lucide-react"

export default function HackathonDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [hackathon, setHackathon] = useState<Hackathon | null>(null)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [teamsLoading, setTeamsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch hackathon details
  useEffect(() => {
    async function fetchHackathon() {
      try {
        const data = await getHackathonById(params.id)
        setHackathon(data)
      } catch (err) {
        setError("Не удалось загрузить детали хакатона. Пожалуйста, попробуйте позже.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchHackathon()
  }, [params.id])
  
  // Fetch teams for this hackathon
  useEffect(() => {
    async function fetchTeams() {
      setTeamsLoading(true)
      try {
        const teamsData = await getTeamsByHackathonId(params.id)
        console.log("Teams for hackathon:", teamsData)
        setTeams(teamsData)
      } catch (err) {
        console.error("Error fetching teams:", err)
      } finally {
        setTeamsLoading(false)
      }
    }
    
    if (params.id) {
      fetchTeams()
    }
  }, [params.id])
  
  // Function to refresh teams data
  const refreshTeams = async () => {
    setTeamsLoading(true)
    try {
      const teamsData = await getTeamsByHackathonId(params.id)
      setTeams(teamsData)
    } catch (err) {
      console.error("Error refreshing teams:", err)
    } finally {
      setTeamsLoading(false)
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <p>Загрузка деталей хакатона...</p>
        </div>
      </div>
    )
  }
  
  if (error || !hackathon) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Хакатон не найден</h1>
          <p className="mb-6">{error || "Запрашиваемый хакатон не существует или был удален."}</p>
          <Link href="/hackathons" className="text-blue-600 hover:underline">
            Вернуться к списку хакатонов
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/hackathons" className="text-blue-600 hover:underline inline-flex items-center">
          ← Назад к хакатонам
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-sm ${
            hackathon.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
            hackathon.status === 'active' ? 'bg-green-100 text-green-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {hackathon.status === 'upcoming' ? 'Предстоящий' :
             hackathon.status === 'active' ? 'Активный' : 'Завершен'}
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-4">{hackathon.name}</h1>
        <p className="text-lg text-gray-700 mb-6">{hackathon.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-3">Детали</h2>
            <div className="space-y-3">
              <div>
                <span className="font-medium">Место проведения:</span> {hackathon.location}
              </div>
              <div>
                <span className="font-medium">Даты:</span> {new Date(hackathon.startDate).toLocaleDateString('ru-RU')} - {new Date(hackathon.endDate).toLocaleDateString('ru-RU')}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href={`/teams/create?hackathonId=${hackathon.id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg inline-block flex items-center"
          >
            <PlusCircle size={18} className="mr-2" />
            Создать команду
          </Link>
          <Link
            href={`/hackathons/${hackathon.id}/winner`}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg inline-block"
          >
            Добавить победное решение
          </Link>
        </div>
      </div>

      {/* Teams Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Команды участников</h2>
          <button 
            onClick={refreshTeams}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-md"
            title="Обновить список команд"
            disabled={teamsLoading}
          >
            <RefreshCw size={18} className={teamsLoading ? 'animate-spin' : ''} />
          </button>
        </div>

        {teamsLoading ? (
          <div className="text-center py-6">
            <p>Загрузка команд...</p>
          </div>
        ) : teams.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500 mb-4">Пока нет зарегистрированных команд для этого хакатона</p>
            <Link
              href={`/teams/create?hackathonId=${hackathon.id}`}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md inline-flex items-center"
            >
              <PlusCircle size={18} className="mr-1" />
              Создать команду
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <Link
                href={`/teams/${team.id}`}
                key={team.id}
                className="block bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md rounded-lg overflow-hidden transition-all"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{team.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{team.description || team.name}</p>
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {team.members && Array.isArray(team.members) 
                        ? `${team.members.length} участников` 
                        : team.hacker_ids && Array.isArray(team.hacker_ids)
                          ? `${team.hacker_ids.length} участников`
                          : "0 участников"}
                    </span>
                    {team.max_size && (
                      <span className="text-sm text-gray-500 ml-1">
                        {" "}/ Макс: {team.max_size}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 