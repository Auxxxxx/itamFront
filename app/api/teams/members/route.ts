import { NextRequest, NextResponse } from "next/server"

// Mock data for development - this should match what's in the teams route
const mockTeams = [
  {
    id: "1",
    name: "Blockchain Innovators",
    description: "We're building a decentralized solution for supply chain management.",
    hackathonId: "1",
    members: [
      { id: "user1", name: "John Doe", email: "john@example.com" },
      { id: "user2", name: "Jane Smith", email: "jane@example.com" }
    ],
    leaderId: "user1"
  },
  {
    id: "2",
    name: "AI Solutions",
    description: "Developing an AI-powered assistant for healthcare professionals.",
    hackathonId: "2",
    members: [
      { id: "user1", name: "John Doe", email: "john@example.com" },
      { id: "user3", name: "Bob Johnson", email: "bob@example.com" }
    ],
    leaderId: "user1"
  }
]

// Mock users data for development
const mockUsers = [
  { id: "user1", name: "John Doe", email: "john@example.com" },
  { id: "user2", name: "Jane Smith", email: "jane@example.com" },
  { id: "user3", name: "Bob Johnson", email: "bob@example.com" },
  { id: "user4", name: "Alice Brown", email: "alice@example.com" }
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    if (!body.teamId || !body.userId) {
      return NextResponse.json(
        { message: "Team ID and User ID are required" },
        { status: 400 }
      )
    }
    
    // Find the team
    const teamIndex = mockTeams.findIndex(team => team.id === body.teamId)
    
    if (teamIndex === -1) {
      return NextResponse.json(
        { message: "Team not found" },
        { status: 404 }
      )
    }
    
    // Check if the user exists
    const user = mockUsers.find(user => user.id === body.userId)
    
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      )
    }
    
    // Check if the user is already a member of the team
    const team = mockTeams[teamIndex]
    const isMember = team.members.some(member => member.id === body.userId)
    
    if (isMember) {
      return NextResponse.json(
        { message: "User is already a member of this team" },
        { status: 400 }
      )
    }
    
    // Add the user to the team
    team.members.push(user)
    
    return NextResponse.json(team)
  } catch (error) {
    console.error("Error adding member to team:", error)
    return NextResponse.json(
      { message: "Failed to add member to team" },
      { status: 500 }
    )
  }
} 