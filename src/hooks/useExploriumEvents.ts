import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

export interface ExploriumEvent {
  event_id: string
  event_name: string
  event_time: string
  data: Record<string, any> | null
  business_id: string
}

export function useExploriumEvents(businessId?: string) {
  const [events, setEvents] = useState<ExploriumEvent[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!businessId) {
      setEvents([])
      setLoading(false)
      return
    }

    async function fetchEvents() {
      try {
        setLoading(true)
        setError(null)
        
        const { data, error } = await supabase
          .from('explorium_events')
          .select('event_id, event_name, event_time, data, business_id')
          .eq('business_id', businessId)
          .order('event_time', { ascending: false })

        if (error) {
          throw error
        }

        // Parse JSON data if it exists
        const parsedEvents: ExploriumEvent[] = (data || []).map((event) => ({
          ...event,
          data: event.data ? (typeof event.data === 'string' ? JSON.parse(event.data) : event.data) : null
        }))

        setEvents(parsedEvents)
      } catch (err) {
        console.error('Error fetching explorium events:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [businessId])

  return { events, loading, error }
}
