import { ClerkProvider, SignInButton, Show, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import NavLinks from "@/components/NavLinks";

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
  title: "DBE OS – Student Operating System",
  description:
    "Your academic command center. Deadlines, practice, focus, community — all in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${beVietnamPro.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-surface text-on-surface min-h-screen selection:bg-primary-container/30 flex flex-col font-body">
        <ClerkProvider
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-primary hover:bg-primary-dim text-white transition-all shadow-md hover:shadow-lg rounded-xl text-sm font-bold py-2.5",
              card: "bg-surface border border-outline-variant/20 shadow-2xl rounded-3xl overflow-hidden",
              headerTitle: "text-on-surface font-headline font-bold text-2xl tracking-tight",
              headerSubtitle: "text-on-surface-variant font-body",
              socialButtonsBlockButton: 
                "border-outline-variant/20 hover:bg-surface-container transition-colors rounded-xl h-11",
              socialButtonsBlockButtonText: "text-on-surface font-semibold",
              formFieldLabel: "text-on-surface-variant font-bold mb-1.5 text-xs uppercase tracking-wider",
              formFieldInput: 
                "bg-surface-container-lowest border-outline-variant/20 focus:border-primary focus:ring-1 focus:ring-primary rounded-xl transition-all h-11",
              footerActionText: "text-on-surface-variant font-medium",
              footerActionLink: "text-primary hover:text-primary-dim font-bold",
              identityPreviewText: "text-on-surface",
              identityPreviewEditButtonIcon: "text-primary",
              userButtonAvatarBox: "shadow-md border-2 border-primary/20 hover:scale-105 transition-transform",
              userButtonPopoverCard: "bg-surface border border-outline-variant/20 shadow-2xl rounded-2xl",
              userButtonPopoverActionButtonText: "text-on-surface font-medium",
              userButtonPopoverFooter: "hidden", // Clean up the footer
            },
            variables: {
              colorPrimary: "#29664c",
              colorText: "#422820",
              colorBackground: "#fff4f1",
              colorInputBackground: "#ffffff",
              colorInputText: "#422820",
              borderRadius: "12px",
            },
          }}
        >
          <header className="sticky top-0 z-50 w-full bg-surface/80 backdrop-blur-xl border-b border-outline-variant/20 shadow-sm print:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                  DB
                </div>
                <span className="font-bold font-headline tracking-tight text-primary text-lg hidden sm:inline">
                  DBE OS{" "}
                  <span className="text-on-surface-variant font-normal ml-1 text-sm border-l border-outline-variant/30 pl-2">
                    v2
                  </span>
                </span>
              </Link>
              <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium text-on-surface-variant">
                <div className="hidden md:flex items-center gap-1">
                  <NavLinks />
                </div>
                <div className="md:ml-4 md:pl-4 md:border-l border-outline-variant/20 flex items-center gap-2">
                  <Show when="signed-out">
                    <div className="flex flex-col items-end gap-1">
                      <SignInButton mode="modal">
                        <button className="bg-primary text-white px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-95 text-[10px] sm:text-xs uppercase tracking-wider">
                          Sign In
                        </button>
                      </SignInButton>
                      <span className="hidden sm:block text-[8px] text-primary/60 font-black uppercase tracking-tighter">Use Student ID (@iimb.ac.in)</span>
                    </div>
                  </Show>
                  <Show when="signed-in">
                    <UserButton />
                  </Show>
                </div>
              </nav>
            </div>
          </header>

          <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10 mb-20 md:mb-0">
            {children}
          </main>

          {/* Bottom Navigation for Mobile */}
          <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-surface/90 backdrop-blur-xl border-t border-outline-variant/20 px-4 py-2 pb-safe-area-inset-bottom shadow-[0_-4px_12px_rgba(0,0,0,0.05)] print:hidden">
            <div className="flex items-center justify-around">
              <NavLinks showLabels={true} isBottomNav={true} />
            </div>
          </nav>
        </ClerkProvider>
      </body>
    </html>
  );
}
