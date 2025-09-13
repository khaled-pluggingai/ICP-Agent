import React, { useState } from "react"
import { motion } from "framer-motion"
import { 
  Calendar, 
  Clock, 
  Search, 
  Settings, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  History, 
  Plus,
  CheckCircle,
  AlertCircle,
  Zap,
  Target,
  Users,
  Database,
  Bell,
  Filter
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAutomationScheduler } from "@/hooks/useAutomationScheduler"

interface ScheduleForm {
  query: string
  accountCount: number
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string
  startDate: string
  autoSave: boolean
  notifications: boolean
  stopAfter: number
  stopCondition: 'results' | 'attempts'
}

interface AutomationSchedule {
  id: string
  query: string
  accountCount: number
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string
  startDate: string
  nextRun: string
  status: 'active' | 'paused' | 'completed'
  autoSave: boolean
  notifications: boolean
  stopAfter: number
  stopCondition: 'results' | 'attempts'
  createdAt: string
  lastRun?: string
  totalRuns: number
  totalResults: number
}

interface ScheduleResult {
  id: string
  scheduleId: string
  query: string
  runTime: string
  status: 'success' | 'failed' | 'partial'
  accountsFound: number
  accountsSaved: number
  duration: number
  error?: string
}

export function AutomationScheduler() {
  const [activeTab, setActiveTab] = useState("create")
  const [formData, setFormData] = useState<ScheduleForm>({
    query: "",
    accountCount: 25,
    frequency: 'daily',
    time: "09:00",
    startDate: new Date().toISOString().split('T')[0],
    autoSave: true,
    notifications: true,
    stopAfter: 100,
    stopCondition: 'results'
  })

  const { 
    schedules, 
    results, 
    loading, 
    error, 
    createSchedule, 
    updateSchedule, 
    deleteSchedule, 
    pauseSchedule, 
    runScheduleNow 
  } = useAutomationScheduler()

  const handleFormChange = (field: keyof ScheduleForm, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreateSchedule = async () => {
    if (!formData.query.trim()) return
    
    try {
      await createSchedule(formData)
      setFormData({
        query: "",
        accountCount: 25,
        frequency: 'daily',
        time: "09:00",
        startDate: new Date().toISOString().split('T')[0],
        autoSave: true,
        notifications: true,
        stopAfter: 100,
        stopCondition: 'results'
      })
      setActiveTab("active")
    } catch (err) {
      console.error('Failed to create schedule:', err)
    }
  }

  const formatNextRun = (schedule: AutomationSchedule) => {
    const nextRun = new Date(schedule.nextRun)
    return nextRun.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'paused': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'completed': return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const getResultStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'failed': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'partial': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Automation Scheduler</h1>
              <p className="text-muted-foreground">Schedule automated account searches and manage your prospecting workflows</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-500/10 text-blue-300 border-blue-500/30">
              <Zap className="w-3 h-3 mr-1" />
              {schedules.filter(s => s.status === 'active').length} Active
            </Badge>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="create" className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Schedule
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              Active Schedules
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Schedule History
            </TabsTrigger>
          </TabsList>

          {/* Create New Schedule Tab */}
          <TabsContent value="create" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-card/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Settings className="w-5 h-5" />
                    Create New Automation Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Search Configuration */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Search className="w-4 h-4" />
                      Search Configuration
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="query">Search Query</Label>
                        <Input
                          id="query"
                          placeholder="Enter your search criteria..."
                          value={formData.query}
                          onChange={(e) => handleFormChange('query', e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="accountCount">Number of Accounts</Label>
                        <Select value={formData.accountCount.toString()} onValueChange={(value) => handleFormChange('accountCount', parseInt(value))}>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10 accounts</SelectItem>
                            <SelectItem value="25">25 accounts</SelectItem>
                            <SelectItem value="50">50 accounts</SelectItem>
                            <SelectItem value="100">100 accounts</SelectItem>
                            <SelectItem value="250">250 accounts</SelectItem>
                            <SelectItem value="500">500 accounts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Scheduling Options */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Scheduling Options
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select value={formData.frequency} onValueChange={(value) => handleFormChange('frequency', value)}>
                          <SelectTrigger className="bg-background/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => handleFormChange('time', e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleFormChange('startDate', e.target.value)}
                          className="bg-background/50"
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Automation Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      Automation Settings
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="autoSave">Auto-save Results</Label>
                            <p className="text-sm text-muted-foreground">Automatically save found accounts to database</p>
                          </div>
                          <Switch
                            id="autoSave"
                            checked={formData.autoSave}
                            onCheckedChange={(checked) => handleFormChange('autoSave', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <Label htmlFor="notifications">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Get notified when search completes</p>
                          </div>
                          <Switch
                            id="notifications"
                            checked={formData.notifications}
                            onCheckedChange={(checked) => handleFormChange('notifications', checked)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="stopCondition">Stop Condition</Label>
                          <Select value={formData.stopCondition} onValueChange={(value) => handleFormChange('stopCondition', value)}>
                            <SelectTrigger className="bg-background/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="results">Stop after X successful results</SelectItem>
                              <SelectItem value="attempts">Stop after X attempts</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="stopAfter">Stop After</Label>
                          <Input
                            id="stopAfter"
                            type="number"
                            value={formData.stopAfter}
                            onChange={(e) => handleFormChange('stopAfter', parseInt(e.target.value))}
                            className="bg-background/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Create Button */}
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleCreateSchedule}
                      disabled={!formData.query.trim() || loading}
                      className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Create Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Active Schedules Tab */}
          <TabsContent value="active" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-card/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <Play className="w-5 h-5" />
                    Active Schedules ({schedules.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {schedules.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Active Schedules</h3>
                      <p className="text-muted-foreground mb-4">Create your first automation schedule to get started</p>
                      <Button onClick={() => setActiveTab("create")} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Schedule
                      </Button>
                    </div>
                  ) : (
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-4">
                        {schedules.map((schedule, index) => (
                          <motion.div
                            key={schedule.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border border-blue-500/20 rounded-lg p-4 bg-background/30"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h4 className="font-semibold text-foreground">{schedule.query}</h4>
                                  <Badge variant="outline" className={getStatusColor(schedule.status)}>
                                    {schedule.status}
                                  </Badge>
                                </div>
                                
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <span className="text-muted-foreground">Frequency:</span>
                                    <p className="font-medium capitalize">{schedule.frequency}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Next Run:</span>
                                    <p className="font-medium">{formatNextRun(schedule)}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Accounts:</span>
                                    <p className="font-medium">{schedule.accountCount}</p>
                                  </div>
                                  <div>
                                    <span className="text-muted-foreground">Total Runs:</span>
                                    <p className="font-medium">{schedule.totalRuns}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => runScheduleNow(schedule.id)}
                                  className="text-green-400 border-green-500/30 hover:bg-green-500/10"
                                >
                                  <Play className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => pauseSchedule(schedule.id)}
                                  className="text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/10"
                                >
                                  <Pause className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {/* Edit functionality */}}
                                  className="text-blue-400 border-blue-500/30 hover:bg-blue-500/10"
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => deleteSchedule(schedule.id)}
                                  className="text-red-400 border-red-500/30 hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* Schedule History Tab */}
          <TabsContent value="history" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-card/50 border-blue-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-400">
                    <History className="w-5 h-5" />
                    Schedule History ({results.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {results.length === 0 ? (
                    <div className="text-center py-12">
                      <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No History Yet</h3>
                      <p className="text-muted-foreground">Automation results will appear here once schedules start running</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-4">
                        {results.map((result, index) => (
                          <motion.div
                            key={result.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border border-blue-500/20 rounded-lg p-4 bg-background/30"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <h4 className="font-semibold text-foreground">{result.query}</h4>
                                <Badge variant="outline" className={getResultStatusColor(result.status)}>
                                  {result.status}
                                </Badge>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {new Date(result.runTime).toLocaleString()}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Accounts Found:</span>
                                <p className="font-medium">{result.accountsFound}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Accounts Saved:</span>
                                <p className="font-medium">{result.accountsSaved}</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Duration:</span>
                                <p className="font-medium">{result.duration}s</p>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Success Rate:</span>
                                <p className="font-medium">
                                  {result.accountsFound > 0 ? Math.round((result.accountsSaved / result.accountsFound) * 100) : 0}%
                                </p>
                              </div>
                            </div>
                            
                            {result.error && (
                              <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded text-sm text-red-300">
                                <strong>Error:</strong> {result.error}
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AutomationScheduler
