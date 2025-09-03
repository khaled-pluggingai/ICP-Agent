import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  Search, 
  MapPin, 
  Users, 
  ChevronDown, 
  Filter,
  Globe2,
  Building2
} from "lucide-react"

interface StateData {
  name: string
  accounts: number
  percentage: number
  color: string
}

interface CountryData {
  name: string
  accounts: number
  percentage: number
  color: string
  states: StateData[]
  flag: string
}

const geographicData: CountryData[] = [
  {
    name: "United States",
    accounts: 2847,
    percentage: 45,
    color: "bg-emerald-500",
    flag: "🇺🇸",
    states: [
      { name: "California", accounts: 1287, percentage: 45.2, color: "bg-emerald-400" },
      { name: "Texas", accounts: 568, percentage: 20.0, color: "bg-emerald-500" },
      { name: "New York", accounts: 423, percentage: 14.9, color: "bg-emerald-600" },
      { name: "Florida", accounts: 312, percentage: 11.0, color: "bg-emerald-700" },
      { name: "Others", accounts: 257, percentage: 8.9, color: "bg-emerald-800" }
    ]
  },
  {
    name: "United Kingdom",
    accounts: 892,
    percentage: 14.1,
    color: "bg-emerald-600",
    flag: "🇬🇧",
    states: [
      { name: "England", accounts: 634, percentage: 71.1, color: "bg-emerald-400" },
      { name: "Scotland", accounts: 134, percentage: 15.0, color: "bg-emerald-500" },
      { name: "Wales", accounts: 78, percentage: 8.7, color: "bg-emerald-600" },
      { name: "N. Ireland", accounts: 46, percentage: 5.2, color: "bg-emerald-700" }
    ]
  },
  {
    name: "Germany",
    accounts: 567,
    percentage: 9.0,
    color: "bg-purple-500",
    flag: "🇩🇪",
    states: [
      { name: "Bavaria", accounts: 156, percentage: 27.5, color: "bg-purple-400" },
      { name: "N. Rhine-Westphalia", accounts: 142, percentage: 25.0, color: "bg-purple-500" },
      { name: "Baden-Württemberg", accounts: 118, percentage: 20.8, color: "bg-purple-600" },
      { name: "Others", accounts: 151, percentage: 26.7, color: "bg-purple-700" }
    ]
  },
  {
    name: "Canada",
    accounts: 445,
    percentage: 7.0,
    color: "bg-blue-500",
    flag: "🇨🇦",
    states: [
      { name: "Ontario", accounts: 178, percentage: 40.0, color: "bg-blue-400" },
      { name: "British Columbia", accounts: 111, percentage: 25.0, color: "bg-blue-500" },
      { name: "Quebec", accounts: 89, percentage: 20.0, color: "bg-blue-600" },
      { name: "Others", accounts: 67, percentage: 15.0, color: "bg-blue-700" }
    ]
  },
  {
    name: "Australia",
    accounts: 378,
    percentage: 6.0,
    color: "bg-amber-500",
    flag: "🇦🇺",
    states: [
      { name: "New South Wales", accounts: 151, percentage: 40.0, color: "bg-amber-400" },
      { name: "Victoria", accounts: 113, percentage: 30.0, color: "bg-amber-500" },
      { name: "Queensland", accounts: 68, percentage: 18.0, color: "bg-amber-600" },
      { name: "Others", accounts: 46, percentage: 12.0, color: "bg-amber-700" }
    ]
  },
  {
    name: "France",
    accounts: 289,
    percentage: 4.6,
    color: "bg-indigo-500",
    flag: "🇫🇷",
    states: [
      { name: "Île-de-France", accounts: 144, percentage: 50.0, color: "bg-indigo-400" },
      { name: "Auvergne-Rhône-Alpes", accounts: 58, percentage: 20.0, color: "bg-indigo-500" },
      { name: "Provence-Alpes-Côte", accounts: 43, percentage: 15.0, color: "bg-indigo-600" },
      { name: "Others", accounts: 44, percentage: 15.0, color: "bg-indigo-700" }
    ]
  }
]

