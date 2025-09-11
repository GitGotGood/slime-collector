import { supabase } from "./supabase";

// Profile types
export interface KidProfile {
  id: string;
  account_user_id: string;
  name: string;
  avatar_url?: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

// Profile management functions
export async function listProfiles(): Promise<KidProfile[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });
  
  if (error) throw error;
  return data ?? [];
}

export async function createProfile(name: string, isDefault = false): Promise<KidProfile> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not signed in");
  
  const { data, error } = await supabase
    .from("profiles")
    .insert({ 
      name, 
      is_default: isDefault, 
      account_user_id: user.user.id 
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updateProfile(profileId: string, updates: Partial<Pick<KidProfile, 'name' | 'avatar_url' | 'is_default'>>): Promise<KidProfile> {
  const { data, error } = await supabase
    .from("profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq("id", profileId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function deleteProfile(profileId: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", profileId);
  
  if (error) throw error;
}

// Active profile management (localStorage for device-specific preferences)
export function setActiveProfileId(id: string | null): void {
  if (id) {
    localStorage.setItem("active_profile_id", id);
  } else {
    localStorage.removeItem("active_profile_id");
  }
}

export function getActiveProfileId(): string | null {
  return localStorage.getItem("active_profile_id");
}

// Preferred profile for this device (remembers last selection)
export function setPreferredProfileId(id: string): void {
  localStorage.setItem("preferred_profile_id", id);
}

export function getPreferredProfileId(): string | null {
  return localStorage.getItem("preferred_profile_id");
}

// Helper to select the best default profile
export function selectDefaultProfile(profiles: KidProfile[]): KidProfile | null {
  if (profiles.length === 0) return null;
  
  // 1. Try preferred profile from this device
  const preferredId = getPreferredProfileId();
  if (preferredId) {
    const preferred = profiles.find(p => p.id === preferredId);
    if (preferred) return preferred;
  }
  
  // 2. Try marked default profile
  const defaultProfile = profiles.find(p => p.is_default);
  if (defaultProfile) return defaultProfile;
  
  // 3. Fall back to first profile
  return profiles[0];
}

