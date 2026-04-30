
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { HelpCircle, Info } from "lucide-react";
import NavLinks from "@/components/NavLinks";
import AssistantWidget from "@/components/AssistantWidget";
import ClientNavbarWrapper from "@/components/ClientNavbarWrapper";
import OfflineOverlay from "@/components/OfflineOverlay";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-headline",
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "DBE OS | IIM Bangalore DBE Student Guide & Operating System",
    template: "%s | DBE OS - IIM Bangalore",
  },
  description: "The ultimate student operating system for IIM Bangalore DBE. Access guides, UG resources, BBA DBE notes, and official IIM B resources for the 2024-25 academic year.",
  keywords: [
    "IIM Bangalore",
    "IIM Bangalore UG",
    "IIM Bangalore BBA DBE",
    "IIM Bangalore DBE guide",
    "IIMB Digital Business",
    "IIM Bangalore BBA resources",
    "DBE OS",
    "IIM Bangalore student portal",
  ],
  authors: [{ name: "DBE OS Team" }],
  creator: "DBE OS",
  publisher: "DBE OS",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://dbeos.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DBE OS | The IIM Bangalore DBE Command Center",
    description: "Official-grade guide and resources for IIM Bangalore DBE students. Mastering the Digital Business & Entrepreneurship program.",
    url: "https://dbeos.in",
    siteName: "DBE OS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DBE OS | IIM Bangalore DBE Guide",
    description: "Your academic command center for IIM Bangalore BBA DBE.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "LL-fVntN9gq1K5rpRna57WTsM4pgf3bLtXciqqYlBKA",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''),
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      }
  );
  const { data: { user } } = await supabase.auth.getUser();

  let isUserDisabled = false;
  if (user) {
    const { data: profile } = await supabase.from('users').select('type').eq('id', user.id).single();
    if (profile && profile.type === 0) {
      isUserDisabled = true;
    }
  }

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${beVietnamPro.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface min-h-screen selection:bg-primary-container/30 flex flex-col font-body">

          {isUserDisabled && (
            <div className="fixed inset-0 z-[9999] bg-surface/95 backdrop-blur-xl flex items-center justify-center p-4">
              <div className="bg-surface-container border border-error/20 p-8 md:p-10 rounded-[2.5rem] max-w-md w-full shadow-2xl text-center relative overflow-hidden">
                <div className="absolute top-[-20%] left-[-20%] w-48 h-48 bg-error/10 rounded-full blur-[50px] pointer-events-none" />
                <div className="absolute bottom-[-10%] right-[-10%] w-32 h-32 bg-primary/5 rounded-full blur-[40px] pointer-events-none" />
                
                <div className="w-20 h-20 bg-error/10 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-error/20 shadow-inner">
                  <span className="material-symbols-outlined text-error text-4xl">block</span>
                </div>
                
                <h2 className="text-3xl font-black font-headline text-on-surface tracking-tight mb-3">Account Disabled</h2>
                <p className="text-sm font-medium text-on-surface-variant leading-relaxed mb-8 px-2">
                  Your account has been disabled. You no longer have access to the DBE OS. Please contact an administrator if you believe this is a mistake.
                </p>
                
                <a 
                  href="mailto:admin@dbeos.in" 
                  className="w-full py-4 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  Contact Admin
                </a>
              </div>
            </div>
          )}

          <ClientNavbarWrapper user={user} />

          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 mb-24 md:mb-0">
            {children}
          </main>
          <AssistantWidget />
          <OfflineOverlay />

      </body>
    </html>
  );
}
