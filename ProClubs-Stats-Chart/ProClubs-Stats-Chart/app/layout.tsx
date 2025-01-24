import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/app/components/theme-provider"
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
        <ThemeProvider
          attribute="class"
          defaultTheme="default"
          enableSystem={false}
          themes={["default", "black", "green", "pink"]}
        >
          <div className="relative min-h-screen">
            <div className="absolute top-4 right-4 z-50">
              <ThemeSwitcher />
            </div>
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

