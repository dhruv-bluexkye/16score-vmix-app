import { Button } from '@/components/ui/button'
import { Home, Link as LinkIcon } from 'lucide-react'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
    },
    {
      id: 'manage-api',
      label: 'Manage API',
      icon: LinkIcon,
    },
  ]

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
    
      
      <nav className="flex-1 space-y-2 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.id
          
          return (
            <Button
              key={item.id}
              variant={isActive ? 'secondary' : 'ghost'}
              className={`w-full justify-start transition-colors ${
                isActive 
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
              onClick={() => onTabChange(item.id)}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>
    </div>
  )
} 