import { NextRequest, NextResponse } from "next/server"

// Mock data for development - this should match what's in the teams route
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

// Mock users data for development
const mockUsers = [
  { id: "user1", name: "Иван Иванов", email: "ivan@example.com" },
  { id: "user2", name: "Мария Петрова", email: "maria@example.com" },
  { id: "user3", name: "Алексей Сидоров", email: "alex@example.com" },
  { id: "user4", name: "Екатерина Смирнова", email: "kate@example.com" }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    if (!body.teamId || !body.userId) {
      return NextResponse.json(
        { message: "Требуются ID команды и ID пользователя" },
        { status: 400 }
      )
    }
    
    // Find the team
    const teamIndex = mockTeams.findIndex(team => team.id === body.teamId)
    
    if (teamIndex === -1) {
      return NextResponse.json(
        { message: "Команда не найдена" },
        { status: 404 }
      )
    }
    
    // Check if the user exists
    const user = mockUsers.find(user => user.id === body.userId)
    
    if (!user) {
      return NextResponse.json(
        { message: "Пользователь не найден" },
        { status: 404 }
      )
    }
    
    // Check if the user is already a member of the team
    const team = mockTeams[teamIndex]
    const isMember = team.members.some(member => member.id === body.userId)
    
    if (isMember) {
      return NextResponse.json(
        { message: "Пользователь уже является членом команды" },
        { status: 400 }
      )
    }
    
    // Add the user to the team
    team.members.push(user)
    
    return NextResponse.json(team)
  } catch (error) {
    console.error("Error adding member to team:", error)
    return NextResponse.json(
      { message: "Не удалось добавить участника в команду" },
      { status: 500 }
    )
  }
} 