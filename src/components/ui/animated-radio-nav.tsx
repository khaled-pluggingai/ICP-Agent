"use client"

import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import clsx from "clsx"
import { CampaignModal } from "@/components/dashboard/CampaignModal"
import { HudButton } from "@/components/ui/hud-button"

export interface NavOption {
  id: string
  value: string // route path
  label: string
}

const NAV_OPTIONS: NavOption[] = [
  { id: "nav-qualified", value: "/dashboard/qualified-accounts", label: "Qualified Accounts" },
  { id: "nav-decision-makers", value: "/dashboard/decision-makers", label: "Decision Makers" },
  { id: "nav-company-events", value: "/dashboard/company-events", label: "Company Events" },
  { id: "nav-analytics", value: "/dashboard/analytics", label: "Analytics Overview" },
  { id: "nav-segments", value: "/dashboard/segments", label: "Segments" },
  { id: "nav-insights", value: "/dashboard/pipeline-insights", label: "Pipeline Insights" },
  { id: "nav-trainer", value: "/dashboard/icp-trainer", label: "ICP Trainer" },
  { id: "nav-automation", value: "/dashboard/automation-scheduler", label: "Automation Scheduler" },
  { id: "nav-monitor", value: "/dashboard/live-monitor", label: "Live Monitor" },
]

export default function AnimatedRadioNav() {
  const location = useLocation()
  const navigate = useNavigate()

  // derive selected from current route
  const initial = useMemo(() => {
    const match = NAV_OPTIONS.find(o => location.pathname?.startsWith(o.value))
    return match?.value ?? NAV_OPTIONS[0].value
  }, [location.pathname])

  const [selectedValue, setSelectedValue] = useState(initial)

  useEffect(() => {
    setSelectedValue(initial)
  }, [initial])

  const handleChange = (value: string) => {
    setSelectedValue(value)
    navigate(value)
  }


  return (
    <nav aria-label="ICP Agent Navigation" className="w-full">
      <div className="relative flex flex-col pl-3">
        {NAV_OPTIONS.map((option) => {
          const active = selectedValue === option.value
          return (
            <div key={option.id} className="relative z-20 py-1">
              <input
                id={option.id}
                name="icp-nav"
                type="radio"
                value={option.value}
                checked={active}
                onChange={(e) => handleChange(e.target.value)}
                className="absolute inset-0 m-0 opacity-0 cursor-pointer z-30 appearance-none"
                aria-label={option.label}
              />
              <label
                htmlFor={option.id}
                className={clsx(
                  "cursor-pointer text-sm py-2 px-3 block transition-all duration-300 ease-in-out select-none rounded-md relative",
                  active
                    ? "text-emerald-300 font-semibold bg-emerald-500/10 border-l-2 border-emerald-500"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-l-2 hover:border-emerald-500/50"
                )}
              >
                {option.label}
                {active && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-r-full" />
                )}
              </label>
            </div>
          )
        })}

      </div>

      {/* Actions Section */}
      <div className="mt-6 pt-6 border-t border-border/50">
        <div className="px-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Actions
          </h3>
          <div className="space-y-3">
            {/* Chat with AI Button */}
            <div className="flex justify-center">
              <HudButton 
                style="style2" 
                variant="primary"
                onClick={() => navigate("/")}
              >
                Chat with AI
              </HudButton>
            </div>
            
            {/* Run Campaign Button */}
            <div className="flex justify-center">
              <CampaignModal />
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}