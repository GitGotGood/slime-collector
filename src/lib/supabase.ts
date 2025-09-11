import { createClient } from "@supabase/supabase-js";

// Debug environment variables
console.log('🔧 Environment Debug:', {
  VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing',
  allEnvVars: import.meta.env
});

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
