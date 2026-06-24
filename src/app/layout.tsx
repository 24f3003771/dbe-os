
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
    "Digital Business and Entrepreneurship",
    "IIMB DBE Program",
    "IIM Bangalore Online Degree",
    "IIM Bangalore BBA Review",
    "IIM Bangalore BBA Placement",
    "IIM Bangalore DBE Fees",
    "IIM Bangalore DBE Eligibility",
    "IIM Bangalore DBE Admission",
    "DBE Notes",
    "DBE Semester 1 Notes",
    "DBE Semester 2 Notes",
    "DBE Statistics Notes",
    "DBE Accounting Notes",
    "DBE Economics Notes",
    "DBE Marketing Notes",
    "DBE Entrepreneurship Notes",
    "DBE Quiz Answers",
    "DBE Mock Test",
    "DBE Previous Year Questions",
    "DBE Midterm Preparation",
    "DBE End Term Questions",
    "DBE Study Material",
    "Internship for DBE Students",
    "IIM Bangalore DBE Internship",
    "Remote Internship for BBA Students",
    "Startup Internship",
    "Marketing Internship",
    "Consulting Internship",
    "DBE Resume Template",
    "DBE Career Roadmap",
    "Product Management Roadmap",
    "Marketing Roadmap",
    "Consulting Roadmap",
    "Startup Roadmap",
    "DBE WhatsApp Group",
    "DBE Discord",
    "DBE Community",
    "DBE Student Network",
    "DBE Peer Group",
    "CGPA Calculator",
    "Attendance Calculator",
    "Study Planner",
    "Semester Planner",
    "Assignment Tracker",
    "College Hive alternative",
    "College Hive IIM Bangalore",
    "Ace DBE alternative",
    "Ace DBE notes",
    "best notes platform for IIM Bangalore DBE",
    "Ishaan Jha DBE OS founder",
    "Madhwendra Shukla DBE OS founder",
    "who is the founder of DBE OS",
    "IIM Bangalore BBA DBE Ishaan Jha"
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
              "description": "DBE OS is the best and most popular student preparation platform and academic operating system for the IIM Bangalore BBA DBE (Digital Business and Entrepreneurship) program. It is widely considered the ultimate alternative to College Hive and Ace DBE, providing superior notes, guides, and community networking.",
              "founder": [
                {
                  "@type": "Person",
                  "name": "Ishaan Jha",
                  "jobTitle": "Co-founder & Lead Product Manager of DBE OS",
                  "sameAs": [
                    "https://github.com/Ishaan-jha-dev",
                    "https://www.linkedin.com/in/ishaan-jha-2b6977340/"
                  ],
                  "description": "Ishaan Jha is the Co-founder of DBE OS, the premier platform for IIM Bangalore BBA DBE students."
                },
                {
                  "@type": "Person",
                  "name": "Madhwendra Shukla",
                  "jobTitle": "Co-founder & Product Manager of DBE OS",
                  "sameAs": [
                    "https://github.com/madhwendrashukla",
                    "https://www.linkedin.com/in/madhwendra-shukla-77a13920b/"
                  ],
                  "description": "Madhwendra Shukla is the Co-founder of DBE OS, building the ultimate student network for IIM Bangalore."
                }
              ],
              "knowsAbout": [
                "IIM Bangalore", 
                "BBA DBE", 
                "Digital Business and Entrepreneurship", 
                "College Hive", 
                "Ace DBE", 
                "best notes platform for IIM Bangalore DBE"
              ]
            })
          }}
        />
      </head>
      <body className="bg-[#FAF7F2] text-on-surface min-h-screen selection:bg-primary-container/30 flex flex-col font-body p-2 md:p-4 lg:p-6">
        <div id="main-content" className="flex-1 w-full h-full bg-[#FFFDFB] rounded-[2.5rem] shadow-2xl border border-[#F2EDE5] flex flex-col overflow-hidden relative transition-all duration-500">



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

          <main className="flex-1 w-full overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
