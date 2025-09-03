"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, Target, Zap, Activity, Clock } from "lucide-react"

interface DataPoint {
  value: number
  timestamp: number
  isSpike?: boolean
}

interface MetricData {
  accountsScanned: DataPoint[]
  accountsEnriched: DataPoint[]
  icpMatchRate: DataPoint[]
  signalsDetected: DataPoint[]
  queueSize: DataPoint[]
}

interface Agent {
  id: string
  name: string
  activity: DataPoint[]
  color: string
  currentValue: number
  unit: string
}

type AgentStatus = "Live" | "Idle" | "Enrichment Running" | "Error"

const generateDataPoint = (baseValue: number, variance: number, spikeChance = 0.05): DataPoint => {
  const isSpike = Math.random() < spikeChance
  const multiplier = isSpike ? 1.5 + Math.random() * 0.5 : 1
  const value = Math.max(0, baseValue + (Math.random() - 0.5) * variance * multiplier)

  return {
    value,
    timestamp: Date.now(),
    isSpike: isSpike && value > baseValue * 1.2,
  }
}

const Sparkline = ({
  data,
  color = "hsl(var(--chart-1))",
  spikeColor = "hsl(var(--destructive))",
  width = 60,
  height = 20,
}: {
  data: DataPoint[]
  color?: string
  spikeColor?: string
  width?: number
  height?: number
}) => {
  const points = data.map((point, index) => ({
    x: (index / (data.length - 1)) * width,
    y: height - (point.value / Math.max(...data.map(d => d.value))) * height,
    isSpike: point.isSpike,
  }))

  const path = points.reduce((acc, point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`
    return `${acc} L ${point.x} ${point.y}`
  }, "")

  const hasSpikes = points.some((p) => p.isSpike)

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={hasSpikes ? spikeColor : color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={hasSpikes ? spikeColor : color} stopOpacity={0.1} />
        </linearGradient>
      </defs>

      <motion.path
        d={`${path} L ${width} ${height} L 0 ${height} Z`}
        fill={`url(#gradient-${color})`}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      <motion.path
        d={path}
        fill="none"
        stroke={hasSpikes ? spikeColor : color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {points.map((point, index) =>
        point.isSpike ? (
          <motion.circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={2}
            fill={spikeColor}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: index * 0.05,
              type: "spring",
              stiffness: 400,
              damping: 10,
            }}
          />
        ) : null,
      )}
    </svg>
  )
}

const MetricCard = ({
  icon: Icon,
  label,
  value,
  data,
  color,
  unit = "",
}: {
  icon: any
  label: string
  value: number
  data: DataPoint[]
  color: string
  unit?: string
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const hasSpikes = data.some((d) => d.isSpike)

  return (
    <motion.div
      className="flex items-center gap-2 p-1.5 rounded-lg transition-colors hover:bg-muted/50"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        className="flex items-center justify-center w-7 h-7 rounded-md bg-muted"
        animate={{
          backgroundColor: hasSpikes ? "hsl(var(--destructive) / 0.1)" : undefined,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <Icon className={`w-4 h-4 ${hasSpikes ? "text-destructive" : "text-muted-foreground"}`} />
      </motion.div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-muted-foreground">{label}</span>
          <motion.span
            className={`text-xs font-mono ${hasSpikes ? "text-destructive" : "text-foreground"}`}
            animate={{ color: hasSpikes ? "hsl(var(--destructive))" : undefined }}
          >
            {value.toFixed(label.includes("Rate") ? 1 : 0)} {unit}
          </motion.span>
        </div>
        <div className="mt-1">
          <Sparkline data={data} color={color} />
        </div>
      </div>
    </motion.div>
  )
}

const AgentCard = ({ agent }: { agent: Agent }) => {
  const [isHovered, setIsHovered] = useState(false)
  const hasSpikes = agent.activity.some((d) => d.isSpike)

  return (
    <motion.div
      className="flex items-center gap-2 p-2 rounded-md transition-colors hover:bg-muted/30"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: hasSpikes ? "hsl(var(--destructive))" : agent.color }}
        animate={{
          scale: isHovered ? 1.2 : 1,
          backgroundColor: hasSpikes ? "hsl(var(--destructive))" : agent.color,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground truncate">{agent.name}</span>
          <motion.span
            className={`text-xs font-mono ml-2 ${hasSpikes ? "text-destructive" : "text-foreground"}`}
            animate={{ color: hasSpikes ? "hsl(var(--destructive))" : undefined }}
          >
            {agent.currentValue} {agent.unit}
          </motion.span>
        </div>
        <div className="mt-1">
          <Sparkline data={agent.activity} color={agent.color} width={40} height={12} />
        </div>
      </div>
    </motion.div>
  )
}

export default function ICPAgentMonitor() {
  const [metricData, setMetricData] = useState<MetricData>({
    accountsScanned: [],
    accountsEnriched: [],
    icpMatchRate: [],
    signalsDetected: [],
    queueSize: [],
  })

  const [agents] = useState<Agent[]>([
    { id: "1", name: "ICP Definition Agent", activity: [], color: "hsl(var(--chart-1))", currentValue: 40, unit: "scored" },
    { id: "2", name: "Account Research Agent", activity: [], color: "hsl(var(--chart-2))", currentValue: 25, unit: "enriched" },
  ])

  const [agentStatus, setAgentStatus] = useState<AgentStatus>("Live")
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setMetricData((prev) => {
        const maxPoints = 20

        return {
          accountsScanned: [...prev.accountsScanned, generateDataPoint(452, 50, 0.08)].slice(-maxPoints),
          accountsEnriched: [...prev.accountsEnriched, generateDataPoint(368, 40, 0.06)].slice(-maxPoints),
          icpMatchRate: [...prev.icpMatchRate, generateDataPoint(78.2, 5, 0.05)].slice(-maxPoints),
          signalsDetected: [...prev.signalsDetected, generateDataPoint(245, 30, 0.1)].slice(-maxPoints),
          queueSize: [...prev.queueSize, generateDataPoint(128, 20, 0.04)].slice(-maxPoints),
        }
      })

      // Update agent activity
      agents.forEach((agent) => {
        const baseActivity = agent.id === "1" ? 40 : 25
        const newPoint = generateDataPoint(baseActivity, 10, 0.06)
        agent.activity = [...agent.activity, newPoint].slice(-15)
        agent.currentValue = Math.round(newPoint.value)
      })

      // Randomly change status
      if (Math.random() < 0.1) {
        const statuses: AgentStatus[] = ["Live", "Idle", "Enrichment Running", "Error"]
        setAgentStatus(statuses[Math.floor(Math.random() * statuses.length)])
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [agents])

  const currentAccountsScanned = metricData.accountsScanned[metricData.accountsScanned.length - 1]?.value || 452
  const currentAccountsEnriched = metricData.accountsEnriched[metricData.accountsEnriched.length - 1]?.value || 368
  const currentIcpMatchRate = metricData.icpMatchRate[metricData.icpMatchRate.length - 1]?.value || 78.2
  const currentSignalsDetected = metricData.signalsDetected[metricData.signalsDetected.length - 1]?.value || 245
  const currentQueueSize = metricData.queueSize[metricData.queueSize.length - 1]?.value || 128

  const hasAnySpikes = [
    ...metricData.accountsScanned,
    ...metricData.accountsEnriched,
    ...metricData.icpMatchRate,
    ...metricData.signalsDetected,
    ...metricData.queueSize,
    ...agents.flatMap((a) => a.activity),
  ].some((d) => d.isSpike)

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
      case "Live": return "bg-green-500"
      case "Idle": return "bg-muted-foreground"
      case "Enrichment Running": return "bg-orange-500"
      case "Error": return "bg-destructive"
    }
  }

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Card className="w-96 bg-background/95 backdrop-blur-sm border shadow-lg">
        <motion.div
          className="p-3 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          whileHover={{ backgroundColor: "hsl(var(--muted) / 0.5)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: hasAnySpikes ? 360 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                <Activity className={`w-4 h-4 ${hasAnySpikes ? "text-destructive" : "text-muted-foreground"}`} />
              </motion.div>
              <span className="text-sm font-medium">ICP Agent — Live Monitor</span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Badge variant="outline" className={`text-xs px-1.5 py-0.5 ${getStatusColor(agentStatus)} text-white border-0`}>
                  {agentStatus}
                </Badge>
              </motion.div>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="text-muted-foreground"
            >
              ▼
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            <MetricCard 
              icon={Users} 
              label="Accounts Scanned" 
              value={currentAccountsScanned} 
              data={metricData.accountsScanned} 
              color="hsl(var(--chart-1))" 
              unit="/hr"
            />
            <MetricCard 
              icon={TrendingUp} 
              label="Accounts Enriched" 
              value={currentAccountsEnriched} 
              data={metricData.accountsEnriched} 
              color="hsl(var(--chart-2))" 
              unit="/hr"
            />
            <MetricCard 
              icon={Target} 
              label="ICP Match Rate" 
              value={currentIcpMatchRate} 
              data={metricData.icpMatchRate} 
              color="hsl(var(--destructive))" 
              unit="%"
            />
            <MetricCard 
              icon={Zap} 
              label="Signals Detected" 
              value={currentSignalsDetected} 
              data={metricData.signalsDetected} 
              color="hsl(var(--chart-4))" 
              unit="/hr"
            />
          </div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-3 border-t">
                <div className="mt-3 mb-2">
                  <MetricCard
                    icon={Clock}
                    label="Total Active Accounts in Queue"
                    value={currentQueueSize}
                    data={metricData.queueSize}
                    color={currentQueueSize > 150 ? "hsl(var(--destructive))" : "hsl(var(--chart-3))"}
                    unit=""
                  />
                </div>

                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Per-Agent Live Stats</span>
                  {agents.map((agent, index) => (
                    <motion.div
                      key={agent.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <AgentCard agent={agent} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  )
}