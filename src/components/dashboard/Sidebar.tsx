"use client"

import { useState } from "react"
import { BarChart3, Brain, Users, Target, TrendingUp, Building2, Activity } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

type Section = "overview" | "accounts" | "segments" | "insights" | "trainer"

interface DashboardSidebarProps {
  activeSection: Section
  onSectionChange: (section: Section) => void
}

const navigationItems = [
  { id: "accounts" as const, label: "Qualified Accounts", icon: Building2 },
  { id: "overview" as const, label: "Analytics Overview", icon: BarChart3 },
  { id: "segments" as const, label: "Segments", icon: Users },
  { id: "insights" as const, label: "Pipeline Insights", icon: TrendingUp },
  { id: "trainer" as const, label: "ICP Trainer", icon: Brain },
]

export function DashboardSidebar({ activeSection, onSectionChange }: DashboardSidebarProps) {

  const sidebarVariants = {
    hidden: { x: -300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 25,
        staggerChildren: 0.1,
      }
    }
  }

  const itemVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring" as const, stiffness: 400, damping: 25 }
    }
  }

  return (
    <motion.aside
      className="w-64 min-h-screen bg-background border-r border-border/50 backdrop-blur-sm"
      variants={sidebarVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="p-6 border-b border-border/50"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-foreground">Plugging AI</h1>
            <p className="text-xs text-muted-foreground">ICP Intelligence</p>
          </div>
        </div>
      </motion.div>

      <nav className="p-4 space-y-2">
        {navigationItems.map((item, index) => {
          const isActive = activeSection === item.id
          
          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              custom={index}
            >
              <button
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group w-full text-left",
                  isActive
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 transition-colors",
                  isActive ? "text-green-400" : "text-muted-foreground group-hover:text-foreground"
                )} />
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-green-400 rounded-full"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  />
                )}
              </button>
            </motion.div>
          )
        })}
      </nav>

      {/* Status Indicator */}
      <motion.div 
        className="absolute bottom-6 left-4 right-4"
        variants={itemVariants}
      >
        <div className="bg-muted/30 rounded-lg p-3 border border-border/50">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">System Online</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Last sync: 2 min ago
          </p>
        </div>
      </motion.div>
    </motion.aside>
  )
}