# Vercel Deployment Guide for ICP Agent Project

## Environment Variables Required

### Required Variables (Set in Vercel Dashboard)
```
VITE_SUPABASE_URL=https://sczozpkrjtmozowhebhh.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjem96cGtyanRtb3pvd2hlYmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDU4NTcsImV4cCI6MjA2NDE4MTg1N30.cFFIqokRIKTeJg5rkdomI1nzNc35iIDWu1vNLnWlgAE
```

### Optional Variables
```
VITE_APP_NAME=PluggingAI-ICP
VITE_APP_DESCRIPTION=Lovable Generated Project
```

## Build Settings
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Root Directory**: `.` (leave empty)

## Deployment Checklist

### Pre-Deployment
- [ ] Update Supabase client to use environment variables
- [ ] Test build locally with `npm run build`
- [ ] Verify all routes work in production build
- [ ] Check static assets are properly referenced

### Vercel Dashboard Setup
- [ ] Connect GitHub repository
- [ ] Set environment variables
- [ ] Configure build settings
- [ ] Set up custom domain (optional)

### Post-Deployment
- [ ] Test all routes: `/`, `/dashboard/*`
- [ ] Verify Supabase connection
- [ ] Check CSV export functionality
- [ ] Test responsive design
- [ ] Verify favicon loads correctly

## Common Issues & Solutions

### 1. 404 on Refresh (SPA Routing)
**Solution**: Already handled by `vercel.json` rewrites

### 2. Supabase Connection Issues
**Solution**: Ensure environment variables are set correctly

### 3. Static Assets Not Loading
**Solution**: Check public folder structure and asset paths

### 4. Build Failures
**Solution**: Check TypeScript errors and dependencies

## Performance Optimizations
- Static assets are cached for 1 year
- Gzip compression enabled by default
- CDN distribution worldwide
- Automatic HTTPS

## Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
