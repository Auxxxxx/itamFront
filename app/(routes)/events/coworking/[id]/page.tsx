"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCoworkingSpaceById, reserveCoworkingSpace, CoworkingSpace } from "@/app/lib/services/event-service"
import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { toast } from "@/app/components/ui/use-toast"

export default function CoworkingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [space, setSpace] = useState<CoworkingSpace | null>(null)
  const [loading, setLoading] = useState(true)
  const [reserving, setReserving] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  )
  const [startTime, setStartTime] = useState<string>("10:00")
  const [endTime, setEndTime] = useState<string>("18:00")
  
  useEffect(() => {
    async function loadCoworkingSpace() {
      setLoading(true)
      try {
        const spaceData = await getCoworkingSpaceById(params.id)
        setSpace(spaceData)
        
        // Set default times based on opening hours
        if (spaceData) {
          setStartTime(spaceData.opening_hours)
          setEndTime(spaceData.closing_hours)
        }
      } catch (error) {
        console.error("Error loading coworking space:", error)
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить информацию о коворкинге.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadCoworkingSpace()
  }, [params.id])
  
  const handleReservation = async () => {
    if (!space) return
    
    // Convert selected date and times to ISO format
    const startDateTime = `${selectedDate}T${startTime}:00`
    const endDateTime = `${selectedDate}T${endTime}:00`
    
    setReserving(true)
    try {
      const result = await reserveCoworkingSpace(space.id, startDateTime, endDateTime)
      if (result) {
        toast({
          title: "Успешное бронирование",
          description: "Вы успешно забронировали место в коворкинге.",
          variant: "default"
        })
      } else {
        throw new Error("Ошибка бронирования")
      }
    } catch (error) {
      console.error("Error reserving coworking space:", error)
      toast({
        title: "Ошибка бронирования",
        description: "Не удалось забронировать место. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      })
    } finally {
      setReserving(false)
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Загрузка коворкинга...</p>
        </div>
      </div>
    )
  }
  
  if (!space) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Коворкинг не найден</h1>
          <p className="text-gray-600 mb-6">Запрашиваемый коворкинг не существует или был удален.</p>
          {/* @ts-ignore Button props type issue */}
          <Button onClick={() => router.push('/events')}>
            Вернуться к списку коворкингов
          </Button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* @ts-ignore Button props type issue */}
      <Button 
        variant="outline" 
        className="mb-6"
        onClick={() => router.back()}
      >
        ← Назад
      </Button>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card className="p-6">
            <h1 className="text-3xl font-bold mb-4">{space.name}</h1>
            
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-600">{space.location}</span>
            </div>
            
            <div className="flex items-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-600">Часы работы: {space.opening_hours} - {space.closing_hours}</span>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Удобства</h2>
              <div className="flex flex-wrap gap-2">
                {space.amenities.map((amenity: string, index: number) => (
                  <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Бронирование</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Дата
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={selectedDate}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Время начала
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={startTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)}
                min={space.opening_hours}
                max={space.closing_hours}
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Время окончания
              </label>
              <input
                type="time"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={endTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)}
                min={startTime}
                max={space.closing_hours}
              />
            </div>
            
            {/* @ts-ignore Button props type issue */}
            <Button 
              className="w-full"
              onClick={handleReservation}
              disabled={space.status !== "open" || reserving || startTime >= endTime}
            >
              {reserving ? "Бронирование..." : "Забронировать"}
            </Button>
            
            {startTime >= endTime && (
              <p className="text-red-500 text-sm mt-2">
                Время окончания должно быть позже времени начала
              </p>
            )}
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Информация</h2>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Статус:</span>
              <span className={`font-medium ${space.status === 'open' ? 'text-green-600' : space.status === 'closed' ? 'text-red-600' : 'text-amber-600'}`}>
                {space.status === "open" ? "Открыто" : 
                 space.status === "closed" ? "Закрыто" : "На обслуживании"}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Вместимость:</span>
              <span className="font-medium">{space.capacity} человек</span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Часы работы:</span>
              <span className="font-medium">{space.opening_hours} - {space.closing_hours}</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
} 