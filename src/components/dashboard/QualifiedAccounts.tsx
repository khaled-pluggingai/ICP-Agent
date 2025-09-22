import React, { useState, useMemo, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  ExternalLink, 
  TrendingUp, 
  TrendingDown,
  Building2,
  Download,
  Grid3X3,
  List,
  Eye,
  Users,
  Play,
  Target,
  Loader2,
  Zap,
  CheckCircle,
  AlertCircle,
  Trash2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { QualifiedAccount } from "@/lib/icp-mocks"
import { SummaryEnrichmentPopup } from "./SummaryEnrichmentPopup"
import { supabase } from "@/integrations/supabase/client"
import { useProspects } from "@/hooks/useProspects"
import { useExaCompanies } from "@/hooks/useExaCompanies"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

type ViewMode = 'comfortable' | 'compact'

const tierColors = {
  'A': 'bg-green-500/20 text-green-300 border-green-500/30',
  'B': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30', 
  'C': 'bg-orange-500/20 text-orange-300 border-orange-500/30'
}

const matchColors = {
  'Match': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Partial': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Miss': 'bg-red-500/20 text-red-300 border-red-500/30'
}

export function QualifiedAccounts() {
  const { accounts, loading, error, refreshAccounts } = useExaCompanies();
  const { prospects, loading: prospectsLoading, error: prospectsError, fetchProspectsByExaId } = useProspects();
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [industryFilter, setIndustryFilter] = useState<string>("all");
  const [minFitScore, setMinFitScore] = useState<number>(10); // Default to 10 as per new schema
  const [minIntentScore, setMinIntentScore] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('comfortable');
  const [selectedAccount, setSelectedAccount] = useState<QualifiedAccount | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isActivating, setIsActivating] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(true); // Keep dropdown open by default
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<QualifiedAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredAccounts = useMemo(() => {
    const filtered = accounts.filter(account => {
      const matchesSearch = searchQuery === "" || 
        account.properties?.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.domain?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTier = tierFilter === "all" || account.tier === tierFilter;
      const matchesIndustry = industryFilter === "all" || account.properties?.company?.industry === industryFilter;
      const matchesFitScore = account.fit_score >= minFitScore;
      const matchesIntentScore = account.intent_score >= minIntentScore;
      
      return matchesSearch && matchesTier && matchesIndustry && matchesFitScore && matchesIntentScore;
    });
    
    console.log('Filtering accounts:', {
      totalAccounts: accounts.length,
      filteredCount: filtered.length,
      filters: { searchQuery, tierFilter, industryFilter, minFitScore, minIntentScore }
    });
    
    return filtered;
  }, [accounts, searchQuery, tierFilter, industryFilter, minFitScore, minIntentScore]);

  const handleViewSummary = (account: QualifiedAccount) => {
    setSelectedAccount(account)
    // Fetch decision makers data for the integrated modal
    // Prefer explicit business_id if present; fallback to account.id
    const businessId = (account as any).business_id ?? account.id
    console.log('QualifiedAccounts: fetching decision makers for business_id:', businessId, account)
    fetchProspectsByExaId(String(businessId))
  }

  const handleExportCSV = () => {
    if (filteredAccounts.length === 0) {
      alert('No accounts to export')
      return
    }

    // Create CSV headers
    const headers = [
      'Business ID',
      'Company Name',
      'Domain',
      'Industry',
      'Location',
      'Employees',
      'Tier',
      'Fit Score',
      'Intent Score',
      'Intent Delta (14d)',
      'Description',
      'CEO/Founder',
      'Contact Email',
      'Phone Number',
      'Address',
      'Mission/Vision',
      'NAICS Code',
      'NAICS Description',
      'SIC Code',
      'SIC Description',
      'Revenue Range',
      'Founded Year',
      'Products/Services',
      'LinkedIn URL',
      'Website'
    ]

    // Create CSV rows
    const csvRows = filteredAccounts.map(account => [
      account.id,
      account.name,
      account.domain,
      account.industry,
      account.geo,
      account.employees,
      account.tier,
      account.fit_score,
      account.intent_score,
      account.intent_delta_14d,
      account.description,
      account.rawData?.ceo_founder || '',
      account.rawData?.contact_email || '',
      account.rawData?.phone_number || '',
      account.rawData?.physical_address || '',
      account.rawData?.mission_vision || '',
      account.rawData?.naics || '',
      account.rawData?.naics_description || '',
      account.rawData?.sic_code || '',
      account.rawData?.sic_code_description || '',
      account.rawData?.yearly_revenue_range || '',
      account.rawData?.founded_year || '',
      account.rawData?.main_products_services || '',
      account.rawData?.['linkedin-url'] || '',
      account.rawData?.website || ''
    ])

    // Escape CSV values (handle commas, quotes, newlines)
    const escapeCSV = (value: any) => {
      if (value === null || value === undefined) return ''
      const stringValue = String(value)
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`
      }
      return stringValue
    }

    // Combine headers and rows
    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...csvRows.map(row => row.map(escapeCSV).join(','))
    ].join('\n')

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `qualified-accounts-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }


  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays}d ago`
    }
  }

  const industries = Array.from(new Set(accounts.map(a => a.properties?.company?.industry).filter(Boolean)))

  // Auto-dismiss messages after 5 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [successMessage])

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(""), 5000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const handleActivate = async () => {
    try {
      setIsActivating(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Fetch the latest webhook URL from the integrations table
      const { data: integrations, error: integrationsError } = await supabase
        .from('integrations' as any)
        .select('clay_webhook')
        .order('created_date', { ascending: false })
        .limit(1);

      if (integrationsError) {
        throw new Error(`Failed to fetch webhook URL: ${integrationsError.message}`);
      }

      if (!integrations || integrations.length === 0) {
        throw new Error("No webhook URL found. Please add an integration first.");
      }

      const latestWebhookUrl = (integrations as any)[0].clay_webhook;

      // Prepare the payload with companies data and webhook URL
      const payload = {
        companies: filteredAccounts,
        clay_webhook: latestWebhookUrl
      };

      // Send to n8n webhook via proxy
      const response = await fetch("http://localhost:3001/api/activate-companies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Failed to send data: ${response.statusText}`);
      }

      setSuccessMessage(`Successfully activated ${filteredAccounts.length} companies!`);
    } catch (error) {
      console.error("Error activating companies:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsActivating(false);
    }
  };

  const handleDeleteAccount = (account: QualifiedAccount) => {
    setAccountToDelete(account);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteAccount = async () => {
    if (!accountToDelete) return;

    try {
      setIsDeleting(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Delete from companies_enrichment table first (foreign key constraint)
      const { error: enrichmentError } = await supabase
        .from('companies_enrichment')
        .delete()
        .eq('exa_company_id', accountToDelete.id);

      if (enrichmentError) {
        throw new Error(`Failed to delete enrichment data: ${enrichmentError.message}`);
      }

      // Delete from exa_companies table
      const { error: companyError } = await supabase
        .from('exa_companies')
        .delete()
        .eq('id', accountToDelete.id);

      if (companyError) {
        throw new Error(`Failed to delete company: ${companyError.message}`);
      }

      // Refresh the accounts list to reflect the deletion
      await refreshAccounts();
      
      setSuccessMessage(`Successfully deleted ${accountToDelete.name}`);
      setDeleteDialogOpen(false);
      setAccountToDelete(null);
    } catch (error) {
      console.error("Error deleting account:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred.");
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDeleteAccount = () => {
    setDeleteDialogOpen(false);
    setAccountToDelete(null);
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-green-400" />
          <span className="text-muted-foreground">Loading accounts from Explorium...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-400 mb-2">Error loading accounts:</p>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Qualified Accounts
          </h2>
          <p className="text-muted-foreground">
            {filteredAccounts.length} accounts match your ICP criteria
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-lg shadow-emerald-500/20 gap-2"
            size="sm"
          >
            <Building2 className="w-4 h-4" />
            Create Account
          </Button>
          
          <Button variant="outline" size="sm" className="gap-2" onClick={handleExportCSV}>
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          
          <Button
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-lg shadow-emerald-500/20 gap-2"
            size="sm"
            onClick={handleActivate}
            disabled={isActivating || filteredAccounts.length === 0}
          >
            {isActivating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Activating...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                Activate
              </>
            )}
          </Button>

          <div className="flex items-center border rounded-lg p-1">
            <Button
              variant={viewMode === 'comfortable' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('comfortable')}
              className="px-3"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'compact' ? 'secondary' : 'ghost'}
              size="sm" 
              onClick={() => setViewMode('compact')}
              className="px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Success/Error Messages */}
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg"
        >
          <CheckCircle className="w-5 h-5 text-green-400" />
          <span className="text-green-400 font-medium">{successMessage}</span>
        </motion.div>
      )}

      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400 font-medium">{errorMessage}</span>
        </motion.div>
      )}

      {/* Filters & Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-card/50 backdrop-blur-sm border border-green-500/20 rounded-xl p-4 space-y-4"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search accounts by name or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-green-500/30"
              />
            </div>
          </div>
          
          <Select value={tierFilter} onValueChange={setTierFilter}>
            <SelectTrigger className="w-32 bg-background/50 border-green-500/30">
              <SelectValue placeholder="Tier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tiers</SelectItem>
              <SelectItem value="A">Tier A</SelectItem>
              <SelectItem value="B">Tier B</SelectItem>
              <SelectItem value="C">Tier C</SelectItem>
            </SelectContent>
          </Select>

          <Select value={industryFilter} onValueChange={setIndustryFilter}>
            <SelectTrigger className="w-40 bg-background/50 border-green-500/30">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Industries</SelectItem>
              {industries.map(industry => (
                <SelectItem key={industry} value={industry}>{industry}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Fit ≥</span>
            <Select value={minFitScore.toString()} onValueChange={(value) => setMinFitScore(Number(value))}>
              <SelectTrigger className="w-20 bg-background/50 border-green-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="70">70</SelectItem>
                <SelectItem value="80">80</SelectItem>
                <SelectItem value="90">90</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Intent ≥</span>
            <Select value={minIntentScore.toString()} onValueChange={(value) => setMinIntentScore(Number(value))}>
              <SelectTrigger className="w-20 bg-background/50 border-green-500/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="70">70</SelectItem>
                <SelectItem value="80">80</SelectItem>
                <SelectItem value="90">90</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Accounts Table */}
      <TooltipProvider>
        <Card className="bg-card/50 backdrop-blur-sm border-green-500/20">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-green-500/20">
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Account</th>
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Description</th>
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Domain</th>
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Tier</th>
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Fit Score</th>
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Intent Score</th>
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Rules Match</th>
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Last Activity</th>
                    <th className="text-left p-4 font-medium text-sm text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account, index) => (
                    <motion.tr
                      key={account.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-green-500/10 hover:bg-green-500/5 transition-colors"
                    >
                      {/* Account Name & Logo */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-green-400" />
                          </div>
                          <div>
                            <button
                              onClick={() => handleViewSummary(account)}
                              className="font-medium text-foreground hover:text-green-400 transition-colors text-left"
                              title="Click to view company details and decision makers"
                            >
                              {account.name}
                            </button>
                            <div className="text-xs text-muted-foreground">
                              {account.employees.toLocaleString()} employees • {account.geo}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="p-4">
                        <Tooltip>
                          <TooltipTrigger>
                            <div className="max-w-xs text-sm text-muted-foreground truncate">
                              {account.description}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-sm">
                            <p>{account.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </td>

                      {/* Domain */}
                      <td className="p-4">
                        <a
                          href={`https://${account.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 transition-colors"
                        >
                          {account.domain}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>

                      {/* Tier */}
                      <td className="p-4">
                        <Badge variant="outline" className={tierColors[account.tier]}>
                          Tier {account.tier}
                        </Badge>
                      </td>

                      {/* Fit Score */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium">{account.fit_score}</span>
                          </div>
                          <Progress value={account.fit_score} className="h-1.5 w-16" />
                        </div>
                      </td>

                      {/* Intent Score */}
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm">
                            <span className="font-medium">{account.intent_score}</span>
                            {account.intent_delta_14d > 0 ? (
                              <div className="flex items-center text-green-400">
                                <TrendingUp className="w-3 h-3" />
                                <span className="text-xs">+{account.intent_delta_14d}</span>
                              </div>
                            ) : account.intent_delta_14d < 0 ? (
                              <div className="flex items-center text-red-400">
                                <TrendingDown className="w-3 h-3" />
                                <span className="text-xs">{account.intent_delta_14d}</span>
                              </div>
                            ) : null}
                          </div>
                          <Progress value={account.intent_score} className="h-1.5 w-16" />
                        </div>
                      </td>

                      {/* Rules Match */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(account.rules_match).map(([rule, status]) => (
                            <Badge
                              key={rule}
                              variant="outline"
                              className={`text-xs ${matchColors[status]}`}
                            >
                              {rule.charAt(0).toUpperCase() + rule.slice(1)}
                            </Badge>
                          ))}
                        </div>
                      </td>

                      {/* Last Activity */}
                      <td className="p-4">
                        <span className="text-sm text-muted-foreground">
                          {formatTimeAgo(account.last_activity_at)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewSummary(account)}>
                              <Eye className="w-4 h-4 mr-2" />
                              View Summary
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewSummary(account)}>
                              <Users className="w-4 h-4 mr-2" />
                              View Decision Makers
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Target className="w-4 h-4 mr-2" />
                              Assign Playbook
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Play className="w-4 h-4 mr-2" />
                              Start 1:few
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteAccount(account)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </TooltipProvider>

      {/* Summary Enrichment Popup */}
      {selectedAccount && (
        <SummaryEnrichmentPopup
          account={selectedAccount}
          isOpen={!!selectedAccount}
          onClose={() => setSelectedAccount(null)}
          prospects={prospects}
          prospectsLoading={prospectsLoading}
          prospectsError={prospectsError}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              Delete Account
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete <strong>{accountToDelete?.name}</strong>? 
              This action cannot be undone and will permanently remove the account from both the database and UI.
            </p>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              <p className="text-sm text-red-400 font-medium">
                ⚠️ This will permanently delete:
              </p>
              <ul className="text-sm text-red-300 mt-1 ml-4 list-disc">
                <li>Company data from the database</li>
                <li>All enrichment data</li>
                <li>Account from the qualified accounts list</li>
              </ul>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={cancelDeleteAccount}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Account
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}