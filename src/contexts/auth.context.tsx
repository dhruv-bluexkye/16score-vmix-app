import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { authService } from '@/services/auth.service'

// Temporary interface definitions to bypass import issue
interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  createdAt: string
  updatedAt: string
}

interface LoginCredentials {
  email: string
  password: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  })
  const [loading, setLoading] = useState(true)

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = () => {
      const state = authService.getAuthState()
      setAuthState(state)
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      await authService.login(credentials)
      const newState = authService.getAuthState()
      setAuthState(newState)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    authService.logout()
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
  }

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 