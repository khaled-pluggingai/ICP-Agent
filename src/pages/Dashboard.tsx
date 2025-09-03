"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { TrendingUp, Users, BarChart3, Timer } from "lucide-react"
import { DashboardSidebar } from "@/components/dashboard/Sidebar"
import { KPICard } from "@/components/dashboard/KPICard"
import { ICPTrainer } from "@/components/dashboard/ICPTrainer"
import { SegmentsTable } from "@/components/dashboard/SegmentsTable"
import { CampaignModal } from "@/components/dashboard/CampaignModal"
import { AnalyticsOverview } from "@/components/dashboard/AnalyticsOverview"
import { LeadScoring } from "@/components/dashboard/LeadScoring"
import { PipelineInsights } from "@/components/dashboard/PipelineInsights"
import { QualifiedAccounts } from "@/components/dashboard/QualifiedAccounts"
import ICPAgentMonitor from "@/components/ui/icp-agent-monitor"

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState<"overview" | "accounts" | "segments" | "insights" | "trainer" | "monitor">("overview")
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex">
      {/* Sidebar */}
      <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} />

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <motion.div
          className="max-w-7xl mx-auto space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">ICP Agent Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Intelligent Customer Profiling & Campaign Management
              </p>
            </div>
            <CampaignModal />
          </motion.div>

          {/* Dynamic Content Based on Active Section */}
          <motion.div variants={itemVariants}>
            {activeSection === "accounts" && <QualifiedAccounts />}
            {activeSection === "overview" && <AnalyticsOverview />}
            {activeSection === "segments" && <SegmentsTable />}
            {activeSection === "insights" && <PipelineInsights />}
            {activeSection === "trainer" && <ICPTrainer />}
            {activeSection === "monitor" && <ICPAgentMonitor />}
          </motion.div>
        </motion.div>
      </main>
    </div>
  )
}

export default Dashboard