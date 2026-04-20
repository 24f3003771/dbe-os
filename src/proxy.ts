import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Define which routes are public (unprotected)
const isPublicRoute = createRouteMatcher(['/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware(async (auth, request) => {
  // 1. Enforce login for all routes except sign-in/sign-up
  if (!isPublicRoute(request)) {
    const { userId, sessionClaims } = await auth()

    // If not logged in, redirect to sign-in modal/page
    if (!userId) {
      return (await auth()).redirectToSignIn()
    }

    // 2. Restrict to @iimb.ac.in domain
    // Note: Clerk stores email in sessionClaims.email if configured in dashboard, 
    // or we can check the primary email address.
    const email = sessionClaims?.email as string;
    if (email && !email.endsWith('@iimb.ac.in')) {
      // If the email is not IIMB, we could redirect to a custom error page
      // For now, we'll redirect back to sign-in with a hint or just block access
      return NextResponse.redirect(new URL('https://clerk.com/docs/errors/unauthorized-domain', request.url))
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
