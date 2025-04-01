import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json()
    console.log('Proxying hacker upsert request:', body)
    
    // Forward the request to the actual API
    const response = await fetch('http://45.10.41.58:8000/hacker/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Forward the authorization header if present
        ...(request.headers.get('Authorization') 
           ? { 'Authorization': request.headers.get('Authorization') as string } 
           : {})
      },
      body: JSON.stringify(body)
    })
    
    // Get the response data
    const data = await response.json()
    
    // Return the response
    return NextResponse.json(data, {
      status: response.status,
    })
  } catch (error) {
    console.error('Error in hacker proxy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 