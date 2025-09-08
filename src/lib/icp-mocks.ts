export type QualifiedAccount = {
  id: string;
  name: string;
  domain: string;
  description: string;
  logoUrl?: string;
  tier: 'A' | 'B' | 'C';
  industry: string;
  geo: string;
  employees: number;
  tech_stack: string[];
  fit_score: number;        // 0–100
  intent_score: number;     // 0–100
  intent_delta_14d: number; // -100..100
  last_activity_at: string; // ISO
  rules_match: {
    firmographic: 'Match' | 'Partial' | 'Miss';
    technographic: 'Match' | 'Partial' | 'Miss';
    intent: 'Match' | 'Partial' | 'Miss';
    behavioral: 'Match' | 'Partial' | 'Miss';
  };
  enrichment: {
    summary_bullets: string[];   // 4–6 items
    icp_reasons: string[];       // chips
    risks: string[];             // optional
    signals: Array<{type: 'Funding' | 'Hiring' | 'Tech' | 'News', note: string, date: string}>;
    references: Array<{source: 'Crunchbase' | 'G2' | 'LinkedIn' | 'News' | 'Website' | 'Other', url?: string}>;
    committee: Array<{name?: string, title: string, role: 'Economic' | 'Champion' | 'User', status: 'Found' | 'Missing'}>;
  };
  // Raw Supabase data for additional fields
  rawData?: {
    business_id: string;
    name: string;
    domain?: string;
    website?: string;
    business_description?: string;
    company_description?: string;
    logo?: string;
    score?: number;
    industry?: string;
    region?: string;
    country_name?: string;
    number_of_employees_range?: string;
    company_size?: string;
    founded_year?: string;
    main_products_services?: string;
    'linkedin-url'?: string;
    intent_score?: number;
    ceo_founder?: string;
    contact_email?: string;
    phone_number?: string;
    physical_address?: string;
    mission_vision?: string;
    naics?: number;
    naics_description?: string;
    sic_code?: string;
    sic_code_description?: string;
    target_customers?: string;
    yearly_revenue_range?: string;
    reasone?: string;
  };
};

