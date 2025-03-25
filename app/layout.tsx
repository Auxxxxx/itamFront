import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navigation } from "./components/ui/navigation"
import { ServiceSelector } from "./components/ui/service-selector"
import { HackathonTabs } from "./components/ui/hackathon-tabs"

const inter = Inter({ subsets: ["latin", "cyrillic"] })

export const metadata: Metadata = {
  title: "ИТ-Платформа",
  description: "Образовательная платформа для технических специалистов",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="h-full">
      <body className={`${inter.className} flex flex-col h-full`}>
        <Navigation />
        <ServiceSelector />
        <HackathonTabs />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  )
} 