export function CountryStatesDistribution() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCountry, setSelectedCountry] = useState<string>("all")
  const [openCountries, setOpenCountries] = useState<Set<string>>(new Set(["United States"]))
  const [viewMode, setViewMode] = useState<"bars" | "map">("bars")

  const filteredData = geographicData.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      country.states.some(state => state.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCountry = selectedCountry === "all" || country.name === selectedCountry
    return matchesSearch && matchesCountry
  })

  const toggleCountry = (countryName: string) => {
    const newOpen = new Set(openCountries)
    if (newOpen.has(countryName)) {
      newOpen.delete(countryName)
    } else {
      newOpen.add(countryName)
    }
    setOpenCountries(newOpen)
  }

  const totalAccounts = geographicData.reduce((sum, country) => sum + country.accounts, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h3 className="text-xl font-semibold text-foreground">Country & States Distribution</h3>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "bars" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("bars")}
            className="h-8"
          >
            <Building2 className="w-4 h-4 mr-1" />
            Bars
          </Button>
          <Button
            variant={viewMode === "map" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("map")}
            className="h-8"
          >
            <Globe2 className="w-4 h-4 mr-1" />
            Map
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search countries or states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              {geographicData.map((country) => (
                <SelectItem key={country.name} value={country.name}>
                  {country.flag} {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Distribution Display */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        {viewMode === "bars" ? (
          <div className="space-y-6">
            <AnimatePresence>
              {filteredData.map((country, index) => (
                <motion.div
                  key={country.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-3"
                >
                  <Collapsible
                    open={openCountries.has(country.name)}
                    onOpenChange={() => toggleCountry(country.name)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex justify-between items-center p-3 rounded-xl hover:bg-muted/30 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <div className="text-left">
                            <div className="font-medium text-foreground">{country.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {country.states.length} regions
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-muted-foreground" />
                              <span className="font-semibold text-foreground">
                                {country.accounts.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-sm font-bold text-emerald-400">
                              {country.percentage}%
                            </div>
                          </div>
                          <ChevronDown 
                            className={`w-4 h-4 text-muted-foreground transition-transform ${
                              openCountries.has(country.name) ? 'rotate-180' : ''
                            }`} 
                          />
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    {/* Country Progress Bar */}
                    <div className="w-full bg-muted rounded-full h-3 mb-4">
                      <motion.div
                        className={`h-3 rounded-full ${country.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${country.percentage}%` }}
                        transition={{ delay: index * 0.2, duration: 0.8 }}
                      />
                    </div>

                    <CollapsibleContent className="space-y-3">
                      <div className="ml-6 pl-4 border-l-2 border-border space-y-3">
                        {country.states.map((state, stateIndex) => (
                          <motion.div
                            key={state.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (index * 0.1) + (stateIndex * 0.05) }}
                            className="space-y-2"
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-3 h-3 text-muted-foreground" />
                                <span className="text-sm font-medium text-foreground">
                                  {state.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {state.accounts.toLocaleString()}
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                  {state.percentage}%
                                </Badge>
                              </div>
                            </div>
                            <div className="w-full bg-muted/50 rounded-full h-2">
                              <motion.div
                                className={`h-2 rounded-full ${state.color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${state.percentage}%` }}
                                transition={{ 
                                  delay: (index * 0.2) + (stateIndex * 0.1), 
                                  duration: 0.6 
                                }}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          /* Map View Placeholder */
          <div className="flex items-center justify-center h-96 border-2 border-dashed border-border rounded-xl">
            <div className="text-center space-y-4">
              <Globe2 className="w-16 h-16 text-muted-foreground mx-auto" />
              <div>
                <h4 className="font-semibold text-foreground">Interactive Map View</h4>
                <p className="text-sm text-muted-foreground">
                  World map visualization coming soon
                </p>
              </div>
              <Badge variant="outline" className="text-xs">
                Total: {totalAccounts.toLocaleString()} accounts
              </Badge>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}