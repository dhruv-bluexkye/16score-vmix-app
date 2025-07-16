import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Copy, Plus, Edit } from 'lucide-react'
import { apiLinksService } from '@/services/api-links.service'
import { apiService } from '@/lib/api'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Temporary interface definition to bypass import issue
interface ApiLink {
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

interface CreateApiLinkData {
  matchId: string
  type: string
}

interface EditApiLinkData {
  matchId: string
  type: string
}

export function ManageApi() {
  const [apiLinks, setApiLinks] = useState<ApiLink[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingLink, setEditingLink] = useState<ApiLink | null>(null)
  const [createFormData, setCreateFormData] = useState<CreateApiLinkData>({
    matchId: '',
    type: ''
  })
  const [editFormData, setEditFormData] = useState<EditApiLinkData>({
    matchId: '',
    type: ''
  })
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    fetchApiLinks()
  }, [])

  const fetchApiLinks = async () => {
    try {
      setLoading(true)
      const response = await apiLinksService.getApiLinks()
      setApiLinks(response.data || [])
    } catch (err) {
      setError('Failed to fetch API links')
      console.error('Error fetching API links:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleActive = async (linkId: string) => {
    try {
      await apiLinksService.toggleApiLink(linkId)
      // Refresh the list
      await fetchApiLinks()
    } catch (err) {
      console.error('Error toggling API link:', err)
    }
  }

  const handleCopyPublicUrl = async (publicUrl: string, linkId: string) => {
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopiedId(linkId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Error copying Public URL:', err)
    }
  }

  const handleEditClick = (link: ApiLink) => {
    setEditingLink(link)
    setEditFormData({
      matchId: link.matchId,
      type: link.type
    })
    setIsEditModalOpen(true)
  }

  const handleUpdateApiLink = async () => {
    if (!editFormData.matchId || !editFormData.type || !editingLink) {
      setError('Please fill in all fields')
      return
    }

    try {
      setIsUpdating(true)
      setError('')
      
      await apiLinksService.updateApiLink(editingLink.linkId, editFormData)

      // Refresh the list
      await fetchApiLinks()
      
      // Reset form and close modal
      setEditFormData({ matchId: '', type: '' })
      setEditingLink(null)
      setIsEditModalOpen(false)
    } catch (err) {
      setError('Failed to update API link')
      console.error('Error updating API link:', err)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCreateApiLink = async () => {
    if (!createFormData.matchId || !createFormData.type) {
      setError('Please fill in all fields')
      return
    }

    try {
      setIsCreating(true)
      setError('')
      
      await apiService.post('/apilinks', {
        matchId: createFormData.matchId,
        type: createFormData.type
      })

      // Refresh the list
      await fetchApiLinks()
      
      // Reset form and close modal
      setCreateFormData({ matchId: '', type: '' })
      setIsCreateModalOpen(false)
    } catch (err) {
      setError('Failed to create API link')
      console.error('Error creating API link:', err)
    } finally {
      setIsCreating(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading API links...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Manage API Links</h1>
          <p className="text-muted-foreground">
            Manage your API links and monitor their usage
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create API Link
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New API Link</DialogTitle>
              <DialogDescription>
                Create a new API link by providing the match ID and type.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="matchId" className="text-right">
                  Match ID
                </Label>
                <Input
                  id="matchId"
                  value={createFormData.matchId}
                  onChange={(e) => setCreateFormData({ ...createFormData, matchId: e.target.value })}
                  className="col-span-3"
                  placeholder="Enter match ID"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Type
                </Label>
                <Select
                  value={createFormData.type}
                  onValueChange={(value: string) => setCreateFormData({ ...createFormData, type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full</SelectItem>
                    <SelectItem value="alive_status">Alive Status</SelectItem>
                    <SelectItem value="points_table">Points Table</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleCreateApiLink}
                disabled={isCreating}
              >
                {isCreating ? 'Creating...' : 'Create API Link'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <Card className="mb-6 border-destructive bg-card">
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-card-foreground">API Links</CardTitle>
          <CardDescription>
            {apiLinks.length} API link{apiLinks.length !== 1 ? 's' : ''} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-medium text-foreground">Match ID</th>
                  <th className="text-left p-3 font-medium text-foreground">Type</th>
                  <th className="text-left p-3 font-medium text-foreground">Created</th>
                  <th className="text-left p-3 font-medium text-foreground">Access Count</th>
                  <th className="text-left p-3 font-medium text-foreground">Link ID</th>
                  <th className="text-left p-3 font-medium text-foreground">Status</th>
                  <th className="text-left p-3 font-medium text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiLinks.map((link) => (
                  <tr key={link._id} className="border-b border-border hover:bg-muted/50">
                    <td className="p-3">
                      <code className="text-xs bg-muted px-2 py-1 rounded text-foreground">
                        {link.matchId}
                      </code>
                    </td>
                    <td className="p-3">
                      <span className="capitalize text-foreground text-xs">{link.type}</span>
                    </td>
                    <td className="p-3 text-xs text-foreground">
                      {formatDate(link.createdAt)}
                    </td>
                    <td className="p-3">
                      <span className="font-medium text-foreground text-xs">{link.accessCount}</span>
                    </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyPublicUrl(link.publicUrl, link.linkId)}
                        className="h-6 px-2 text-xs hover:bg-muted"
                      >
                        <code className="text-xs bg-muted px-2 py-1 rounded text-foreground cursor-pointer">
                          {link.linkId}
                        </code>
                        <Copy className="h-3 w-3 ml-1" />
                        {copiedId === link.linkId && (
                          <span className="ml-1 text-xs text-green-600">Copied!</span>
                        )}
                      </Button>
                    </td>
                    <td className="p-3">
                      <Switch
                        checked={link.isActive}
                        onCheckedChange={() => handleToggleActive(link.linkId)}
                      />
                    </td>
                    <td className="p-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(link)}
                        className="h-6 px-2 text-xs hover:bg-muted"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit API Link</DialogTitle>
            <DialogDescription>
              Update the match ID and type for this API link.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-matchId" className="text-right">
                Match ID
              </Label>
              <Input
                id="edit-matchId"
                value={editFormData.matchId}
                onChange={(e) => setEditFormData({ ...editFormData, matchId: e.target.value })}
                className="col-span-3"
                placeholder="Enter match ID"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <Select
                value={editFormData.type}
                onValueChange={(value: string) => setEditFormData({ ...editFormData, type: value })}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full">Full</SelectItem>
                  <SelectItem value="alive_status">Alive Status</SelectItem>
                  <SelectItem value="points_table">Points Table</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={handleUpdateApiLink}
              disabled={isUpdating}
            >
              {isUpdating ? 'Updating...' : 'Update API Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 