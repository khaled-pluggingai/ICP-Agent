"use client";

import { motion } from "framer-motion"
import { HudButton } from "@/components/ui/hud-button"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"
import { ICPChat } from "@/components/dashboard/ICPChat"
import ICPAgentMonitor from "@/components/ui/icp-agent-monitor"

const Index = () => {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="bg-background/80 backdrop-blur-sm border-border/50"
        >
          {theme === "dark" ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-8">
        <motion.div 
          className="max-w-6xl w-full space-y-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              Always busy scouting for your next big client
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              AI-powered ICP research agent that helps you identify and analyze your ideal customer profiles
            </p>
            <div className="pt-4">
              <HudButton
                style="style2"
                variant="primary"
                onClick={() => window.location.href = '/dashboard'}
              >
                VIEW DASHBOARD
              </HudButton>
            </div>
          </motion.div>

          {/* ICP Chat Interface */}
          <motion.div variants={itemVariants} className="w-full">
            <ICPChat />
          </motion.div>
        </motion.div>
      </div>
      
      {/* ICP Agent Monitor - Floating Widget */}
      <ICPAgentMonitor />
    </div>
  );
};

export default Index;