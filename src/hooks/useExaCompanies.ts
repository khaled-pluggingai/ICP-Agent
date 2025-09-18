import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { QualifiedAccount } from "@/lib/icp-mocks"

export function useExaCompanies() {
  const [accounts, setAccounts] = useState<QualifiedAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchExaCompanies() {
      try {
        setLoading(true)
        
        // Join exa_companies with companies_enrichment to get Fit Score and Intent Score
        // Only include companies where icp_fit_score >= 10 (Qualified Accounts)
        const { data, error } = await supabase
          .from('exa_companies')
          .select(`
            id,
            properties,
            evaluations,
            enrichments,
            created_at,
            updated_at,
            companies_enrichment!inner(
              exa_company_id,
              icp_fit_score,
              intent_score,
              status
            )
          `)
          .gte('companies_enrichment.icp_fit_score', 10)

        console.log('Executing Supabase query:', {
          table: 'exa_companies',
          select: `
            id,
            properties,
            evaluations,
            enrichments,
            created_at,
            updated_at,
            companies_enrichment!inner(
              exa_company_id,
              icp_fit_score,
              intent_score,
              status
            )
          `,
          filter: { gte: { 'companies_enrichment.icp_fit_score': 10 } }
        });

        if (error) {
          console.error('Supabase query error:', error);
          setError(`Failed to fetch companies: ${error.message}`);
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          console.warn('No companies found in the query result.');
          setError('No companies found.');
          setLoading(false);
          return;
        }

        // Debug logging to check what data is being fetched
        console.log('Supabase exa_companies data:', data)
        console.log('Sample item:', data?.[0])
        console.log('Total companies found:', data?.length || 0)
        
        // Log each company's data to check for duplicates
        data?.forEach((item: any, index: number) => {
          const properties = item.properties || {}
          const company = properties.company || {}
          console.log(`Company ${index + 1}:`, {
            id: item.id,
            name: company.name,
            industry: company.industry,
            location: company.location,
            employees: company.employees
          })
        })

        // Map exa_companies data to QualifiedAccount format
        const mappedAccounts: QualifiedAccount[] = (data || []).map((item: any, index: number) => {
          const properties = item.properties || {}
          const company = properties.company || {}
          const enrichment = item.companies_enrichment || {}
          
          console.log(`Mapping company ${index + 1}:`, {
            id: item.id,
            name: company.name,
            industry: company.industry,
            location: company.location,
            employees: company.employees,
            fit_score: enrichment.icp_fit_score,
            intent_score: enrichment.intent_score
          })
          
          return {
            id: item.id,
            name: company.name || "Unknown Company",
            domain: properties.url ? new URL(properties.url).hostname : "unknown.com",
            description: company.about || "",
            logoUrl: null, // Not available in new schema
            tier: calculateTier(enrichment.icp_fit_score || 0),
            industry: company.industry || "Other",
            geo: company.location || "Unknown",
            employees: company.employees || 0,
            tech_stack: [], // Not available in new schema
            fit_score: Math.min(100, Math.max(0, enrichment.icp_fit_score || 0)),
            intent_score: Math.min(100, Math.max(0, enrichment.intent_score || 0)),
            intent_delta_14d: Math.floor(Math.random() * 41) - 20, // Random -20 to +20
            last_activity_at: item.updated_at || item.created_at || new Date().toISOString(),
            rules_match: {
              firmographic: getRandomMatch(),
              technographic: getRandomMatch(),
              intent: getRandomMatch(),
              behavioral: getRandomMatch(),
            },
            enrichment: {
              summary_bullets: generateSummaryBullets(company),
              icp_reasons: generateIcpReasons(enrichment.icp_fit_score),
              risks: [],
              signals: generateSignals(item.evaluations),
              references: generateReferences(properties),
              committee: generateCommittee(),
            },
            // Raw data for additional fields
            rawData: {
              business_id: item.id,
              name: company.name || "Unknown Company",
              domain: properties.url ? new URL(properties.url).hostname : "unknown.com",
              website: properties.url,
              business_description: company.about || "",
              company_description: company.about || "",
              logo: null,
              score: enrichment.icp_fit_score || 0,
              industry: company.industry || "Other",
              region: company.location || "Unknown",
              country_name: company.location ? company.location.split(',').pop()?.trim() : "Unknown",
              number_of_employees_range: company.employees ? `${company.employees}` : "0",
              company_size: company.employees ? getCompanySize(company.employees) : "Unknown",
              founded_year: null,
              main_products_services: company.about || "",
              'linkedin-url': null,
              intent_score: enrichment.intent_score || 0,
              ceo_founder: null,
              contact_email: null,
              phone_number: null,
              physical_address: company.location || "",
              mission_vision: company.about || "",
              naics: null,
              naics_description: null,
              sic_code: null,
              sic_code_description: null,
              target_customers: null,
              yearly_revenue_range: null,
              reasone: null,
            }
          }
        })

        setAccounts(mappedAccounts)
      } catch (err) {
        console.error('Error fetching exa companies:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch companies')
      } finally {
        setLoading(false)
      }
    }

    fetchExaCompanies()
  }, [])

  return { accounts, loading, error }
}

