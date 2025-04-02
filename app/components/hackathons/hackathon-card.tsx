import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card"
import { Button } from "@/app/components/ui/button"
import { CalendarIcon, MapPinIcon } from "lucide-react"
import type { Hackathon } from "@/app/lib/types/hackathon"

interface HackathonCardProps {
  hackathon: Hackathon
}

export function HackathonCard({ hackathon }: HackathonCardProps) {
  const { id, name, description, startDate, endDate, location, status } = hackathon
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }
  
  const statusColors = {
    upcoming: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    completed: "bg-gray-100 text-gray-800"
  }
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{name}</CardTitle>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </div>
        </div>
        <CardDescription className="flex items-center gap-2 text-sm text-gray-500">
          <CalendarIcon size={14} />
          <span>
            {formatDate(startDate)} - {formatDate(endDate)}
          </span>
        </CardDescription>
        {location && (
          <CardDescription className="flex items-center gap-2 text-sm text-gray-500">
            <MapPinIcon size={14} />
            <span>{location}</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-2">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-2">
        <Link href={`/hackathons/${id}`} passHref>
          <Button variant="outline">View Details</Button>
        </Link>
        <Link href={`/hackathons/teams/create?hackathonId=${id}`} passHref>
          <Button>Create Team</Button>
        </Link>
      </CardFooter>
    </Card>
  )
} 