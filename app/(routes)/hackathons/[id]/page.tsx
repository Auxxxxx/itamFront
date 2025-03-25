"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Hackathon } from "@/app/lib/types/hackathon"
import { getHackathonById } from "@/app/lib/services/hackathon-service"

export default function HackathonDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [hackathon, setHackathon] = useState<Hackathon | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
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

        <div className="mt-8">
          <Link
            href={`/hackathons/${hackathon.id}/join`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg inline-block"
          >
            Подать заявку на участие
          </Link>
        </div>
      </div>
    </div>
  )
} 