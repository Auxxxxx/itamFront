"use client"

import React, { useEffect, useState } from "react"
// Исправляем импорт на upsetCurrentHacker как предложил линтер
// import { upsertCurrentHacker } from "@/app/lib/services/hacker-service"
import { getAllEvents, getAllCoworkingSpaces, Event, CoworkingSpace, registerForEvent } from "@/app/lib/services/event-service"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Button } from "@/app/components/ui/button"
import { Card } from "@/app/components/ui/card"
import { toast } from "@/app/components/ui/use-toast"
import { CreateEventModal } from "@/app/components/events/create-event-modal"

// Helper function to format date
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('ru-RU', options)
}

export default function EventsPage() {
  const router = useRouter()
  const [events, setEvents] = useState<Event[]>([])
  const [coworkingSpaces, setCoworkingSpaces] = useState<CoworkingSpace[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("events")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  // Функция для тестового входа
  const handleTestLogin = () => {
    const testUser = {
      ID: "test-user-id-123",
      name: "Test User",
      email: "test@example.com"
    }
    localStorage.setItem('user_profile', JSON.stringify(testUser))
    localStorage.setItem('auth_token', 'test-auth-token')
    setIsAuthenticated(true)
    toast({
      title: "Тестовый вход выполнен",
      description: "Теперь вы можете создавать мероприятия",
      variant: "default"
    })
  }

  // Функция для выхода
  const handleLogout = () => {
    localStorage.removeItem('user_profile')
    localStorage.removeItem('auth_token')
    setIsAuthenticated(false)
    toast({
      title: "Выход выполнен",
      description: "Вы вышли из системы",
      variant: "default"
    })
  }
  
  useEffect(() => {
    // Check if user is authenticated
    const userProfile = localStorage.getItem('user_profile')
    setIsAuthenticated(!!userProfile)
    
    // Register the current user as a hacker when they visit the events tab
    async function registerUserAsHacker() {
      try {
        // Функция была переименована или удалена, поэтому комментируем
        // await upsertCurrentHacker()
        console.log("Attempted to register user as hacker from events page (functionality may be missing)")
      } catch (error) {
        console.error("Error registering user as hacker:", error)
      }
    }

    registerUserAsHacker()
    
    // Load events and coworking spaces
    async function loadData() {
      setLoading(true)
      try {
        const [eventsData, coworkingData] = await Promise.all([
          getAllEvents(),
          getAllCoworkingSpaces()
        ])
        
        setEvents(eventsData)
        setCoworkingSpaces(coworkingData)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Ошибка загрузки данных",
          description: "Не удалось загрузить данные. Пожалуйста, попробуйте позже.",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])
  
  const handleEventClick = (id: string) => {
    router.push(`/events/${id}`)
  }
  
  const handleCoworkingClick = (id: string) => {
    router.push(`/events/coworking/${id}`)
  }
  
  const handleRegisterForEvent = async (e: React.MouseEvent<HTMLButtonElement>, eventId: string) => {
    e.stopPropagation() // Prevent navigation to detail page
    
    try {
      const result = await registerForEvent(eventId)
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
    }
  }

  const handleEventCreated = async () => {
    try {
      const eventsData = await getAllEvents()
      setEvents(eventsData)
      toast({
        title: "Успешно",
        description: "Мероприятие создано и добавлено в список",
        variant: "default"
      })
    } catch (error) {
      console.error("Error refreshing events:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Мероприятия и коворкинги</h1>
        <div className="flex space-x-2">
          {!isAuthenticated ? (
            <Button onClick={handleTestLogin} className="bg-blue-600 hover:bg-blue-700">
              Тестовый вход
            </Button>
          ) : (
            <>
              <Button onClick={handleLogout} variant="outline">
                Выйти
              </Button>
              {activeTab === "events" && (
                <CreateEventModal onEventCreated={handleEventCreated} />
              )}
            </>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="events" className="w-full mb-8" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="events" className="flex-1">Мероприятия</TabsTrigger>
          <TabsTrigger value="coworking" className="flex-1">Коворкинги</TabsTrigger>
        </TabsList>
        
        <TabsContent value="events">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Загрузка мероприятий...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event: Event) => (
                <Card 
                  key={event.id} 
                  className="overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => handleEventClick(event.id)}
                >
                  <div className="relative h-48 w-full">
                    {event.image_url ? (
                      <div 
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${event.image_url})` }}
                        aria-label={`Изображение мероприятия ${event.title}`}
                      />
                    ) : (
                      <div className="bg-gray-200 h-full w-full flex items-center justify-center text-gray-400">
                        Изображение мероприятия
                      </div>
                    )}
                    
                    <div className="absolute top-2 right-2 px-2 py-1 text-xs rounded bg-blue-600 text-white">
                      {event.status === "upcoming" ? "Предстоящее" : 
                       event.status === "ongoing" ? "Текущее" : 
                       event.status === "completed" ? "Завершено" : "Отменено"}
                    </div>
                  </div>
                  
                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
                    <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                    
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-600">{formatDate(event.date)}</span>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-600">{event.location}</span>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-gray-600">
                        {event.registered_count !== undefined ? `${event.registered_count} из ${event.capacity}` : `0 из ${event.capacity}`}
                      </span>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleRegisterForEvent(e, event.id)}
                      disabled={event.status !== "upcoming"}
                    >
                      {event.status === "upcoming" ? "Зарегистрироваться" : "Недоступно"}
                    </Button>
                  </div>
                </Card>
              ))}
              
              {events.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">Нет доступных мероприятий</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="coworking">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p className="text-gray-500">Загрузка коворкингов...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coworkingSpaces.map((space: CoworkingSpace) => (
                <Card 
                  key={space.id} 
                  className="overflow-hidden cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => handleCoworkingClick(space.id)}
                >
                  <div className="p-5">
                    <h2 className="text-xl font-semibold mb-2">{space.name}</h2>
                    
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-gray-600">{space.location}</span>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-600">{space.opening_hours} - {space.closing_hours}</span>
                    </div>
                    
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="text-gray-600">Вместимость: {space.capacity}</span>
                    </div>
                    
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 font-medium mb-1">Удобства:</p>
                      <div className="flex flex-wrap gap-2">
                        {space.amenities.map((amenity: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1"
                        variant="outline"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation()
                          handleCoworkingClick(space.id)
                        }}
                      >
                        Подробнее
                      </Button>
                      <Button 
                        className="flex-1"
                        disabled={space.status !== "open"}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation()
                          handleCoworkingClick(space.id)
                        }}
                      >
                        Забронировать
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {coworkingSpaces.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">Нет доступных коворкингов</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Removed local Event interface to avoid conflict
// interface Event {
//   id: string
//   title: string
//   description: string
//   date: string
//   location: string
//   imageUrl: string
//   registrationUrl: string
// } 