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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    
    if (!userId) {
      return NextResponse.json(
        { message: "Требуется ID пользователя" },
        { status: 400 }
      )
    }
    
    // Filter teams where the user is a member
    const userTeams = mockTeams.filter(team => 
      team.members.some(member => member.id === userId)
    )
    
    return NextResponse.json(userTeams)
  } catch (error) {
    console.error("Error fetching teams:", error)
    return NextResponse.json(
      { message: "Не удалось загрузить команды" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    if (!body.name || !body.description || !body.hackathonId) {
      return NextResponse.json(
        { message: "Отсутствуют необходимые поля" },
        { status: 400 }
      )
    }
    
    // Get the user ID from the request (in a real app, this would come from the authenticated session)
    const userId = body.userId || "user1" // Default to user1 for demo purposes
    
    // Create a new team
    const newTeam = {
      id: `${mockTeams.length + 1}`,
      name: body.name,
      description: body.description,
      hackathonId: body.hackathonId,
      members: [
        { id: userId, name: "Иван Иванов", email: "ivan@example.com" } // We're assuming this is the user creating the team
      ],
      leaderId: userId
    }
    
    // In a real app, we would save this to a database
    mockTeams.push(newTeam)
    
    return NextResponse.json(newTeam)
  } catch (error) {
    console.error("Error creating team:", error)
    return NextResponse.json(
      { message: "Не удалось создать команду" },
      { status: 500 }
    )
  }
} 