import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

export interface AutomationSchedule {
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

export interface ScheduleResult {
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

export interface ScheduleForm {
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

export function useAutomationScheduler() {
  const [schedules, setSchedules] = useState<AutomationSchedule[]>([])
  const [results, setResults] = useState<ScheduleResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Mock data for demonstration - replace with actual Supabase calls
  const mockSchedules: AutomationSchedule[] = [
    {
      id: '1',
      query: 'Software companies in San Francisco with 50-200 employees',
      accountCount: 50,
      frequency: 'daily',
      time: '09:00',
      startDate: '2024-01-15',
      nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      autoSave: true,
      notifications: true,
      stopAfter: 100,
      stopCondition: 'results',
      createdAt: '2024-01-15T08:00:00Z',
      lastRun: '2024-01-20T09:00:00Z',
      totalRuns: 5,
      totalResults: 247
    },
    {
      id: '2',
      query: 'Fintech startups in New York with Series A funding',
      accountCount: 25,
      frequency: 'weekly',
      time: '14:00',
      startDate: '2024-01-10',
      nextRun: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      autoSave: true,
      notifications: false,
      stopAfter: 50,
      stopCondition: 'results',
      createdAt: '2024-01-10T10:00:00Z',
      lastRun: '2024-01-17T14:00:00Z',
      totalRuns: 2,
      totalResults: 48
    },
    {
      id: '3',
      query: 'Healthcare companies in Austin with remote work policies',
      accountCount: 100,
      frequency: 'monthly',
      time: '11:00',
      startDate: '2024-01-01',
      nextRun: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'paused',
      autoSave: false,
      notifications: true,
      stopAfter: 200,
      stopCondition: 'attempts',
      createdAt: '2024-01-01T12:00:00Z',
      lastRun: '2024-01-15T11:00:00Z',
      totalRuns: 1,
      totalResults: 89
    }
  ]

  const mockResults: ScheduleResult[] = [
    {
      id: '1',
      scheduleId: '1',
      query: 'Software companies in San Francisco with 50-200 employees',
      runTime: '2024-01-20T09:00:00Z',
      status: 'success',
      accountsFound: 52,
      accountsSaved: 50,
      duration: 45
    },
    {
      id: '2',
      scheduleId: '1',
      query: 'Software companies in San Francisco with 50-200 employees',
      runTime: '2024-01-19T09:00:00Z',
      status: 'success',
      accountsFound: 48,
      accountsSaved: 48,
      duration: 42
    },
    {
      id: '3',
      scheduleId: '2',
      query: 'Fintech startups in New York with Series A funding',
      runTime: '2024-01-17T14:00:00Z',
      status: 'partial',
      accountsFound: 23,
      accountsSaved: 20,
      duration: 38
    },
    {
      id: '4',
      scheduleId: '3',
      query: 'Healthcare companies in Austin with remote work policies',
      runTime: '2024-01-15T11:00:00Z',
      status: 'failed',
      accountsFound: 0,
      accountsSaved: 0,
      duration: 12,
      error: 'API rate limit exceeded'
    }
  ]

  // Load initial data
  useEffect(() => {
    loadSchedules()
    loadResults()
  }, [])

  const loadSchedules = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('automation_schedules')
      //   .select('*')
      //   .order('created_at', { ascending: false })
      
      // if (error) throw error
      
      // For now, use mock data
      setSchedules(mockSchedules)
    } catch (err) {
      console.error('Error loading schedules:', err)
      setError(err instanceof Error ? err.message : 'Failed to load schedules')
    } finally {
      setLoading(false)
    }
  }

  const loadResults = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // TODO: Replace with actual Supabase query
      // const { data, error } = await supabase
      //   .from('schedule_results')
      //   .select('*')
      //   .order('run_time', { ascending: false })
      
      // if (error) throw error
      
