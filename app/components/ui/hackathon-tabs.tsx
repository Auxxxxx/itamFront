'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface HackathonTab {
  id: string
  name: string
  path: string
  active: boolean
}

export function HackathonTabs() {
  const pathname = usePathname()
  
  const [tabs, setTabs] = useState<HackathonTab[]>([
    { id: 'list', name: 'Список хакатонов', path: '/hackathons', active: false },
    { id: 'teams', name: 'Мои команды', path: '/hackathons/teams', active: false },
  ])
  
  useEffect(() => {
    // Update active tab based on current pathname
    const updatedTabs = tabs.map(tab => {
      // Exact match for the hackathons main page
      if (tab.id === 'list' && (pathname === '/hackathons' || pathname === '/hackathons/')) {
        return { ...tab, active: true }
      }
      // For other tabs, check if the path is included in the pathname
      return {
        ...tab,
        active: tab.id !== 'list' && pathname?.startsWith(tab.path) || false
      }
    })
    
    setTabs(updatedTabs)
  }, [pathname])

  // Only show hackathon tabs on hackathons pages
  if (!pathname?.startsWith('/hackathons')) {
    return null
  }

  return (
    <div className="bg-gray-50 border-b">
      <div className="container mx-auto">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map(tab => (
            <Link
              key={tab.id}
              href={tab.path}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors
                ${tab.active 
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              aria-current={tab.active ? 'page' : undefined}
            >
              {tab.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 