"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getEventById, registerForEvent, Event } from "@/app/lib/services/event-service"
import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { toast } from "@/app/components/ui/use-toast"

// Helper function to format date
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('ru-RU', options)
}

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState(false)
  
  useEffect(() => {
    async function loadEvent() {
      setLoading(true)
      try {
        const eventData = await getEventById(params.id)
        setEvent(eventData)
      } catch (error) {
        console.error("Error loading event:", error)
        toast({
          title: "Ошибка загрузки",
          description: "Не удалось загрузить информацию о мероприятии.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadEvent()
  }, [params.id])
  
  const handleRegister = async () => {
    if (!event) return
    
    setRegistering(true)
    try {
      const result = await registerForEvent(event.id)
      if (result) {
        toast({
          title: "Успешная регистрация",
          description: "Вы успешно зарегистрировались на мероприятие.",
          variant: "default"
        })
      } else {
        throw new Error("Ошибка регистрации")
      }
    } catch (error) {
      console.error("Error registering for event:", error)
      toast({
        title: "Ошибка регистрации",
        description: "Не удалось зарегистрироваться на мероприятие. Пожалуйста, попробуйте позже.",
        variant: "destructive"
      })
    } finally {
      setRegistering(false)
    }
  }
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Загрузка мероприятия...</p>
        </div>
      </div>
    )
  }
  
  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Мероприятие не найдено</h1>
          <p className="text-gray-600 mb-6">Запрашиваемое мероприятие не существует или было удалено.</p>
          {/* @ts-ignore Button props type issue */}
          <Button onClick={() => router.push('/events')}>
            Вернуться к списку мероприятий
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
            <div className="relative h-64 w-full mb-6">
              {event.image_url ? (
                <div 
                  className="h-full w-full bg-cover bg-center rounded-md"
                  style={{ backgroundImage: `url(${event.image_url})` }}
                  aria-label={`Изображение мероприятия ${event.title}`}
                />
              ) : (
                <div className="bg-gray-200 h-full w-full flex items-center justify-center text-gray-400 rounded-md">
                  Изображение мероприятия
                </div>
              )}
              
              <div className="absolute top-4 right-4 px-3 py-1 text-sm rounded bg-blue-600 text-white">
                {event.status === "upcoming" ? "Предстоящее" : 
                 event.status === "ongoing" ? "Текущее" : 
                 event.status === "completed" ? "Завершено" : "Отменено"}
              </div>
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
            
            <div className="flex items-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-600">{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-gray-600">{event.location}</span>
            </div>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Описание</h2>
              <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
            </div>
          </Card>
        </div>
        
        <div>
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Информация</h2>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Статус:</span>
              <span className="font-medium">
                {event.status === "upcoming" ? "Предстоящее" : 
                 event.status === "ongoing" ? "Текущее" : 
                 event.status === "completed" ? "Завершено" : "Отменено"}
              </span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Дата:</span>
              <span className="font-medium">{formatDate(event.date)}</span>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-600">Место:</span>
              <span className="font-medium">{event.location}</span>
            </div>
            
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-600">Участники:</span>
              <span className="font-medium">{event.registered_count || 0} из {event.capacity}</span>
            </div>
            
            {/* @ts-ignore Button props type issue */}
            <Button 
              className="w-full"
              onClick={handleRegister}
              disabled={event.status !== "upcoming" || registering}
            >
              {registering ? "Регистрация..." : 
               event.status === "upcoming" ? "Зарегистрироваться" : "Регистрация недоступна"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
} 