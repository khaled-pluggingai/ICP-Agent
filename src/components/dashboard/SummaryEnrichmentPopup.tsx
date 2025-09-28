import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  X, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown,
  Building2,
  Users,
  Target,
  Play,
  Calendar,
  DollarSign,
  Briefcase,
  Zap,
  Globe,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { QualifiedAccount } from "@/lib/icp-mocks"
import { DecisionMakers } from "./DecisionMakers"
import { Prospect } from "@/hooks/useProspects"
import { useExploriumEvents, ExploriumEvent } from "@/hooks/useExploriumEvents"

interface SummaryEnrichmentPopupProps {
  account: QualifiedAccount
  isOpen: boolean
  onClose: () => void
  prospects?: Prospect[]
  prospectsLoading?: boolean
  prospectsError?: string | null
}

const tierColors = {
  'A': 'bg-green-500/20 text-green-300 border-green-500/30',
  'B': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'C': 'bg-orange-500/20 text-orange-300 border-orange-500/30'
}

const signalIcons = {
  'Funding': DollarSign,
  'Hiring': Briefcase,
  'Tech': Zap,
  'News': Globe
}

const signalColors = {
  'Funding': 'text-green-400',
  'Hiring': 'text-amber-400', 
  'Tech': 'text-purple-400',
  'News': 'text-yellow-400'
}

const referenceIcons = {
  'Crunchbase': Building2,
  'G2': Target,
  'LinkedIn': Users,
  'News': Globe,
  'Website': Globe,
  'Other': Building2
}

const roleColors = {
  'Economic': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Champion': 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  'User': 'bg-purple-500/20 text-purple-300 border-purple-500/30'
}

