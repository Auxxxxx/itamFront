'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Service {
  id: string
  name: string
  path: string
  active: boolean
}

export function ServiceSelector() {
  const pathname = usePathname()
  
  const [services, setServices] = useState<Service[]>([
    { id: 'hackathons', name: 'Хакатоны', path: '/hackathons', active: false },
    { id: 'events', name: 'Мероприятия', path: '/events', active: false },
    { id: 'courses', name: 'Курсы', path: '/courses', active: false },
    { id: 'mentoring', name: 'Менторство', path: '/mentoring', active: false },
  ])
  
  useEffect(() => {
    // Update active service based on current pathname
    const updatedServices = services.map(service => ({
      ...service,
      active: pathname?.startsWith(service.path) || false
    }))
    
    // If no service is active and user is on a page other than home, make hackathons active by default
    if (!updatedServices.some(s => s.active) && pathname !== '/' && pathname !== '/login' && pathname !== '/register') {
      updatedServices[0].active = true
    }
    
    setServices(updatedServices)
  }, [pathname])

  // Hide the service selector on certain pages
  if (pathname === '/' || pathname === '/login' || pathname === '/register') {
    return null
  }

  return (
    <div className="sticky top-0 bg-white border-b z-10">
      <div className="container mx-auto">
        <div className="flex overflow-x-auto scrollbar-hide">
          {services.map(service => (
            <Link
              key={service.id}
              href={service.path}
              className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors
                ${service.active 
                  ? 'text-blue-600 border-b-2 border-blue-600' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              aria-current={service.active ? 'page' : undefined}
            >
              {service.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 