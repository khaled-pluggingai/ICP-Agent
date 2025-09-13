import React, { useState } from "react"
import { motion } from "framer-motion"
import { X, Loader2, User, MapPin, Briefcase, Mail, Linkedin, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Prospect } from "@/hooks/useProspects"

interface DecisionMakersModalProps {
  isOpen: boolean
  onClose: () => void
  companyName: string
  prospects: Prospect[]
  loading: boolean
  error: string | null
}

export function DecisionMakersModal({ 
  isOpen, 
  onClose, 
  companyName, 
  prospects, 
  loading, 
  error 
}: DecisionMakersModalProps) {
  // State for tracking expanded sections for each prospect
  const [expandedSections, setExpandedSections] = useState<Record<string, { skills: boolean; interests: boolean }>>({})
  
  if (!isOpen) return null

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
  const toggleExpanded = (prospectKey: string, section: 'skills' | 'interests') => {
    setExpandedSections(prev => ({
      ...prev,
      [prospectKey]: {
        ...prev[prospectKey],
        [section]: !prev[prospectKey]?.[section]
      }
    }))
  }

  // Helper function to check if section is expanded
  const isExpanded = (prospectKey: string, section: 'skills' | 'interests') => {
    return expandedSections[prospectKey]?.[section] || false
  }

  const getInitials = (name?: string) => {
    if (!name) return "?"
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getSeniorityColor = (seniority?: string) => {
    if (!seniority) return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    
    const level = seniority.toLowerCase()
    if (level.includes('c-level') || level.includes('executive') || level.includes('vp')) {
      return "bg-purple-500/20 text-purple-300 border-purple-500/30"
    }
    if (level.includes('director') || level.includes('manager')) {
      return "bg-blue-500/20 text-blue-300 border-blue-500/30"
    }
    if (level.includes('senior')) {
      return "bg-green-500/20 text-green-300 border-green-500/30"
    }
    return "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-green-500/20 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-green-500/20">
          <div>
            <h2 className="text-xl font-bold text-foreground">Decision Makers</h2>
            <p className="text-muted-foreground">{companyName}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-green-400" />
                <span className="text-muted-foreground">Loading decision makers...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="text-center py-8">
              <p className="text-red-400 mb-2">Error loading decision makers:</p>
              <p className="text-muted-foreground">{error}</p>
            </div>
          )}

          {!loading && !error && prospects.length === 0 && (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No decision makers found for this company.</p>
            </div>
          )}

          {!loading && !error && prospects.length > 0 && (
            <div className="grid gap-4">
              {prospects.map((prospect, index) => {
                const prospectKey = getProspectKey(prospect, index)
                return (
                <Card key={prospect.prospect_id} className="bg-card/50 border-green-500/20">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12 border-2 border-green-500/30">
                        <AvatarFallback className="bg-green-500/20 text-green-300">
                          {getInitials(prospect.full_name || prospect.first_name)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">
                              {prospect.full_name || `${prospect.first_name || ''} ${prospect.last_name || ''}`.trim() || 'Unknown Name'}
                            </h3>
                            {prospect.job_title && (
                              <p className="text-sm text-muted-foreground">{prospect.job_title}</p>
                            )}
                          </div>
                          
                          {prospect.job_seniority_level && (
                            <Badge variant="outline" className={getSeniorityColor(prospect.job_seniority_level)}>
                              {prospect.job_seniority_level}
                            </Badge>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          {prospect.job_department && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              <span>{prospect.job_department}</span>
                            </div>
                          )}
                          
                          {(prospect.city || prospect.region_name || prospect.country_name) && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>
                                {[prospect.city, prospect.region_name, prospect.country_name]
                                  .filter(Boolean)
                                  .join(', ')}
                              </span>
                            </div>
                          )}
                        </div>

                        {(prospect.linkedin || prospect.professional_email_hashed) && (
                          <div className="flex items-center gap-2">
                            {prospect.linkedin && (
                              <Button variant="outline" size="sm" asChild>
                                <a 
                                  href={prospect.linkedin} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="gap-1"
                                >
                                  <Linkedin className="w-3 h-3" />
                                  LinkedIn
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </Button>
                            )}
                            
                            {prospect.professional_email_hashed && (
                              <Badge variant="outline" className="gap-1">
                                <Mail className="w-3 h-3" />
                                Email Available
                              </Badge>
                            )}
                          </div>
                        )}

                        {(prospect.skills || prospect.interests) && (
                          <div className="space-y-3">
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
                            {prospect.interests && (
                              <div>
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Interests</span>
                                <div className="mt-1">
                                  {(() => {
                                    const interestsArray = parseStringArray(prospect.interests)
                                    return interestsArray.length > 0 ? (
                                      <div className="space-y-2">
                                        <div className="space-y-1">
                                          {(isExpanded(prospectKey, 'interests') 
                                            ? interestsArray 
                                            : truncateArray(interestsArray)
                                          ).map((interest, interestIndex) => (
                                            <div key={interestIndex} className="flex items-start gap-2">
                                              <span className="text-xs text-white font-medium">{interestIndex + 1} -</span>
                                              <span className="text-xs text-white leading-relaxed">{interest}</span>
                                            </div>
                                          ))}
                                        </div>
                                        {interestsArray.length > 3 && (
                                          <button
                                            onClick={() => toggleExpanded(prospectKey, 'interests')}
                                            className="text-xs text-white hover:text-gray-300 transition-colors underline font-medium"
                                          >
                                            {isExpanded(prospectKey, 'interests') ? 'See Less' : 'See More'}
                                          </button>
                                        )}
                                      </div>
                                    ) : (
                                      <p className="text-sm">{prospect.interests}</p>
                                    )
                                  })()}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}