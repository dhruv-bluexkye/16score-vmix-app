import { apiService } from '@/lib/api'

export interface LoginCredentials {
  email: string
  password: string
}

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  success: boolean
  token: string
  user: User
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

class AuthService {
  private tokenKey = 'authToken'
  private userKey = 'authUser'

  // Login user
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      console.log('Attempting login with credentials:', credentials)
      
      const response = await apiService.post<LoginResponse>('/auth/login', credentials)
      
      console.log('Login response:', response)
      
      // Handle the response structure
      if (response.success && response.data) {
        const { token, user } = response.data
        console.log('Using data.token and data.user')
        
        // Store token and user data
        this.setToken(token)
        this.setUser(user)
        
        return response.data
      } else {
        console.log('Response validation failed')
        throw new Error(response.message || 'Login failed - invalid response format')
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  // Logout user
  logout(): void {
    localStorage.removeItem(this.tokenKey)
    localStorage.removeItem(this.userKey)
  }

  // Get current user
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem(this.userKey)
    return userStr ? JSON.parse(userStr) : null
  }

  // Get current token
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey)
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken()
  }

  // Get auth state
  getAuthState(): AuthState {
    const user = this.getCurrentUser()
    const token = this.getToken()
    
    return {
      user,
      token,
      isAuthenticated: !!token,
    }
  }

  // Set token in localStorage
  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token)
  }

  // Set user in localStorage
  private setUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user))
  }

  // Refresh user data (optional - for future use)
  async refreshUser(): Promise<User | null> {
    try {
      const response = await apiService.get<User>('/auth/me')
      if (response.success && response.data) {
        this.setUser(response.data)
        return response.data
      }
      return null
    } catch (error) {
      console.error('Refresh user error:', error)
      return null
    }
  }
}

export const authService = new AuthService() 