"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { HudButton } from "@/components/ui/hud-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, Plus, Filter } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Segment {
  id: string
  name: string
  description: string
  accounts: number
  lastUpdated: string
  filters: {
    industry?: string
    size?: string
    tier?: string
  }
}

const initialSegments: Segment[] = [
  {
    id: "1",
    name: "Enterprise SaaS",
    description: "Large SaaS companies with 500+ employees",
    accounts: 1247,
    lastUpdated: "2024-01-15",
    filters: { industry: "SaaS", size: "500+", tier: "A" }
  },
  {
    id: "2", 
    name: "High-Intent Startups",
    description: "Fast-growing startups showing buying signals",
    accounts: 892,
    lastUpdated: "2024-01-14",
    filters: { industry: "Startup", size: "50-500", tier: "A" }
  },
  {
    id: "3",
    name: "E-commerce Mid-Market",
    description: "Mid-market e-commerce companies",
    accounts: 634,
    lastUpdated: "2024-01-13",
    filters: { industry: "E-commerce", size: "100-500", tier: "B" }
  },
  {
    id: "4",
    name: "Tech Adopters",
    description: "Companies with modern tech stacks",
    accounts: 423,
    lastUpdated: "2024-01-12",
    filters: { tier: "A" }
  }
]

export function SegmentsTable() {
  const { toast } = useToast()
  const [segments, setSegments] = useState<Segment[]>(initialSegments)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingSegment, setEditingSegment] = useState<Segment | null>(null)
  const [newSegment, setNewSegment] = useState({
    name: "",
    description: "",
    industry: "",
    size: "",
    tier: ""
  })

  const handleCreateSegment = () => {
    const segment: Segment = {
      id: Math.random().toString(36).substr(2, 9),
      name: newSegment.name,
      description: newSegment.description,
      accounts: Math.floor(Math.random() * 1000) + 100,
      lastUpdated: new Date().toISOString().split('T')[0],
      filters: {
        industry: newSegment.industry || undefined,
        size: newSegment.size || undefined,
        tier: newSegment.tier || undefined
      }
    }

    setSegments(prev => [...prev, segment])
    setNewSegment({ name: "", description: "", industry: "", size: "", tier: "" })
    setIsCreateOpen(false)
    
    toast({
      title: "Segment Created",
      description: `${segment.name} has been created successfully`,
    })
  }

  const handleDeleteSegment = (id: string) => {
    const segment = segments.find(s => s.id === id)
    setSegments(prev => prev.filter(s => s.id !== id))
    
    toast({
      title: "Segment Deleted",
      description: `${segment?.name} has been deleted`,
    })
  }

  const handleEditSegment = (segment: Segment) => {
    setEditingSegment(segment)
    setNewSegment({
      name: segment.name,
      description: segment.description,
      industry: segment.filters.industry || "",
      size: segment.filters.size || "",
      tier: segment.filters.tier || ""
    })
  }

  const handleUpdateSegment = () => {
    if (!editingSegment) return

    const updatedSegment: Segment = {
      ...editingSegment,
      name: newSegment.name,
      description: newSegment.description,
      lastUpdated: new Date().toISOString().split('T')[0],
      filters: {
        industry: newSegment.industry || undefined,
        size: newSegment.size || undefined,
        tier: newSegment.tier || undefined
      }
    }

    setSegments(prev => prev.map(s => s.id === editingSegment.id ? updatedSegment : s))
    setEditingSegment(null)
    setNewSegment({ name: "", description: "", industry: "", size: "", tier: "" })
    
    toast({
      title: "Segment Updated",
      description: `${updatedSegment.name} has been updated successfully`,
    })
  }

  const SegmentForm = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Segment Name</Label>
        <Input
          id="name"
          value={newSegment.name}
          onChange={(e) => setNewSegment(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Enter segment name..."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={newSegment.description}
          onChange={(e) => setNewSegment(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe this segment..."
          className="mt-1"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="industry">Industry</Label>
          <Select
            value={newSegment.industry}
            onValueChange={(value) => setNewSegment(prev => ({ ...prev, industry: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SaaS">SaaS</SelectItem>
              <SelectItem value="E-commerce">E-commerce</SelectItem>
              <SelectItem value="Startup">Startup</SelectItem>
              <SelectItem value="Enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="size">Company Size</Label>
          <Select
            value={newSegment.size}
            onValueChange={(value) => setNewSegment(prev => ({ ...prev, size: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-50">1-50</SelectItem>
              <SelectItem value="50-500">50-500</SelectItem>
              <SelectItem value="500+">500+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="tier">Tier</Label>
          <Select
            value={newSegment.tier}
            onValueChange={(value) => setNewSegment(prev => ({ ...prev, tier: value }))}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="A">Tier A</SelectItem>
              <SelectItem value="B">Tier B</SelectItem>
              <SelectItem value="C">Tier C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button 
          variant="outline" 
          onClick={() => {
            setIsCreateOpen(false)
            setEditingSegment(null)
            setNewSegment({ name: "", description: "", industry: "", size: "", tier: "" })
          }}
        >
          Cancel
        </Button>
        <HudButton
          style="style2"
          variant="primary"
          size="small"
          onClick={editingSegment ? handleUpdateSegment : handleCreateSegment}
        >
          {editingSegment ? "UPDATE" : "CREATE"}
        </HudButton>
      </div>
    </div>
  )

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-foreground">Segments</CardTitle>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <HudButton style="style2" variant="primary" size="small">
                CREATE SEGMENT
              </HudButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-popover/95 backdrop-blur-sm border-border/50">
              <DialogHeader>
                <DialogTitle>Create New Segment</DialogTitle>
              </DialogHeader>
              <SegmentForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/20 rounded-lg border border-border/50 overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/30">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Name</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Description</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Accounts</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Last Updated</th>
                <th className="text-left p-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {segments.map((segment, index) => (
                <motion.tr
                  key={segment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { delay: index * 0.1 }
                  }}
                  className="border-t border-border/30 hover:bg-muted/10 transition-colors"
                >
                  <td className="p-4">
                    <div>
                      <div className="text-sm font-medium text-foreground">{segment.name}</div>
                      <div className="flex gap-1 mt-1">
                        {Object.entries(segment.filters).map(([key, value]) => (
                          value && (
                            <Badge key={key} variant="outline" className="text-xs">
                              {value}
                            </Badge>
                          )
                        ))}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground max-w-xs">
                    {segment.description}
                  </td>
                  <td className="p-4">
                    <div className="text-sm font-medium text-foreground">
                      {segment.accounts.toLocaleString()}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(segment.lastUpdated).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex space-x-2">
                      <Dialog 
                        open={editingSegment?.id === segment.id} 
                        onOpenChange={(open) => {
                          if (open) {
                            handleEditSegment(segment)
                          } else {
                            setEditingSegment(null)
                            setNewSegment({ name: "", description: "", industry: "", size: "", tier: "" })
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-green-500/10 hover:text-green-400"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-md bg-popover/95 backdrop-blur-sm border-border/50">
                          <DialogHeader>
                            <DialogTitle>Edit Segment</DialogTitle>
                          </DialogHeader>
                          <SegmentForm />
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSegment(segment.id)}
                        className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}