import { createClient } from "@supabase/supabase-js";

// Context [Sep-11-2025]: User had white screen on Netlify deployment - needed to debug env vars
// What: Added comprehensive debug logging to diagnose missing environment variables  
// Why: Supabase client was failing silently with undefined env vars, preventing app startup
// Goal: Ensure environment variables load correctly in production and provide clear debugging info
console.log('🔧 SUPABASE FILE LOADED!');
console.log('🔧 Environment Debug:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing',
  allEnvVars: import.meta.env
});

// Add error handling for client creation
try {
  if (!import.meta.env.VITE_SUPABASE_URL) {
    console.error('❌ VITE_SUPABASE_URL is undefined!');
  }
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
    console.error('❌ VITE_SUPABASE_ANON_KEY is undefined!');
  }
} catch (error) {
  console.error('❌ Error checking environment variables:', error);
}

// Create Supabase client
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

// Auth helper functions
export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({ 
    provider: "google",
    options: {
      redirectTo: window.location.origin
    }
  });
  if (error) throw error;
}

export async function signOutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function onAuthChange(cb: (user: any) => void) {
  return supabase.auth.onAuthStateChange((_event, session) => {
    cb(session?.user ?? null);
  });
}

export async function currentUserId() {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}
