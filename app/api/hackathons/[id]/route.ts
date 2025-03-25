import { NextRequest, NextResponse } from "next/server"

// Mock data for development
const mockHackathons = [
  {
    id: "1",
    name: "Blockchain Innovation Challenge",
    description: "Build innovative blockchain solutions for real-world problems.",
    startDate: "2024-01-15T00:00:00Z",
    endDate: "2024-01-17T00:00:00Z",
    location: "San Francisco, CA",
    status: "upcoming"
  },
  {
    id: "2",
    name: "AI & Machine Learning Hackathon",
    description: "Develop intelligent applications using AI and machine learning technologies.",
    startDate: "2024-02-10T00:00:00Z",
    endDate: "2024-02-12T00:00:00Z",
    location: "Online",
    status: "upcoming"
  },
  {
    id: "3",
    name: "Web3 Development Summit",
    description: "Create decentralized applications for the next generation of the web.",
    startDate: "2023-11-05T00:00:00Z",
    endDate: "2023-11-07T00:00:00Z",
    location: "Berlin, Germany",
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
        { message: "Hackathon not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(hackathon)
  } catch (error) {
    console.error(`Error fetching hackathon ${params.id}:`, error)
    return NextResponse.json(
      { message: "Failed to fetch hackathon" },
      { status: 500 }
    )
  }
} 