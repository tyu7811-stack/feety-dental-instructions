import { type NextRequest } from "next/server"
import { redirectIfLegacyHost } from "@/lib/middleware/legacy-vercel-host-redirect"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  const legacy = redirectIfLegacyHost(request)
  if (legacy) return legacy
  return updateSession(request)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|documents/).*)",
  ],
}
