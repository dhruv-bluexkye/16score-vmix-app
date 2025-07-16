import { apiService } from '@/lib/api'

export interface ApiLink {
  _id: string
  userId: string
  linkId: string
  matchId: string
  type: string
  isActive: boolean
  lastAccessed: string
  accessCount: number
  createdAt: string
  updatedAt: string
  __v: number
  publicUrl: string
}

export interface ApiLinksResponse {
  success: boolean
  count: number
  data: ApiLink[]
}

interface UpdateApiLinkData {
  matchId: string
  type: string
}

class ApiLinksService {
  // Get all API links
  async getApiLinks(): Promise<ApiLinksResponse> {
    try {
      const response = await apiService.get<ApiLinksResponse>('/apilinks')
      return response as unknown as ApiLinksResponse
    } catch (error) {
      console.error('Failed to fetch API links:', error)
      throw error
    }
  }

  // Toggle API link status
  async toggleApiLink(linkId: string): Promise<any> {
    try {
      const response = await apiService.patch(`/apilinks/${linkId}/toggle`)
      return response.data || response
    } catch (error) {
      console.error('Failed to toggle API link:', error)
      throw error
    }
  }

  // Update API link
  async updateApiLink(linkId: string, data: UpdateApiLinkData): Promise<any> {
    try {
      const response = await apiService.patch(`/apilinks/${linkId}/update`, data)
      return response.data || response
    } catch (error) {
      console.error('Failed to update API link:', error)
      throw error
    }
  }

  // Copy public URL to clipboard
  async copyToClipboard(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      throw error
    }
  }
}

export const apiLinksService = new ApiLinksService() 