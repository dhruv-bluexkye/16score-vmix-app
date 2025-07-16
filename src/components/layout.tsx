import { type ReactNode } from 'react'
import { Navbar } from './navbar'
import { Sidebar } from './sidebar'

interface LayoutProps {
  children: ReactNode
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="flex h-[calc(100vh-4rem)]">
        <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
        <main className="flex-1 overflow-auto bg-background">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 