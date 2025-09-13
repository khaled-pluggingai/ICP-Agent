import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types'

type ICPData = Tables<'icp_data'>
type ICPDataInsert = TablesInsert<'icp_data'>
type ICPDataUpdate = TablesUpdate<'icp_data'>

export interface ICPModel {
  icpName: string
  companyProfile: {
    industries: string[]
    geos: string[]
    employeeRange: [number, number]
    acvRange: [number, number]
  }
  mustHaves: {
    tech: string[]
    compliance: string[]
    motion: string
  }
  disqualifiers: {
    industries: string[]
    geos: string[]
    tech: string[]
    sizeCaps: [number, number]
  }
  buyingTriggers: string[]
  personas: string[]
  weights: {
    firmographic: number
    technographic: number
    intent: number
    behavioral: number
  }
}

export function useICPData() {
  const [icpData, setIcpData] = useState<ICPData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Convert ICPModel to database format
  const convertToDatabaseFormat = (model: ICPModel): ICPDataInsert => {
    return {
      icp_name: model.icpName,
      industries: model.companyProfile.industries,
      geos: model.companyProfile.geos,
      employee_range_min: model.companyProfile.employeeRange[0],
      employee_range_max: model.companyProfile.employeeRange[1],
      acv_range_min: model.companyProfile.acvRange[0],
      acv_range_max: model.companyProfile.acvRange[1],
      must_have_tech: model.mustHaves.tech,
      must_have_compliance: model.mustHaves.compliance,
      must_have_motion: model.mustHaves.motion,
      disq_industries: model.disqualifiers.industries,
      disq_geos: model.disqualifiers.geos,
      disq_tech: model.disqualifiers.tech,
      disq_sizecap_min: model.disqualifiers.sizeCaps[0],
      disq_sizecap_max: model.disqualifiers.sizeCaps[1],
      buying_triggers: model.buyingTriggers,
      personas: model.personas,
      weight_firmographic: model.weights.firmographic,
      weight_technographic: model.weights.technographic,
      weight_intent: model.weights.intent,
      weight_behavioral: model.weights.behavioral,
    }
  }

  // Convert database format to ICPModel
  const convertFromDatabaseFormat = (data: ICPData): ICPModel => {
    return {
      icpName: data.icp_name || `Model #${data.id}`,
      companyProfile: {
        industries: data.industries || [],
        geos: data.geos || [],
        employeeRange: [data.employee_range_min || 0, data.employee_range_max || 0],
        acvRange: [data.acv_range_min || 0, data.acv_range_max || 0],
      },
      mustHaves: {
        tech: data.must_have_tech || [],
        compliance: data.must_have_compliance || [],
        motion: data.must_have_motion || '',
      },
      disqualifiers: {
        industries: data.disq_industries || [],
        geos: data.disq_geos || [],
        tech: data.disq_tech || [],
        sizeCaps: [data.disq_sizecap_min || 0, data.disq_sizecap_max || 0],
      },
      buyingTriggers: data.buying_triggers || [],
      personas: data.personas || [],
      weights: {
        firmographic: data.weight_firmographic || 0,
        technographic: data.weight_technographic || 0,
        intent: data.weight_intent || 0,
        behavioral: data.weight_behavioral || 0,
      },
    }
  }

  // Fetch all ICP data
  const fetchICPData = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('icp_data')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setIcpData(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch ICP data')
    } finally {
      setLoading(false)
    }
  }

  // Save new ICP data
  const saveICPData = async (model: ICPModel) => {
    setLoading(true)
    setError(null)
    
    try {
      const dbData = convertToDatabaseFormat(model)
      
      const { data, error } = await supabase
        .from('icp_data')
        .insert([dbData])
        .select()
        .single()

      if (error) throw error
      
      // Refresh the data list
      await fetchICPData()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save ICP data')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Update existing ICP data
  const updateICPData = async (id: number, model: ICPModel) => {
    setLoading(true)
    setError(null)
    
    try {
      const dbData = convertToDatabaseFormat(model)
      
      const { data, error } = await supabase
        .from('icp_data')
        .update(dbData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      // Refresh the data list
      await fetchICPData()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update ICP data')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Delete ICP data
  const deleteICPData = async (id: number) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('icp_data')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Refresh the data list
      await fetchICPData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete ICP data')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Get the latest ICP data
  const getLatestICPData = (): ICPModel | null => {
    if (icpData.length === 0) return null
    return convertFromDatabaseFormat(icpData[0])
  }

  // Get the primary ICP data
  const getPrimaryICPData = (): ICPModel | null => {
    const primaryData = icpData.find(data => data.is_primary === true)
    if (!primaryData) return null
    return convertFromDatabaseFormat(primaryData)
  }

  // Set an ICP as primary (unset others)
  const setPrimaryICP = async (id: number) => {
    setLoading(true)
    setError(null)
    
    try {
      // First, unset all primary flags
      const { error: unsetError } = await supabase
        .from('icp_data')
        .update({ is_primary: false })
        .neq('id', id)

      if (unsetError) throw unsetError

      // Then set the selected ICP as primary
      const { error: setError } = await supabase
        .from('icp_data')
        .update({ is_primary: true })
        .eq('id', id)

      if (setError) throw setError
      
      // Refresh the data list
      await fetchICPData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set primary ICP')
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Load data on mount
  useEffect(() => {
    fetchICPData()
  }, [])

  return {
    icpData,
    loading,
    error,
    fetchICPData,
    saveICPData,
    updateICPData,
    deleteICPData,
    getLatestICPData,
    getPrimaryICPData,
    setPrimaryICP,
    convertToDatabaseFormat,
    convertFromDatabaseFormat,
  }
}
