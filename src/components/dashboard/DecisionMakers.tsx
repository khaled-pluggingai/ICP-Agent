import React, { useState } from "react"
import { 
  Mail, 
  Phone, 
  Linkedin,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Eye,
  EyeOff,
  Filter,
  Info
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion, AnimatePresence } from "framer-motion"

interface DecisionMaker {
  id: string
  name: string
  title: string
  company?: string
  location?: string
  role: 'Economic' | 'Champion' | 'Technical' | 'User' | 'Procurement' | 'Security'
  status: 'Found' | 'Missing' | 'Needs Research'
  avatar?: string
  lastContact?: string
  contacts: {
    email?: { value: string; status: 'Found' | 'Missing' | 'Unknown' }
    linkedin?: { value: string; status: 'Found' | 'Missing' | 'Unknown' }
    phone?: { value: string; status: 'Found' | 'Missing' | 'Unknown' }
  }
}

interface DecisionMakersProps {
  decisionMakers?: DecisionMaker[]
}

const roleConfig = {
  Champion: { 
    icon: '🏆', 
    color: 'bg-emerald-500/12 text-emerald-300 border-emerald-500/30',
    description: 'Internal advocate who drives the purchase decision'
  },
  Economic: { 
    icon: '💼', 
    color: 'bg-emerald-400/12 text-emerald-200 border-emerald-400/30',
    description: 'Controls budget and financial approval'
  },
  Technical: { 
    icon: '🛠', 
    color: 'bg-emerald-600/12 text-emerald-400 border-emerald-600/30',
    description: 'Evaluates technical requirements and integration'
  },
  Security: { 
    icon: '🔒', 
    color: 'bg-amber-500/12 text-amber-300 border-amber-500/30',
    description: 'Reviews security, compliance, and risk factors'
  },
  User: { 
    icon: '👤', 
    color: 'bg-slate-500/12 text-slate-300 border-slate-500/30',
    description: 'End user who will use the product daily'
  },
  Procurement: { 
    icon: '📑', 
    color: 'bg-blue-500/12 text-blue-300 border-blue-500/30',
    description: 'Manages vendor relationships and contracts'
  }
}

const mockDecisionMakers: DecisionMaker[] = [
  {
    id: '1',
    name: 'Sarah Smith',
    title: 'VP of Marketing',
    company: 'TechCorp Inc.',
    role: 'Champion',
    status: 'Found',
    lastContact: '2024-01-15',
    contacts: {
      email: { value: 'sarah@techcorp.com', status: 'Found' },
      phone: { value: '+1 234 567 8901', status: 'Found' },
      linkedin: { value: 'https://linkedin.com/in/sarah-smith-tech', status: 'Found' }
    }
  },
  {
    id: '2',
    name: 'Alex Brown',
    title: 'Chief Financial Officer',
    company: 'TechCorp Inc.',
    role: 'Economic',
    status: 'Found',
    lastContact: '2024-01-12',
    contacts: {
      email: { value: 'alex@techcorp.com', status: 'Found' },
      phone: { value: '+971 50 123 4567', status: 'Found' },
      linkedin: { value: 'https://linkedin.com/in/alex-brown-cfo', status: 'Found' }
    }
  },
  {
    id: '3',
    name: 'Mark Johnson',
    title: 'Head of Engineering',
    company: 'TechCorp Inc.',
    role: 'Technical',
    status: 'Found',
    lastContact: '2024-01-10',
    contacts: {
      email: { value: 'mark@techcorp.com', status: 'Found' },
      phone: { value: '+44 20 7946 0123', status: 'Found' },
      linkedin: { value: 'https://linkedin.com/in/mark-johnson-eng', status: 'Found' }
    }
  },
  {
    id: '4',
    name: 'Jane Doe',
    title: 'Chief Information Security Officer',
    company: 'TechCorp Inc.',
    role: 'Security',
    status: 'Found',
    lastContact: '2024-01-08',
    contacts: {
      email: { value: 'jane@techcorp.com', status: 'Found' },
      phone: { value: '+1 415 123 9876', status: 'Found' },
      linkedin: { value: 'https://linkedin.com/in/jane-doe-ciso', status: 'Found' }
    }
  },
  {
    id: '5',
    name: 'Michael Chen',
    title: 'Procurement Director',
    company: 'TechCorp Inc.',
    role: 'Procurement',
    status: 'Needs Research',
    lastContact: null,
    contacts: {
      email: { value: '', status: 'Missing' },
      phone: { value: '', status: 'Missing' },
      linkedin: { value: 'https://linkedin.com/in/michael-chen-proc', status: 'Found' }
    }
  }
]

