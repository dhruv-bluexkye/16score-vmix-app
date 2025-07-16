import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/auth.context'

export function Dashboard() {
  const { user } = useAuth()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your account.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Welcome, {user?.firstName}!</CardTitle>
            <CardDescription>
              You are successfully logged in to your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-card-foreground">
              <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Member since:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-card-foreground">Account Information</CardTitle>
            <CardDescription>
              Your account details and settings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-card-foreground">
              <div>
                <p className="text-sm text-muted-foreground">User ID</p>
                <p className="font-mono text-sm">{user?._id}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last Updated</p>
                <p>{user?.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">API Integration</CardTitle>
          <CardDescription>
            This dashboard demonstrates successful API integration with your backend.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The login form successfully communicates with your API at{' '}
            <code className="bg-muted px-2 py-1 rounded text-foreground">
              {import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}
            </code>
          </p>
        </CardContent>
      </Card>
    </div>
  )
} 