# Supabase Setup Guide

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Choose a project name (e.g., "slime-collector")
3. Set a strong database password
4. Select a region close to your users

## 2. Configure Google OAuth

1. In your Supabase dashboard, go to **Authentication → Providers**
2. Enable **Google** provider
3. You'll need to create a Google OAuth app:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add your domains to authorized origins:
     - `http://localhost:5173` (development)
     - Your production domain (e.g., `https://yourapp.netlify.app`)
   - Copy Client ID and Client Secret to Supabase

## 3. Set Up Database

1. In Supabase dashboard, go to **SQL Editor**
2. Copy and paste the contents of `database-setup.sql`
3. Click **Run** to execute the schema

## 4. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from **Supabase Dashboard → Settings → API**

## 5. Update Site URLs

1. In Supabase dashboard, go to **Authentication → URL Configuration**
2. Set **Site URL** to your production domain
3. Add **Redirect URLs**:
   - `http://localhost:5173` (development)
   - Your production domain

## 6. Test the Setup

1. Start your development server: `npm run dev`
2. Try logging in with Google
3. Check that profiles and saves are created in your Supabase database

## Migration Notes

- Your existing players will see a migration dialog on first login
- First device creates a family code for linking additional devices
- Family codes expire after 24 hours
- All existing localStorage data is preserved during migration

## Security

- Row Level Security (RLS) ensures families can only see their own data
- Google OAuth handles authentication securely
- All database operations are protected by Supabase's built-in security

## Troubleshooting

- **Google login not working**: Check OAuth redirect URLs match exactly
- **Database permissions**: Verify RLS policies are enabled
- **Migration issues**: Check browser console for detailed error messages


