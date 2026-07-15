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

    const publicRoutes = ["/login", "/register", "/auth", "/api/auth", "/features", "/developers"];
    const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route));
    const isAuthRoute = ["/login", "/register"].some(route => request.nextUrl.pathname.startsWith(route));

    // Protect EVERYTHING by default unless it's explicitly public
    if (!user && !isPublicRoute) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Only check admin role permission when accessing /hq-admin routes
    if (user && request.nextUrl.pathname.startsWith('/hq-admin')) {
        const { data: profile } = await supabase.from('users').select('role').eq('id', user.id).single();
        if (!profile || profile.role !== 'SUPER_ADMIN') {
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
