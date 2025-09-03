export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      decision_maker: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          departments: Json | null
          email: string | null
          email_status: string | null
          employment_history: Json | null
          estimated_num_employees: number | null
          extrapolated_email_confidence: number | null
          facebook_url: string | null
          first_name: string | null
          functions: Json | null
          github_url: string | null
          headline: string | null
          id: number
          industry: string | null
          last_name: string | null
          linkedin_url: string | null
          name: string | null
          organization: Json | null
          organization_annual_revenue: number | null
          organization_annual_revenue_printed: string | null
          organization_city: string | null
          organization_country: string | null
          organization_founded_year: number | null
          organization_linkedin_url: string | null
          organization_name: string | null
          organization_postal_code: string | null
          organization_raw_address: string | null
          organization_seo_description: string | null
          organization_short_description: string | null
          organization_state: string | null
          organization_technologies: string | null
          organization_website_url: string | null
          personal_emails: Json | null
          phone_numbers: Json | null
          photo_url: string | null
          present_raw_address: string | null
          seniority: string | null
          state: string | null
          subdepartments: Json | null
          time_zone: string | null
          title: string | null
          twitter_url: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          departments?: Json | null
          email?: string | null
          email_status?: string | null
          employment_history?: Json | null
          estimated_num_employees?: number | null
          extrapolated_email_confidence?: number | null
          facebook_url?: string | null
          first_name?: string | null
          functions?: Json | null
          github_url?: string | null
          headline?: string | null
          id?: number
          industry?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          name?: string | null
          organization?: Json | null
          organization_annual_revenue?: number | null
          organization_annual_revenue_printed?: string | null
          organization_city?: string | null
          organization_country?: string | null
          organization_founded_year?: number | null
          organization_linkedin_url?: string | null
          organization_name?: string | null
          organization_postal_code?: string | null
          organization_raw_address?: string | null
          organization_seo_description?: string | null
          organization_short_description?: string | null
          organization_state?: string | null
          organization_technologies?: string | null
          organization_website_url?: string | null
          personal_emails?: Json | null
          phone_numbers?: Json | null
          photo_url?: string | null
          present_raw_address?: string | null
          seniority?: string | null
          state?: string | null
          subdepartments?: Json | null
          time_zone?: string | null
          title?: string | null
          twitter_url?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          departments?: Json | null
          email?: string | null
          email_status?: string | null
          employment_history?: Json | null
          estimated_num_employees?: number | null
          extrapolated_email_confidence?: number | null
          facebook_url?: string | null
          first_name?: string | null
          functions?: Json | null
          github_url?: string | null
          headline?: string | null
          id?: number
          industry?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          name?: string | null
          organization?: Json | null
          organization_annual_revenue?: number | null
          organization_annual_revenue_printed?: string | null
          organization_city?: string | null
          organization_country?: string | null
          organization_founded_year?: number | null
          organization_linkedin_url?: string | null
          organization_name?: string | null
          organization_postal_code?: string | null
          organization_raw_address?: string | null
          organization_seo_description?: string | null
          organization_short_description?: string | null
          organization_state?: string | null
          organization_technologies?: string | null
          organization_website_url?: string | null
          personal_emails?: Json | null
          phone_numbers?: Json | null
          photo_url?: string | null
          present_raw_address?: string | null
          seniority?: string | null
          state?: string | null
          subdepartments?: Json | null
          time_zone?: string | null
          title?: string | null
          twitter_url?: string | null
        }
        Relationships: []
      }
      decision_maker_user: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          departments: Json | null
          email: string | null
          email_status: string | null
          employment_history: Json | null
          estimated_num_employees: number | null
          extrapolated_email_confidence: number | null
          facebook_url: string | null
          first_name: string | null
          functions: Json | null
          github_url: string | null
          headline: string | null
          id: number
          industry: string | null
          last_name: string | null
          linkedin_url: string | null
          name: string | null
          organization: Json | null
          organization_annual_revenue: number | null
          organization_annual_revenue_printed: string | null
          organization_city: string | null
          organization_country: string | null
          organization_founded_year: number | null
          organization_linkedin_url: string | null
          organization_name: string | null
          organization_postal_code: string | null
          organization_raw_address: string | null
          organization_seo_description: string | null
          organization_short_description: string | null
          organization_state: string | null
          organization_technologies: string | null
          organization_website_url: string | null
          personal_emails: Json | null
          phone_numbers: Json | null
          photo_url: string | null
          present_raw_address: string | null
          seniority: string | null
          state: string | null
          subdepartments: Json | null
          time_zone: string | null
          title: string | null
          twitter_url: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          departments?: Json | null
          email?: string | null
          email_status?: string | null
          employment_history?: Json | null
          estimated_num_employees?: number | null
          extrapolated_email_confidence?: number | null
          facebook_url?: string | null
          first_name?: string | null
          functions?: Json | null
          github_url?: string | null
          headline?: string | null
          id?: number
          industry?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          name?: string | null
          organization?: Json | null
          organization_annual_revenue?: number | null
          organization_annual_revenue_printed?: string | null
          organization_city?: string | null
          organization_country?: string | null
          organization_founded_year?: number | null
          organization_linkedin_url?: string | null
          organization_name?: string | null
          organization_postal_code?: string | null
          organization_raw_address?: string | null
          organization_seo_description?: string | null
          organization_short_description?: string | null
          organization_state?: string | null
          organization_technologies?: string | null
          organization_website_url?: string | null
          personal_emails?: Json | null
          phone_numbers?: Json | null
          photo_url?: string | null
          present_raw_address?: string | null
          seniority?: string | null
          state?: string | null
          subdepartments?: Json | null
          time_zone?: string | null
          title?: string | null
          twitter_url?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          departments?: Json | null
          email?: string | null
          email_status?: string | null
          employment_history?: Json | null
          estimated_num_employees?: number | null
          extrapolated_email_confidence?: number | null
          facebook_url?: string | null
          first_name?: string | null
          functions?: Json | null
          github_url?: string | null
          headline?: string | null
          id?: number
          industry?: string | null
          last_name?: string | null
          linkedin_url?: string | null
          name?: string | null
          organization?: Json | null
          organization_annual_revenue?: number | null
          organization_annual_revenue_printed?: string | null
          organization_city?: string | null
          organization_country?: string | null
          organization_founded_year?: number | null
          organization_linkedin_url?: string | null
          organization_name?: string | null
          organization_postal_code?: string | null
          organization_raw_address?: string | null
          organization_seo_description?: string | null
          organization_short_description?: string | null
          organization_state?: string | null
          organization_technologies?: string | null
          organization_website_url?: string | null
          personal_emails?: Json | null
          phone_numbers?: Json | null
          photo_url?: string | null
          present_raw_address?: string | null
          seniority?: string | null
          state?: string | null
          subdepartments?: Json | null
          time_zone?: string | null
          title?: string | null
          twitter_url?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      exa: {
        Row: {
          content: string | null
          created_at: string
          exa_id: string | null
          image_url: string | null
          published_at: string | null
          reason: string | null
          score: number | null
          title: string
          url: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          exa_id?: string | null
          image_url?: string | null
          published_at?: string | null
          reason?: string | null
          score?: number | null
          title: string
          url: string
        }
        Update: {
          content?: string | null
          created_at?: string
          exa_id?: string | null
          image_url?: string | null
          published_at?: string | null
          reason?: string | null
          score?: number | null
          title?: string
          url?: string
        }
        Relationships: []
      }
      explorium: {
        Row: {
          business_description: string | null
          business_id: string
          ceo_founder: string | null
          company_description: string | null
          company_size: string | null
          contact_email: string | null
          country_name: string | null
          domain: string | null
          founded_year: string | null
          industry: string | null
          "linkedin-url": string | null
          logo: string | null
          main_products_services: string | null
          mission_vision: string | null
          naics: number | null
          naics_description: string | null
          name: string
          number_of_employees_range: string | null
          phone_number: string | null
          physical_address: string | null
          reasone: string | null
          region: string | null
          score: number | null
          sic_code: string | null
          sic_code_description: string | null
          target_customers: string | null
          website: string | null
          yearly_revenue_range: string | null
        }
        Insert: {
          business_description?: string | null
          business_id: string
          ceo_founder?: string | null
          company_description?: string | null
          company_size?: string | null
          contact_email?: string | null
          country_name?: string | null
          domain?: string | null
          founded_year?: string | null
          industry?: string | null
          "linkedin-url"?: string | null
          logo?: string | null
          main_products_services?: string | null
          mission_vision?: string | null
          naics?: number | null
          naics_description?: string | null
          name: string
          number_of_employees_range?: string | null
          phone_number?: string | null
          physical_address?: string | null
          reasone?: string | null
          region?: string | null
          score?: number | null
          sic_code?: string | null
          sic_code_description?: string | null
          target_customers?: string | null
          website?: string | null
          yearly_revenue_range?: string | null
        }
        Update: {
          business_description?: string | null
          business_id?: string
          ceo_founder?: string | null
          company_description?: string | null
          company_size?: string | null
          contact_email?: string | null
          country_name?: string | null
          domain?: string | null
          founded_year?: string | null
          industry?: string | null
          "linkedin-url"?: string | null
          logo?: string | null
          main_products_services?: string | null
          mission_vision?: string | null
          naics?: number | null
          naics_description?: string | null
          name?: string
          number_of_employees_range?: string | null
          phone_number?: string | null
          physical_address?: string | null
          reasone?: string | null
          region?: string | null
          score?: number | null
          sic_code?: string | null
          sic_code_description?: string | null
          target_customers?: string | null
          website?: string | null
          yearly_revenue_range?: string | null
        }
        Relationships: []
      }
      explorium_events: {
        Row: {
          business_id: string
          data: Json
          event_id: string
          event_name: string
          event_time: string
        }
        Insert: {
          business_id: string
          data: Json
          event_id: string
          event_name: string
          event_time: string
        }
        Update: {
          business_id?: string
          data?: Json
          event_id?: string
          event_name?: string
          event_time?: string
        }
        Relationships: []
      }
      instantly_moeen: {
        Row: {
          assigned_to: string | null
          campaign: string | null
          campaign_name: string | null
          company_domain: string | null
          contact: string | null
          email_click_count: number
          email_clicked: boolean | null
          email_enrichment: Json | null
          email_open_count: number
          email_opened: boolean | null
          email_replied: boolean | null
          email_reply_count: number
          enrichment_status: string | null
          esp_code: number | null
          id: string
          is_website_visitor: boolean | null
          last_contacted_from: string | null
          "lead email": string | null
          lead_data: Json | null
          list_id: string | null
          lt_interest_status: number | null
          phone_numbers: string[] | null
          pl_value_lead: number | null
          status: string | null
          status_summary_subseq: string | null
          subsequence_id: string | null
          supersearch_enrichment_status: string | null
          timestamp_added_subsequence: string | null
          timestamp_created: string
          timestamp_last_click: string | null
          timestamp_last_contact: string | null
          timestamp_last_interest_change: string | null
          timestamp_last_open: string | null
          timestamp_last_reply: string | null
          timestamp_last_touch: string | null
          upload_method: string | null
          uploaded_by_user: string | null
          verification_status: string | null
        }
        Insert: {
          assigned_to?: string | null
          campaign?: string | null
          campaign_name?: string | null
          company_domain?: string | null
          contact?: string | null
          email_click_count?: number
          email_clicked?: boolean | null
          email_enrichment?: Json | null
          email_open_count?: number
          email_opened?: boolean | null
          email_replied?: boolean | null
          email_reply_count?: number
          enrichment_status?: string | null
          esp_code?: number | null
          id?: string
          is_website_visitor?: boolean | null
          last_contacted_from?: string | null
          "lead email"?: string | null
          lead_data?: Json | null
          list_id?: string | null
          lt_interest_status?: number | null
          phone_numbers?: string[] | null
          pl_value_lead?: number | null
          status?: string | null
          status_summary_subseq?: string | null
          subsequence_id?: string | null
          supersearch_enrichment_status?: string | null
          timestamp_added_subsequence?: string | null
          timestamp_created?: string
          timestamp_last_click?: string | null
          timestamp_last_contact?: string | null
          timestamp_last_interest_change?: string | null
          timestamp_last_open?: string | null
          timestamp_last_reply?: string | null
          timestamp_last_touch?: string | null
          upload_method?: string | null
          uploaded_by_user?: string | null
          verification_status?: string | null
        }
        Update: {
          assigned_to?: string | null
          campaign?: string | null
          campaign_name?: string | null
          company_domain?: string | null
          contact?: string | null
          email_click_count?: number
          email_clicked?: boolean | null
          email_enrichment?: Json | null
          email_open_count?: number
          email_opened?: boolean | null
          email_replied?: boolean | null
          email_reply_count?: number
          enrichment_status?: string | null
          esp_code?: number | null
          id?: string
          is_website_visitor?: boolean | null
          last_contacted_from?: string | null
          "lead email"?: string | null
          lead_data?: Json | null
          list_id?: string | null
          lt_interest_status?: number | null
          phone_numbers?: string[] | null
          pl_value_lead?: number | null
          status?: string | null
          status_summary_subseq?: string | null
          subsequence_id?: string | null
          supersearch_enrichment_status?: string | null
          timestamp_added_subsequence?: string | null
          timestamp_created?: string
          timestamp_last_click?: string | null
          timestamp_last_contact?: string | null
          timestamp_last_interest_change?: string | null
          timestamp_last_open?: string | null
          timestamp_last_reply?: string | null
          timestamp_last_touch?: string | null
          upload_method?: string | null
          uploaded_by_user?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      instantly_newform_leads: {
        Row: {
          assigned_to: string | null
          campaign: string | null
          campaign_name: string | null
          company_domain: string | null
          contact: string | null
          email_click_count: number
          email_clicked: boolean | null
          email_enrichment: Json | null
          email_open_count: number
          email_opened: boolean | null
          email_replied: boolean | null
          email_reply_count: number
          enrichment_status: string | null
          esp_code: number | null
          id: string
          is_website_visitor: boolean | null
          last_contacted_from: string | null
          "lead email": string | null
          lead_data: Json | null
          list_id: string | null
          lt_interest_status: number | null
          phone_numbers: string[] | null
          pl_value_lead: number | null
          status: string | null
          status_summary_subseq: string | null
          subsequence_id: string | null
          supersearch_enrichment_status: string | null
          timestamp_added_subsequence: string | null
          timestamp_created: string
          timestamp_last_click: string | null
          timestamp_last_contact: string | null
          timestamp_last_interest_change: string | null
          timestamp_last_open: string | null
          timestamp_last_reply: string | null
          timestamp_last_touch: string | null
          upload_method: string | null
          uploaded_by_user: string | null
          verification_status: string | null
        }
        Insert: {
          assigned_to?: string | null
          campaign?: string | null
          campaign_name?: string | null
          company_domain?: string | null
          contact?: string | null
          email_click_count?: number
          email_clicked?: boolean | null
          email_enrichment?: Json | null
          email_open_count?: number
          email_opened?: boolean | null
          email_replied?: boolean | null
          email_reply_count?: number
          enrichment_status?: string | null
          esp_code?: number | null
          id?: string
          is_website_visitor?: boolean | null
          last_contacted_from?: string | null
          "lead email"?: string | null
          lead_data?: Json | null
          list_id?: string | null
          lt_interest_status?: number | null
          phone_numbers?: string[] | null
          pl_value_lead?: number | null
          status?: string | null
          status_summary_subseq?: string | null
          subsequence_id?: string | null
          supersearch_enrichment_status?: string | null
          timestamp_added_subsequence?: string | null
          timestamp_created?: string
          timestamp_last_click?: string | null
          timestamp_last_contact?: string | null
          timestamp_last_interest_change?: string | null
          timestamp_last_open?: string | null
          timestamp_last_reply?: string | null
          timestamp_last_touch?: string | null
          upload_method?: string | null
          uploaded_by_user?: string | null
          verification_status?: string | null
        }
        Update: {
          assigned_to?: string | null
          campaign?: string | null
          campaign_name?: string | null
          company_domain?: string | null
          contact?: string | null
          email_click_count?: number
          email_clicked?: boolean | null
          email_enrichment?: Json | null
          email_open_count?: number
          email_opened?: boolean | null
          email_replied?: boolean | null
          email_reply_count?: number
          enrichment_status?: string | null
          esp_code?: number | null
          id?: string
          is_website_visitor?: boolean | null
          last_contacted_from?: string | null
          "lead email"?: string | null
          lead_data?: Json | null
          list_id?: string | null
          lt_interest_status?: number | null
          phone_numbers?: string[] | null
          pl_value_lead?: number | null
          status?: string | null
          status_summary_subseq?: string | null
          subsequence_id?: string | null
          supersearch_enrichment_status?: string | null
          timestamp_added_subsequence?: string | null
          timestamp_created?: string
          timestamp_last_click?: string | null
          timestamp_last_contact?: string | null
          timestamp_last_interest_change?: string | null
          timestamp_last_open?: string | null
          timestamp_last_reply?: string | null
          timestamp_last_touch?: string | null
          upload_method?: string | null
          uploaded_by_user?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      instantly_plugging_ai_leads: {
        Row: {
          assigned_to: string | null
          campaign: string | null
          campaign_name: string | null
          company_domain: string | null
          contact: string | null
          email_click_count: number
          email_clicked: boolean | null
          email_enrichment: Json | null
          email_open_count: number
          email_opened: boolean | null
          email_replied: boolean | null
          email_reply_count: number
          enrichment_status: string | null
          esp_code: number | null
          id: string
          is_website_visitor: boolean | null
          last_contacted_from: string | null
          "lead email": string | null
          lead_data: Json | null
          list_id: string | null
          lt_interest_status: number | null
          phone_numbers: string[] | null
          pl_value_lead: number | null
          status: string | null
          status_summary_subseq: string | null
          subsequence_id: string | null
          supersearch_enrichment_status: string | null
          timestamp_added_subsequence: string | null
          timestamp_created: string
          timestamp_last_click: string | null
          timestamp_last_contact: string | null
          timestamp_last_interest_change: string | null
          timestamp_last_open: string | null
          timestamp_last_reply: string | null
          timestamp_last_touch: string | null
          upload_method: string | null
          uploaded_by_user: string | null
          verification_status: string | null
        }
        Insert: {
          assigned_to?: string | null
          campaign?: string | null
          campaign_name?: string | null
          company_domain?: string | null
          contact?: string | null
          email_click_count?: number
          email_clicked?: boolean | null
          email_enrichment?: Json | null
          email_open_count?: number
          email_opened?: boolean | null
          email_replied?: boolean | null
          email_reply_count?: number
          enrichment_status?: string | null
          esp_code?: number | null
          id?: string
          is_website_visitor?: boolean | null
          last_contacted_from?: string | null
          "lead email"?: string | null
          lead_data?: Json | null
          list_id?: string | null
          lt_interest_status?: number | null
          phone_numbers?: string[] | null
          pl_value_lead?: number | null
          status?: string | null
          status_summary_subseq?: string | null
          subsequence_id?: string | null
          supersearch_enrichment_status?: string | null
          timestamp_added_subsequence?: string | null
          timestamp_created?: string
          timestamp_last_click?: string | null
          timestamp_last_contact?: string | null
          timestamp_last_interest_change?: string | null
          timestamp_last_open?: string | null
          timestamp_last_reply?: string | null
          timestamp_last_touch?: string | null
          upload_method?: string | null
          uploaded_by_user?: string | null
          verification_status?: string | null
        }
        Update: {
          assigned_to?: string | null
          campaign?: string | null
          campaign_name?: string | null
          company_domain?: string | null
          contact?: string | null
          email_click_count?: number
          email_clicked?: boolean | null
          email_enrichment?: Json | null
          email_open_count?: number
          email_opened?: boolean | null
          email_replied?: boolean | null
          email_reply_count?: number
          enrichment_status?: string | null
          esp_code?: number | null
          id?: string
          is_website_visitor?: boolean | null
          last_contacted_from?: string | null
          "lead email"?: string | null
          lead_data?: Json | null
          list_id?: string | null
          lt_interest_status?: number | null
          phone_numbers?: string[] | null
          pl_value_lead?: number | null
          status?: string | null
          status_summary_subseq?: string | null
          subsequence_id?: string | null
          supersearch_enrichment_status?: string | null
          timestamp_added_subsequence?: string | null
          timestamp_created?: string
          timestamp_last_click?: string | null
          timestamp_last_contact?: string | null
          timestamp_last_interest_change?: string | null
          timestamp_last_open?: string | null
          timestamp_last_reply?: string | null
          timestamp_last_touch?: string | null
          upload_method?: string | null
          uploaded_by_user?: string | null
          verification_status?: string | null
        }
        Relationships: []
      }
      "Linkedin Ads company": {
        Row: {
          adId: number
          advertiserLogo: string | null
          advertiserName: string | null
          advertiserUrl: string | null
          affiliatedOrganizationsByEmployees: Json | null
          affiliatedOrganizationsByShowcases: Json | null
          body: string | null
          callToAction: string | null
          clickUrl: string | null
          companyId: number | null
          companyName: string | null
          created_at: string
          croppedCoverImage: string | null
          crunchbaseFundingData: Json | null
          ctas: string[] | null
          description: string | null
          "email body": string | null
          "email subject": string | null
          employeeCount: number | null
          employeeCountRange: string | null
          end_date: string | null
          followerCount: number | null
          format: string | null
          foundedOn: string | null
          hashtag: string | null
          headline: string | null
          headquarter: Json | null
          imageUrl: string | null
          impressions: string | null
          impressionsPerCountry: Json | null
          industry: string | null
          industryV2Taxonomy: Json | null
          locations: Json | null
          logoResolutionResult: Json | null
          originalCoverImage: string | null
          paidBy: string | null
          reason: string | null
          score: number | null
          similarOrganizations: Json | null
          specialities: string[] | null
          start_date: string | null
          startUrl: string | null
          tagline: string | null
          targeting: Json | null
          universalName: string | null
          url: string | null
          websiteUrl: string | null
        }
        Insert: {
          adId: number
          advertiserLogo?: string | null
          advertiserName?: string | null
          advertiserUrl?: string | null
          affiliatedOrganizationsByEmployees?: Json | null
          affiliatedOrganizationsByShowcases?: Json | null
          body?: string | null
          callToAction?: string | null
          clickUrl?: string | null
          companyId?: number | null
          companyName?: string | null
          created_at?: string
          croppedCoverImage?: string | null
          crunchbaseFundingData?: Json | null
          ctas?: string[] | null
          description?: string | null
          "email body"?: string | null
          "email subject"?: string | null
          employeeCount?: number | null
          employeeCountRange?: string | null
          end_date?: string | null
          followerCount?: number | null
          format?: string | null
          foundedOn?: string | null
          hashtag?: string | null
          headline?: string | null
          headquarter?: Json | null
          imageUrl?: string | null
          impressions?: string | null
          impressionsPerCountry?: Json | null
          industry?: string | null
          industryV2Taxonomy?: Json | null
          locations?: Json | null
          logoResolutionResult?: Json | null
          originalCoverImage?: string | null
          paidBy?: string | null
          reason?: string | null
          score?: number | null
          similarOrganizations?: Json | null
          specialities?: string[] | null
          start_date?: string | null
          startUrl?: string | null
          tagline?: string | null
          targeting?: Json | null
          universalName?: string | null
          url?: string | null
          websiteUrl?: string | null
        }
        Update: {
          adId?: number
          advertiserLogo?: string | null
          advertiserName?: string | null
          advertiserUrl?: string | null
          affiliatedOrganizationsByEmployees?: Json | null
          affiliatedOrganizationsByShowcases?: Json | null
          body?: string | null
          callToAction?: string | null
          clickUrl?: string | null
          companyId?: number | null
          companyName?: string | null
          created_at?: string
          croppedCoverImage?: string | null
          crunchbaseFundingData?: Json | null
          ctas?: string[] | null
          description?: string | null
          "email body"?: string | null
          "email subject"?: string | null
          employeeCount?: number | null
          employeeCountRange?: string | null
          end_date?: string | null
          followerCount?: number | null
          format?: string | null
          foundedOn?: string | null
          hashtag?: string | null
          headline?: string | null
          headquarter?: Json | null
          imageUrl?: string | null
          impressions?: string | null
          impressionsPerCountry?: Json | null
          industry?: string | null
          industryV2Taxonomy?: Json | null
          locations?: Json | null
          logoResolutionResult?: Json | null
          originalCoverImage?: string | null
          paidBy?: string | null
          reason?: string | null
          score?: number | null
          similarOrganizations?: Json | null
          specialities?: string[] | null
          start_date?: string | null
          startUrl?: string | null
          tagline?: string | null
          targeting?: Json | null
          universalName?: string | null
          url?: string | null
          websiteUrl?: string | null
        }
        Relationships: []
      }
      product_hunt: {
        Row: {
          callToAction: Json | null
          categories: string[] | null
          companyId: number | null
          companyName: string | null
          date: string | null
          description: string | null
          employeeCount: number | null
          employeeCountRange: Json | null
          followerCount: number | null
          hashtag: string | null
          headquarter: Json | null
          industry: string | null
          industryV2Taxonomy: string | null
          launch_date: string | null
          linkedin_url: string | null
          locations: string[] | null
          name: string | null
          reason: string | null
          score: number | null
          short_description: string | null
          specialities: string[] | null
          tagline: string | null
          title: string | null
          universalName: string | null
          upvotes: number | null
          url: string
          website_email: string | null
          website_raw_text: string | null
          website_title: string | null
          website_url: string | null
        }
        Insert: {
          callToAction?: Json | null
          categories?: string[] | null
          companyId?: number | null
          companyName?: string | null
          date?: string | null
          description?: string | null
          employeeCount?: number | null
          employeeCountRange?: Json | null
          followerCount?: number | null
          hashtag?: string | null
          headquarter?: Json | null
          industry?: string | null
          industryV2Taxonomy?: string | null
          launch_date?: string | null
          linkedin_url?: string | null
          locations?: string[] | null
          name?: string | null
          reason?: string | null
          score?: number | null
          short_description?: string | null
          specialities?: string[] | null
          tagline?: string | null
          title?: string | null
          universalName?: string | null
          upvotes?: number | null
          url: string
          website_email?: string | null
          website_raw_text?: string | null
          website_title?: string | null
          website_url?: string | null
        }
        Update: {
          callToAction?: Json | null
          categories?: string[] | null
          companyId?: number | null
          companyName?: string | null
          date?: string | null
          description?: string | null
          employeeCount?: number | null
          employeeCountRange?: Json | null
          followerCount?: number | null
          hashtag?: string | null
          headquarter?: Json | null
          industry?: string | null
          industryV2Taxonomy?: string | null
          launch_date?: string | null
          linkedin_url?: string | null
          locations?: string[] | null
          name?: string | null
          reason?: string | null
          score?: number | null
          short_description?: string | null
          specialities?: string[] | null
          tagline?: string | null
          title?: string | null
          universalName?: string | null
          upvotes?: number | null
          url?: string
          website_email?: string | null
          website_raw_text?: string | null
          website_title?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      prospects: {
        Row: {
          business_id: string | null
          city: string | null
          company_linkedin: string | null
          company_name: string | null
          company_website: string | null
          country_name: string | null
          experience: string | null
          first_name: string | null
          full_name: string | null
          interests: string | null
          job_department: string | null
          job_seniority_level: string | null
          job_title: string | null
          last_name: string | null
          linkedin: string | null
          professional_email_hashed: string | null
          prospect_id: string
          region_name: string | null
          skills: string | null
        }
        Insert: {
          business_id?: string | null
          city?: string | null
          company_linkedin?: string | null
          company_name?: string | null
          company_website?: string | null
          country_name?: string | null
          experience?: string | null
          first_name?: string | null
          full_name?: string | null
          interests?: string | null
          job_department?: string | null
          job_seniority_level?: string | null
          job_title?: string | null
          last_name?: string | null
          linkedin?: string | null
          professional_email_hashed?: string | null
          prospect_id: string
          region_name?: string | null
          skills?: string | null
        }
        Update: {
          business_id?: string | null
          city?: string | null
          company_linkedin?: string | null
          company_name?: string | null
          company_website?: string | null
          country_name?: string | null
          experience?: string | null
          first_name?: string | null
          full_name?: string | null
          interests?: string | null
          job_department?: string | null
          job_seniority_level?: string | null
          job_title?: string | null
          last_name?: string | null
          linkedin?: string | null
          professional_email_hashed?: string | null
          prospect_id?: string
          region_name?: string | null
          skills?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      match_documents: {
        Args: { filter?: Json; match_count?: number; query_embedding: string }
        Returns: {
          content: string
          id: number
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      ad_availability_enum:
        | "active"
        | "paused"
        | "archived"
        | "draft"
        | "expired"
      ad_format_enum: "image" | "video" | "carousel" | "text_only" | "story"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ad_availability_enum: [
        "active",
        "paused",
        "archived",
        "draft",
        "expired",
      ],
      ad_format_enum: ["image", "video", "carousel", "text_only", "story"],
    },
  },
} as const
