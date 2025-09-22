import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Save, 
  X, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Link,
  Database
} from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { cn } from "@/lib/utils"

interface Integration {
  id: number
  clay_webhook: string
  clay_table_name: string
  created_date: string
}

const Integrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  
  // Form state
  const [webhookUrl, setWebhookUrl] = useState("")
  const [tableName, setTableName] = useState("")
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Fetch integrations from Supabase
  const fetchIntegrations = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('created_date', { ascending: false })

      if (error) throw error
      setIntegrations(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch integrations')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIntegrations()
  }, [])

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [success])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  // Form validation
  const validateForm = () => {
    if (!webhookUrl.trim()) {
      setError("Clay Webhook URL is required")
      return false
    }
    if (!tableName.trim()) {
      setError("Clay Table Name is required")
      return false
    }
    
    // Basic URL validation
    try {
      new URL(webhookUrl)
    } catch {
      setError("Please enter a valid webhook URL")
      return false
    }
    
    return true
  }

  // Save integration
  const handleSave = async () => {
    if (!validateForm()) return

    try {
      setSaving(true)
      setError("")

      if (editingId) {
        // Update existing integration
        const { error } = await supabase
          .from('integrations')
          .update({
            clay_webhook: webhookUrl.trim(),
            clay_table_name: tableName.trim()
          })
          .eq('id', editingId)

        if (error) throw error
        setSuccess("Integration updated successfully!")
      } else {
        // Create new integration
        const { error } = await supabase
          .from('integrations')
          .insert({
            clay_webhook: webhookUrl.trim(),
            clay_table_name: tableName.trim()
          })

        if (error) throw error
        setSuccess("Integration created successfully!")
      }

      // Reset form and refresh data
      setWebhookUrl("")
      setTableName("")
      setEditingId(null)
      setIsDialogOpen(false)
      await fetchIntegrations()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save integration')
    } finally {
      setSaving(false)
    }
  }

  // Delete integration
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this integration?")) return

    try {
      setSaving(true)
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSuccess("Integration deleted successfully!")
      await fetchIntegrations()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete integration')
    } finally {
      setSaving(false)
    }
  }

  // Edit integration
  const handleEdit = (integration: Integration) => {
    setWebhookUrl(integration.clay_webhook)
    setTableName(integration.clay_table_name)
    setEditingId(integration.id)
    setIsDialogOpen(true)
  }

  // Reset form
  const handleCancel = () => {
    setWebhookUrl("")
    setTableName("")
    setEditingId(null)
    setIsDialogOpen(false)
    setError("")
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-green-400" />
          <span className="text-foreground/80">Loading integrations...</span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
            Integrations
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your Clay webhook integrations and data connections
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => handleCancel()}
              className="bg-green-500 hover:bg-green-400 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Integration" : "Add New Integration"}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Clay Webhook URL</label>
                <Input
                  placeholder="https://api.clay.com/webhooks/..."
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Clay Table Name</label>
                <Input
                  placeholder="companies, contacts, etc."
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-500 hover:bg-green-400 text-white flex-1"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {editingId ? "Update" : "Save"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Success/Error Messages */}
      {success && (
        <motion.div variants={itemVariants}>
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-400" />
            <AlertDescription className="text-green-400">
              {success}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {error && (
        <motion.div variants={itemVariants}>
          <Alert className="border-red-500/50 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Integrations Table */}
      <motion.div variants={itemVariants}>
        <Card className="bg-gray-800/50 border-gray-700">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold">Clay Integrations</h2>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400">
                {integrations.length} {integrations.length === 1 ? 'integration' : 'integrations'}
              </Badge>
            </div>

            {integrations.length === 0 ? (
              <div className="text-center py-12">
                <Link className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-400 mb-2">No integrations yet</h3>
                <p className="text-gray-500 mb-4">
                  Create your first Clay webhook integration to get started
                </p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-green-500 hover:bg-green-400 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Integration
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">ID</TableHead>
                      <TableHead className="text-gray-300">Webhook URL</TableHead>
                      <TableHead className="text-gray-300">Table Name</TableHead>
                      <TableHead className="text-gray-300">Created Date</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {integrations.map((integration) => (
                      <TableRow key={integration.id} className="border-gray-700 hover:bg-gray-700/30">
                        <TableCell className="text-gray-300 font-mono text-sm">
                          #{integration.id}
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <div className="max-w-xs truncate" title={integration.clay_webhook}>
                            {integration.clay_webhook}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {integration.clay_table_name}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-400 text-sm">
                          {new Date(integration.created_date).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(integration)}
                              className="border-gray-600 hover:bg-gray-700"
                            >
                              <Edit2 className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDelete(integration.id)}
                              disabled={saving}
                              className="border-red-600 hover:bg-red-600/20 text-red-400"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

export default Integrations
