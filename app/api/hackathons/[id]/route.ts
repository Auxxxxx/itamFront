import { NextRequest, NextResponse } from "next/server"

// Mock data for development
const mockHackathons = [
  {
    id: "1",
    name: "Блокчейн Инновации",
    description: "Создайте инновационные блокчейн-решения для реальных проблем.",
    startDate: "2024-01-15T00:00:00Z",
    endDate: "2024-01-17T00:00:00Z",
    location: "Москва, Россия",
    status: "upcoming"
  },
  {
    id: "2",
    name: "ИИ и Машинное Обучение",
    description: "Разработайте интеллектуальные приложения с использованием технологий ИИ и машинного обучения.",
    startDate: "2024-02-10T00:00:00Z",
    endDate: "2024-02-12T00:00:00Z",
    location: "Онлайн",
    status: "upcoming"
  },
  {
    id: "3",
    name: "Web3 Разработка",
    description: "Создайте децентрализованные приложения для нового поколения веба.",
    startDate: "2023-11-05T00:00:00Z",
    endDate: "2023-11-07T00:00:00Z",
    location: "Санкт-Петербург, Россия",
    status: "completed"
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const hackathon = mockHackathons.find((h) => h.id === params.id)
    
    if (!hackathon) {
      return NextResponse.json(
        { message: "Хакатон не найден" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(hackathon)
  } catch (error) {
    console.error(`Error fetching hackathon ${params.id}:`, error)
    return NextResponse.json(
      { message: "Не удалось загрузить хакатон" },
      { status: 500 }
    )
  }
} 