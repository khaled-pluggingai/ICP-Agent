import { Outlet, useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Brain, MessageCircle } from "lucide-react"
import AnimatedRadioNav from "@/components/ui/animated-radio-nav"
import { Button } from "@/components/ui/button"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      staggerChildren: 0.1,
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5 }
  }
}

export default function DashboardLayout() {
  const navigate = useNavigate()
  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Sidebar */}
      <motion.aside 
        className="w-64 min-h-screen bg-background border-r border-border/50 backdrop-blur-sm"
        variants={itemVariants}
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

        {/* Navigation */}
        <div className="p-4">
          <AnimatedRadioNav />
        </div>

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

      {/* Main Content */}
      <main className="flex-1">
        <motion.div
          className="p-6"
          variants={itemVariants}
        >
          {/* Chat with AI Button */}
          <div className="fixed top-6 right-6 z-50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2 bg-background/80 backdrop-blur-sm border-emerald-500/20 hover:border-emerald-500/40 hover:bg-emerald-500/5"
            >
              <MessageCircle className="w-4 h-4" />
              Chat with AI
            </Button>
          </div>
          
          <Outlet />
        </motion.div>
      </main>
    </motion.div>
  )
}