      // For now, use mock data
      setResults(mockResults)
    } catch (err) {
      console.error('Error loading results:', err)
      setError(err instanceof Error ? err.message : 'Failed to load results')
    } finally {
      setLoading(false)
    }
  }

  const createSchedule = async (formData: ScheduleForm) => {
    try {
      setLoading(true)
      setError(null)

      const newSchedule: AutomationSchedule = {
        id: Date.now().toString(),
        query: formData.query,
        accountCount: formData.accountCount,
        frequency: formData.frequency,
        time: formData.time,
        startDate: formData.startDate,
        nextRun: calculateNextRun(formData.frequency, formData.time, formData.startDate),
        status: 'active',
        autoSave: formData.autoSave,
        notifications: formData.notifications,
        stopAfter: formData.stopAfter,
        stopCondition: formData.stopCondition,
        createdAt: new Date().toISOString(),
        totalRuns: 0,
        totalResults: 0
      }

      // TODO: Replace with actual Supabase insert
      // const { data, error } = await supabase
      //   .from('automation_schedules')
      //   .insert([newSchedule])
      //   .select()
      
      // if (error) throw error

      // For now, add to local state
      setSchedules(prev => [newSchedule, ...prev])
      
      return newSchedule
    } catch (err) {
      console.error('Error creating schedule:', err)
      setError(err instanceof Error ? err.message : 'Failed to create schedule')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateSchedule = async (id: string, updates: Partial<AutomationSchedule>) => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Replace with actual Supabase update
      // const { data, error } = await supabase
      //   .from('automation_schedules')
      //   .update(updates)
      //   .eq('id', id)
      //   .select()
      
      // if (error) throw error

      // For now, update local state
      setSchedules(prev => prev.map(schedule => 
        schedule.id === id ? { ...schedule, ...updates } : schedule
      ))
    } catch (err) {
      console.error('Error updating schedule:', err)
      setError(err instanceof Error ? err.message : 'Failed to update schedule')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteSchedule = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Replace with actual Supabase delete
      // const { error } = await supabase
      //   .from('automation_schedules')
      //   .delete()
      //   .eq('id', id)
      
      // if (error) throw error

      // For now, remove from local state
      setSchedules(prev => prev.filter(schedule => schedule.id !== id))
    } catch (err) {
      console.error('Error deleting schedule:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete schedule')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const pauseSchedule = async (id: string) => {
    try {
      await updateSchedule(id, { status: 'paused' })
    } catch (err) {
      console.error('Error pausing schedule:', err)
      throw err
    }
  }

  const resumeSchedule = async (id: string) => {
    try {
      await updateSchedule(id, { status: 'active' })
    } catch (err) {
      console.error('Error resuming schedule:', err)
      throw err
    }
  }

  const runScheduleNow = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const schedule = schedules.find(s => s.id === id)
      if (!schedule) throw new Error('Schedule not found')

      // TODO: Implement actual automation execution
      // This would trigger the search automation
      console.log('Running schedule now:', schedule)

      // Simulate running the schedule
      const result: ScheduleResult = {
        id: Date.now().toString(),
        scheduleId: id,
        query: schedule.query,
        runTime: new Date().toISOString(),
        status: 'success',
        accountsFound: Math.floor(Math.random() * 50) + 10,
        accountsSaved: Math.floor(Math.random() * 45) + 5,
        duration: Math.floor(Math.random() * 60) + 20
      }

      // Add result to history
      setResults(prev => [result, ...prev])

      // Update schedule stats
      await updateSchedule(id, {
        lastRun: result.runTime,
        totalRuns: schedule.totalRuns + 1,
        totalResults: schedule.totalResults + result.accountsSaved
      })

      return result
    } catch (err) {
      console.error('Error running schedule:', err)
      setError(err instanceof Error ? err.message : 'Failed to run schedule')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const calculateNextRun = (frequency: string, time: string, startDate: string): string => {
    const now = new Date()
    const start = new Date(startDate)
    const [hours, minutes] = time.split(':').map(Number)
    
    let nextRun = new Date()
    nextRun.setHours(hours, minutes, 0, 0)

    switch (frequency) {
      case 'daily':
        nextRun.setDate(nextRun.getDate() + 1)
        break
      case 'weekly':
        nextRun.setDate(nextRun.getDate() + 7)
        break
      case 'monthly':
        nextRun.setMonth(nextRun.getMonth() + 1)
        break
    }

    return nextRun.toISOString()
  }

  return {
    schedules,
    results,
    loading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    pauseSchedule,
    resumeSchedule,
    runScheduleNow,
    loadSchedules,
    loadResults
  }
}
