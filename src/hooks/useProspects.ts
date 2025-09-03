import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"

export interface Prospect {
  prospect_id: string
  professional_email_hashed?: string
  first_name?: string
  last_name?: string
  full_name?: string
  country_name?: string
  region_name?: string
  city?: string
  linkedin?: string
  experience?: string
  skills?: string
  interests?: string
  company_name?: string
  company_website?: string
  company_linkedin?: string
  job_department?: string
  job_seniority_level?: string
  job_title?: string
  business_id?: string
}

export function useProspects() {
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProspectsByBusinessId = async (businessId: string) => {
    try {
      setLoading(true)
      setError(null)

      const normalized = String(businessId ?? '').trim()
      console.log('useProspects: querying prospects by business_id:', normalized)
      
      const { data, error } = await supabase
        .from('prospects')
        .select('*')
        .eq('business_id', normalized)

      if (error) {
        throw error
      }

      setProspects(data || [])
    } catch (err) {
      console.error('Error fetching prospects:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch prospects')
      setProspects([])
    } finally {
      setLoading(false)
    }
  }

  return {
    prospects,
    loading,
    error,
    fetchProspectsByBusinessId
  }
}