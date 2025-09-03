"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { HudButton } from "@/components/ui/hud-button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChipInput } from "@/components/ui/chip-input"
import { useToast } from "@/hooks/use-toast"

interface ICPModel {
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

const sampleAccounts = [
  { name: "TechCorp Inc", fit_score: 92, tier: "A" },
  { name: "StartupXYZ", fit_score: 78, tier: "B" },
  { name: "Enterprise Ltd", fit_score: 65, tier: "C" },
  { name: "Innovation Co", fit_score: 88, tier: "A" },
  { name: "DataCorp", fit_score: 71, tier: "B" },
]

export function ICPTrainer() {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("form")
  const [model, setModel] = useState<ICPModel>({
    companyProfile: {
      industries: ["SaaS", "E-commerce"],
      geos: ["North America", "Europe"],
      employeeRange: [100, 1000],
      acvRange: [50000, 500000]
    },
    mustHaves: {
      tech: ["Salesforce", "HubSpot"],
      compliance: ["SOC2", "GDPR"],
      motion: "PLG"
    },
    disqualifiers: {
      industries: ["Government"],
      geos: ["Restricted Markets"],
      tech: ["Legacy CRM"],
      sizeCaps: [0, 50]
    },
    buyingTriggers: ["funding", "key hires", "tech change"],
    personas: ["CMO", "VP Sales", "RevOps"],
    weights: {
      firmographic: 8,
      technographic: 7,
      intent: 9,
      behavioral: 6
    }
  })

  const [previewData, setPreviewData] = useState<typeof sampleAccounts | null>(null)

  const handleChipChange = (category: keyof ICPModel, field: string, values: string[]) => {
    if (category === "personas") {
      setModel(prev => ({
        ...prev,
        personas: values
      }))
    } else {
      setModel(prev => ({
        ...prev,
        [category]: {
          ...prev[category as keyof ICPModel],
          [field]: values
        }
      }))
    }
  }

  const handlePreviewScoring = () => {
    // Mock scoring logic
    const scoredAccounts = sampleAccounts.map(account => ({
      ...account,
      fit_score: Math.floor(Math.random() * 40) + 60, // 60-100 range
      tier: Math.random() > 0.6 ? "A" : Math.random() > 0.3 ? "B" : "C"
    }))
    setPreviewData(scoredAccounts)
    toast({
      title: "Scoring Complete",
      description: "Mock scoring applied to sample accounts",
    })
  }

  const handleSaveModel = () => {
    toast({
      title: "Model Saved",
      description: "ICP Model v1.2 saved successfully",
    })
  }

  const handleSetActive = () => {
    toast({
      title: "Active ICP Updated",
      description: "Model is now the active ICP configuration",
    })
  }


  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">ICP Trainer</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30">
            <TabsTrigger value="form">Model Configuration</TabsTrigger>
            <TabsTrigger value="json">Live JSON Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Company Profile */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Company Profile</h3>
                
                <ChipInput
                  label="Industries"
                  placeholder="Add industry..."
                  values={model.companyProfile.industries}
                  onChange={(values) => handleChipChange("companyProfile", "industries", values)}
                />
                
                <ChipInput
                  label="Geographies"
                  placeholder="Add geography..."
                  values={model.companyProfile.geos}
                  onChange={(values) => handleChipChange("companyProfile", "geos", values)}
                />

                <div className="space-y-2">
                  <Label>Employee Range</Label>
                  <div className="px-3">
                    <Slider
                      value={model.companyProfile.employeeRange}
                      onValueChange={(value) => setModel(prev => ({
                        ...prev,
                        companyProfile: { ...prev.companyProfile, employeeRange: value as [number, number] }
                      }))}
                      max={10000}
                      min={1}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>{model.companyProfile.employeeRange[0]}</span>
                      <span>{model.companyProfile.employeeRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>ACV Range ($)</Label>
                  <div className="px-3">
                    <Slider
                      value={model.companyProfile.acvRange}
                      onValueChange={(value) => setModel(prev => ({
                        ...prev,
                        companyProfile: { ...prev.companyProfile, acvRange: value as [number, number] }
                      }))}
                      max={1000000}
                      min={1000}
                      step={10000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>${model.companyProfile.acvRange[0].toLocaleString()}</span>
                      <span>${model.companyProfile.acvRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Must-Haves & Disqualifiers */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Must-Haves</h3>
                
                <ChipInput
                  label="Technology Stack"
                  placeholder="Add technology..."
                  values={model.mustHaves.tech}
                  onChange={(values) => handleChipChange("mustHaves", "tech", values)}
                />

                <ChipInput
                  label="Compliance Requirements"
                  placeholder="Add compliance..."
                  values={model.mustHaves.compliance}
                  onChange={(values) => handleChipChange("mustHaves", "compliance", values)}
                />

                <div className="space-y-2">
                  <Label>Sales Motion</Label>
                  <Select
                    value={model.mustHaves.motion}
                    onValueChange={(value) => setModel(prev => ({
                      ...prev,
                      mustHaves: { ...prev.mustHaves, motion: value }
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PLG">Product-Led Growth</SelectItem>
                      <SelectItem value="SLG">Sales-Led Growth</SelectItem>
                      <SelectItem value="ABM">Account-Based Marketing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <h3 className="text-lg font-semibold text-foreground pt-4">Disqualifiers</h3>
                <ChipInput
                  label="Excluded Industries"
                  placeholder="Add excluded industry..."
                  values={model.disqualifiers.industries}
                  onChange={(values) => handleChipChange("disqualifiers", "industries", values)}
                />
              </div>
            </div>

            {/* Buying Triggers & Personas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Buying Triggers</h3>
                <div className="space-y-2">
                  {["funding", "key hires", "tech change", "product launches"].map((trigger) => (
                    <div key={trigger} className="flex items-center space-x-2">
                      <Checkbox
                        checked={model.buyingTriggers.includes(trigger)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setModel(prev => ({
                              ...prev,
                              buyingTriggers: [...prev.buyingTriggers, trigger]
                            }))
                          } else {
                            setModel(prev => ({
                              ...prev,
                              buyingTriggers: prev.buyingTriggers.filter(t => t !== trigger)
                            }))
                          }
                        }}
                      />
                      <Label className="capitalize">{trigger.replace('_', ' ')}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">Target Personas</h3>
                <ChipInput
                  label="Decision Maker Titles"
                  placeholder="Add persona title..."
                  values={model.personas}
                  onChange={(values) => handleChipChange("personas", "", values)}
                />
              </div>
            </div>

            {/* Weights */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Scoring Weights</h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(model.weights).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">{key}</Label>
                    <div className="px-3">
                      <Slider
                        value={[value]}
                        onValueChange={(newValue) => setModel(prev => ({
                          ...prev,
                          weights: { ...prev.weights, [key]: newValue[0] }
                        }))}
                        max={10}
                        min={0}
                        step={1}
                        className="w-full"
                      />
                      <div className="text-center text-sm text-muted-foreground mt-1">
                        {value}/10
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-6">
              <HudButton
                style="style2"
                variant="primary"
                onClick={handlePreviewScoring}
              >
                PREVIEW SCORING
              </HudButton>
              <HudButton
                style="style2"
                variant="secondary"
                onClick={handleSaveModel}
              >
                SAVE AS V1.X
              </HudButton>
              <HudButton
                style="style2"
                variant="primary"
                onClick={handleSetActive}
              >
                SET ACTIVE
              </HudButton>
            </div>

            {/* Preview Results */}
            {previewData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <h3 className="text-lg font-semibold text-foreground mb-4">Scoring Preview</h3>
                <div className="bg-muted/20 rounded-lg border border-border/50 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/30">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Account</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Fit Score</th>
                        <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.map((account, index) => (
                        <tr key={index} className="border-t border-border/30">
                          <td className="p-4 text-sm text-foreground">{account.name}</td>
                          <td className="p-4 text-sm text-foreground">{account.fit_score}%</td>
                          <td className="p-4">
                            <Badge variant={
                              account.tier === "A" ? "default" : 
                              account.tier === "B" ? "secondary" : 
                              "outline"
                            }>
                              Tier {account.tier}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </TabsContent>

          <TabsContent value="json">
            <div className="bg-muted/20 rounded-lg border border-border/50 p-4">
              <pre className="text-sm text-foreground overflow-auto max-h-96">
                {JSON.stringify(model, null, 2)}
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}