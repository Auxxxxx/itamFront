"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getTeamById } from "@/app/lib/services/team-service"
import { getHackathonById } from "@/app/lib/services/hackathon-service"
import type { Team, TeamMember } from "@/app/lib/types/team"
import type { Hackathon } from "@/app/lib/types/hackathon"
import { UserPlus, Share2, Users } from "lucide-react"

export default function TeamDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [team, setTeam] = useState<Team | null>(null)
  const [hackathon, setHackathon] = useState<Hackathon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function fetchTeamAndHackathon() {
      try {
        const teamData = await getTeamById(params.id)
        console.log("Team data:", teamData) // Log data for debugging
        setTeam(teamData)
        
        // Fetch associated hackathon
        if (teamData.hackathonId) {
          try {
            const hackathonData = await getHackathonById(teamData.hackathonId)
            setHackathon(hackathonData)
          } catch (hackathonErr) {
            console.error("Failed to fetch hackathon:", hackathonErr)
          }
        }
      } catch (err) {
        setError("Не удалось загрузить детали команды. Пожалуйста, попробуйте позже.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTeamAndHackathon()
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
          <Link href="/hackathons/teams" className="text-blue-600 hover:underline">
            Вернуться к списку команд
          </Link>
        </div>
      </div>
    )
  }
  
  // Get the team members to display
  const teamMembers = team.members || [];
  const maxMembers = team.max_size || teamMembers.length + 3;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/hackathons/teams" className="text-blue-600 hover:underline inline-flex items-center">
          ← Назад к командам
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{team.name}</h1>
          <p className="text-lg text-gray-700 mb-6">{team.description || team.name}</p>

          {hackathon && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <h2 className="text-xl font-semibold mb-2">Хакатон</h2>
              <Link 
                href={`/hackathons/${hackathon.id}`}
                className="block font-medium text-blue-600 hover:underline"
              >
                {hackathon.name}
              </Link>
              <p className="text-gray-600 mt-1">{hackathon.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                {new Date(hackathon.startDate).toLocaleDateString('ru-RU')} - {new Date(hackathon.endDate).toLocaleDateString('ru-RU')}
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Участники команды 
                <span className="ml-2 text-sm text-gray-500">
                  ({teamMembers.length} / {maxMembers})
                </span>
              </h2>
              <button className="text-blue-600 hover:text-blue-800 flex items-center text-sm">
                <UserPlus size={16} className="mr-1" />
                Пригласить участника
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.length > 0 ? (
                teamMembers.map((member) => (
                  <div 
                    key={member.id} 
                    className="bg-gray-50 p-4 rounded-md"
                  >
                    <div className="font-medium">{member.name}</div>
                    {member.role && (
                      <div className="text-sm text-gray-500">{member.role}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center p-4 bg-gray-50 rounded-md">
                  <p className="text-gray-500">В команде пока нет участников</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex space-x-4 pt-4 border-t">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center">
              <Share2 size={16} className="mr-1" />
              Поделиться ссылкой
            </button>
            <Link
              href={`/hackathons/teams/${team.id}/edit`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md"
            >
              Редактировать команду
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 