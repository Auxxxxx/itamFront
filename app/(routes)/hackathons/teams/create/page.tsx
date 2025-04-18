"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createTeam } from "@/app/lib/services/team-service"
import { getHackathons } from "@/app/lib/services/hackathon-service"
import type { Hackathon } from "@/app/lib/types/hackathon"

export default function CreateTeamPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    hackathonId: ""
  })
  
  useEffect(() => {
    async function fetchHackathons() {
      try {
        const data = await getHackathons()
        setHackathons(Array.isArray(data) ? data : [])
      } catch (err) {
        console.error("Error fetching hackathons:", err)
      }
    }
    
    fetchHackathons()
  }, [])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      if (!formData.name) {
        throw new Error("Пожалуйста, введите название команды")
      }
      
      // Get user ID from localStorage
      const userProfileStr = localStorage.getItem("user_profile")
      if (!userProfileStr) {
        throw new Error("Пользователь не авторизован")
      }
      
      let userProfileId
      try {
        const userProfile = JSON.parse(userProfileStr)
        userProfileId = userProfile.ID
      } catch (err) {
        throw new Error("Ошибка при получении ID пользователя")
      }
      
      if (!userProfileId) {
        throw new Error("ID пользователя не найден")
      }
      
      // Create simplified payload
      const teamPayload = {
        name: formData.name,
        ownerID: userProfileId
      }
      
      await createTeam(teamPayload)
      setSuccess(true)
      
      // Navigate to teams list after a short delay
      setTimeout(() => {
        router.push("/hackathons/teams")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось создать команду")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Создание новой команды</h1>
        
        {success ? (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
            Команда успешно создана! Перенаправление на страницу команд...
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                {error}
              </div>
            )}
            
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Название команды*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="Введите название команды"
                required
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Link
                href="/hackathons/teams"
                className="text-gray-600 hover:text-gray-800"
              >
                Отмена
              </Link>
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Создание..." : "Создать команду"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
} 