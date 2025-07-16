import { Button } from '@/components/ui/button'
import { ThemeToggle } from './theme-toggle'
import { useAuth } from '@/contexts/auth.context'

export function Navbar() {
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-foreground">16Score VMix</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="hidden sm:inline text-sm text-muted-foreground">
            Welcome, {user?.firstName || 'User'}!
          </span>
          <ThemeToggle />
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            size="sm"
            className="hidden sm:inline-flex"
          >
            Logout
          </Button>
          <Button 
            onClick={handleLogout} 
            variant="outline" 
            size="sm"
            className="sm:hidden"
          >
            <span className="sr-only">Logout</span>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </Button>
        </div>
      </div>
    </nav>
  )
} 