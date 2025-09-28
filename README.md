# ICP Agent - AI-Powered Customer Profiling Platform

![ICP Agent](public/images/logo.png)

**ICP Agent** is an intelligent customer profiling and campaign management platform that helps businesses identify, analyze, and engage with their ideal customer profiles (ICPs) using AI-powered research and automation.

## 🚀 Features

### Core Functionality
- **AI-Powered ICP Research**: Intelligent chat interface for discovering companies and prospects based on specific criteria
- **Qualified Account Management**: Track and manage qualified accounts with detailed company information
- **Decision Maker Identification**: Find and analyze key decision makers within target organizations
- **Pipeline Insights**: Comprehensive analytics and insights into your sales pipeline
- **Campaign Management**: Create and manage targeted marketing campaigns
- **Automation Scheduler**: Schedule and automate outreach activities
- **Live Monitoring**: Real-time monitoring of campaign performance and activities

### Dashboard Sections
- **Analytics Overview**: KPI cards and performance metrics
- **Qualified Accounts**: Company database with enrichment data
- **Segments**: Customer segmentation and analysis
- **Decision Makers**: Contact and stakeholder management
- **Company Events**: Track company activities and triggers
- **Pipeline Insights**: Sales funnel analytics
- **ICP Trainer**: AI-powered ICP refinement and training
- **Automation Scheduler**: Campaign automation tools
- **Live Monitor**: Real-time activity tracking
- **Integrations**: Third-party service connections

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Radix UI** components with shadcn/ui
- **React Router** for navigation
- **React Query** for data fetching and caching
- **React Hook Form** with Zod validation

### Backend & Database
- **Supabase** for backend services and PostgreSQL database
- **Vector embeddings** for AI-powered search
- **Real-time subscriptions** for live data updates

### Integrations
- **Exa** for company and prospect data
- **Explorium** for event tracking
- **Instantly** for email campaign management
- **LinkedIn Ads** data integration
- **Product Hunt** integration

## 📋 Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn** package manager
- **Supabase** account and project
- **Git** for version control

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/icp-agent-60-main.git
   cd icp-agent-60-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_APP_NAME=ICP-Agent
   VITE_APP_DESCRIPTION=AI-Powered Customer Profiling Platform
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   The application will be available at `http://localhost:8080`

## 🏗️ Build & Deployment

### Local Build
```bash
npm run build
# or
yarn build
```

### Production Build
```bash
npm run build:dev
# or
yarn build:dev
```

### Vercel Deployment

The project is configured for easy deployment on Vercel:

1. **Connect your GitHub repository** to Vercel
2. **Set environment variables** in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
3. **Deploy** - Vercel will automatically build and deploy

See [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

## 📁 Project Structure

```
src/
├── api/                    # API configuration and proxy
├── components/             # React components
│   ├── dashboard/         # Dashboard-specific components
│   └── ui/               # Reusable UI components
├── hooks/                 # Custom React hooks
├── integrations/          # Third-party integrations
│   └── supabase/         # Supabase client and types
├── lib/                   # Utility functions and mocks
├── pages/                 # Page components and routing
├── utils/                 # Helper utilities
└── main.tsx              # Application entry point
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Set up the required database tables (see database schema in `src/integrations/supabase/types.ts`)
3. Configure Row Level Security (RLS) policies
4. Set up vector extensions for AI search functionality

### Database Schema
The application uses several key tables:
- `decision_maker` - Contact and stakeholder data
- `exa_companies` - Company information from Exa API
- `prospects` - Prospect and lead data
- `icp_data` - ICP configuration and criteria
- `instantly_*` - Email campaign data
- `explorium_events` - Event tracking data

## 🎯 Usage

### Getting Started
1. **Access the Dashboard**: Navigate to `/dashboard` after starting the application
2. **Configure ICP**: Use the ICP Trainer to define your ideal customer profile
3. **Search Companies**: Use the AI chat interface to find companies matching your criteria
4. **Manage Accounts**: Add qualified accounts to your database
5. **Track Decision Makers**: Identify and track key contacts
6. **Monitor Performance**: Use analytics to track campaign effectiveness

### Example Search Query
```
"I want to find Canadian software development companies for AI marketing with revenue 10k+ and size of 15+ employees"
```

Required fields for searches:
- Country
- Industry/Field
- Revenue range
- Company size

## 🔌 API Integrations

### Exa API
- Company and prospect data enrichment
- Real-time company information
- LinkedIn profile data

### Explorium
- Event tracking and monitoring
- Company activity insights
- Intent signals

### Instantly
- Email campaign management
- Lead tracking and scoring
- Automation workflows

## 🛡️ Security

- **Environment Variables**: Sensitive data stored in environment variables
- **Supabase RLS**: Row-level security for data access
- **HTTPS**: Secure connections in production
- **Content Security**: Headers configured for security

## 📊 Performance

- **Static Asset Caching**: 1-year cache for static assets
- **CDN Distribution**: Global content delivery
- **Gzip Compression**: Automatic compression
- **Code Splitting**: Optimized bundle sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for deployment issues
- Review the Supabase documentation for database setup

## 🔄 Version History

- **v1.0.0** - Initial release with core ICP functionality
- **v0.0.0** - Development version (current)

---

**Built with ❤️ using React, TypeScript, and Supabase**
