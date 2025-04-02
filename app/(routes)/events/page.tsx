"use client"

import { useEffect } from "react"
import { upsertCurrentHacker } from "@/app/lib/services/hacker-service"
import Image from "next/image"
import Link from "next/link"

// Mock data for events
const mockEvents = [
  {
    id: "1",
    title: "IT Conference 2023",
    description: "Annual conference for IT professionals featuring workshops, keynotes, and networking opportunities.",
    date: "2023-12-15",
    location: "Москва",
    imageUrl: "/images/placeholder.jpg",
    registrationUrl: "/events/register/1"
  },
  {
    id: "2",
    title: "Web Development Workshop",
    description: "Hands-on workshop focused on modern web development techniques and best practices.",
    date: "2023-12-22",
    location: "Санкт-Петербург",
    imageUrl: "/images/placeholder.jpg",
    registrationUrl: "/events/register/2"
  },
  {
    id: "3",
    title: "AI and Machine Learning Summit",
    description: "Explore the latest advancements in AI and machine learning with industry experts.",
    date: "2024-01-10",
    location: "Онлайн",
    imageUrl: "/images/placeholder.jpg",
    registrationUrl: "/events/register/3"
  },
  {
    id: "4",
    title: "Cybersecurity Symposium",
    description: "Learn about the latest trends and challenges in cybersecurity from leading professionals.",
    date: "2024-01-25",
    location: "Казань",
    imageUrl: "/images/placeholder.jpg",
    registrationUrl: "/events/register/4"
  }
]

// Helper function to format date
function formatDate(dateString: string): string {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('ru-RU', options)
}

export default function EventsPage() {
  useEffect(() => {
    // Register the current user as a hacker when they visit the events tab
    async function registerUserAsHacker() {
      try {
        await upsertCurrentHacker()
        console.log("User registered as hacker from events page")
      } catch (error) {
        console.error("Error registering user as hacker:", error)
      }
    }

    registerUserAsHacker()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Мероприятия</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockEvents.map(event => (
          <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-48 w-full">
              <div className="bg-gray-200 h-full w-full flex items-center justify-center text-gray-400">
                Изображение мероприятия
              </div>
            </div>
            <div className="p-5">
              <h2 className="text-xl font-semibold mb-2">{event.title}</h2>
              <p className="text-gray-600 mb-3">{event.description}</p>
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-600">{formatDate(event.date)}</span>
              </div>
              <div className="flex items-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-600">{event.location}</span>
              </div>
              <Link 
                href={event.registrationUrl}
                className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Зарегистрироваться
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Interface definitions
interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  imageUrl: string
  registrationUrl: string
} 