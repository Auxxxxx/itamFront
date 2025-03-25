import { NextRequest, NextResponse } from "next/server"

// Mock data for development
const mockTeams = [
  {
    id: "1",
    name: "Блокчейн Новаторы",
    description: "Мы создаем децентрализованное решение для управления цепочками поставок.",
    hackathonId: "1",
    members: [
      { id: "user1", name: "Иван Иванов", email: "ivan@example.com" },
      { id: "user2", name: "Мария Петрова", email: "maria@example.com" }
    ],
    leaderId: "user1"
  },
  {
    id: "2",
    name: "ИИ Решения",
    description: "Разрабатываем ИИ-помощника для медицинских работников.",
    hackathonId: "2",
    members: [
      { id: "user1", name: "Иван Иванов", email: "ivan@example.com" },
      { id: "user3", name: "Алексей Сидоров", email: "alex@example.com" }
    ],
    leaderId: "user1"
  }
]

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const team = mockTeams.find((t) => t.id === params.id)
    
    if (!team) {
      return NextResponse.json(
        { message: "Команда не найдена" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(team)
  } catch (error) {
    console.error(`Error fetching team ${params.id}:`, error)
    return NextResponse.json(
      { message: "Не удалось загрузить команду" },
      { status: 500 }
    )
  }
}
 