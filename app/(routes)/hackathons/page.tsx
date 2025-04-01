"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Hackathon } from "@/app/lib/types/hackathon"
import { getHackathons } from "@/app/lib/services/hackathon-service"

export default function HackathonsPage() {
  const router = useRouter()
  const [hackathons, setHackathons] = useState<Hackathon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)
  
  useEffect(() => {
    // Fetch hackathons
    async function fetchHackathons() {
      try {
        console.log("Fetching hackathons...")
        const startTime = Date.now()
        const data = await getHackathons()
        const endTime = Date.now()
        console.log("Hackathons response:", data)
        
        // Check if response time is too fast (likely mock data)
        if (endTime - startTime < 100 && data.length > 0) {
          setUsingMockData(true)
        }
        
        // Debug information
        setDebugInfo(
          `API Response: ${JSON.stringify(data).substring(0, 200)}... 
          isArray: ${Array.isArray(data)}, 
          type: ${typeof data}, 
          length: ${Array.isArray(data) ? data.length : 'N/A'},
          response time: ${endTime - startTime}ms`
        )
        
        // Ensure we're setting an array
        setHackathons(Array.isArray(data) ? data : [])
        setError(null)
      } catch (err) {
        console.error("Error fetching hackathons:", err)
        setError("Не удалось загрузить хакатоны. Пожалуйста, попробуйте позже.")
        setDebugInfo(`Error: ${err instanceof Error ? err.message : String(err)}`)
      } finally {
        setLoading(false)
      }
    }
    
    fetchHackathons()
  }, [])
  
  // Make sure hackathons is always an array before rendering
  const hackathonsArray = Array.isArray(hackathons) ? hackathons : []
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Хакатоны</h1>
      
      {loading ? (
        <div className="text-center py-10">
          <p>Загрузка хакатонов...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          {debugInfo && <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto">{debugInfo}</pre>}
        </div>
      ) : hackathonsArray.length === 0 ? (
        <div className="p-4 border rounded-md">
          <p className="text-center text-gray-500">Хакатоны не найдены</p>
          {debugInfo && <pre className="mt-4 p-4 bg-gray-100 rounded text-xs overflow-auto">{debugInfo}</pre>}
        </div>
      ) : (
        <div>
          {usingMockData && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-amber-600 text-sm">
                Примечание: API в настоящее время недоступен. Отображаются демонстрационные данные.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathonsArray.map((hackathon) => (
              <Link 
                href={`/hackathons/${hackathon.id}`} 
                key={hackathon.id} 
                className="block border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-5">
                  <h2 className="font-bold text-xl mb-2">{hackathon.name}</h2>
                  <p className="text-gray-600 mb-3">{hackathon.description}</p>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">
                      {new Date(hackathon.startDate).toLocaleDateString('ru-RU')} - {new Date(hackathon.endDate).toLocaleDateString('ru-RU')}
                    </span>
                    
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      hackathon.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                      hackathon.status === 'active' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {hackathon.status === 'upcoming' ? 'Предстоящий' :
                       hackathon.status === 'active' ? 'Активный' : 'Завершен'}
                    </span>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <span className="text-gray-500">{hackathon.location}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
} 