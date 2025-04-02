"use client"

import { useEffect } from "react"
import { upsertCurrentHacker } from "@/app/lib/services/hacker-service"
import Link from "next/link"

// Mock data for courses
const mockCourses = [
  {
    id: "1",
    title: "Основы программирования на Python",
    description: "Изучите основы программирования с нуля на одном из самых популярных и простых для понимания языков.",
    duration: "8 недель",
    level: "Начинающий",
    instructor: "Алексей Петров",
    price: "Бесплатно",
    enrollmentUrl: "/courses/enroll/1",
    tags: ["Python", "Программирование", "Для начинающих"]
  },
  {
    id: "2",
    title: "JavaScript для веб-разработчиков",
    description: "Полный курс по современному JavaScript для создания интерактивных веб-приложений.",
    duration: "10 недель",
    level: "Средний",
    instructor: "Мария Иванова",
    price: "5000 ₽",
    enrollmentUrl: "/courses/enroll/2",
    tags: ["JavaScript", "Веб-разработка", "Frontend"]
  },
  {
    id: "3",
    title: "Machine Learning с Python",
    description: "Изучите основы машинного обучения и построения предиктивных моделей с использованием Python.",
    duration: "12 недель",
    level: "Продвинутый",
    instructor: "Дмитрий Кузнецов",
    price: "8000 ₽",
    enrollmentUrl: "/courses/enroll/3",
    tags: ["Python", "Machine Learning", "Data Science"]
  },
  {
    id: "4",
    title: "React.js с нуля до профи",
    description: "Освойте популярную библиотеку для разработки современных пользовательских интерфейсов.",
    duration: "8 недель",
    level: "Средний",
    instructor: "Ольга Смирнова",
    price: "6000 ₽",
    enrollmentUrl: "/courses/enroll/4",
    tags: ["React", "JavaScript", "Frontend"]
  }
]

export default function CoursesPage() {
  useEffect(() => {
    // Register the current user as a hacker when they visit the courses tab
    async function registerUserAsHacker() {
      try {
        await upsertCurrentHacker()
        console.log("User registered as hacker from courses page")
      } catch (error) {
        console.error("Error registering user as hacker:", error)
      }
    }

    registerUserAsHacker()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Курсы</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockCourses.map(course => (
          <div key={course.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{course.title}</h2>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">{course.price}</span>
              </div>
              
              <p className="text-gray-600 mb-4">{course.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Продолжительность</h3>
                  <p>{course.duration}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Уровень</h3>
                  <p>{course.level}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Преподаватель</h3>
                  <p>{course.instructor}</p>
                </div>
              </div>
              
              <div className="mb-5">
                <div className="flex flex-wrap gap-2">
                  {course.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <Link 
                href={course.enrollmentUrl}
                className="inline-block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Записаться на курс
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Interface definitions
interface Course {
  id: string
  title: string
  description: string
  duration: string
  level: string
  instructor: string
  price: string
  enrollmentUrl: string
  tags: string[]
} 