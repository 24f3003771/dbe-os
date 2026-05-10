
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { HelpCircle, Info } from "lucide-react";
import NavLinks from "@/components/NavLinks";
import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import dynamic from "next/dynamic";
import ClientNavbarWrapper from "@/components/ClientNavbarWrapper";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-headline",
  display: "swap",
  preload: true,
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: {
    default: "DBE OS | IIM Bangalore BBA DBE Student Platform",
    template: "%s | IIM Bangalore BBA DBE",
  },
  description: "The ultimate student platform for Indian Institute of Management Bangalore BBA DBE. Access online BBA courses, admission process 2026, eligibility criteria, fees, syllabus, and IIMB DBE community notes.",
  keywords: [
    "Indian Institute of Management Bangalore BBA",
    "IIM Bangalore BBA",
    "IIM Bangalore DBE",
    "IIM Bangalore Digital Business Entrepreneurship",
    "IIM Bangalore undergraduate program",
    "IIM Bangalore online BBA",
    "IIMB BBA DBE course",
    "IIM Bangalore BBA eligibility",
    "IIM Bangalore BBA fees",
    "IIM Bangalore BBA admission 2026",
    "IIM Bangalore BBA DBE admission process 2026",
    "how to get into IIM Bangalore BBA",
    "IIM Bangalore BBA entrance exam details",
    "IIMB DBE course syllabus",
    "IIM Bangalore BBA online course review",
    "is IIM Bangalore BBA worth it",
    "IIM Bangalore BBA placement details",
    "IIM Bangalore DBE vs regular BBA",
    "IIM Bangalore BBA eligibility criteria for 12th students",
    "IIM Bangalore BBA application form last date",
    "what is digital business and entrepreneurship",
    "online BBA from IIM Bangalore",
    "benefits of IIM Bangalore online degree",
    "best online BBA programs in India",
    "IIM Bangalore courses for students after 12th",
    "IIM Bangalore certification courses",
    "IIM Bangalore online learning platform",
    "IIM Bangalore BBA vs Indian Institute of Management Indore IPM",
    "IIM Bangalore DBE vs regular college BBA",
    "IIM Bangalore BBA vs DU BBA",
    "IIM Bangalore vs private BBA colleges",
    "IIM Bangalore online vs offline programs",
    "IIMB DBE community",
    "IIM Bangalore BBA student platform",
    "IIM Bangalore BBA resources",
    "IIM Bangalore DBE notes",
    "IIM Bangalore BBA preparation platform",
    "IIM Bangalore DBE student network"
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
    title: "DBE OS | IIM Bangalore BBA DBE Student Platform",
    description: "Official-grade guide and resources for IIM Bangalore BBA DBE students. Mastering the Digital Business & Entrepreneurship program.",
    url: "https://dbeos.in",
    siteName: "DBE OS",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DBE OS - Your Productivity. Upgraded.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DBE OS | IIM Bangalore BBA DBE Platform",
    description: "Your academic command center for IIM Bangalore BBA DBE.",
    images: ["/og-image.png"],
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
  const supabase = createClient(cookieStore);
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Load Material Symbols async — non-blocking to avoid render delay */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
          media="print"
          // @ts-ignore
          onLoad="this.media='all'"
        />
        <noscript>
          <link
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
            rel="stylesheet"
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "EducationalOrganization",
              "name": "DBE OS",
              "alternateName": "IIM Bangalore BBA DBE Student Platform",
              "url": "https://dbeos.in",
              "description": "DBE OS is the ultimate student preparation platform and academic operating system for the IIM Bangalore BBA DBE (Digital Business and Entrepreneurship) program. Built by students, for students. It is the best preparation platform for BBA DBE, providing notes, guides, community networking, and tools.",
              "founder": [
                {
                  "@type": "Person",
                  "name": "Ishaan Jha",
                  "jobTitle": "Co-founder of DBE OS",
                  "sameAs": "https://github.com/Ishaan-jha-dev"
                },
                {
                  "@type": "Person",
                  "name": "Madhwendra",
                  "jobTitle": "Co-founder of DBE OS"
                }
              ],
              "knowsAbout": ["IIM Bangalore", "BBA DBE", "Digital Business and Entrepreneurship", "Undergraduate Program"]
            })
          }}
        />
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

      </body>
    </html>
  );
}
