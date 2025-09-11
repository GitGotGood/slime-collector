import { supabase } from "./supabase";
import { getActiveProfileId } from "./profiles";
import type { Profile } from "../core/types";

// Save data structure
export interface CloudSave {
  profile_id: string;
  data: Profile;
  updated_at: string;
}

// Load save data for the active profile
export async function loadSave(): Promise<Profile | null> {
  const profileId = getActiveProfileId();
  if (!profileId) return null;
  
  const { data, error } = await supabase
    .from("saves")
    .select("data, updated_at")
    .eq("profile_id", profileId)
    .maybeSingle();
  
  if (error) throw error;
  return data?.data ?? null;
}

// Save game state for the active profile (dual-write: cloud + localStorage)
export async function saveGame(gameState: Profile): Promise<void> {
  const profileId = getActiveProfileId();
  if (!profileId) throw new Error("No active profile");
  
  const timestamp = new Date().toISOString();
  
  // Save to cloud
  const { error } = await supabase
    .from("saves")
    .upsert({ 
      profile_id: profileId, 
      data: gameState, 
      updated_at: timestamp 
    });
  
  if (error) throw error;
  
  // Also save to localStorage as backup (dual-write)
  try {
    const { loadState, saveState } = await import('../core/storage');
    const localStore = loadState();
    
    // Update the specific profile in localStorage
    const updatedProfiles = localStore.profiles.map((p: any) => 
      p.id === profileId 
        ? { ...gameState, id: profileId, updated_at: timestamp }
        : p
    );
    
    // If profile doesn't exist in localStorage, add it
    if (!updatedProfiles.find((p: any) => p.id === profileId)) {
      updatedProfiles.push({ ...gameState, id: profileId, updated_at: timestamp });
    }
    
    const updatedStore = {
      ...localStore,
      profiles: updatedProfiles
    };
    
    saveState(updatedStore);
    console.log('💾 Dual-write: Saved to both cloud and localStorage for profile:', profileId);
    
  } catch (localError) {
    // Don't fail the cloud save if localStorage fails
    console.warn('⚠️ Failed to save to localStorage backup:', localError);
  }
}

// Load save data for a specific profile (useful for migration)
export async function loadSaveForProfile(profileId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("saves")
    .select("data, updated_at")
    .eq("profile_id", profileId)
    .maybeSingle();
  
  if (error) throw error;
  return data?.data ?? null;
}

// Save game state for a specific profile (useful for migration)
export async function saveGameForProfile(profileId: string, gameState: Profile): Promise<void> {
  const { error } = await supabase
    .from("saves")
    .upsert({ 
      profile_id: profileId, 
      data: gameState, 
      updated_at: new Date().toISOString() 
    });
  
  if (error) throw error;
}

// Get save metadata (when was it last updated)
export async function getSaveMetadata(profileId: string): Promise<{ updated_at: string } | null> {
  const { data, error } = await supabase
    .from("saves")
    .select("updated_at")
    .eq("profile_id", profileId)
    .maybeSingle();
  
  if (error) throw error;
  return data;
}

// Delete save data for a profile
export async function deleteSave(profileId: string): Promise<void> {
  const { error } = await supabase
    .from("saves")
    .delete()
    .eq("profile_id", profileId);
  
  if (error) throw error;
}

