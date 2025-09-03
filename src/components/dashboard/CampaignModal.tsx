"use client"

import { useState } from "react"
import { HudButton } from "@/components/ui/hud-button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Rocket, Mail, Linkedin, Monitor } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { GlowingEffect } from "@/components/ui/glowing-effect"

const CAMPAIGN_MODES = [
  { id: "m-1to1", value: "one_to_one", label: "1:1 ABM" },
  { id: "m-1tofew", value: "one_to_few", label: "1:Few ABM" },
  { id: "m-1tomany", value: "one_to_many", label: "1:Many Outbound" },
]

const segments = [
  { id: "1", name: "Enterprise SaaS", accounts: 1247 },
  { id: "2", name: "High-Intent Startups", accounts: 892 },
  { id: "3", name: "E-commerce Mid-Market", accounts: 634 },
  { id: "4", name: "Tech Adopters", accounts: 423 }
]

const playbooks = [
  { id: "1", name: "Product Demo Outreach", description: "Personalized demo invitations" },
  { id: "2", name: "Value-Based Messaging", description: "ROI-focused communication" },
  { id: "3", name: "Competitive Displacement", description: "Switch from competitor messaging" }
]

const sampleAccounts = [
  { id: "1", name: "TechCorp Inc", score: 92, tier: "A" },
  { id: "2", name: "StartupXYZ", score: 78, tier: "B" },
  { id: "3", name: "Enterprise Ltd", score: 65, tier: "C" },
  { id: "4", name: "Innovation Co", score: 88, tier: "A" },
  { id: "5", name: "DataCorp", score: 71, tier: "B" }
]

