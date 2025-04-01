'use client'

import { useState, useEffect } from 'react'

interface User {
  id: number
  name: string
  email: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  async function fetchUser() {
    console.log("Fetching user data...");
    try {
      const token = localStorage.getItem('auth_token')
      console.log("Token found:", !!token);
      
      if (!token) {
        setUser(null);
        setIsLoading(false)
        return
      }

      const response = await fetch('http://45.10.41.58:8080/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      console.log("API response status:", response.status);
      
      if (!response.ok) {
        console.error("Failed to fetch user data:", response.status);
        localStorage.removeItem('auth_token')
        localStorage.removeItem('token_type')
        localStorage.removeItem('expires_in')
        setUser(null);
        setIsLoading(false)
        return
      }

      const data = await response.json()
      console.log("User data received:", data);
      setUser(data)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      setUser(null);
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()

    // Listen for auth state changes
    function handleAuthChange() {
      console.log("Auth state changed event received");
      fetchUser()
    }

    window.addEventListener('authStateChanged', handleAuthChange)

    return () => {
      window.removeEventListener('authStateChanged', handleAuthChange)
    }
  }, [])

  return { user, isLoading }
} 