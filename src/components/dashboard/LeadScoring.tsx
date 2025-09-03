"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building2, Mail, Phone, Star, TrendingUp } from "lucide-react"

export function LeadScoring() {
  const topLeads = [
    {
      company: "TechFlow Solutions",
      contact: "Sarah Chen",
      role: "VP Engineering",
      score: 96,
      tier: "A",
      signals: ["Job posting", "Tech stack match", "Growth funding"],
      lastActivity: "2 hours ago",
      initials: "SC"
    },
    {
      company: "DataCore Systems",
      contact: "Mike Rodriguez",
      role: "CTO",
      score: 91,
      tier: "A",
      signals: ["Website visit", "Demo request", "Pricing inquiry"],
      lastActivity: "1 day ago",
      initials: "MR"
    },
    {
      company: "CloudFirst Inc",
      contact: "Emma Thompson",
      role: "Director IT",
      score: 87,
      tier: "B+",
      signals: ["Content download", "Event attendance"],
      lastActivity: "3 days ago",
      initials: "ET"
    },
    {
      company: "InnovateLab",
      contact: "James Wilson",
      role: "Engineering Manager",
      score: 83,
      tier: "B",
      signals: ["Social engagement", "Competitor research"],
      lastActivity: "1 week ago",
      initials: "JW"
    }
  ]

  const scoringFactors = [
    { factor: "Company Size", weight: 25, value: 90 },
    { factor: "Tech Stack Fit", weight: 20, value: 85 },
    { factor: "Buying Signals", weight: 20, value: 75 },
    { factor: "Budget Range", weight: 15, value: 95 },
    { factor: "Decision Authority", weight: 10, value: 80 },
    { factor: "Timing", weight: 10, value: 70 }
  ]

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "A": return "bg-green-500"
      case "B+": return "bg-amber-500"
      case "B": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 80) return "text-amber-500"
    if (score >= 70) return "text-yellow-500"
    return "text-gray-500"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Top Leads */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-foreground">High-Priority Leads</h3>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        <div className="space-y-4">
          {topLeads.map((lead, index) => (
            <motion.div
              key={lead.company}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {lead.initials}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-foreground">{lead.company}</span>
                        <Badge 
                          className={`${getTierColor(lead.tier)} text-white`}
                          variant="default"
                        >
                          Tier {lead.tier}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-foreground mb-1">
                        {lead.contact} • {lead.role}
                      </p>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {lead.signals.map((signal) => (
                          <Badge key={signal} variant="secondary" className="text-xs">
                            {signal}
                          </Badge>
                        ))}
                      </div>
                      
                      <p className="text-xs text-muted-foreground">
                        Last activity: {lead.lastActivity}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className={`text-2xl font-bold ${getScoreColor(lead.score)}`}>
                        {lead.score}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Phone className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scoring Model */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Scoring Model</h3>
        
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <span className="font-semibold text-foreground">Weighted Factors</span>
            </div>
            
            {scoringFactors.map((factor, index) => (
              <motion.div
                key={factor.factor}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">
                    {factor.factor}
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {factor.weight}%
                    </Badge>
                    <span className="text-sm font-semibold text-foreground">
                      {factor.value}%
                    </span>
                  </div>
                </div>
                <Progress value={factor.value} className="h-2" />
              </motion.div>
            ))}
            
            <div className="pt-4 border-t border-border/50">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-foreground">Overall Score</span>
                <span className="text-2xl font-bold text-primary">87%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}