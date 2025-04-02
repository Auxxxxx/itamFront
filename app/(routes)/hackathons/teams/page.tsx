"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getTeams } from "@/app/lib/services/team-service"
import { getHackathons } from "@/app/lib/services/hackathon-service"
import type { Team } from "@/app/lib/types/team"
import type { Hackathon } from "@/app/lib/types/hackathon"
import { PlusCircle, Users, RefreshCw, Filter } from "lucide-react"

export default function HackathonTeamsPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("")
  
  // Function to fetch teams
  async function fetchTeams() {
    setLoading(true)
    try {
      const data = await getTeams()
      console.log("Teams data:", data)
      setTeams(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError("Не удалось загрузить команды. Пожалуйста, попробуйте позже.")
      console.error(err)
    } finally {
      setLoading(false)
      setLastRefreshed(new Date())
    }
  }
  
  // Function to fetch hackathons
  async function fetchHackathons() {
    try {
      const data = await getHackathons()
      console.log("Hackathons data:", data)
      setHackathons(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error("Не удалось загрузить хакатоны:", err)
    }
  }
  
  // Initial data load
  useEffect(() => {
    fetchTeams()
    fetchHackathons()
  }, [])
  
  // Refresh when the page regains focus (e.g., after team creation)
  useEffect(() => {
    function handleFocus() {
      console.log("Window focused, refreshing teams data")
      fetchTeams()
    }
    
    window.addEventListener('focus', handleFocus)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [])
  
  const teamsArray = Array.isArray(teams) ? teams : []
  
  // Filter teams by selected hackathon
  const filteredTeams = selectedHackathonId 
    ? teamsArray.filter(team => team.hackathonId === selectedHackathonId)
    : teamsArray
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Мои команды</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={fetchTeams} 
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-md"
            title="Обновить список команд"
            disabled={loading}
          >
            <RefreshCw size={18} className={`${loading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/hackathons/teams/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
          >
            <PlusCircle size={18} className="mr-1" />
            Создать команду
          </Link>
        </div>
      </div>
      
      {/* Hackathon Filter */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center mb-2">
          <Filter size={16} className="mr-2 text-gray-500" />
          <h2 className="text-lg font-medium">Фильтр по хакатонам</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedHackathonId}
            onChange={(e) => setSelectedHackathonId(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все хакатоны</option>
            {hackathons.map(hackathon => (
              <option key={hackathon.id} value={hackathon.id}>
                {hackathon.name}
              </option>
            ))}
          </select>
          
          {selectedHackathonId && (
            <button
              onClick={() => setSelectedHackathonId("")}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Сбросить фильтр
            </button>
          )}
        </div>
      </div>
      
      {loading && filteredTeams.length === 0 ? (
        <div className="text-center py-10">
          <p>Загрузка команд...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={fetchTeams} 
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Попробовать снова
          </button>
        </div>
      ) : filteredTeams.length === 0 ? (
        <div className="bg-white shadow-sm rounded-lg p-6 text-center">
          {selectedHackathonId ? (
            <>
              <p className="text-gray-500 mb-4">У вас нет команд для выбранного хакатона</p>
              <div className="flex justify-center space-x-4">
                <Link
                  href={`/hackathons/teams/create?hackathonId=${selectedHackathonId}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md flex items-center"
                >
                  <PlusCircle size={18} className="mr-1" />
                  Создать команду
                </Link>
                <button
                  onClick={() => setSelectedHackathonId("")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md"
                >
                  Показать все команды
                </button>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      ) : (
        <div>
          {loading && (
            <div className="bg-blue-50 text-blue-700 p-2 mb-4 rounded-md text-center text-sm">
              Обновление списка команд...
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTeams.map((team) => {
              // Find the hackathon for this team
              const teamHackathon = hackathons.find(h => h.id === team.hackathonId);
              
              return (
                <Link
                  href={`/hackathons/teams/${team.id}`}
                  key={team.id}
                  className="block bg-white shadow-sm hover:shadow-md rounded-lg overflow-hidden transition-shadow"
                >
                  <div className="p-6">
                    <h2 className="text-xl font-bold mb-2">{team.name}</h2>
                    <p className="text-gray-600 mb-4">{team.description || team.name}</p>
                    
                    {teamHackathon && (
                      <div className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded mb-3 inline-block">
                        {teamHackathon.name}
                      </div>
                    )}
                    
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
              );
            })}
          </div>
        </div>
      )}
    </div>
  )
} 