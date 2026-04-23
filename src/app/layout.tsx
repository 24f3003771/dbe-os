
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { HelpCircle, Info } from "lucide-react";
import NavLinks from "@/components/NavLinks";
import AssistantWidget from "@/components/AssistantWidget";
import MainLoadingScreen from "@/components/MainLoadingScreen";
import ClientNavbarWrapper from "@/components/ClientNavbarWrapper";
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
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      }
  );
  const { data: { user } } = await supabase.auth.getUser();
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${beVietnamPro.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface min-h-screen selection:bg-primary-container/30 flex flex-col font-body">

          <ClientNavbarWrapper user={user} />

          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 mb-20 md:mb-0">
            {children}
          </main>
          <MainLoadingScreen />
          <AssistantWidget />

      </body>
    </html>
  );
}
