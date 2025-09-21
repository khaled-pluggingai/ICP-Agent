"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Download, ExternalLink, User, Building2, MapPin, Crown, Mail, Phone, Calendar } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import type { Tables } from "@/integrations/supabase/types"

type Prospect = Tables<'prospects'>

// Helper function to format LinkedIn URLs
const formatLinkedInUrl = (url: string | null): string => {
  if (!url) return ''
  
  // If URL already has protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // If URL starts with linkedin.com, add https://
  if (url.startsWith('linkedin.com')) {
    return `https://${url}`
  }
  
  // If URL doesn't start with linkedin.com, assume it's a LinkedIn profile path
  if (url.startsWith('/in/') || url.startsWith('in/')) {
    return `https://linkedin.com${url.startsWith('/') ? '' : '/'}${url}`
  }
  
  // Default: add https://linkedin.com/ prefix
  return `https://linkedin.com/${url}`
}

const DecisionMakers = () => {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [filteredProspects, setFilteredProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [seniorityFilter, setSeniorityFilter] = useState<string>("all")

  // Fetch prospects from Supabase
  useEffect(() => {
    const fetchProspects = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('prospects')
          .select('*')
          .order('full_name', { ascending: true })

        if (error) throw error

        setProspects(data || [])
        setFilteredProspects(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch prospects')
      } finally {
        setLoading(false)
      }
    }

    fetchProspects()
  }, [])

  // Filter prospects based on search term and seniority
  useEffect(() => {
    let filtered = prospects

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(prospect => 
        prospect.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospect.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prospect.job_title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply seniority filter
    if (seniorityFilter !== "all") {
      filtered = filtered.filter(prospect => 
        prospect.job_seniority_level?.toLowerCase() === seniorityFilter.toLowerCase()
      )
    }

    setFilteredProspects(filtered)
    setCurrentPage(1) // Reset to first page when filtering
  }, [prospects, searchTerm, seniorityFilter])

  // Pagination
  const totalPages = Math.ceil(filteredProspects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProspects = filteredProspects.slice(startIndex, endIndex)

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Full Name', 'Job Title', 'Company Name', 'Location', 'Seniority Level', 'LinkedIn']
    const csvContent = [
      headers.join(','),
      ...filteredProspects.map(prospect => [
        prospect.full_name || '',
        prospect.job_title || '',
        prospect.company_name || '',
        `${prospect.city || ''}, ${prospect.country_name || ''}`,
        prospect.job_seniority_level || '',
        formatLinkedInUrl(prospect.linkedin)
      ].join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'decision-makers.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Get seniority level color
  const getSeniorityColor = (level: string | null) => {
    if (!level) return "bg-gray-500"
    const lowerLevel = level.toLowerCase()
    if (lowerLevel.includes('executive') || lowerLevel.includes('c-level')) return "bg-red-500"
    if (lowerLevel.includes('director') || lowerLevel.includes('vp')) return "bg-orange-500"
    if (lowerLevel.includes('manager') || lowerLevel.includes('senior')) return "bg-blue-500"
    if (lowerLevel.includes('lead') || lowerLevel.includes('principal')) return "bg-green-500"
    return "bg-gray-500"
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
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
          <h1 className="text-3xl font-bold text-foreground">Decision Makers</h1>
          <p className="text-muted-foreground mt-1">
            Manage and analyze your prospect database
          </p>
        </div>
        <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{prospects.length}</p>
                <p className="text-sm text-muted-foreground">Total Prospects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {new Set(prospects.map(p => p.company_name).filter(Boolean)).size}
                </p>
                <p className="text-sm text-muted-foreground">Companies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Crown className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">
                  {prospects.filter(p => p.job_seniority_level?.toLowerCase().includes('executive') || p.job_seniority_level?.toLowerCase().includes('c-level')).length}
                </p>
                <p className="text-sm text-muted-foreground">Executives</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {new Set(prospects.map(p => p.country_name).filter(Boolean)).size}
                </p>
                <p className="text-sm text-muted-foreground">Countries</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by name, company, or job title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={seniorityFilter} onValueChange={setSeniorityFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filter by seniority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Seniority Levels</SelectItem>
            <SelectItem value="executive">Executive/C-Level</SelectItem>
            <SelectItem value="director">Director/VP</SelectItem>
            <SelectItem value="manager">Manager/Senior</SelectItem>
            <SelectItem value="lead">Lead/Principal</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Results Summary */}
      <motion.div variants={itemVariants}>
        <p className="text-sm text-muted-foreground">
          Showing {currentProspects.length} of {filteredProspects.length} prospects
        </p>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Seniority Level</TableHead>
                    <TableHead>LinkedIn</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentProspects.map((prospect) => (
                    <TableRow key={prospect.prospect_id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {prospect.full_name || 'N/A'}
                      </TableCell>
                      <TableCell>{prospect.job_title || 'N/A'}</TableCell>
                      <TableCell>{prospect.company_name || 'N/A'}</TableCell>
                      <TableCell>
                        {prospect.city && prospect.country_name 
                          ? `${prospect.city}, ${prospect.country_name}`
                          : prospect.country_name || 'N/A'
                        }
                      </TableCell>
                      <TableCell>
                        {prospect.job_seniority_level ? (
                          <Badge className={cn("text-white", getSeniorityColor(prospect.job_seniority_level))}>
                            {prospect.job_seniority_level}
                          </Badge>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        {prospect.linkedin ? (
                          <a
                            href={formatLinkedInUrl(prospect.linkedin)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 flex items-center"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View Profile
                          </a>
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProspect(prospect)}
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Prospect Details</DialogTitle>
                            </DialogHeader>
                            {selectedProspect && (
                              <div className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-2">Personal Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <span>{selectedProspect.full_name || 'N/A'}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <span>{selectedProspect.professional_email_hashed || 'N/A'}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <span>
                                          {selectedProspect.city && selectedProspect.country_name 
                                            ? `${selectedProspect.city}, ${selectedProspect.country_name}`
                                            : selectedProspect.country_name || 'N/A'
                                          }
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-2">Professional Information</h4>
                                    <div className="space-y-2 text-sm">
                                      <div className="flex items-center">
                                        <Building2 className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <span>{selectedProspect.company_name || 'N/A'}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Crown className="w-4 h-4 mr-2 text-muted-foreground" />
                                        <span>{selectedProspect.job_title || 'N/A'}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="text-muted-foreground mr-2">Department:</span>
                                        <span>{selectedProspect.job_department || 'N/A'}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="text-muted-foreground mr-2">Seniority:</span>
                                        <Badge className={cn("text-white", getSeniorityColor(selectedProspect.job_seniority_level))}>
                                          {selectedProspect.job_seniority_level || 'N/A'}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Additional Details */}
                                {(selectedProspect.experience || selectedProspect.skills || selectedProspect.interests) && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Additional Information</h4>
                                    <div className="space-y-2 text-sm">
                                      {selectedProspect.experience && (
                                        <div>
                                          <span className="text-muted-foreground">Experience:</span>
                                          <p className="mt-1">{selectedProspect.experience}</p>
                                        </div>
                                      )}
                                      {selectedProspect.skills && (
                                        <div>
                                          <span className="text-muted-foreground">Skills:</span>
                                          <p className="mt-1">{selectedProspect.skills}</p>
                                        </div>
                                      )}
                                      {selectedProspect.interests && (
                                        <div>
                                          <span className="text-muted-foreground">Interests:</span>
                                          <p className="mt-1">{selectedProspect.interests}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}

                                {/* Company Links */}
                                {(selectedProspect.company_website || selectedProspect.company_linkedin || selectedProspect.linkedin) && (
                                  <div>
                                    <h4 className="font-semibold mb-2">Links</h4>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedProspect.company_website && (
                                        <Button variant="outline" size="sm" asChild>
                                          <a href={selectedProspect.company_website} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 mr-1" />
                                            Company Website
                                          </a>
                                        </Button>
                                      )}
                                      {selectedProspect.company_linkedin && (
                                        <Button variant="outline" size="sm" asChild>
                                          <a href={formatLinkedInUrl(selectedProspect.company_linkedin)} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 mr-1" />
                                            Company LinkedIn
                                          </a>
                                        </Button>
                                      )}
                                      {selectedProspect.linkedin && (
                                        <Button variant="outline" size="sm" asChild>
                                          <a href={formatLinkedInUrl(selectedProspect.linkedin)} target="_blank" rel="noopener noreferrer">
                                            <ExternalLink className="w-4 h-4 mr-1" />
                                            Personal LinkedIn
                                          </a>
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div variants={itemVariants} className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default DecisionMakers
