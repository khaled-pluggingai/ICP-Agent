import React from "react"
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
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
          <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-card/95 backdrop-blur-xl border-green-500/20">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="flex flex-col h-full"
            >
              {/* Header */}
              <DialogHeader className="p-6 pb-4 border-b border-green-500/20">
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
              <ScrollArea className="flex-1">
                <div className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Summary (Compressed) */}
                    <div className="lg:col-span-1 space-y-4">
                      {/* Account Summary */}
                      <div>
                        <h3 className="text-base font-semibold mb-3 text-green-400">Summary</h3>
                        <div className="space-y-2">
                          {account.enrichment.summary_bullets.slice(0, 3).map((bullet, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <div className="w-1 h-1 rounded-full bg-green-400 mt-2 flex-shrink-0" />
                              <p className="text-xs leading-tight">{bullet}</p>
                            </div>
                          ))}
                          {account.enrichment.summary_bullets.length > 3 && (
                            <p className="text-xs text-muted-foreground">+{account.enrichment.summary_bullets.length - 3} more points</p>
                          )}
                        </div>
                      </div>

                      {/* ICP Match Reasons - Compressed */}
                      <div>
                        <h3 className="text-base font-semibold mb-2 text-green-400">ICP Match</h3>
                        <div className="flex flex-wrap gap-1">
                          {account.enrichment.icp_reasons.slice(0, 4).map((reason, index) => (
                            <Badge key={index} variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30 text-xs px-2 py-0.5">
                              {reason}
                            </Badge>
                          ))}
                          {account.enrichment.icp_reasons.length > 4 && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-300 border-green-500/30 text-xs px-2 py-0.5">
                              +{account.enrichment.icp_reasons.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Risks - Compressed */}
                      {account.enrichment.risks.length > 0 && (
                        <div>
                          <h3 className="text-base font-semibold mb-2 text-yellow-400 flex items-center gap-2">
                            <AlertTriangle className="w-3 h-3" />
                            Risks
                          </h3>
                          <div className="space-y-1">
                            {account.enrichment.risks.slice(0, 2).map((risk, index) => (
                              <div key={index} className="flex items-start gap-1">
                                <AlertTriangle className="w-2 h-2 text-yellow-400 mt-1 flex-shrink-0" />
                                <p className="text-xs text-yellow-200 leading-tight">{risk}</p>
                              </div>
                            ))}
                            {account.enrichment.risks.length > 2 && (
                              <p className="text-xs text-muted-foreground">+{account.enrichment.risks.length - 2} more</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Signals & Events - Compressed */}
                      <div>
                        <h3 className="text-base font-semibold mb-2 text-green-400">Recent Signals</h3>
                        <div className="space-y-2">
                          {account.enrichment.signals.slice(0, 2).map((signal, index) => {
                            const Icon = signalIcons[signal.type]
                            return (
                              <div key={index} className="flex items-start gap-2 p-2 rounded-lg bg-background/30 border border-green-500/10">
                                <Icon className={`w-3 h-3 mt-0.5 ${signalColors[signal.type]}`} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                    <Badge variant="outline" className={`text-xs ${signalColors[signal.type]} border-current/30 px-1 py-0`}>
                                      {signal.type}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {formatDate(signal.date)}
                                    </span>
                                  </div>
                                  <p className="text-xs mt-1 truncate">{signal.note}</p>
                                </div>
                              </div>
                            )
                          })}
                          {account.enrichment.signals.length > 2 && (
                            <p className="text-xs text-muted-foreground">+{account.enrichment.signals.length - 2} more signals</p>
                          )}
                        </div>
                      </div>

                      {/* References - Compressed */}
                      <div>
                        <h3 className="text-base font-semibold mb-2 text-green-400">Sources</h3>
                        <div className="flex flex-wrap gap-1">
                          {account.enrichment.references.slice(0, 4).map((ref, index) => {
                            const Icon = referenceIcons[ref.source]
                            return (
                              <Badge key={index} variant="outline" className="bg-background/50 border-green-500/30 flex items-center gap-1 text-xs px-1.5 py-0.5">
                                <Icon className="w-2 h-2" />
                                {ref.source}
                              </Badge>
                            )
                          })}
                          {account.enrichment.references.length > 4 && (
                            <Badge variant="outline" className="bg-background/50 border-green-500/30 text-xs px-1.5 py-0.5">
                              +{account.enrichment.references.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Decision Makers (Enhanced) */}
                    <div className="lg:col-span-2">
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
                      ) : (
                        <DecisionMakers 
                          decisionMakers={transformProspectsToDecisionMakers(prospects)}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </ScrollArea>

              {/* Footer Actions */}
              <div className="p-6 pt-4 border-t border-green-500/20">
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