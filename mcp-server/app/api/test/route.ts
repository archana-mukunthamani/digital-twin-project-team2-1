import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  return NextResponse.json({ 
    success: true, 
    message: 'Test endpoint works! API routing is functioning.' 
  })
}

export async function POST(request: Request) {
  return NextResponse.json({ 
    success: true, 
    message: 'Test endpoint POST works!' 
  })
}
