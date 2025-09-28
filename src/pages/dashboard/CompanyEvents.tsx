"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Download, ExternalLink, Calendar, Building2, Users, ArrowLeft, Clock, Activity, Globe, MapPin, Users2, Calendar as CalendarIcon, Briefcase, FileText, ChevronDown, ChevronRight } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import type { Tables } from "@/integrations/supabase/types"

type ExploriumEvent = Tables<'explorium_events'>
type ExaCompany = Tables<'exa_companies'>

interface EventSummary {
  event_name: string
  count: number
  latest_event_time: string
  companies: string[]
}

interface CompanyEventDetail {
  event_id: string
  event_name: string
  event_time: string
  data: any
  business_id: string
  exa_id: string
  company_info?: {
    id: string
    name?: string
    website?: string
    industry?: string
    location?: string
    description?: string
    employee_count?: string
    founded_year?: string
    properties?: any
    enrichments?: any
  }
}

// Helper function to extract company information from JSONB fields
const extractCompanyInfo = (company: ExaCompany): CompanyEventDetail['company_info'] => {
  const properties = company.properties as any
  const enrichments = company.enrichments as any
  
  console.log('Extracting company info for:', company.id)
  console.log('Properties:', properties)
  console.log('Enrichments:', enrichments)
  
  // Extract company data from the nested structure
  const companyData = properties?.company || {}
  
  const extracted = {
    id: company.id,
    name: companyData?.name || properties?.name || properties?.company_name || properties?.title || 
          enrichments?.name || enrichments?.company_name || enrichments?.title || 
          'Unknown Company',
    website: properties?.url || companyData?.website || properties?.website || properties?.website_url || properties?.url || 
             enrichments?.website || enrichments?.website_url || enrichments?.url || '',
    industry: companyData?.industry || properties?.industry || properties?.industry_name || properties?.sector || 
              enrichments?.industry || enrichments?.industry_name || enrichments?.sector || '',
    location: companyData?.location || properties?.location || properties?.headquarters || properties?.address || 
              properties?.city || properties?.country || 
              enrichments?.location || enrichments?.headquarters || enrichments?.address || 
              enrichments?.city || enrichments?.country || '',
    description: companyData?.about || properties?.description || properties?.short_description || properties?.summary || 
                 enrichments?.description || enrichments?.short_description || enrichments?.summary || '',
    employee_count: companyData?.employees || properties?.employee_count || properties?.employees || properties?.size || 
                    enrichments?.employee_count || enrichments?.employees || enrichments?.size || '',
    founded_year: companyData?.founded_year || properties?.founded_year || properties?.founded || properties?.founding_year || 
                  enrichments?.founded_year || enrichments?.founded || enrichments?.founding_year || '',
    properties,
    enrichments
  }
  
  console.log('Extracted company info:', extracted)
  return extracted
}

