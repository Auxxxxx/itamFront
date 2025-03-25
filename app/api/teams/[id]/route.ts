import { NextRequest, NextResponse } from "next/server"

// Mock data for development
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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const team = mockTeams.find((t) => t.id === params.id)
    
    if (!team) {
      return NextResponse.json(
        { message: "Team not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(team)
  } catch (error) {
    console.error(`Error fetching team ${params.id}:`, error)
    return NextResponse.json(
      { message: "Failed to fetch team" },
 