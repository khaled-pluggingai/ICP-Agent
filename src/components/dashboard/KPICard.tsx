"use client"

import { motion } from "framer-motion"
import { LucideIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"

interface KPICardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description: string
  trend?: {
    value: number
    isPositive: boolean
  }
  progressValue?: number
  delay?: number
}

export function KPICard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  progressValue,
  delay = 0 
}: KPICardProps) {
  const cardVariants = {
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
        delay,
      }
    }
  }

  const countVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 500,
        damping: 25,
        delay: delay + 0.2,
      }
    }
  }

  return (
    <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg p-6 hover:border-green-500/30 transition-all duration-300 group cursor-pointer overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ 
              scale: 1.02,
              transition: { type: "spring", stiffness: 400, damping: 25 }
            }}
          >
            {/* Background glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Icon className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
              </div>
              {trend && (
                <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded-full ${
                  trend.isPositive 
                    ? 'text-green-400 bg-green-500/10' 
                    : 'text-red-400 bg-red-500/10'
                }`}>
                  <span>{trend.isPositive ? '▲' : '▼'}</span>
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>

            {/* Value */}
            <motion.div
              className="mb-4"
              variants={countVariants}
            >
              <div className="text-3xl font-bold text-foreground mb-1">
                {value}
              </div>
              {progressValue !== undefined && (
                <Progress 
                  value={progressValue} 
                  className="h-2 bg-muted"
                />
              )}
            </motion.div>

            {/* Animated border */}
            <div className="absolute inset-0 rounded-lg border border-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="bg-popover/95 backdrop-blur-sm border border-border/50"
        >
          <p className="text-sm">{description}</p>
        </TooltipContent>
      </Tooltip>
  )
}