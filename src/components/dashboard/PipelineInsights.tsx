"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown, Globe, Zap, Users, DollarSign } from "lucide-react"
import { CountryStatesDistribution } from "./CountryStatesDistribution"
import { DecisionMakers } from "./DecisionMakers"

export function PipelineInsights() {
  const marketTrends = [
    {
      sector: "SaaS & Cloud",
      growth: 23.5,
      opportunity: "High",
      accounts: 1847,
      avgDeal: "$125K",
      trend: "up"
    },
    {
      sector: "FinTech",
      growth: 18.2,
      opportunity: "Medium",
      accounts: 923,
      avgDeal: "$89K",
      trend: "up"
    },
    {
      sector: "Healthcare Tech",
      growth: -2.1,
      opportunity: "Low",
      accounts: 456,
      avgDeal: "$67K",
      trend: "down"
    },
    {
      sector: "E-commerce",
      growth: 15.7,
      opportunity: "Medium",
      accounts: 1234,
      avgDeal: "$45K",
      trend: "up"
    }
  ]


  const buyingSignals = [
    {
      signal: "Tech Stack Adoption",
      companies: 234,
      strength: 87,
      description: "Companies adopting complementary technologies"
    },
    {
      signal: "Hiring Surge",
      companies: 189,
      strength: 92,
      description: "Engineering teams expanding rapidly"
    },
    {
      signal: "Funding Events",
      companies: 156,
      strength: 78,
      description: "Recent funding rounds completed"
    },
    {
      signal: "Executive Changes",
      companies: 143,
      strength: 65,
      description: "New technical leadership hired"
    }
  ]

  const getOpportunityColor = (opportunity: string) => {
    switch (opportunity) {
      case "High": return "bg-green-500 text-white"
      case "Medium": return "bg-yellow-500 text-white"
      case "Low": return "bg-red-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  return (
    <div className="space-y-8">
      {/* Market Trends */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-foreground">Pipeline Trends</h3>
          <Button variant="outline" size="sm">
            Export Report
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {marketTrends.map((trend, index) => (
            <motion.div
              key={trend.sector}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    <span className="font-semibold text-foreground">{trend.sector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {trend.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`font-bold ${trend.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                      {trend.growth > 0 ? "+" : ""}{trend.growth}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getOpportunityColor(trend.opportunity)}>
                      {trend.opportunity} Opportunity
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {trend.accounts.toLocaleString()} accounts
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Avg Deal Size:</span>
                    <span className="font-semibold text-foreground">{trend.avgDeal}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Country & States Distribution */}
        <div className="lg:col-span-2">
          <CountryStatesDistribution />
        </div>

        {/* Decision Makers Preview */}
        <div className="lg:col-span-2">
          <DecisionMakers />
        </div>

        {/* Buying Signals */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-foreground">Active Buying Signals</h3>
          
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="space-y-4">
              {buyingSignals.map((signal, index) => (
                <motion.div
                  key={signal.signal}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium text-foreground">{signal.signal}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {signal.companies} companies
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{signal.description}</p>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Signal Strength:</span>
                    <Progress value={signal.strength} className="flex-1 h-2" />
                    <span className="text-sm font-semibold text-foreground">{signal.strength}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}