import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { QualifiedAccount } from "@/lib/icp-mocks"

export function useExplorium() {
  const [accounts, setAccounts] = useState<QualifiedAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchExplorium() {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('explorium')
          .select('*')

        if (error) {
          console.error('Supabase query error:', error)
          throw error
        }

        // Debug logging to check what data is being fetched
        console.log('Supabase explorium data:', data)
        console.log('Sample item:', data?.[0])
        console.log('Available columns in first item:', data?.[0] ? Object.keys(data[0]) : 'No data')

        // Map explorium data to QualifiedAccount format
        const mappedAccounts: QualifiedAccount[] = (data || []).map((item) => ({
          id: item.business_id,
          name: item.name || "Unknown Company",
          domain: item.domain || item.website || "unknown.com",
          description: item.business_description || item.company_description || "",
          logoUrl: item.logo,
          tier: calculateTier(item.score), // Use score to determine tier
          industry: item.industry || "Other",
          geo: [item.region, item.country_name].filter(Boolean).join(", ") || "Unknown",
          employees: parseEmployeeCount(item.number_of_employees_range || item.company_size),
          tech_stack: [], // Not available in explorium table
          fit_score: Math.min(100, Math.max(0, item.score || 0)), // Ensure 0-100 range
          intent_score: (item as any).intent_score ?? (item as any)['Intent Score'] ?? Math.floor(Math.random() * 40) + 60, // Try different column names for Intent Score
          intent_delta_14d: Math.floor(Math.random() * 41) - 20, // Random -20 to +20
          last_activity_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          rules_match: {
            firmographic: getRandomMatch(),
            technographic: getRandomMatch(),
            intent: getRandomMatch(),
            behavioral: getRandomMatch(),
          },
          enrichment: {
            summary_bullets: [
              item.business_description || item.company_description || "Company information not available",
              `Founded in ${item.founded_year || "unknown year"}`,
              `Industry: ${item.industry || "Not specified"}`,
              item.main_products_services ? `Services: ${item.main_products_services}` : "Services not specified"
            ].filter(Boolean),
            icp_reasons: ["Imported from Explorium"],
            risks: [],
            signals: [],
            references: [
              ...(item.website ? [{ source: "Website" as const, url: item.website }] : []),
              ...(item["linkedin-url"] ? [{ source: "LinkedIn" as const, url: item["linkedin-url"] }] : [])
            ],
            committee: []
          }
        }))

        // Filter out companies with fit_score = 0 (strictly greater than zero required)
        const filteredAccounts = mappedAccounts.filter(account => account.fit_score > 0)

        // Debug logging to check mapped accounts
        console.log('Mapped accounts sample:', filteredAccounts.slice(0, 2))
        console.log('Intent scores in mapped accounts:', filteredAccounts.map(acc => ({ name: acc.name, intent_score: acc.intent_score })).slice(0, 5))

        setAccounts(filteredAccounts)
        setError(null)
      } catch (err) {
        console.error('Error fetching explorium data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchExplorium()
  }, [])

  return { accounts, loading, error }
}

// Helper functions
function calculateTier(score?: number): 'A' | 'B' | 'C' {
  if (!score) return 'C'
  if (score >= 80) return 'A'
  if (score >= 60) return 'B'
  return 'C'
}

function parseEmployeeCount(range?: string): number {
  if (!range) return 0
  
  // Extract numbers from ranges like "10-50", "100+", "1-10 employees"
  const numbers = range.match(/\d+/g)
  if (!numbers) return 0
  
  if (numbers.length === 1) {
    return parseInt(numbers[0])
  } else if (numbers.length >= 2) {
    // Take the average of the range
    return Math.floor((parseInt(numbers[0]) + parseInt(numbers[1])) / 2)
  }
  
  return 0
}

function getRandomMatch(): 'Match' | 'Partial' | 'Miss' {
  const options: ('Match' | 'Partial' | 'Miss')[] = ['Match', 'Partial', 'Miss']
  return options[Math.floor(Math.random() * options.length)]
}