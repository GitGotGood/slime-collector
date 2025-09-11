import { supabase } from "./supabase";
import { createProfile, type KidProfile } from "./profiles";
import { saveGameForProfile } from "./saves";
import type { Profile } from "../core/types";

// Migration code types
export interface MigrationCode {
  code: string;
  account_user_id: string;
  expires_at: string;
  used: boolean;
}

// Generate a 6-digit family code
function generateFamilyCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Create a migration code for the current user
export async function createMigrationCode(): Promise<string> {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not signed in");
  
  const code = generateFamilyCode();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiry
  
  const { error } = await supabase
    .from("migration_codes")
    .insert({
      code,
      account_user_id: user.user.id,
      expires_at: expiresAt.toISOString(),
      used: false
    });
  
  if (error) throw error;
  return code;
}

// Verify and consume a migration code
export async function verifyMigrationCode(code: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("migration_codes")
    .select("account_user_id, expires_at, used")
    .eq("code", code.toUpperCase())
    .maybeSingle();
  
  if (error) throw error;
  if (!data) return null;
  
  // Check if expired
  if (new Date(data.expires_at) < new Date()) return null;
  
  // Check if already used
  if (data.used) return null;
  
  // Mark as used
  await supabase
    .from("migration_codes")
    .update({ used: true })
    .eq("code", code.toUpperCase());
  
  return data.account_user_id;
}

// Check if user has existing localStorage data
export function hasLocalStorageData(): boolean {
  const profile = localStorage.getItem('slime-collector-profile');
  return profile !== null;
}

// Get localStorage profile data
export function getLocalStorageProfile(): Profile | null {
  try {
    const stored = localStorage.getItem('slime-collector-profile');
    if (!stored) return null;
    return JSON.parse(stored) as Profile;
  } catch {
    return null;
  }
}

// Migration workflow for first device (creates family code)
export async function migrateFirstDevice(profileName: string): Promise<{ profile: KidProfile; familyCode: string }> {
  const localData = getLocalStorageProfile();
  if (!localData) throw new Error("No local data to migrate");
  
  // Create kid profile
  const profile = await createProfile(profileName, true);
  
  // Save the game data to cloud
  await saveGameForProfile(profile.id, localData);
  
  // Generate family code for additional devices
  const familyCode = await createMigrationCode();
  
  // Mark migration as complete in localStorage
  localStorage.setItem('migration_completed', 'true');
  
  return { profile, familyCode };
}

// Migration workflow for additional devices (uses family code)
export async function migrateAdditionalDevice(profileName: string, familyCode: string): Promise<KidProfile> {
  const localData = getLocalStorageProfile();
  if (!localData) throw new Error("No local data to migrate");
  
  // Verify the family code and get the parent account
  const parentUserId = await verifyMigrationCode(familyCode);
  if (!parentUserId) throw new Error("Invalid or expired family code");
  
  // Create kid profile under the parent account
  const profile = await createProfile(profileName, false);
  
  // Save the game data to cloud
  await saveGameForProfile(profile.id, localData);
  
  // Mark migration as complete in localStorage
  localStorage.setItem('migration_completed', 'true');
  
  return profile;
}

// Check if migration has been completed on this device
export function isMigrationCompleted(): boolean {
  return localStorage.getItem('migration_completed') === 'true';
}

// Clear local storage after successful migration (optional)
export function clearLocalStorageAfterMigration(): void {
  // Keep a backup just in case
  const profile = localStorage.getItem('slime-collector-profile');
  if (profile) {
    localStorage.setItem('slime-collector-profile-backup', profile);
  }
  
  // Clear the main profile
  localStorage.removeItem('slime-collector-profile');
}

// Cleanup expired migration codes (can be called periodically)
export async function cleanupExpiredCodes(): Promise<void> {
  const { error } = await supabase
    .from("migration_codes")
    .delete()
    .lt("expires_at", new Date().toISOString());
  
  if (error) throw error;
}


