"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity, Target } from "lucide-react"

export function AnalyticsOverview() {
  const metrics = [
    {
      title: "Pipeline Velocity",
      value: "28 days",
      change: -3,
      description: "Average deal closure time",
      icon: Activity,
      progress: 75
    },
    {
      title: "Conversion Rate",
      value: "12.4%",
      change: 2.1,
      description: "Lead to opportunity conversion",
      icon: Target,
      progress: 62
    },
    {
      title: "Account Penetration",
      value: "34.2%",
      change: 5.3,
      description: "ICP accounts engaged",
      icon: TrendingUp,
      progress: 84
    }
  ]

  const recentActivities = [
    {
      type: "New ICP Match",
      company: "TechCorp Industries",
      score: 94,
      time: "2 min ago"
    },
    {
      type: "Buying Signal",
      company: "Innovation Labs",
      score: 87,
      time: "15 min ago"
    },
    {
      type: "Intent Spike",
      company: "Future Systems",
      score: 91,
      time: "1 hour ago"
    },
    {
      type: "New Segment",
      company: "Global Enterprises",
      score: 88,
      time: "2 hours ago"
    }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Metrics Cards */}
      <div className="lg:col-span-2 space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Performance Analytics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/30 transition-all duration-300">
                <div className="flex items-center justify-between mb-3">
                  <metric.icon className="w-5 h-5 text-primary" />
                  <Badge variant={metric.change > 0 ? "default" : "secondary"} className="text-xs">
                    {metric.change > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(metric.change)}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                  <Progress value={metric.progress} className="h-2" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="space-y-6">
        <h3 className="text-xl font-semibold text-foreground">Recent Activity</h3>
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{activity.company}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">Score:</span>
                    <Badge variant="default" className="text-xs">
                      {activity.score}%
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}