export const qualifiedAccounts: QualifiedAccount[] = [
  {
    id: "1",
    name: "Retool",
    domain: "retool.com",
    description: "Internal tool builder that connects to databases and APIs for rapid application development",
    tier: "A",
    industry: "Developer Tools",
    geo: "San Francisco, CA",
    employees: 800,
    tech_stack: ["React", "Node.js", "PostgreSQL", "Redis", "AWS"],
    fit_score: 95,
    intent_score: 87,
    intent_delta_14d: 12,
    last_activity_at: "2024-01-08T14:30:00Z",
    rules_match: {
      firmographic: "Match",
      technographic: "Match",
      intent: "Match",
      behavioral: "Partial"
    },
    enrichment: {
      summary_bullets: [
        "Fast-growing internal tools platform serving 3000+ companies including Brex and DoorDash",
        "Strong technical infrastructure using React, Node.js, and cloud-native architecture", 
        "Recently announced expansion into workflow automation and AI-powered features",
        "Active in developer community with frequent product updates and integrations",
        "Leadership team focused on enterprise growth and platform scalability"
      ],
      icp_reasons: ["Enterprise Scale", "Tech-Forward", "Growth Phase", "API-First"],
      risks: [],
      signals: [
        {type: "Funding", note: "Series C funding round of $45M announced", date: "2024-01-05"},
        {type: "Hiring", note: "Posted 25+ engineering roles in Q4", date: "2024-01-03"},
        {type: "Tech", note: "Launched AI query generator for databases", date: "2023-12-28"},
        {type: "News", note: "Named in Y Combinator's top success stories", date: "2024-01-02"}
      ],
      references: [
        {source: "Crunchbase", url: "https://crunchbase.com/retool"},
        {source: "LinkedIn", url: "https://linkedin.com/company/retool"},
        {source: "G2", url: "https://g2.com/retool"},
        {source: "News"},
        {source: "Website"}
      ],
      committee: [
        {name: "David Hsu", title: "Co-founder & CEO", role: "Economic", status: "Found"},
        {name: "Jake Miller", title: "VP Engineering", role: "Champion", status: "Found"},
        {title: "Director of Developer Experience", role: "User", status: "Missing"}
      ]
    }
  },
  {
    id: "2", 
    name: "Gusto",
    domain: "gusto.com",
    description: "Modern payroll, benefits, and HR platform designed for small and medium businesses",
    tier: "A",
    industry: "HR Tech",
    geo: "San Francisco, CA",
    employees: 3500,
    tech_stack: ["Ruby on Rails", "React", "GraphQL", "MySQL", "GCP"],
    fit_score: 92,
    intent_score: 78,
    intent_delta_14d: -5,
    last_activity_at: "2024-01-07T09:15:00Z",
    rules_match: {
      firmographic: "Match",
      technographic: "Match", 
      intent: "Partial",
      behavioral: "Match"
    },
    enrichment: {
      summary_bullets: [
        "Leading HR platform serving 300K+ businesses with comprehensive payroll and benefits",
        "Strong Ruby on Rails and React technical foundation with modern APIs",
        "Expanding into enterprise markets with advanced compliance features",
        "Recent focus on international expansion and contractor management solutions"
      ],
      icp_reasons: ["Market Leader", "Enterprise Focus", "Tech Stack Match", "Growth Mode"],
      risks: ["High competition in HR tech space"],
      signals: [
        {type: "Tech", note: "Launched contractor management API", date: "2024-01-04"},
        {type: "Hiring", note: "15+ senior engineering positions posted", date: "2024-01-01"},
        {type: "News", note: "Q4 revenue grew 28% year-over-year", date: "2023-12-30"}
      ],
      references: [
        {source: "Crunchbase"},
        {source: "LinkedIn"},
        {source: "G2"},
        {source: "Website"},
        {source: "News"}
      ],
      committee: [
        {name: "Josh Reeves", title: "CEO", role: "Economic", status: "Found"},
        {title: "CTO", role: "Champion", status: "Missing"},
        {name: "Sarah Kim", title: "VP Product", role: "User", status: "Found"}
      ]
    }
  },
  {
    id: "3",
    name: "Linear",
    domain: "linear.app", 
    description: "Issue tracking and project management tool built for high-performance software teams",
    tier: "B",
    industry: "Productivity",
    geo: "San Francisco, CA",
    employees: 150,
    tech_stack: ["TypeScript", "React", "Node.js", "PostgreSQL", "Vercel"],
    fit_score: 88,
    intent_score: 91,
    intent_delta_14d: 18,
    last_activity_at: "2024-01-08T16:45:00Z",
    rules_match: {
      firmographic: "Partial",
      technographic: "Match",
      intent: "Match", 
      behavioral: "Match"
    },
    enrichment: {
      summary_bullets: [
        "Fast-growing project management platform trusted by top engineering teams",
        "Modern TypeScript/React stack with exceptional performance and design",
        "Strong focus on developer experience with keyboard shortcuts and automation",
        "Expanding feature set with roadmaps, cycles, and advanced integrations",
        "Used by companies like Vercel, Coinbase, and Loom"
      ],
      icp_reasons: ["High Intent", "Tech Match", "Growth Trajectory", "Developer-Friendly"],
      risks: ["Smaller team size", "Competitive market"],
      signals: [
        {type: "Funding", note: "Series B funding round of $35M", date: "2024-01-06"},
        {type: "Hiring", note: "Expanding engineering and design teams", date: "2024-01-04"},
        {type: "Tech", note: "Released advanced automation features", date: "2024-01-02"},
        {type: "News", note: "Named Product Hunt's tool of the year", date: "2023-12-29"}
      ],
      references: [
        {source: "Crunchbase"},
        {source: "LinkedIn"},
        {source: "Website"},
        {source: "Other"}
      ],
      committee: [
        {name: "Karri Saarinen", title: "Co-founder & CEO", role: "Economic", status: "Found"},
        {title: "Head of Engineering", role: "Champion", status: "Missing"},
        {name: "Tuomas Artman", title: "Co-founder & CTO", role: "User", status: "Found"}
      ]
    }
  },
  {
    id: "4",
    name: "Segment",
    domain: "segment.com",
    description: "Customer data platform that collects, cleans, and controls customer data",
    tier: "A",
    industry: "Data Infrastructure",
    geo: "San Francisco, CA", 
    employees: 1200,
    tech_stack: ["Go", "React", "Kafka", "Redshift", "AWS"],
    fit_score: 85,
    intent_score: 72,
    intent_delta_14d: 8,
    last_activity_at: "2024-01-07T11:20:00Z",
    rules_match: {
      firmographic: "Match",
      technographic: "Partial",
      intent: "Partial",
      behavioral: "Match"
    },
    enrichment: {
      summary_bullets: [
        "Leading customer data platform processing 500B+ API calls per month",
        "Robust Go/React architecture optimized for real-time data processing",
        "Strong focus on data governance and privacy compliance",
        "Recently acquired by Twilio, expanding integration opportunities"
      ],
      icp_reasons: ["Large Scale", "Data Focus", "Enterprise Clients", "Twilio Integration"],
      risks: ["Recent acquisition integration", "Complex enterprise sales cycle"],
      signals: [
        {type: "Tech", note: "Launched real-time personalization features", date: "2024-01-05"},
        {type: "Hiring", note: "Building enterprise customer success team", date: "2024-01-03"},
        {type: "News", note: "Partnership with leading CDPs announced", date: "2023-12-31"}
      ],
      references: [
        {source: "Crunchbase"},
        {source: "LinkedIn"},
        {source: "Website"},
        {source: "News"}
      ],
      committee: [
        {name: "Peter Reinhardt", title: "CEO", role: "Economic", status: "Found"},
        {title: "VP Engineering", role: "Champion", status: "Missing"},
        {name: "David Kim", title: "Head of Product", role: "User", status: "Found"}
      ]
    }
  },
  {
    id: "5",
    name: "Webflow",
    domain: "webflow.com",
    description: "Visual web development platform that allows designers to build responsive websites",
    tier: "A",
    industry: "Web Development",
    geo: "San Francisco, CA",
    employees: 700,
    tech_stack: ["TypeScript", "React", "Node.js", "MongoDB", "AWS"],
    fit_score: 90,
    intent_score: 83,
    intent_delta_14d: 15,
    last_activity_at: "2024-01-08T13:10:00Z",
    rules_match: {
      firmographic: "Match",
      technographic: "Match",
      intent: "Match",
      behavioral: "Partial"
    },
    enrichment: {
      summary_bullets: [
        "Leading visual web development platform with 3.5M+ registered users",
        "Advanced TypeScript/React architecture with visual design tools",
        "Strong enterprise adoption with CMS and e-commerce capabilities",
        "Recently launched Webflow University and expanded marketplace",
        "Active design community with thousands of templates and integrations"
      ],
      icp_reasons: ["Enterprise Adoption", "Technical Innovation", "Design Focus", "Growing Platform"],
      risks: ["Competition from traditional web builders"],
      signals: [
        {type: "Funding", note: "Series C funding round of $140M", date: "2024-01-01"},
        {type: "Tech", note: "Launched advanced CMS features", date: "2023-12-28"},
        {type: "Hiring", note: "Expanding engineering team globally", date: "2023-12-25"}
      ],
      references: [
        {source: "Crunchbase"},
        {source: "LinkedIn"},
        {source: "G2"},
        {source: "Website"}
      ],
      committee: [
        {name: "Vlad Magdalin", title: "CEO", role: "Economic", status: "Found"},
        {name: "Bryant Chou", title: "CTO", role: "Champion", status: "Found"},
        {title: "VP Product", role: "User", status: "Missing"}
      ]
    }
  },
  {
    id: "6",
    name: "Plaid",
    domain: "plaid.com",
    description: "Financial services API that enables applications to connect with users' bank accounts",
    tier: "A",
    industry: "Fintech Infrastructure",
    geo: "San Francisco, CA",
    employees: 1500,
    tech_stack: ["Python", "React", "PostgreSQL", "Kafka", "AWS"],
    fit_score: 93,
    intent_score: 89,
    intent_delta_14d: 10,
    last_activity_at: "2024-01-08T10:25:00Z",
    rules_match: {
      firmographic: "Match",
      technographic: "Match",
      intent: "Match",
      behavioral: "Match"
    },
    enrichment: {
      summary_bullets: [
        "Leading financial data API powering 8000+ apps including Venmo and Robinhood",
        "Robust Python/React infrastructure handling millions of transactions daily",
        "Strong focus on security and compliance with banking regulations",
        "Expanding internationally with European and Canadian market entry",
        "Building next-generation financial products and payment rails"
      ],
      icp_reasons: ["API-First", "High Scale", "Financial Sector", "Enterprise Grade"],
      risks: ["Regulatory scrutiny", "Banking partnership dependencies"],
      signals: [
        {type: "Funding", note: "Series D funding round of $425M", date: "2024-01-04"},
        {type: "Tech", note: "Launched real-time payment verification", date: "2024-01-02"},
        {type: "Hiring", note: "30+ open roles in engineering and compliance", date: "2023-12-30"},
        {type: "News", note: "Partnership with major European banks", date: "2023-12-28"}
      ],
      references: [
        {source: "Crunchbase"},
        {source: "LinkedIn"},
        {source: "Website"},
        {source: "News"}
      ],
      committee: [
        {name: "Zach Perret", title: "CEO", role: "Economic", status: "Found"},
        {name: "Jean-Denis Greze", title: "CTO", role: "Champion", status: "Found"},
        {title: "Head of Product", role: "User", status: "Missing"}
      ]
    }
  },
  {
    id: "7",
    name: "Loom",
    domain: "loom.com",
    description: "Video messaging platform for asynchronous work communication and screen recording",
    tier: "B",
    industry: "Communication",
    geo: "San Francisco, CA",
    employees: 400,
    tech_stack: ["React", "Node.js", "WebRTC", "PostgreSQL", "GCP"],
    fit_score: 87,
    intent_score: 76,
    intent_delta_14d: 6,
    last_activity_at: "2024-01-07T15:40:00Z",
    rules_match: {
      firmographic: "Partial",
      technographic: "Match",
      intent: "Partial",
      behavioral: "Match"
    },
    enrichment: {
      summary_bullets: [
        "Popular video messaging platform with 20M+ users across 200K+ companies",
        "Advanced React/WebRTC stack optimized for seamless video recording",
        "Strong adoption in remote teams and async communication workflows",
        "Recently acquired by Atlassian, expanding integration opportunities"
      ],
      icp_reasons: ["Remote Work Focus", "Tech Stack Match", "Atlassian Integration", "Growing User Base"],
      risks: ["Smaller team size", "Post-acquisition integration"],
      signals: [
        {type: "News", note: "Acquired by Atlassian for $975M", date: "2024-01-03"},
        {type: "Tech", note: "Launched AI-powered video summaries", date: "2024-01-01"},
        {type: "Hiring", note: "Integrating with Atlassian teams", date: "2023-12-29"}
      ],
      references: [
        {source: "Crunchbase"},
        {source: "LinkedIn"},
        {source: "Website"},
        {source: "News"}
      ],
      committee: [
        {name: "Joe Thomas", title: "CEO", role: "Economic", status: "Found"},
        {title: "VP Engineering", role: "Champion", status: "Missing"},
        {name: "Alex Chen", title: "Product Manager", role: "User", status: "Found"}
      ]
    }
  },
  {
    id: "8",
    name: "Greenhouse",
    domain: "greenhouse.io",
    description: "Recruiting software and hiring platform that helps companies hire great people",
    tier: "B",
    industry: "HR Tech",
    geo: "New York, NY",
    employees: 1100,
    tech_stack: ["Ruby on Rails", "React", "PostgreSQL", "Redis", "AWS"],
    fit_score: 84,
    intent_score: 81,
    intent_delta_14d: 14,
    last_activity_at: "2024-01-08T09:55:00Z",
    rules_match: {
      firmographic: "Match",
      technographic: "Match",
      intent: "Match",
      behavioral: "Partial"
    },
    enrichment: {
      summary_bullets: [
        "Leading recruiting platform used by 6000+ companies including Airbnb and Stripe",
        "Mature Ruby on Rails/React architecture with extensive API ecosystem",
        "Strong focus on diversity and inclusion in hiring processes",
        "Expanding into talent analytics and workforce planning tools"
      ],
      icp_reasons: ["Enterprise Focus", "Established Platform", "API Ecosystem", "Growth Market"],
      risks: ["Competitive recruiting software market"],
      signals: [
        {type: "Tech", note: "Launched AI-powered candidate matching", date: "2024-01-05"},
        {type: "Hiring", note: "Building machine learning team", date: "2024-01-02"},
        {type: "News", note: "Named leader in G2 recruiting software grid", date: "2023-12-31"}
      ],
      references: [
        {source: "Crunchbase"},
        {source: "LinkedIn"},
        {source: "G2"},
        {source: "Website"}
      ],
      committee: [
        {name: "Daniel Chait", title: "CEO", role: "Economic", status: "Found"},
        {title: "CTO", role: "Champion", status: "Missing"},
        {name: "Lisa Rodriguez", title: "VP Product", role: "User", status: "Found"}
      ]
    }
  },
  {
    id: "9",
    name: "Mixpanel",
    domain: "mixpanel.com",
    description: "Product analytics platform that helps teams understand user behavior and improve products",
    tier: "B",
    industry: "Analytics",
    geo: "San Francisco, CA",
    employees: 450,
    tech_stack: ["Python", "React", "ClickHouse", "Kafka", "AWS"],
    fit_score: 89,
    intent_score: 85,
    intent_delta_14d: 9,
    last_activity_at: "2024-01-08T12:15:00Z",
    rules_match: {
      firmographic: "Partial",
      technographic: "Match",
      intent: "Match",
      behavioral: "Match"
    },
    enrichment: {
      summary_bullets: [
        "Established product analytics platform serving 8000+ companies globally",
        "High-performance Python/ClickHouse architecture for real-time analytics",
        "Strong self-serve model with advanced segmentation and cohort analysis",
        "Recent focus on privacy-first analytics and GDPR compliance",
        "Expanding into customer journey and retention analytics"
      ],
      icp_reasons: ["Analytics Focus", "Self-Serve Model", "Privacy Compliance", "Tech Innovation"],
      risks: ["Competition from larger analytics providers"],
      signals: [
        {type: "Tech", note: "Launched privacy-compliant tracking SDK", date: "2024-01-06"},
        {type: "Hiring", note: "Expanding data engineering team", date: "2024-01-04"},
        {type: "News", note: "Partnership with major CDP providers", date: "2024-01-01"}
      ],
      references: [
        {source: "Crunchbase"},
        {source: "LinkedIn"},
        {source: "G2"},
        {source: "Website"}
      ],
      committee: [
        {name: "Amir Movafaghi", title: "CEO", role: "Economic", status: "Found"},
        {title: "VP Engineering", role: "Champion", status: "Missing"},
        {name: "Michael Park", title: "Head of Product", role: "User", status: "Found"}
      ]
    }
  },
  {
    id: "10",
    name: "Amplitude",
    domain: "amplitude.com",
    description: "Digital analytics platform that helps companies build better products through data",
    tier: "A",
    industry: "Analytics",
    geo: "San Francisco, CA",
    employees: 900,
    tech_stack: ["Java", "React", "Kafka", "ClickHouse", "AWS"],
    fit_score: 91,
    intent_score: 88,
    intent_delta_14d: 11,
    last_activity_at: "2024-01-08T14:05:00Z",
    rules_match: {
      firmographic: "Match",
      technographic: "Match",
      intent: "Match",
      behavioral: "Match"
    },
    enrichment: {
      summary_bullets: [
        "Public analytics company (NASDAQ: AMPL) serving 2000+ enterprise customers",
        "Scalable Java/React platform processing billions of events daily",
        "Leading in behavioral analytics and experiment management",
        "Strong enterprise focus with advanced governance and security features",
        "Recent expansion into CDP and customer journey orchestration"
      ],
      icp_reasons: ["Public Company", "Enterprise Focus", "Market Leader", "Platform Expansion"],
      risks: ["Public company quarterly pressure"],
      signals: [
        {type: "News", note: "Q4 earnings exceeded analyst expectations", date: "2024-01-07"},
        {type: "Tech", note: "Launched audience management platform", date: "2024-01-03"},
        {type: "Hiring", note: "25+ enterprise sales roles posted", date: "2024-01-01"},
        {type: "Funding", note: "Completed $50M secondary offering", date: "2023-12-30"}
      ],
      references: [
        {source: "Crunchbase"},
        {source: "LinkedIn"},
        {source: "G2"},
        {source: "Website"},
        {source: "News"}
      ],
      committee: [
        {name: "Spenser Skates", title: "CEO", role: "Economic", status: "Found"},
        {name: "Curtis Liu", title: "CTO", role: "Champion", status: "Found"},
        {title: "VP Product Analytics", role: "User", status: "Missing"}
      ]
    }
  }
];