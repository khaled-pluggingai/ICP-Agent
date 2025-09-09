"use client"

import { useState, useEffect } from "react"
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
import { useICPData, type ICPModel } from "@/hooks/useICPData"

export function ICPTrainer() {
  const { toast } = useToast()
  const { saveICPData, getLatestICPData, icpData, loading, error, convertFromDatabaseFormat } = useICPData()
  const [activeTab, setActiveTab] = useState("form")
  const [selectedModelId, setSelectedModelId] = useState<number | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [model, setModel] = useState<ICPModel>({
    companyProfile: {
      industries: [],
      geos: [],
      employeeRange: [1, 10],
      acvRange: [1000, 10000]
    },
    mustHaves: {
      tech: [],
      compliance: [],
      motion: "PLG"
    },
    disqualifiers: {
      industries: [],
      geos: [],
      tech: [],
      sizeCaps: [1, 10]
    },
    buyingTriggers: [],
    personas: [],
    weights: {
      firmographic: 5,
      technographic: 5,
      intent: 5,
      behavioral: 5
    }
  })


  // Load latest ICP data only once on component mount
  useEffect(() => {
    if (!isInitialized) {
      const latestData = getLatestICPData()
      if (latestData) {
        setModel(latestData)
      }
      setIsInitialized(true)
    }
  }, [getLatestICPData, isInitialized])

  // Handle model selection from dropdown
  const handleModelSelection = (modelId: string) => {
    const id = parseInt(modelId)
    setSelectedModelId(id)
    const selectedData = icpData.find(data => data.id === id)
    if (selectedData) {
      const convertedModel = convertFromDatabaseFormat(selectedData)
      setModel(convertedModel)
    }
  }

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


  const validateRequiredFields = () => {
    const errors: string[] = []
    
    if (model.companyProfile.industries.length === 0) {
      errors.push("Industries is required")
    }
    
    if (model.companyProfile.geos.length === 0) {
      errors.push("Geographies is required")
    }
    
    if (model.mustHaves.tech.length === 0) {
      errors.push("Technology Stack is required")
    }
    
    if (model.mustHaves.compliance.length === 0) {
      errors.push("Compliance Requirements is required")
    }
    
    if (!model.mustHaves.motion) {
      errors.push("Sales Motion is required")
    }
    
    return errors
  }

  const handleSaveModel = async () => {
    const validationErrors = validateRequiredFields()
    
    if (validationErrors.length > 0) {
      toast({
        title: "Validation Error",
        description: `Please fill in the following required fields: ${validationErrors.join(", ")}`,
        variant: "destructive",
      })
      return
    }
    
    try {
      await saveICPData(model)
      toast({
        title: "Model Saved",
        description: "ICP Model saved successfully to Supabase",
      })
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save ICP Model",
        variant: "destructive",
      })
    }
  }



  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
        <CardTitle className="text-xl font-bold text-foreground">ICP Trainer</CardTitle>
            {icpData.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {icpData.length} saved model{icpData.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {icpData.length > 0 && (
            <div className="flex items-center gap-2">
              <Label htmlFor="model-select" className="text-sm text-muted-foreground">
                Load Saved Model:
              </Label>
              <Select value={selectedModelId?.toString() || ""} onValueChange={handleModelSelection}>
                <SelectTrigger id="model-select" className="w-48">
                  <SelectValue placeholder="Select a model..." />
                </SelectTrigger>
                <SelectContent>
                  {icpData.map((data) => (
                    <SelectItem key={data.id} value={data.id.toString()}>
                      Model #{data.id} - {data.created_at ? new Date(data.created_at).toLocaleDateString() : 'Unknown date'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-muted/30">
            <TabsTrigger value="form">Model Configuration</TabsTrigger>
            <TabsTrigger value="json">Live JSON Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-8">
            {/* Instructions */}
            <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <span className="text-white text-xs font-bold">i</span>
                </div>
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">How to use the ICP Trainer</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Fill out the form below to define your Ideal Customer Profile. Use the chip inputs to add multiple values, 
                    select from dropdowns for ranges, and check boxes for buying triggers. Fields marked with * are required. 
                    Click "SAVE TO SUPABASE" to persist your configuration.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Company Profile */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-foreground">Company Profile</h3>
                </div>
                
                <ChipInput
                  label="Industries *"
                  placeholder="Add industry..."
                  values={model.companyProfile.industries}
                  onChange={(values) => handleChipChange("companyProfile", "industries", values)}
                />
                
                <ChipInput
                  label="Geographies *"
                  placeholder="Add geography..."
                  values={model.companyProfile.geos}
                  onChange={(values) => handleChipChange("companyProfile", "geos", values)}
                />

                <div className="space-y-2">
                  <Label>Employee Range *</Label>
                  <Select
                    value={model.companyProfile.employeeRange.join('-')}
                    onValueChange={(value) => {
                      const [min, max] = value.split('-').map(Number)
                      setModel(prev => ({
                        ...prev,
                        companyProfile: { 
                          ...prev.companyProfile, 
                          employeeRange: [min, max] as [number, number] 
                        }
                      }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employee range..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1–10 employees</SelectItem>
                      <SelectItem value="11-50">11–50 employees</SelectItem>
                      <SelectItem value="51-200">51–200 employees</SelectItem>
                      <SelectItem value="201-500">201–500 employees</SelectItem>
                      <SelectItem value="500-10000">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>ACV Range ($) *</Label>
                  <Select
                    value={model.companyProfile.acvRange.join('-')}
                    onValueChange={(value) => {
                      const [min, max] = value.split('-').map(Number)
                      setModel(prev => ({
                        ...prev,
                        companyProfile: { 
                          ...prev.companyProfile, 
                          acvRange: [min, max] as [number, number] 
                        }
                      }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select ACV range..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1000-10000">$1k–$10k</SelectItem>
                      <SelectItem value="10000-50000">$10k–$50k</SelectItem>
                      <SelectItem value="50000-100000">$50k–$100k</SelectItem>
                      <SelectItem value="100000-500000">$100k–$500k</SelectItem>
                      <SelectItem value="500000-1000000">$500k+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Must-Haves & Disqualifiers */}
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-foreground">Must-Haves</h3>
                </div>
                
                <ChipInput
                  label="Technology Stack *"
                  placeholder="Add technology..."
                  values={model.mustHaves.tech}
                  onChange={(values) => handleChipChange("mustHaves", "tech", values)}
                />

                <ChipInput
                  label="Compliance Requirements *"
                  placeholder="Add compliance..."
                  values={model.mustHaves.compliance}
                  onChange={(values) => handleChipChange("mustHaves", "compliance", values)}
                />

                <div className="space-y-2">
                  <Label>Sales Motion *</Label>
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

                <div className="flex items-center gap-2 pt-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <h3 className="text-lg font-semibold text-foreground">Disqualifiers</h3>
                </div>
                
                <ChipInput
                  label="Excluded Industries"
                  placeholder="Add excluded industry..."
                  values={model.disqualifiers.industries}
                  onChange={(values) => handleChipChange("disqualifiers", "industries", values)}
                />

                <ChipInput
                  label="Excluded Geographies"
                  placeholder="Add excluded geography..."
                  values={model.disqualifiers.geos}
                  onChange={(values) => handleChipChange("disqualifiers", "geos", values)}
                />

                <ChipInput
                  label="Excluded Technologies"
                  placeholder="Add excluded technology..."
                  values={model.disqualifiers.tech}
                  onChange={(values) => handleChipChange("disqualifiers", "tech", values)}
                />

                <div className="space-y-2">
                  <Label>Excluded Size Range</Label>
                  <Select
                    value={model.disqualifiers.sizeCaps.join('-')}
                    onValueChange={(value) => {
                      const [min, max] = value.split('-').map(Number)
                      setModel(prev => ({
                        ...prev,
                        disqualifiers: { 
                          ...prev.disqualifiers, 
                          sizeCaps: [min, max] as [number, number] 
                        }
                      }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select excluded size range..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1–10 employees</SelectItem>
                      <SelectItem value="11-50">11–50 employees</SelectItem>
                      <SelectItem value="51-200">51–200 employees</SelectItem>
                      <SelectItem value="201-500">201–500 employees</SelectItem>
                      <SelectItem value="500-10000">500+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Buying Triggers & Personas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-foreground">Buying Triggers</h3>
                </div>
                <div className="space-y-3">
                  {["funding", "key hires", "tech change", "product launches"].map((trigger) => (
                    <div key={trigger} className="flex items-center space-x-3">
                      <Checkbox
                        id={`trigger-${trigger}`}
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
                      <Label 
                        htmlFor={`trigger-${trigger}`} 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer capitalize"
                      >
                        {trigger.replace('_', ' ')}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <h3 className="text-lg font-semibold text-foreground">Target Personas</h3>
                </div>
                <ChipInput
                  label="Decision Maker Titles"
                  placeholder="Add persona title..."
                  values={model.personas}
                  onChange={(values) => handleChipChange("personas", "", values)}
                />
              </div>
            </div>

            {/* Weights */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
              <h3 className="text-lg font-semibold text-foreground">Scoring Weights</h3>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(model.weights).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize text-sm font-medium">{key}</Label>
                    <div className="px-3">
                      <Slider
                        value={[value]}
                        onValueChange={(newValue) => {
                          if (newValue && newValue.length > 0) {
                            setModel(prev => ({
                          ...prev,
                          weights: { ...prev.weights, [key]: newValue[0] }
                            }))
                          }
                        }}
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
            <div className="flex flex-wrap gap-4 pt-8 border-t border-border/30">
              <HudButton
                style="style2"
                variant="secondary"
                onClick={() => {
                  setModel({
                    companyProfile: {
                      industries: [],
                      geos: [],
                      employeeRange: [1, 10],
                      acvRange: [1000, 10000]
                    },
                    mustHaves: {
                      tech: [],
                      compliance: [],
                      motion: "PLG"
                    },
                    disqualifiers: {
                      industries: [],
                      geos: [],
                      tech: [],
                      sizeCaps: [1, 10]
                    },
                    buyingTriggers: [],
                    personas: [],
                    weights: {
                      firmographic: 5,
                      technographic: 5,
                      intent: 5,
                      behavioral: 5
                    }
                  })
                  setSelectedModelId(null)
                  toast({
                    title: "Form Cleared",
                    description: "All fields have been reset to default values",
                  })
                }}
                disabled={loading}
              >
                CLEAR FORM
              </HudButton>
              <HudButton
                style="style2"
                variant="primary"
                onClick={handleSaveModel}
                disabled={loading}
              >
                {loading ? "SAVING..." : "SAVE TO SUPABASE"}
              </HudButton>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-sm text-destructive">Error: {error}</p>
                </div>
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