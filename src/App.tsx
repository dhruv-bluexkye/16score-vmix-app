import { useState } from 'react'
import { LoginPage } from '@/components/login-page'
import { Dashboard } from '@/components/dashboard'
import { ManageApi } from '@/components/manage-api'
import { Layout } from '@/components/layout'
import { AuthProvider, useAuth } from '@/contexts/auth.context'

function AppContent() {
  const { isAuthenticated, loading } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'manage-api':
        return <ManageApi />
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