const CompanyEvents = () => {
  const [events, setEvents] = useState<ExploriumEvent[]>([])
  const [eventSummaries, setEventSummaries] = useState<EventSummary[]>([])
  const [filteredEvents, setFilteredEvents] = useState<EventSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null)
  const [eventDetails, setEventDetails] = useState<CompanyEventDetail[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(20)
  const [viewMode, setViewMode] = useState<'events' | 'companies'>('events')
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  // Fetch events from Supabase
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('explorium_events')
          .select('*')
          .order('event_time', { ascending: false })

        if (error) throw error

        console.log('Fetched events:', data)
        console.log('Sample event exa_ids:', data?.slice(0, 5).map(e => e.exa_id))

        setEvents(data || [])
        
        // Process events to create summaries
        const summaries = processEventSummaries(data || [])
        setEventSummaries(summaries)
        setFilteredEvents(summaries)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Process events to create summaries grouped by event name
  const processEventSummaries = (events: ExploriumEvent[]): EventSummary[] => {
    const eventMap = new Map<string, EventSummary>()
    
    events.forEach(event => {
      const eventName = event.event_name
      if (!eventMap.has(eventName)) {
        eventMap.set(eventName, {
          event_name: eventName,
          count: 0,
          latest_event_time: event.event_time,
          companies: []
        })
      }
      
      const summary = eventMap.get(eventName)!
      summary.count++
      
      // Track unique companies (using exa_id as company identifier)
      if (event.exa_id && !summary.companies.includes(event.exa_id)) {
        summary.companies.push(event.exa_id)
      }
      
      // Update latest event time
      if (new Date(event.event_time) > new Date(summary.latest_event_time)) {
        summary.latest_event_time = event.event_time
      }
    })
    
    return Array.from(eventMap.values()).sort((a, b) => b.count - a.count)
  }

  // Filter events based on search term
  useEffect(() => {
    let filtered = eventSummaries

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.event_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredEvents(filtered)
    setCurrentPage(1)
  }, [eventSummaries, searchTerm])

  // Handle event selection
  const handleEventSelect = async (eventName: string) => {
    try {
      setLoading(true)
      
      // First, get the events for this event name
      const eventData = events.filter(event => event.event_name === eventName)
      
      // Get unique exa_ids from these events
      const exaIds = [...new Set(eventData.map(event => event.exa_id).filter(Boolean))]
      
      console.log('Event data:', eventData)
      console.log('Exa IDs to fetch:', exaIds)
      
      // Fetch company information for these exa_ids
      const { data: companies, error: companiesError } = await supabase
        .from('exa_companies')
        .select('*')
        .in('id', exaIds)
      
      console.log('Companies fetched:', companies)
      console.log('Companies error:', companiesError)
      
      if (companiesError) throw companiesError
      
      // Combine event data with company information
      const enrichedEventDetails: CompanyEventDetail[] = eventData.map(event => {
        const company = companies?.find(c => c.id === event.exa_id)
        console.log(`Matching company for exa_id ${event.exa_id}:`, company)
        return {
          event_id: event.event_id,
          event_name: event.event_name,
          event_time: event.event_time,
          data: event.data,
          business_id: '', // business_id doesn't exist in explorium_events table
          exa_id: event.exa_id,
          company_info: company ? extractCompanyInfo(company) : undefined
        }
      })
      
      console.log('Enriched event details:', enrichedEventDetails)
      
      setEventDetails(enrichedEventDetails)
      setSelectedEvent(eventName)
      setViewMode('companies')
    } catch (err) {
      console.error('Error fetching event details:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch event details')
    } finally {
      setLoading(false)
    }
  }

  // Go back to events view
  const handleBackToEvents = () => {
    setViewMode('events')
    setSelectedEvent(null)
    setEventDetails([])
  }

  // Export to CSV
  const exportToCSV = () => {
    if (viewMode === 'events') {
      // Export event summaries
      const headers = ['Event Name', 'Total Events', 'Unique Companies', 'Latest Event Time']
      const csvContent = [
        headers.join(','),
        ...filteredEvents.map(event => [
          event.event_name,
          event.count,
          event.companies.length,
          new Date(event.latest_event_time).toLocaleString()
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'company-events-summary.csv'
      a.click()
      window.URL.revokeObjectURL(url)
    } else {
      // Export company details for selected event
      const headers = ['Company Name', 'Website', 'Industry', 'Location', 'Event Time', 'Business ID', 'Exa ID', 'Event Data']
      const csvContent = [
        headers.join(','),
        ...eventDetails.map(event => [
          event.company_info?.name || 'Unknown Company',
          event.company_info?.website || '',
          event.company_info?.industry || '',
          event.company_info?.location || '',
          new Date(event.event_time).toLocaleString(),
          event.business_id || '',
          event.exa_id || '',
          JSON.stringify(event.data || {})
        ].join(','))
      ].join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `company-events-${selectedEvent?.replace(/[^a-zA-Z0-9]/g, '-')}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    }
  }

  // Format event time
  const formatEventTime = (timeString: string) => {
    return new Date(timeString).toLocaleString()
  }

  // Toggle collapsible section
  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  // Format JSON data for better display
  const formatJsonData = (data: any) => {
    if (!data) return null
    return JSON.stringify(data, null, 2)
  }

  // Format company description for better readability
  const formatDescription = (description: string) => {
    if (!description) return 'N/A'
    // Truncate long descriptions and add ellipsis
    return description.length > 200 ? description.substring(0, 200) + '...' : description
  }

  // Get event type color
  const getEventTypeColor = (eventName: string) => {
    const lowerName = eventName.toLowerCase()
    if (lowerName.includes('funding') || lowerName.includes('investment')) return "bg-green-500"
    if (lowerName.includes('acquisition') || lowerName.includes('merger')) return "bg-blue-500"
    if (lowerName.includes('product') || lowerName.includes('launch')) return "bg-purple-500"
    if (lowerName.includes('partnership') || lowerName.includes('collaboration')) return "bg-orange-500"
    if (lowerName.includes('hiring') || lowerName.includes('expansion')) return "bg-yellow-500"
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
        <div className="flex items-center space-x-4">
          {viewMode === 'companies' && (
            <Button variant="outline" onClick={handleBackToEvents}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Events
            </Button>
          )}
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {viewMode === 'events' ? 'Company Events' : `Companies - ${selectedEvent}`}
            </h1>
            <p className="text-muted-foreground mt-1">
              {viewMode === 'events' 
                ? 'Track and analyze company events and activities'
                : `Companies that have triggered: ${selectedEvent}`
              }
            </p>
          </div>
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
              <Activity className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{events.length}</p>
                <p className="text-sm text-muted-foreground">Total Events</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{eventSummaries.length}</p>
                <p className="text-sm text-muted-foreground">Event Types</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">
                  {new Set(events.map(e => e.exa_id).filter(Boolean)).size}
                </p>
                <p className="text-sm text-muted-foreground">Companies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">
                  {events.length > 0 ? new Date(events[0].event_time).toLocaleDateString() : 'N/A'}
                </p>
                <p className="text-sm text-muted-foreground">Latest Event</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Search */}
      {viewMode === 'events' && (
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>
      )}

      {/* Results Summary */}
      <motion.div variants={itemVariants}>
        <p className="text-sm text-muted-foreground">
          {viewMode === 'events' 
            ? `Showing ${filteredEvents.length} event types`
            : `Showing ${eventDetails.length} companies for "${selectedEvent}"`
          }
        </p>
      </motion.div>

      {/* Debug Section - Remove after fixing */}
      {viewMode === 'companies' && (
        <motion.div variants={itemVariants}>
          <Card className="border-yellow-500">
            <CardHeader>
              <CardTitle className="text-yellow-500">Debug Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div><strong>Selected Event:</strong> {selectedEvent}</div>
                <div><strong>Event Details Count:</strong> {eventDetails.length}</div>
                <div><strong>Companies with Info:</strong> {eventDetails.filter(e => e.company_info).length}</div>
                {/* <div><strong>Sample Exa IDs:</strong> {eventDetails.slice(0, 3).map(e => e.exa_id).join(', ')}</div> */}
                <Button 
                  onClick={async () => {
                    const { data, error } = await supabase
                      .from('exa_companies')
                      .select('*')
                      .limit(5)
                    console.log('Sample companies:', data)
                    console.log('Error:', error)
                  }}
                  variant="outline"
                  size="sm"
                >
                  Test Company Fetch
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Events View */}
      {viewMode === 'events' && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Event Name</TableHead>
                      <TableHead>Total Events</TableHead>
                      <TableHead>Unique Companies</TableHead>
                      <TableHead>Latest Event</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEvents.map((event) => (
                      <TableRow key={event.event_name} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Badge className={cn("text-white", getEventTypeColor(event.event_name))}>
                              {event.event_name}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>{event.count}</TableCell>
                        <TableCell>{event.companies.length}</TableCell>
                        <TableCell>{formatEventTime(event.latest_event_time)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEventSelect(event.event_name)}
                          >
                            View Companies
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Companies View */}
      {viewMode === 'companies' && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Company Name</TableHead>
                      <TableHead>Website</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Event Time</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eventDetails.map((event) => (
                      <TableRow key={event.event_id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">
                          {event.company_info?.name || `Company ID: ${event.exa_id}`}
                        </TableCell>
                        <TableCell>
                          {event.company_info?.website ? (
                            <a
                              href={event.company_info.website.startsWith('http') ? event.company_info.website : `https://${event.company_info.website}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 flex items-center"
                            >
                              <ExternalLink className="w-4 h-4 mr-1" />
                              Visit Website
                            </a>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell>
                          {event.company_info?.industry || 'N/A'}
                        </TableCell>
                        <TableCell>
                          {event.company_info?.location || 'N/A'}
                        </TableCell>
                        <TableCell>{formatEventTime(event.event_time)}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2 text-white">
                                  <Building2 className="w-5 h-5 text-[#00D084]" />
                                  Company & Event Details
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                {/* Company Information Card */}
                                {event.company_info && (
                                  <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                                    <CardHeader>
                                      <CardTitle className="flex items-center gap-2 text-[#00D084]">
                                        <Building2 className="w-5 h-5" />
                                        Company Information
                                      </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-6">
                                          <div className="flex items-start gap-4">
                                            <Building2 className="w-5 h-5 text-[#00D084] mt-1" />
                                            <div>
                                              <p className="text-sm font-medium text-gray-400 mb-1">Company Name</p>
                                              <p className="font-semibold text-xl text-white">{event.company_info.name}</p>
                                            </div>
                                          </div>
                                          
                                          {event.company_info.website && (
                                            <div className="flex items-start gap-4">
                                              <Globe className="w-5 h-5 text-[#00D084] mt-1" />
                                              <div>
                                                <p className="text-sm font-medium text-gray-400 mb-1">Website</p>
                                                <a
                                                  href={event.company_info.website.startsWith('http') ? event.company_info.website : `https://${event.company_info.website}`}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-[#00D084] hover:text-green-300 flex items-center gap-2 transition-colors"
                                                >
                                                  <ExternalLink className="w-4 h-4" />
                                                  {event.company_info.website}
                                                </a>
                                              </div>
                                            </div>
                                          )}
                                          
                                          {event.company_info.industry && (
                                            <div className="flex items-start gap-4">
                                              <Briefcase className="w-5 h-5 text-[#00D084] mt-1" />
                                              <div>
                                                <p className="text-sm font-medium text-gray-400 mb-1">Industry</p>
                                                <Badge variant="secondary" className="bg-gray-700 text-[#00D084] border-[#00D084]/20">
                                                  {event.company_info.industry}
                                                </Badge>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                        
                                        <div className="space-y-6">
                                          {event.company_info.location && (
                                            <div className="flex items-start gap-4">
                                              <MapPin className="w-5 h-5 text-[#00D084] mt-1" />
                                              <div>
                                                <p className="text-sm font-medium text-gray-400 mb-1">Location</p>
                                                <p className="font-medium text-white">{event.company_info.location}</p>
                                              </div>
                                            </div>
                                          )}
                                          
                                          {event.company_info.employee_count && (
                                            <div className="flex items-start gap-4">
                                              <Users2 className="w-5 h-5 text-[#00D084] mt-1" />
                                              <div>
                                                <p className="text-sm font-medium text-gray-400 mb-1">Employee Count</p>
                                                <p className="font-medium text-white">{event.company_info.employee_count}</p>
                                              </div>
                                            </div>
                                          )}
                                          
                                          {event.company_info.founded_year && (
                                            <div className="flex items-start gap-4">
                                              <CalendarIcon className="w-5 h-5 text-[#00D084] mt-1" />
                                  <div>
                                                <p className="text-sm font-medium text-gray-400 mb-1">Founded Year</p>
                                                <p className="font-medium text-white">{event.company_info.founded_year}</p>
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                      
                                      {event.company_info.description && (
                                        <div className="mt-8 pt-6 border-t border-gray-700">
                                          <div className="flex items-start gap-4">
                                            <FileText className="w-5 h-5 text-[#00D084] mt-1" />
                                            <div className="flex-1">
                                              <p className="text-sm font-medium text-gray-400 mb-3">Description</p>
                                              <p className="text-sm text-gray-300 leading-relaxed">
                                                {formatDescription(event.company_info.description)}
                                              </p>
                                      </div>
                                    </div>
                                  </div>
                                      )}
                                    </CardContent>
                                  </Card>
                                )}

                                {/* Event Information Card */}
                                <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                                  <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-[#00D084]">
                                      <Activity className="w-5 h-5" />
                                      Event Information
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                      <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                          <Activity className="w-5 h-5 text-[#00D084] mt-1" />
                                          <div>
                                            <p className="text-sm font-medium text-gray-400 mb-2">Event Name</p>
                                            <Badge className={cn("text-white text-sm px-3 py-1", getEventTypeColor(event.event_name))}>
                                              {event.event_name}
                                            </Badge>
                                          </div>
                                        </div>
                                        
                                        <div className="flex items-start gap-4">
                                          <Clock className="w-5 h-5 text-[#00D084] mt-1" />
                                          <div>
                                            <p className="text-sm font-medium text-gray-400 mb-1">Event Time</p>
                                            <p className="font-medium text-white">{formatEventTime(event.event_time)}</p>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      {/* <div className="space-y-6">
                                        <div className="flex items-start gap-4">
                                          <Building2 className="w-5 h-5 text-[#00D084] mt-1" />
                                          <div>
                                            <p className="text-sm font-medium text-gray-400 mb-1">Exa ID</p>
                                            <p className="font-mono text-sm bg-gray-700 text-gray-300 px-3 py-2 rounded-lg">
                                              {event.exa_id}
                                            </p>
                                          </div>
                                        </div>
                                      </div> */}
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Event Data Card */}
                                {/* {event.data && (
                                  <Card className="border-gray-700 bg-gray-800/50 backdrop-blur-sm">
                                    <Collapsible 
                                      open={expandedSections[`event-data-${event.event_id}`]}
                                      onOpenChange={() => toggleSection(`event-data-${event.event_id}`)}
                                    >
                                      <CollapsibleTrigger asChild>
                                        <CardHeader className="cursor-pointer hover:bg-gray-700/50 transition-colors">
                                          <CardTitle className="flex items-center justify-between text-[#00D084]">
                                            <div className="flex items-center gap-2">
                                              <FileText className="w-5 h-5" />
                                              Event Data
                                            </div>
                                            {expandedSections[`event-data-${event.event_id}`] ? 
                                              <ChevronDown className="w-5 h-5" /> : 
                                              <ChevronRight className="w-5 h-5" />
                                            }
                                          </CardTitle>
                                        </CardHeader>
                                      </CollapsibleTrigger>
                                      <CollapsibleContent>
                                        <CardContent>
                                          <pre className="bg-gray-900 text-[#00D084] p-6 rounded-lg text-sm overflow-auto max-h-80 font-mono border border-gray-700">
                                            {formatJsonData(event.data)}
                                          </pre>
                                        </CardContent>
                                      </CollapsibleContent>
                                    </Collapsible>
                                  </Card>
                                )} */}

                              </div>
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
      )}
    </motion.div>
  )
}

export default CompanyEvents
