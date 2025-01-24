import "./globals.css"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import { ThemeSwitcher } from "@/app/components/theme-switcher"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Pro Clubs Stats",
  description: "Interactive statistics for Pro Clubs player and team data",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="relative min-h-screen bg-background text-foreground">
            <div className="absolute top-4 right-4 z-50 sm:top-6 sm:right-6">
              <ThemeSwitcher />
            </div>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}