export function DecisionMakers({ decisionMakers = mockDecisionMakers }: DecisionMakersProps) {
  const [showAll, setShowAll] = useState(false)
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('role')
  const [hasContactFilter, setHasContactFilter] = useState(false)

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return '??'
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const handleEmailClick = (email: string) => {
    window.open(`mailto:${email}`, '_blank')
  }

  const handlePhoneClick = (phone: string) => {
    window.open(`tel:${phone}`, '_blank')
  }

  const handleLinkedInClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const ContactButton = ({ 
    type, 
    contact, 
    onClick 
  }: { 
    type: 'email' | 'linkedin' | 'phone'
    contact?: { value: string; status: 'Found' | 'Missing' | 'Unknown' }
    onClick?: () => void
  }) => {
    const icons = { 
      email: { icon: Mail, label: 'Email' }, 
      linkedin: { icon: Linkedin, label: 'LinkedIn' }, 
      phone: { icon: Phone, label: 'Phone' } 
    }
    const { icon: Icon, label } = icons[type]
    
    if (!contact || contact.status === 'Missing' || !contact.value) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 w-6 p-0 opacity-30 cursor-not-allowed"
                disabled
              >
              <Icon className="w-3 h-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{label} not available</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0 hover:bg-emerald-500/10 hover:text-emerald-400 transition-colors"
              onClick={onClick}
            >
              <Icon className="w-3 h-3" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Open {label}: {contact.value}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const RoleBadge = ({ role }: { role: string }) => {
    const config = roleConfig[role as keyof typeof roleConfig]
    
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge className={`${config.color} font-medium cursor-help`}>
              <span className="mr-1">{config.icon}</span>
              {role}
            </Badge>
          </TooltipTrigger>
          <TooltipContent className="max-w-64">
            <p>{config.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  // Helper function to check if a decision maker has contact info
  const hasValidContact = (maker: DecisionMaker) => {
    return (maker.contacts.email?.status === 'Found' && maker.contacts.email?.value) ||
           (maker.contacts.phone?.status === 'Found' && maker.contacts.phone?.value) ||
           (maker.contacts.linkedin?.status === 'Found' && maker.contacts.linkedin?.value)
  }

  // Filter and sort logic
  const filteredMakers = decisionMakers
    .filter(maker => roleFilter === 'all' || maker.role === roleFilter)
    .filter(maker => !hasContactFilter || hasValidContact(maker))
    .sort((a, b) => {
    if (sortBy === 'role') {
      const roleOrder = ['Champion', 'Economic', 'Technical', 'Security', 'User', 'Procurement']
      return roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role)
    }
    if (sortBy === 'lastContact') {
      const dateA = a.lastContact ? new Date(a.lastContact).getTime() : 0
      const dateB = b.lastContact ? new Date(b.lastContact).getTime() : 0
      return dateB - dateA
    }
    return a.name.localeCompare(b.name)
  })

  const displayedMakers = showAll ? filteredMakers : filteredMakers.slice(0, 3)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-lg font-semibold text-emerald-300">Decision Makers</h3>
          <p className="text-sm text-muted-foreground">
            Verified contacts and buying roles from enrichment data
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-36 h-8">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Role Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="Champion">🏆 Champion</SelectItem>
              <SelectItem value="Economic">💼 Economic</SelectItem>
              <SelectItem value="Technical">🛠 Technical</SelectItem>
              <SelectItem value="Security">🔒 Security</SelectItem>
              <SelectItem value="User">👤 User</SelectItem>
              <SelectItem value="Procurement">📑 Procurement</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant={hasContactFilter ? "default" : "outline"}
            size="sm"
            onClick={() => setHasContactFilter(!hasContactFilter)}
            className="h-8 text-xs whitespace-nowrap"
          >
            {hasContactFilter ? "✓" : ""} Has Contact Info
          </Button>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="role">By Role</SelectItem>
              <SelectItem value="lastContact">By Contact</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Scrollable Table Container */}
      <div className="h-96 rounded-2xl border border-emerald-500/20 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
        {/* Sticky Header */}
        <div className="border-b border-emerald-500/10 bg-gradient-to-r from-emerald-500/5 to-emerald-600/5 p-2">
          <div className="grid grid-cols-6 gap-2 text-xs font-medium text-emerald-300">
            <div>Role</div>
            <div>Name & Title</div>
            <div className="text-center">Email</div>
            <div className="text-center">Phone</div>
            <div className="text-center">LinkedIn</div>
            <div className="text-center">Status</div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/50">
          <AnimatePresence>
            {displayedMakers.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {roleFilter === 'all' ? 'No decision makers found' : `No ${roleFilter} contacts found`}
                </p>
              </div>
            ) : (
              displayedMakers.map((maker, index) => (
                <motion.div
                  key={maker.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className="grid grid-cols-6 gap-2 p-2 hover:bg-emerald-500/5 transition-colors"
                >
                  {/* Role */}
                  <div className="flex items-center">
                    <RoleBadge role={maker.role} />
                  </div>

                  {/* Name & Title */}
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="bg-emerald-500/20 text-emerald-300 text-[10px] font-medium">
                        {getInitials(maker.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <div className="font-medium text-foreground text-xs truncate">{maker.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{maker.title}</div>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex justify-center">
                    <ContactButton 
                      type="email" 
                      contact={maker.contacts.email}
                      onClick={() => maker.contacts.email?.value && handleEmailClick(maker.contacts.email.value)}
                    />
                  </div>

                  {/* Phone */}
                  <div className="flex justify-center">
                    <ContactButton 
                      type="phone" 
                      contact={maker.contacts.phone}
                      onClick={() => maker.contacts.phone?.value && handlePhoneClick(maker.contacts.phone.value)}
                    />
                  </div>

                  {/* LinkedIn */}
                  <div className="flex justify-center">
                    <ContactButton 
                      type="linkedin" 
                      contact={maker.contacts.linkedin}
                      onClick={() => maker.contacts.linkedin?.value && handleLinkedInClick(maker.contacts.linkedin.value)}
                    />
                  </div>

                  {/* Status */}
                  <div className="flex justify-center">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        maker.status === 'Found' 
                          ? 'bg-emerald-500/12 text-emerald-300 border-emerald-500/30'
                          : maker.status === 'Needs Research'
                          ? 'bg-amber-500/12 text-amber-300 border-amber-500/30'
                          : 'bg-slate-500/12 text-slate-300 border-slate-500/30'
                      }`}
                    >
                      {maker.status === 'Found' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : maker.status === 'Needs Research' ? (
                        <Clock className="w-3 h-3 mr-1" />
                      ) : (
                        <XCircle className="w-3 h-3 mr-1" />
                      )}
                      {maker.status}
                    </Badge>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Show More/Less Button */}
        {filteredMakers.length > 3 && (
          <div className="border-t border-border/50 p-4 text-center">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
            >
              {showAll ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Show Less
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  View All ({filteredMakers.length})
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Data Source Info */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Info className="w-3 h-3" />
        <span>Data enriched from Clay, Apollo, LinkedIn Sales Navigator</span>
      </div>
    </div>
  )
}