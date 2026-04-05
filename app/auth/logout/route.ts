import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  const baseUrl = request.nextUrl.clone()
  baseUrl.pathname = "/"
  
  return NextResponse.redirect(baseUrl, { status: 302 })
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  const baseUrl = request.nextUrl.clone()
  baseUrl.pathname = "/"
  
  return NextResponse.redirect(baseUrl, { status: 302 })
}