export function CampaignModal() {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [campaignData, setCampaignData] = useState({
    mode: "one_to_one",
    target: "segment",
    selectedSegment: "",
    selectedAccounts: [] as string[],
    playbook: "",
    channels: {
      email: true,
      linkedin: false,
      ads: false
    }
  })

  const handleLaunch = () => {
    const jobId = Math.random().toString(36).substr(2, 9).toUpperCase()
    
    toast({
      title: "Campaign Launched! 🚀",
      description: `Campaign launched successfully. Job ID: ${jobId}`,
    })
    
    setIsOpen(false)
    setCampaignData({
      mode: "one_to_one",
      target: "segment", 
      selectedSegment: "",
      selectedAccounts: [],
      playbook: "",
      channels: { email: true, linkedin: false, ads: false }
    })
  }

  const handleAccountToggle = (accountId: string) => {
    setCampaignData(prev => ({
      ...prev,
      selectedAccounts: prev.selectedAccounts.includes(accountId)
        ? prev.selectedAccounts.filter(id => id !== accountId)
        : [...prev.selectedAccounts, accountId]
    }))
  }

  const getTargetCount = () => {
    if (campaignData.target === "segment" && campaignData.selectedSegment) {
      const segment = segments.find(s => s.id === campaignData.selectedSegment)
      return segment?.accounts || 0
    }
    return campaignData.selectedAccounts.length
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <HudButton style="style2" variant="primary">
          Run campaign
        </HudButton>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl bg-popover/95 backdrop-blur-sm border-border/50 max-h-[90vh] overflow-y-auto">
        <div className="relative rounded-2xl border border-border bg-background p-6 md:p-8">
          <GlowingEffect
            spread={40}
            glow
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
            borderWidth={2}
          />
          <DialogHeader className="relative z-10">
            <DialogTitle className="text-xl font-bold">Launch Campaign</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 relative z-10">
          {/* Campaign Mode */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Campaign Mode</Label>
            <RadioGroup
              value={campaignData.mode}
              onValueChange={(value) => setCampaignData(prev => ({ ...prev, mode: value }))}
              className="grid grid-cols-3 gap-4"
            >
              {CAMPAIGN_MODES.map((mode) => (
                <div key={mode.id} className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value={mode.value} 
                    id={mode.id}
                    className="data-[state=checked]:bg-emerald-500/10 data-[state=checked]:text-emerald-300 data-[state=checked]:border-emerald-500/30"
                  />
                  <Label htmlFor={mode.id} className="cursor-pointer">{mode.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Target Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Target Selection</Label>
            <RadioGroup
              value={campaignData.target}
              onValueChange={(value) => setCampaignData(prev => ({ ...prev, target: value }))}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="segment" 
                  id="target-segment"
                  className="data-[state=checked]:bg-emerald-500/10 data-[state=checked]:text-emerald-300 data-[state=checked]:border-emerald-500/30"
                />
                <Label htmlFor="target-segment" className="cursor-pointer">Choose Segment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem 
                  value="accounts" 
                  id="target-accounts"
                  className="data-[state=checked]:bg-emerald-500/10 data-[state=checked]:text-emerald-300 data-[state=checked]:border-emerald-500/30"
                />
                <Label htmlFor="target-accounts" className="cursor-pointer">Select Individual Accounts</Label>
              </div>
            </RadioGroup>

            {campaignData.target === "segment" && (
              <Select
                value={campaignData.selectedSegment}
                onValueChange={(value) => setCampaignData(prev => ({ ...prev, selectedSegment: value }))}
              >
                <SelectTrigger className="mt-2 focus:ring-emerald-500 ring-1 ring-emerald-500/60">
                  <SelectValue placeholder="Select a segment..." />
                </SelectTrigger>
                <SelectContent>
                  {segments.map(segment => (
                    <SelectItem key={segment.id} value={segment.id}>
                      {segment.name} ({segment.accounts.toLocaleString()} accounts)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {campaignData.target === "accounts" && (
              <Card className="mt-2 bg-muted/20 border-border/50">
                <CardContent className="p-4">
                  <Label className="text-sm font-medium mb-3 block">Select Accounts</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {sampleAccounts.map(account => (
                      <div key={account.id} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={campaignData.selectedAccounts.includes(account.id)}
                            onCheckedChange={() => handleAccountToggle(account.id)}
                            className="data-[state=checked]:bg-emerald-500/10 data-[state=checked]:text-emerald-300 data-[state=checked]:border-emerald-500/30"
                          />
                          <span className="text-sm text-foreground">{account.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-muted-foreground">{account.score}%</span>
                          <Badge variant="outline" className="text-xs">
                            Tier {account.tier}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Playbook Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Playbook</Label>
            <Select
              value={campaignData.playbook}
              onValueChange={(value) => setCampaignData(prev => ({ ...prev, playbook: value }))}
            >
              <SelectTrigger className="focus:ring-emerald-500 ring-1 ring-emerald-500/60">
                <SelectValue placeholder="Select a playbook..." />
              </SelectTrigger>
              <SelectContent>
                {playbooks.map(playbook => (
                  <SelectItem key={playbook.id} value={playbook.id}>
                    <div>
                      <div className="font-medium">{playbook.name}</div>
                      <div className="text-xs text-muted-foreground">{playbook.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Channels */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Channels</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:border-emerald-500/30 transition-colors data-[state=on]:bg-emerald-500/15 data-[state=on]:text-emerald-300">
                <Checkbox
                  checked={campaignData.channels.email}
                  onCheckedChange={(checked) => 
                    setCampaignData(prev => ({
                      ...prev,
                      channels: { ...prev.channels, email: !!checked }
                    }))
                  }
                  className="data-[state=checked]:bg-emerald-500/10 data-[state=checked]:text-emerald-300 data-[state=checked]:border-emerald-500/30"
                />
                <Mail className="w-4 h-4 text-muted-foreground" />
                <Label className="cursor-pointer">Email</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:border-emerald-500/30 transition-colors data-[state=on]:bg-emerald-500/15 data-[state=on]:text-emerald-300">
                <Checkbox
                  checked={campaignData.channels.linkedin}
                  onCheckedChange={(checked) => 
                    setCampaignData(prev => ({
                      ...prev,
                      channels: { ...prev.channels, linkedin: !!checked }
                    }))
                  }
                  className="data-[state=checked]:bg-emerald-500/10 data-[state=checked]:text-emerald-300 data-[state=checked]:border-emerald-500/30"
                />
                <Linkedin className="w-4 h-4 text-muted-foreground" />
                <Label className="cursor-pointer">LinkedIn</Label>
              </div>
              <div className="flex items-center space-x-2 p-3 rounded-lg border border-border/50 hover:border-emerald-500/30 transition-colors data-[state=on]:bg-emerald-500/15 data-[state=on]:text-emerald-300">
                <Checkbox
                  checked={campaignData.channels.ads}
                  onCheckedChange={(checked) => 
                    setCampaignData(prev => ({
                      ...prev,
                      channels: { ...prev.channels, ads: !!checked }
                    }))
                  }
                  className="data-[state=checked]:bg-emerald-500/10 data-[state=checked]:text-emerald-300 data-[state=checked]:border-emerald-500/30"
                />
                <Monitor className="w-4 h-4 text-muted-foreground" />
                <Label className="cursor-pointer">Ads</Label>
              </div>
            </div>
          </div>

          {/* Campaign Summary */}
          {getTargetCount() > 0 && (
            <Card className="bg-emerald-500/5 border-emerald-700/30">
              <CardContent className="p-4">
                <div className="text-sm space-y-1">
                  <div className="font-medium text-foreground">Campaign Summary</div>
                  <div className="text-muted-foreground">
                    Mode: <span className="text-foreground">{CAMPAIGN_MODES.find(m => m.value === campaignData.mode)?.label || campaignData.mode}</span>
                  </div>
                  <div className="text-muted-foreground">
                    Targets: <span className="text-foreground">{getTargetCount().toLocaleString()} accounts</span>
                  </div>
                  <div className="text-muted-foreground">
                    Channels: <span className="text-foreground">
                      {Object.entries(campaignData.channels)
                        .filter(([_, enabled]) => enabled)
                        .map(([channel]) => channel.charAt(0).toUpperCase() + channel.slice(1))
                        .join(', ')
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-border/50">
            <Button 
              variant="outline" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold shadow-lg shadow-emerald-500/20"
              onClick={handleLaunch}
            >
              <Rocket className="w-4 h-4 mr-2" />
              Launch
            </Button>
          </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}