export function SummaryEnrichmentPopup({ 
  account, 
  isOpen, 
  onClose, 
  prospects = [], 
  prospectsLoading = false, 
  prospectsError = null 
}: SummaryEnrichmentPopupProps) {
  // State for tracking expanded sections for each prospect
  const [expandedSections, setExpandedSections] = useState<Record<string, { experience: boolean; skills: boolean }>>({})
  
  // Fetch events for this company
  const { events, loading: eventsLoading, error: eventsError } = useExploriumEvents(account.id)
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const formatEventTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Helper function to parse string array to actual array
  const parseStringArray = (str: string | string[]): string[] => {
    if (Array.isArray(str)) return str
    if (typeof str === 'string') {
      try {
        // Try to parse as JSON array
        const parsed = JSON.parse(str)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        // If not JSON, split by comma and clean up
        return str.split(',').map(item => item.trim().replace(/^["']|["']$/g, ''))
      }
    }
    return []
  }

  // Helper function to truncate array to first 3 items
  const truncateArray = (arr: string[], maxItems: number = 3) => {
    if (!Array.isArray(arr)) return []
    return arr.slice(0, maxItems)
  }

  // Helper function to get a unique prospect key
  const getProspectKey = (prospect: Prospect, index: number) => {
    return prospect.prospect_id || `prospect-${index}-${prospect.full_name || 'unknown'}`
  }

  // Helper function to toggle expanded state
  const toggleExpanded = (prospectKey: string, section: 'experience' | 'skills') => {
    setExpandedSections(prev => ({
      ...prev,
      [prospectKey]: {
        ...prev[prospectKey],
        [section]: !prev[prospectKey]?.[section]
      }
    }))
  }

  // Helper function to check if section is expanded
  const isExpanded = (prospectKey: string, section: 'experience' | 'skills') => {
    return expandedSections[prospectKey]?.[section] || false
  }

  const renderEventData = (data: Record<string, any> | null) => {
    if (!data) return null

    return (
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-start gap-2">
            <span className="text-xs text-muted-foreground capitalize">
              {key.replace(/_/g, ' ')}:
            </span>
            <span className="text-xs break-words">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </span>
          </div>
        ))}
      </div>
    )
  }

  // Transform prospects data to DecisionMaker format
  const transformProspectsToDecisionMakers = (prospects: Prospect[]) => {
    return prospects.map((prospect) => ({
      id: prospect.prospect_id || `prospect-${Math.random()}`,
      name: prospect.full_name || `${prospect.first_name || ''} ${prospect.last_name || ''}`.trim() || 'Unknown Name',
      title: prospect.job_title || 'Unknown Title',
      company: account.name,
      location: [prospect.city, prospect.region_name, prospect.country_name].filter(Boolean).join(', '),
      role: getRoleFromSeniority(prospect.job_seniority_level),
      status: 'Found' as const,
      contacts: {
        email: prospect.professional_email_hashed ? { 
          value: prospect.professional_email_hashed, 
          status: 'Found' as const 
        } : undefined,
        linkedin: prospect.linkedin ? { 
          value: prospect.linkedin, 
          status: 'Found' as const 
        } : undefined,
        phone: undefined // Phone not available in prospects data
      }
    }))
  }

  // Helper function to map seniority level to decision maker role
  const getRoleFromSeniority = (seniority?: string): 'Economic' | 'Champion' | 'Technical' | 'User' | 'Procurement' | 'Security' => {
    if (!seniority) return 'User'
    
    const level = seniority.toLowerCase()
    if (level.includes('c-level') || level.includes('executive') || level.includes('vp') || level.includes('chief')) {
      return 'Economic'
    }
    if (level.includes('director') || level.includes('manager')) {
      return 'Champion'
    }
    if (level.includes('engineer') || level.includes('developer') || level.includes('technical')) {
      return 'Technical'
    }
    if (level.includes('security') || level.includes('compliance')) {
      return 'Security'
    }
    if (level.includes('procurement') || level.includes('purchasing')) {
      return 'Procurement'
    }
    return 'User'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-6xl h-[90vh] p-0 bg-card/95 backdrop-blur-xl border-green-500/20 flex flex-col">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col h-full overflow-hidden"
            >
              {/* Header */}
              <DialogHeader className="p-6 pb-4 border-b border-green-500/20 flex-shrink-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-bold flex items-center gap-3">
                        {account.name}
                        <Badge variant="outline" className={tierColors[account.tier]}>
                          Tier {account.tier}
                        </Badge>
                      </DialogTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <a
                          href={`https://${account.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors"
                        >
                          {account.domain}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">{account.industry}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Fit & Intent Meters */}
                <div className="flex items-center gap-8 mt-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Fit Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={account.fit_score} className="w-24 h-2" />
                      <span className="text-sm font-bold text-green-400">{account.fit_score}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Intent Score</span>
                    <div className="flex items-center gap-2">
                      <Progress value={account.intent_score} className="w-24 h-2" />
                      <span className="text-sm font-bold text-green-400">{account.intent_score}</span>
                      {account.intent_delta_14d > 0 ? (
                        <div className="flex items-center text-green-400">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-xs">+{account.intent_delta_14d}</span>
                        </div>
                      ) : account.intent_delta_14d < 0 ? (
                        <div className="flex items-center text-red-400">
                          <TrendingDown className="w-3 h-3" />
                          <span className="text-xs">{account.intent_delta_14d}</span>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </DialogHeader>

              {/* Body */}
              <ScrollArea className="flex-1 min-h-0">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column - Complete Supabase Data */}
                    <div className="space-y-6">
                      {/* Company Overview */}
                      <div className="bg-background/30 rounded-lg p-4 border border-green-500/20">
                        <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center gap-2">
                          <Building2 className="w-5 h-5" />
                          Company Overview
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                          {/* <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Business ID:</span>
                            <span className="text-sm font-mono">{account.id}</span>
                          </div> */}
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Industry:</span>
                            <span className="text-sm">{account.industry}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Location:</span>
                            <span className="text-sm">{account.geo}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Employees:</span>
                            <span className="text-sm">{account.employees.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">Domain:</span>
                            <a 
                              href={`https://${account.domain}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
                            >
                              {account.domain}
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Detailed Company Information */}
                      <div className="bg-background/30 rounded-lg p-4 border border-green-500/20">
                        <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center gap-2">
                          <Briefcase className="w-5 h-5" />
                          Detailed Information
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Description:</span>
                            <p className="text-sm mt-1 leading-relaxed">{account.description}</p>
                          </div>
                          
                          {/* Show all summary bullets */}
                          {/* <div>
                            <span className="text-sm font-medium text-muted-foreground">Summary Points:</span>
                            <div className="mt-2 space-y-2">
                              {account.enrichment.summary_bullets.map((bullet, index) => (
                                <div key={index} className="flex items-start gap-2">
                                  <div className="w-1 h-1 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                                  <p className="text-sm leading-relaxed">{bullet}</p>
                                </div>
                              ))}
                            </div>
                          </div> */}

                          {/* ICP Match Reasons */}
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">ICP Match Reasons:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {account.enrichment.icp_reasons.map((reason, index) => (
                                <Badge key={index} variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30 text-xs px-2 py-1">
                                  {reason}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Risks */}
                          {account.enrichment.risks.length > 0 && (
                            <div>
                              <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 text-yellow-400" />
                                Risks:
                              </span>
                              <div className="mt-2 space-y-2">
                                {account.enrichment.risks.map((risk, index) => (
                                  <div key={index} className="flex items-start gap-2 p-2 rounded bg-yellow-500/10 border border-yellow-500/20">
                                    <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-yellow-200 leading-relaxed">{risk}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Signals & Events */}
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Recent Signals:</span>
                            <div className="mt-2 space-y-2">
                              {account.enrichment.signals.map((signal, index) => {
                                const Icon = signalIcons[signal.type]
                                return (
                                  <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-green-500/20">
                                    <Icon className={`w-4 h-4 mt-0.5 ${signalColors[signal.type]}`} />
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <Badge variant="outline" className={`text-xs ${signalColors[signal.type]} border-current/30 px-2 py-0.5`}>
                                          {signal.type}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                          {formatDate(signal.date)}
                                        </span>
                                      </div>
                                      <p className="text-sm leading-relaxed">{signal.note}</p>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>

                          {/* References */}
                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Data Sources:</span>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {account.enrichment.references.map((ref, index) => {
                                const Icon = referenceIcons[ref.source]
                                return (
                                  <Badge key={index} variant="outline" className="bg-background/50 border-green-500/30 flex items-center gap-1 text-xs px-2 py-1">
                                    <Icon className="w-3 h-3" />
                                    {ref.source}
                                    {ref.url && (
                                      <a 
                                        href={ref.url} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="ml-1 hover:text-green-300"
                                      >
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </Badge>
                                )
                              })}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Scoring & Metrics */}
                      <div className="bg-background/30 rounded-lg p-4 border border-green-500/20">
                        <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Scoring & Metrics
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Fit Score</span>
                              <span className="text-sm font-bold text-green-400">{account.fit_score}</span>
                            </div>
                            <Progress value={account.fit_score} className="h-2" />
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-medium">Intent Score</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-green-400">{account.intent_score}</span>
                                {account.intent_delta_14d > 0 ? (
                                  <div className="flex items-center text-green-400">
                                    <TrendingUp className="w-3 h-3" />
                                    <span className="text-xs">+{account.intent_delta_14d}</span>
                                  </div>
                                ) : account.intent_delta_14d < 0 ? (
                                  <div className="flex items-center text-red-400">
                                    <TrendingDown className="w-3 h-3" />
                                    <span className="text-xs">{account.intent_delta_14d}</span>
                                  </div>
                                ) : null}
                              </div>
                            </div>
                            <Progress value={account.intent_score} className="h-2" />
                          </div>

                          <div>
                            <span className="text-sm font-medium text-muted-foreground">Rules Match:</span>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {Object.entries(account.rules_match).map(([key, value]) => (
                                <div key={key} className="flex justify-between items-center">
                                  <span className="text-xs capitalize">{key}:</span>
                                  <Badge 
                                    variant="outline" 
                                    className={`text-xs px-2 py-0.5 ${
                                      value === 'Match' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                                      value === 'Partial' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                                      'bg-red-500/20 text-red-300 border-red-500/30'
                                    }`}
                                  >
                                    {value}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Additional Supabase Fields */}
                      {account.rawData && (
                        <div className="bg-background/30 rounded-lg p-4 border border-green-500/20">
                          <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center gap-2">
                            <Globe className="w-5 h-5" />
                            Additional Data
                          </h3>
                          <div className="space-y-3">
                            {account.rawData.ceo_founder && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">CEO/Founder:</span>
                                <span className="text-sm">{account.rawData.ceo_founder}</span>
                              </div>
                            )}
                            {account.rawData.contact_email && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Contact Email:</span>
                                <a 
                                  href={`mailto:${account.rawData.contact_email}`}
                                  className="text-sm text-green-400 hover:text-green-300"
                                >
                                  {account.rawData.contact_email}
                                </a>
                              </div>
                            )}
                            {account.rawData.phone_number && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Phone:</span>
                                <a 
                                  href={`tel:${account.rawData.phone_number}`}
                                  className="text-sm text-green-400 hover:text-green-300"
                                >
                                  {account.rawData.phone_number}
                                </a>
                              </div>
                            )}
                            {account.rawData.physical_address && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Address:</span>
                                <span className="text-sm text-right max-w-[200px]">{account.rawData.physical_address}</span>
                              </div>
                            )}
                            {account.rawData.mission_vision && (
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Mission/Vision:</span>
                                <p className="text-sm mt-1 leading-relaxed">{account.rawData.mission_vision}</p>
                              </div>
                            )}
                            {account.rawData.target_customers && (
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Target Customers:</span>
                                <p className="text-sm mt-1 leading-relaxed">{account.rawData.target_customers}</p>
                              </div>
                            )}
                            {account.rawData.yearly_revenue_range && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Revenue Range:</span>
                                <span className="text-sm">{account.rawData.yearly_revenue_range}</span>
                              </div>
                            )}
                            {account.rawData.naics && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">NAICS Code:</span>
                                <span className="text-sm font-mono">{account.rawData.naics}</span>
                              </div>
                            )}
                            {account.rawData.naics_description && (
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">NAICS Description:</span>
                                <p className="text-sm mt-1 leading-relaxed">{account.rawData.naics_description}</p>
                              </div>
                            )}
                            {account.rawData.sic_code && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">SIC Code:</span>
                                <span className="text-sm font-mono">{account.rawData.sic_code}</span>
                              </div>
                            )}
                            {account.rawData.sic_code_description && (
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">SIC Description:</span>
                                <p className="text-sm mt-1 leading-relaxed">{account.rawData.sic_code_description}</p>
                              </div>
                            )}
                            {account.rawData.number_of_employees_range && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Employee Range:</span>
                                <span className="text-sm">{account.rawData.number_of_employees_range}</span>
                              </div>
                            )}
                            {account.rawData.company_size && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Company Size:</span>
                                <span className="text-sm">{account.rawData.company_size}</span>
                              </div>
                            )}
                            {account.rawData.founded_year && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Founded:</span>
                                <span className="text-sm">{account.rawData.founded_year}</span>
                              </div>
                            )}
                            {account.rawData.main_products_services && (
                              <div>
                                <span className="text-sm font-medium text-muted-foreground">Products/Services:</span>
                                <p className="text-sm mt-1 leading-relaxed">{account.rawData.main_products_services}</p>
                              </div>
                            )}
                            {account.rawData['linkedin-url'] && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">LinkedIn:</span>
                                <a 
                                  href={account.rawData['linkedin-url']}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1"
                                >
                                  View Profile
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Column - Decision Makers & Events */}
                    <div className="space-y-6">
                      {/* Decision Makers */}
                      <div className="bg-background/30 rounded-lg p-4 border border-green-500/20">
                        <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center gap-2">
                          <Users className="w-5 h-5" />
                          Decision Makers
                        </h3>
                        {prospectsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                              <span className="text-muted-foreground">Loading decision makers...</span>
                            </div>
                          </div>
                        ) : prospectsError ? (
                          <div className="text-center py-8">
                            <p className="text-red-400 mb-2">Error loading decision makers:</p>
                            <p className="text-muted-foreground">{prospectsError}</p>
                          </div>
                        ) : prospects.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No decision makers found for this company</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {prospects.map((prospect, index) => {
                              const prospectKey = getProspectKey(prospect, index)
                              return (
                              <div key={prospectKey} className="border border-green-500/20 rounded-lg p-4 bg-background/50">
                                {/* Header */}
                                <div className="mb-3">
                                  <h4 className="font-semibold text-base text-green-300 mb-1">{prospect.full_name}</h4>
                                  <p className="text-sm text-muted-foreground">{prospect.job_title}</p>
                                </div>
                                
                                {/* Details */}
                                <div className="space-y-3">
                                  {prospect.country_name && (
                                    <div>
                                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Location</span>
                                      <p className="text-sm mt-1">{prospect.country_name}</p>
                                    </div>
                                  )}
                                  
                                  {prospect.experience && (
                                    <div>
                                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Experience</span>
                                      <div className="mt-1">
                                        {(() => {
                                          const experienceArray = parseStringArray(prospect.experience)
                                          return experienceArray.length > 0 ? (
                                            <div className="space-y-2">
                                              <div className="space-y-1">
                                                {(isExpanded(prospectKey, 'experience') 
                                                  ? experienceArray 
                                                  : truncateArray(experienceArray)
                                                ).map((exp, expIndex) => (
                                                  <div key={expIndex} className="flex items-start gap-2">
                                                    <span className="text-xs text-white font-medium">{expIndex + 1} -</span>
                                                    <span className="text-xs text-white leading-relaxed">{exp}</span>
                                                  </div>
                                                ))}
                                              </div>
                                              {experienceArray.length > 3 && (
                                                <button
                                                  onClick={() => toggleExpanded(prospectKey, 'experience')}
                                                  className="text-xs text-white hover:text-gray-300 transition-colors underline font-medium"
                                                >
                                                  {isExpanded(prospectKey, 'experience') ? 'See Less' : 'See More'}
                                                </button>
                                              )}
                                            </div>
                                          ) : (
                                            <p className="text-sm">{prospect.experience}</p>
                                          )
                                        })()}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {prospect.skills && (
                                    <div>
                                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Skills</span>
                                      <div className="mt-1">
                                        {(() => {
                                          const skillsArray = parseStringArray(prospect.skills)
                                          return skillsArray.length > 0 ? (
                                            <div className="space-y-2">
                                              <div className="space-y-1">
                                                {(isExpanded(prospectKey, 'skills') 
                                                  ? skillsArray 
                                                  : truncateArray(skillsArray)
                                                ).map((skill, skillIndex) => (
                                                  <div key={skillIndex} className="flex items-start gap-2">
                                                    <span className="text-xs text-white font-medium">{skillIndex + 1} -</span>
                                                    <span className="text-xs text-white leading-relaxed">{skill}</span>
                                                  </div>
                                                ))}
                                              </div>
                                              {skillsArray.length > 3 && (
                                                <button
                                                  onClick={() => toggleExpanded(prospectKey, 'skills')}
                                                  className="text-xs text-white hover:text-gray-300 transition-colors underline font-medium"
                                                >
                                                  {isExpanded(prospectKey, 'skills') ? 'See Less' : 'See More'}
                                                </button>
                                              )}
                                            </div>
                                          ) : (
                                            <p className="text-sm">{prospect.skills}</p>
                                          )
                                        })()}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {prospect.linkedin && (
                                    <div>
                                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">LinkedIn</span>
                                      <div className="mt-1">
                                        <a 
                                          href={prospect.linkedin.startsWith('http') ? prospect.linkedin : `https://${prospect.linkedin}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-green-400 hover:text-green-300 flex items-center gap-2"
                                        >
                                          <span>View Profile</span>
                                          <ExternalLink className="w-3 h-3" />
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      {/* Events */}
                      <div className="bg-background/30 rounded-lg p-4 border border-green-500/20">
                        <h3 className="text-lg font-semibold mb-4 text-green-400 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Recent Events
                        </h3>
                        {eventsLoading ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
                              <span className="text-muted-foreground">Loading events...</span>
                            </div>
                          </div>
                        ) : eventsError ? (
                          <div className="text-center py-8">
                            <p className="text-red-400 mb-2">Error loading events:</p>
                            <p className="text-muted-foreground">{eventsError}</p>
                          </div>
                        ) : events.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-muted-foreground">No events found for this company</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {events.map((event) => (
                              <div key={event.event_id} className="border border-green-500/20 rounded-lg p-3 bg-background/50">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className="font-medium text-sm text-green-300">{event.event_name}</h4>
                                  <span className="text-xs text-muted-foreground">
                                    {formatEventTime(event.event_time)}
                                  </span>
                                </div>
                                {event.data && (
                                  <div className="mt-2">
                                    {renderEventData(event.data)}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Footer Actions */}
              <div className="p-6 pt-4 border-t border-green-500/20 flex-shrink-0">
                <div className="flex items-center justify-end gap-3">
                  <Button variant="outline" className="gap-2">
                    <Users className="w-4 h-4" />
                    Add to Segment
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Target className="w-4 h-4" />
                    Assign Playbook
                  </Button>
                  <Button className="gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400">
                    <Play className="w-4 h-4" />
                    Start 1:few
                  </Button>
                </div>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}