import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;

export const updateSession = async (request: NextRequest) => {
  try {
    // Create an unmodified response
    let supabaseResponse = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase environment variables in middleware");
      return supabaseResponse;
    }

    const supabase = createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
            supabaseResponse = NextResponse.next({
              request,
            })
            cookiesToSet.forEach(({ name, value, options }) =>
              supabaseResponse.cookies.set(name, value, options)
            )
          },
        },
      },
    );

    // refreshing the auth token
    const { data: { user } } = await supabase.auth.getUser()

    const protectedRoutes = ["/", "/dashboard", "/notes", "/leaderboard", "/matchforge", "/dbe_notes", "/profile", "/hq-admin"];
    const authRoutes = ["/login", "/register"];
    const isProtectedRoute = protectedRoutes.some(route => 
      route === '/' ? request.nextUrl.pathname === '/' : request.nextUrl.pathname.startsWith(route)
    );
    const isAuthRoute = authRoutes.some(route => request.nextUrl.pathname.startsWith(route));

    if (!user && isProtectedRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Check if the user is active (type !== 0) and check admin route permissions
    if (user && isProtectedRoute) {
        const { data: profile } = await supabase.from('users').select('type, role').eq('id', user.id).single();
        
        // If disabled, we let them through to the page, but layout.tsx will render a global un-dismissible dialog.
        // We do not sign them out so they stay logged in.


        // If trying to access /hq-admin without SUPER_ADMIN role, redirect to dashboard
        if (request.nextUrl.pathname.startsWith('/hq-admin') && (!profile || profile.role !== 'SUPER_ADMIN')) {
            const url = request.nextUrl.clone();
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
    }

    if (user && isAuthRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/";
        return NextResponse.redirect(url);
    }

    return supabaseResponse
  } catch (error) {
    console.error("Middleware error:", error);
    // If middleware crashes, just let the request through so the site doesn't 500
    // They will just be unauthenticated
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
};