// Helper functions
function calculateTier(fitScore: number): 'A' | 'B' | 'C' {
  if (fitScore >= 80) return 'A'
  if (fitScore >= 50) return 'B'
  return 'C'
}

function getRandomMatch(): 'Match' | 'Partial' | 'Miss' {
  const matches = ['Match', 'Partial', 'Miss'] as const
  return matches[Math.floor(Math.random() * matches.length)]
}

function generateSummaryBullets(company: any): string[] {
  const bullets = []
  if (company.name) bullets.push(`${company.name} is a leading company in ${company.industry || 'their industry'}`)
  if (company.employees) bullets.push(`Company size: ${company.employees} employees`)
  if (company.location) bullets.push(`Headquartered in ${company.location}`)
  if (company.about) bullets.push(`Focus: ${company.about.substring(0, 100)}...`)
  return bullets.slice(0, 4)
}

function generateIcpReasons(fitScore: number): string[] {
  const reasons = []
  if (fitScore >= 80) reasons.push('High ICP Match')
  if (fitScore >= 60) reasons.push('Strong Intent Signals')
  if (fitScore >= 40) reasons.push('Good Company Profile')
  return reasons
}

function generateSignals(evaluations: any): Array<{type: 'Funding' | 'Hiring' | 'Tech' | 'News', note: string, date: string}> {
  if (!evaluations || !Array.isArray(evaluations)) return []
  
  return evaluations.slice(0, 3).map((evaluation: any) => ({
    type: 'News' as const,
    note: evaluation.criterion || 'Company activity detected',
    date: new Date().toISOString().split('T')[0]
  }))
}

function generateReferences(properties: any): Array<{source: 'Crunchbase' | 'G2' | 'LinkedIn' | 'News' | 'Website' | 'Other', url?: string}> {
  const references = []
  if (properties.url) {
    references.push({ source: 'Website' as const, url: properties.url })
  }
  return references
}

function generateCommittee(): Array<{name?: string, title: string, role: 'Economic' | 'Champion' | 'User', status: 'Found' | 'Missing'}> {
  return [
    { title: 'CEO', role: 'Economic' as const, status: 'Missing' as const },
    { title: 'CTO', role: 'Champion' as const, status: 'Missing' as const },
    { title: 'VP Engineering', role: 'User' as const, status: 'Missing' as const }
  ]
}

function getCompanySize(employees: number): string {
  if (employees < 10) return '1-10'
  if (employees < 50) return '11-50'
  if (employees < 200) return '51-200'
  if (employees < 500) return '201-500'
  if (employees < 1000) return '501-1000'
  if (employees < 5000) return '1001-5000'
  return '5000+'
}
