"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTeams } from "@/app/lib/services/team-service"
import type { Team } from "@/app/lib/types/team"
import { PlusCircle, Users } from "lucide-react"

export default function HackathonTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    async function fetchTeams() {
      try {
        const data = await getTeams()
        console.log("Teams data:", data) // Log data for debugging
        setTeams(Array.isArray(data) ? data : [])
      } catch (err) {
        setError("Не удалось загрузить команды. Пожалуйста, попробуйте позже.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchTeams()
  }, [])
  
  const teamsArray = Array.isArray(teams) ? teams : []
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Мои команды</h1>
        <Link
          href="/hackathons/teams/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
        >
          <PlusCircle size={18} className="mr-1" />
          Создать команду
        </Link>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <p>Загрузка команд...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
        </div>
      ) : teamsArray.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-6 text-center">
          <p className="text-gray-500 mb-4">У вас пока нет команд</p>
          <p className="text-gray-500 mb-6">Создайте новую команду или присоединитесь к существующей</p>
          <div className="flex justify-center space-x-4">
            <Link
              href="/hackathons/teams/create"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
            >
              <PlusCircle size={18} className="mr-1" />
              Создать команду
            </Link>
            <Link
              href="/hackathons"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md"
            >
              Найти хакатон
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamsArray.map((team) => (
            <Link
              href={`/hackathons/teams/${team.id}`}
              key={team.id}
              className="block bg-white shadow-sm hover:shadow-md rounded-lg overflow-hidden transition-shadow"
            >
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{team.name}</h2>
                <p className="text-gray-600 mb-4">{team.description || team.name}</p>
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
  )
} 