import React from 'react';
import { onAuthChange, signOutUser } from '../../lib/supabase';
import { authLogger } from '../../lib/debug';
import { 
  listProfiles, 
  createProfile, 
  setActiveProfileId, 
  getActiveProfileId, 
  selectDefaultProfile,
  setPreferredProfileId,
  type KidProfile 
} from '../../lib/profiles';
import { 
  hasLocalStorageData, 
  isMigrationCompleted, 
  migrateFirstDevice, 
  migrateAdditionalDevice 
} from '../../lib/migration';
import { loadState } from '../../core/storage';
import { LoginModal } from './LoginModal';
import { ProfileSelector, CreateProfileModal } from './ProfileSelector';
import { MigrationModal } from './MigrationModal';

interface AuthContextType {
  user: any;
  profiles: KidProfile[];
  activeProfile: KidProfile | null;
  isLoading: boolean;
  isOfflineMode: boolean;
  signOut: () => Promise<void>;
  refreshProfiles: () => Promise<void>;
  refreshOfflineProfiles: () => void;
  selectProfile: (profileId: string) => Promise<void>;
  exitOfflineMode: () => void;
  createProfile: (name: string) => Promise<void>;
  deleteProfile: (profileId: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  authLogger.log('AuthProvider initialized', { timestamp: new Date().toISOString() });
  const [user, setUser] = React.useState<any>(null);
  const [profiles, setProfiles] = React.useState<KidProfile[]>([]);
  const [activeProfile, setActiveProfile] = React.useState<KidProfile | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [profilesLoading, setProfilesLoading] = React.useState(false);
  const [isOfflineMode, setIsOfflineMode] = React.useState(false);
  const [networkError, setNetworkError] = React.useState(false);
  
  // Modal states
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showProfileSelector, setShowProfileSelector] = React.useState(false);
  const [showCreateProfile, setShowCreateProfile] = React.useState(false);
  const [showMigrationModal, setShowMigrationModal] = React.useState(false);
  const [syncInProgress, setSyncInProgress] = React.useState(false);
  const [hasCompletedInitialSync, setHasCompletedInitialSync] = React.useState(false);

  // Load profiles and handle auth state
  const refreshProfiles = async (currentUser?: any) => {
    const userToCheck = currentUser || user;
    if (!userToCheck) {
      if (import.meta.env.DEV) console.log('🚫 RefreshProfiles: No user provided, skipping');
      setProfiles([]);
      setActiveProfile(null);
      setProfilesLoading(false);
      return [];
    }

    try {
      setProfilesLoading(true);
      authLogger.log('Loading profiles from database', { userEmail: userToCheck.email });
      const userProfiles = await listProfiles();
      authLogger.log('Profiles loaded', { 
        count: userProfiles.length, 
        profiles: userProfiles.map(p => ({ name: p.name, id: p.id }))
      });
      setProfiles(userProfiles);

      // Handle profile selection
      const activeId = getActiveProfileId();
      if (activeId) {
        const activeProf = userProfiles.find(p => p.id === activeId);
        if (activeProf) {
          authLogger.log('Active profile restored', { profileName: activeProf.name, profileId: activeProf.id });
          setActiveProfile(activeProf);
          setProfilesLoading(false);
          return userProfiles;
        }
      }

      // Don't auto-select - let user choose from profile picker
      if (userProfiles.length === 0) {
        console.log('🆕 No profiles found, checking for migration...');
        // No profiles exist - check for migration
        if (hasLocalStorageData() && !isMigrationCompleted()) {
          setShowMigrationModal(true);
        } else {
          setShowCreateProfile(true);
        }
      }
      setProfilesLoading(false);
      return userProfiles;
    } catch (error) {
        console.error('❌ Failed to load profiles:', error);
        console.error('❌ Error details:', error.message, error.details);
        setProfilesLoading(false);
        
        // Check if this is a network error and trigger offline mode
        if (error.message?.includes('fetch') || error.message?.includes('network') || 
            error.message?.includes('Failed to fetch') || error.details?.includes('Failed to fetch')) {
          handleNetworkError();
          return;
        }
        
        // Still show create profile option if we can't load profiles
        setShowCreateProfile(true);
      }
  };

  // Load fresh localStorage profiles for offline mode
  const loadOfflineProfiles = () => {
    try {
      const localState = loadState();
      console.log('📱 Loading fresh local state:', {
        profiles: localState.profiles.length,
        currentId: localState.currentId
      });
      
      const localProfiles = localState.profiles.map((p: any) => ({
        id: p.id,
        name: p.name,
        account_user_id: 'offline',
        avatar_url: null,
        is_default: false,
        created_at: new Date().toISOString(),
        // Include the full profile data for offline stats
        ...p
      }));
      
      console.log('📱 Local profiles mapped:', localProfiles.map(p => ({ 
        id: p.id, 
        name: p.name, 
        goo: p.goo, 
        xp: p.xp 
      })));
      setProfiles(localProfiles);
      
      // Update active profile with fresh data if it exists
      if (localState.currentId && localProfiles.length > 0) {
        const activeProf = localProfiles.find((p: any) => p.id === localState.currentId);
        if (activeProf) {
          console.log('📱 Updated active profile with fresh data:', activeProf.name, 'Goo:', activeProf.goo);
          setActiveProfile(activeProf);
        }
      }
      
      return localProfiles;
    } catch (error) {
      console.error('❌ Failed to load local profiles:', error);
      setProfiles([]);
      return [];
    }
  };

  // Network error handler
  const handleNetworkError = () => {
    console.log('🔌 Network error detected, enabling offline mode');
    setNetworkError(true);
    setIsOfflineMode(true);
    setIsLoading(false);
    setShowLoginModal(false);
    
    // Load fresh profiles from localStorage
    loadOfflineProfiles();
    
    // Always show profile selector in offline mode for clear UX
    console.log('📱 Always showing profile selector in offline mode for clear UX');
    setShowProfileSelector(true);
  };

  // Auth state listener
  React.useEffect(() => {
    console.log('🔄 AuthProvider: Setting up auth listener');
    
    const { data } = onAuthChange(async (newUser) => {
      console.log('🔄 AuthProvider: Auth state changed, user:', newUser?.email || 'null');
      setUser(newUser);
      setIsLoading(false);
      
      if (newUser) {
        console.log('🔄 AuthProvider: User authenticated, calling refreshProfiles');
        try {
          const loadedProfiles = await refreshProfiles(newUser);
          
          // Check for offline data that needs to be synced (pass loaded profiles)
          await handleOfflineToOnlineSync(newUser, loadedProfiles);
        } catch (error) {
          console.error('❌ Failed to load profiles, checking for network error:', error);
          if (error.message?.includes('fetch') || error.message?.includes('network') || 
              error.message?.includes('Failed to fetch') || error.details?.includes('Failed to fetch')) {
            handleNetworkError();
            return;
          }
        }
      } else {
        console.log('🔄 AuthProvider: No user, clearing profiles');
        setProfiles([]);
        setActiveProfile(null);
        setActiveProfileId(null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  // Debug localStorage on mount
  React.useEffect(() => {
    console.log('🔍 Checking localStorage data on mount...');
    try {
      const localState = loadState();
      console.log('📱 LocalStorage state:', {
        profiles: localState.profiles.length,
        currentId: localState.currentId,
        profileNames: localState.profiles.map((p: any) => p.name)
      });
    } catch (error) {
      console.log('📱 No localStorage data found:', error.message);
    }
  }, []);

  // Detect initial network connectivity
  React.useEffect(() => {
    const checkInitialConnectivity = async () => {
      console.log('🌐 Starting initial network connectivity check...');
      try {
        // Try to reach Supabase with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Context [Sep-11-2025]: User reported white screen on Netlify, then 404 errors during iPad OAuth
        // What: Changed hardcoded Supabase URL to environment variable for network connectivity check
        // Why: Hardcoded URL had typo (coqnrjx vs cqpnrjx) causing 404s, plus needed dynamic URLs for env flexibility
        // Goal: Enable proper OAuth flow across all environments and prevent hardcoded URL maintenance issues
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/auth/v1/settings`, {
          signal: controller.signal,
          method: 'GET'
        });
        
        clearTimeout(timeoutId);
        console.log('✅ Network connectivity confirmed');
      } catch (error) {
        console.log('🔌 Initial network check failed, enabling offline mode', error.message);
        handleNetworkError();
      }
    };

    // Longer delay to give user time to choose login vs offline
    console.log('⏱️ Scheduling network check in 8 seconds...');
    setTimeout(checkInitialConnectivity, 8000);
  }, []);

  // Show login modal if not authenticated and not in offline mode
  React.useEffect(() => {
    if (!isLoading && !user && !isOfflineMode) {
      setShowLoginModal(true);
    } else {
      setShowLoginModal(false);
    }
  }, [user, isLoading, isOfflineMode]);

  const handleSignOut = async () => {
    await signOutUser();
    setActiveProfileId(null);
  };

  const handleExitOfflineMode = () => {
    console.log('🌐 Exiting offline mode...');
    setIsOfflineMode(false);
    setNetworkError(false);
    setProfiles([]);
    setActiveProfile(null);
    setShowProfileSelector(false);
    setShowLoginModal(true);
  };

  const handleOfflineToOnlineSync = async (user: any, cloudProfiles?: any[]) => {
    // Prevent multiple simultaneous syncs and only sync once per session
    if (syncInProgress || hasCompletedInitialSync) {
      console.log('⏭️ Sync already in progress or completed, skipping...', {
        syncInProgress,
        hasCompletedInitialSync
      });
      return;
    }
    
    try {
      setSyncInProgress(true);
      console.log('🔄 Checking for offline data to sync...');
      
      // Load local storage data
      const { loadState } = await import('../../core/storage');
      const localState = loadState();
      
      if (!localState.profiles || localState.profiles.length === 0) {
        console.log('📭 No local profiles to sync');
        setHasCompletedInitialSync(true);
        return;
      }
      
      console.log('📦 Found local data to sync:', {
        profileCount: localState.profiles.length,
        currentId: localState.currentId
      });
      
      // Get current cloud profiles (use passed profiles or fallback to state)
      const profilesForSync = cloudProfiles || profiles;
      console.log('☁️ Current cloud profiles for sync:', profilesForSync.map(cp => ({ id: cp.id, name: cp.name })));
      
      // Sync logic for each local profile
      for (const localProfile of localState.profiles) {
        await syncLocalProfileToCloud(localProfile, profilesForSync, user);
      }
      
      // Refresh profiles after sync
      await refreshProfiles(user);
      
      // Mark sync as completed for this session
      setHasCompletedInitialSync(true);
      console.log('✅ Initial sync completed for session');
      
    } catch (error) {
      console.error('❌ Failed to sync offline data:', error);
    } finally {
      setSyncInProgress(false);
    }
  };

  const syncLocalProfileToCloud = async (localProfile: any, cloudProfiles: any[], user: any) => {
    try {
      console.log('🔍 Syncing profile:', {
        localName: localProfile.name,
        localId: localProfile.id,
        localGoo: localProfile.goo,
        localXP: localProfile.xp,
        localUpdatedAt: localProfile.updated_at,
        isOfflineId: localProfile.id.startsWith('offline-'),
        synced: localProfile.synced
      });
      
      // Skip if already synced (prevent duplicate uploads)
      if (localProfile.synced && !localProfile.id.startsWith('offline-')) {
        console.log('⏭️ Profile already synced, skipping:', localProfile.name);
        return;
      }
      
      // Strategy 1: Exact ID match (existing profile)
      const exactMatch = cloudProfiles.find(cp => cp.id === localProfile.id);
      
      if (exactMatch) {
        console.log('🔄 Found exact match, merging progress for:', localProfile.name);
        await mergeProfileProgress(localProfile, exactMatch);
        return;
      }
      
      // Strategy 2: Name-based duplicate detection (prevent creating duplicates)
      const nameMatch = cloudProfiles.find(cp => cp.name === localProfile.name);
      
      if (nameMatch && localProfile.id.startsWith('offline-')) {
        console.log('🔗 Found name match for offline profile, merging instead of creating duplicate:', localProfile.name);
        await mergeProfileProgress(localProfile, nameMatch);
        return;
      }
      
      // Strategy 3: Create new profile (only for offline profiles)
      if (localProfile.id.startsWith('offline-')) {
        console.log('📤 Creating new cloud profile for offline profile:', localProfile.name);
        await createNewCloudProfile(localProfile);
        return;
      }
      
      // Strategy 4: Existing cloud profile not found locally (download it)
      console.log('⬇️ Profile exists in cloud but not locally, will be downloaded on next refresh:', localProfile.name);
      
    } catch (error) {
      console.error('❌ Failed to sync profile:', localProfile.name, error);
    }
  };
  
  const mergeProfileProgress = async (localProfile: any, cloudProfile: any) => {
    // Timestamp-based conflict resolution with fallbacks
    const localTimestamp = new Date(localProfile.updated_at || '2025-01-01'); // Assume recent if no timestamp
    const cloudTimestamp = new Date(cloudProfile.updated_at || '1970-01-01'); // Assume old if no timestamp
    
    console.log('📊 Timestamp comparison:', {
      local: localProfile.updated_at,
      cloud: cloudProfile.updated_at,
      localIsNewer: localTimestamp > cloudTimestamp
    });
    
    let finalData;
    
    if (localTimestamp > cloudTimestamp) {
      // Local is newer - use local data but merge conservatively
      console.log('🔄 Local data is newer, merging with cloud data');
      finalData = {
        ...cloudProfile,
        ...localProfile,
        // Conservative merge: take the max of numeric values
        goo: Math.max(localProfile.goo || 0, cloudProfile.goo || 0),
        xp: Math.max(localProfile.xp || 0, cloudProfile.xp || 0),
        // Merge arrays (combine unique items)
        ownedSkins: [...new Set([
          ...(localProfile.ownedSkins || []),
          ...(cloudProfile.ownedSkins || [])
        ])],
        mastered: {
          ...(cloudProfile.mastered || {}),
          ...(localProfile.mastered || {})
        },
        updated_at: new Date().toISOString()
      };
    } else {
      // Cloud is newer or equal - minimal merge (just add any new progress)
      console.log('☁️ Cloud data is newer, adding any new local progress');
      finalData = {
        ...cloudProfile,
        // Only increase if local has more
        goo: Math.max(localProfile.goo || 0, cloudProfile.goo || 0),
        xp: Math.max(localProfile.xp || 0, cloudProfile.xp || 0),
        // Add any new unlocks
        ownedSkins: [...new Set([
          ...(cloudProfile.ownedSkins || []),
          ...(localProfile.ownedSkins || [])
        ])],
        mastered: {
          ...(cloudProfile.mastered || {}),
          ...(localProfile.mastered || {})
        },
        updated_at: cloudProfile.updated_at // Keep cloud timestamp
      };
    }
    
    // Save merged data to cloud
    const { saveGameForProfile } = await import('../../lib/saves');
    await saveGameForProfile(cloudProfile.id, finalData);
    
    // Mark as synced in localStorage
    await markProfileAsSynced(localProfile.id);
    
    console.log('✅ Merged profile progress:', finalData.name);
  };
  
  const createNewCloudProfile = async (localProfile: any) => {
    const { createProfile } = await import('../../lib/profiles');
    const newCloudProfile = await createProfile(localProfile.name, false);
    
    // Save the offline progress to the new cloud profile
    const { saveGameForProfile } = await import('../../lib/saves');
    await saveGameForProfile(newCloudProfile.id, {
      ...localProfile,
      id: newCloudProfile.id,
      updated_at: new Date().toISOString()
    });
    
    // Mark as synced in localStorage
    await markProfileAsSynced(localProfile.id);
    
    console.log('✅ Created new cloud profile:', localProfile.name, '→', newCloudProfile.id);
  };
  
  const markProfileAsSynced = async (profileId: string) => {
    try {
      const { loadState, saveState } = await import('../../core/storage');
      const localStore = loadState();
      
      const updatedProfiles = localStore.profiles.map((p: any) =>
        p.id === profileId ? { ...p, synced: true } : p
      );
      
      saveState({ ...localStore, profiles: updatedProfiles });
      console.log('✅ Marked profile as synced:', profileId);
    } catch (error) {
      console.warn('⚠️ Failed to mark profile as synced:', error);
    }
  };

  const handleSelectProfile = async (profileId: string) => {
    const profile = profiles.find(p => p.id === profileId);
    if (profile) {
      console.log('🔄 AuthProvider: Switching to profile:', profile.name, profile.id);
      
      if (isOfflineMode) {
        // In offline mode, just update localStorage
        const { saveState, loadState } = await import('../../core/storage');
        const localState = loadState();
        localState.currentId = profileId;
        saveState(localState);
        console.log('📱 Offline: Updated localStorage currentId to:', profileId);
      } else {
        // In online mode, update cloud preferences
        setActiveProfileId(profileId);
        setPreferredProfileId(profileId);
      }
      
      setActiveProfile(profile);
      // Keep profile selector open for video game UX paradigm
    } else {
      console.error('❌ Profile not found:', profileId, 'Available:', profiles.map(p => p.id));
    }
  };

  const handleCreateProfile = async (name: string) => {
    if (isOfflineMode) {
      // Create offline profile in localStorage
      const { mkProfile, saveState, loadState } = await import('../../core/storage');
      const newId = `offline-${Date.now()}`;
      const newProfile = mkProfile(newId, name, '#22c55e');
      
      // Save to localStorage
      const localState = loadState();
      localState.profiles.push(newProfile);
      localState.currentId = newId;
      saveState(localState);
      
      // Update React state
      const profileForList = {
        id: newId,
        name: name,
        account_user_id: 'offline',
        avatar_url: null,
        is_default: false,
        created_at: new Date().toISOString(),
        ...newProfile
      };
      
      setProfiles(prev => [...prev, profileForList]);
      setActiveProfile(profileForList);
      setShowCreateProfile(false);
      // Keep profile selector open for video game UX paradigm
    } else {
      // Cloud profile creation
      const profile = await createProfile(name, profiles.length === 0);
      setProfiles(prev => [...prev, profile]);
      setActiveProfileId(profile.id);
      setPreferredProfileId(profile.id);
      setActiveProfile(profile);
      setShowCreateProfile(false);
    }
  };

  const handleMigrateFirst = async (playerName: string): Promise<string> => {
    const { profile, familyCode } = await migrateFirstDevice(playerName);
    setProfiles([profile]);
    setActiveProfileId(profile.id);
    setPreferredProfileId(profile.id);
    setActiveProfile(profile);
    return familyCode;
  };

  const handleMigrateAdditional = async (playerName: string, familyCode: string) => {
    const profile = await migrateAdditionalDevice(playerName, familyCode);
    await refreshProfiles(); // Refresh to get updated list
    setActiveProfileId(profile.id);
    setPreferredProfileId(profile.id);
    setActiveProfile(profile);
  };

  const handleDeleteProfile = async (profileId: string) => {
    try {
      if (isOfflineMode) {
        // Delete from localStorage
        const { loadState, saveState } = await import('../../core/storage');
        const store = loadState();
        const updatedStore = {
          ...store,
          profiles: store.profiles.filter((p: any) => p.id !== profileId),
          currentId: store.currentId === profileId ? store.profiles.find((p: any) => p.id !== profileId)?.id : store.currentId
        };
        saveState(updatedStore);
        setProfiles(profiles.filter(p => p.id !== profileId));
        if (activeProfile?.id === profileId) {
          setActiveProfile(null);
        }
        console.log('✅ Deleted offline profile:', profileId);
      } else {
        // Delete from cloud
        console.log('🗑️ Deleting cloud profile and save data:', profileId);
        
        // Delete both profile and associated save data
        const { deleteProfile } = await import('../../lib/profiles');
        const { deleteSave } = await import('../../lib/saves');
        
        await deleteProfile(profileId);
        await deleteSave(profileId);
        
        // Refresh profiles to show updated list
        await refreshProfiles();
        
        // If we just deleted the active profile, clear it
        if (activeProfile?.id === profileId) {
          setActiveProfile(null);
        }
        
        console.log('✅ Cloud profile and save data deleted successfully:', profileId);
      }
    } catch (error) {
      console.error('❌ Failed to delete profile:', error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    profiles,
    activeProfile,
    isLoading,
    isOfflineMode,
    signOut: handleSignOut,
    refreshProfiles,
    refreshOfflineProfiles: loadOfflineProfiles,
    selectProfile: handleSelectProfile,
    exitOfflineMode: handleExitOfflineMode,
    createProfile: handleCreateProfile,
    deleteProfile: handleDeleteProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      
      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onUseOfflineMode={handleNetworkError}
      />

      {/* Loading indicator while profiles load */}
      {user && profilesLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading Profiles...</h3>
            <p className="text-gray-600">Fetching your player data from the cloud</p>
          </div>
        </div>
      )}

      {/* Profile Selector - show if user but no active profile and not loading, OR if in offline mode */}
      {((user && !activeProfile && !showMigrationModal && !showCreateProfile && !profilesLoading) || 
        (isOfflineMode && showProfileSelector)) && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowProfileSelector(false);
            }
          }}
        >
          <ProfileSelector
            profiles={profiles}
            activeProfileId={activeProfile?.id || null}
            onSelectProfile={async (profileId) => {
              await handleSelectProfile(profileId);
              setShowProfileSelector(false);
            }}
            onCreateProfile={() => setShowCreateProfile(true)}
            onDeleteProfile={handleDeleteProfile}
            onClose={() => setShowProfileSelector(false)}
            onExitOfflineMode={handleExitOfflineMode}
            parentEmail={isOfflineMode ? undefined : user?.email}
            isOfflineMode={isOfflineMode}
          />
        </div>
      )}

      {/* Create Profile Modal */}
      <CreateProfileModal
        isOpen={showCreateProfile}
        onClose={() => setShowCreateProfile(false)}
        onCreateProfile={handleCreateProfile}
      />

      {/* Migration Modal */}
      <MigrationModal
        isOpen={showMigrationModal}
        onClose={() => setShowMigrationModal(false)}
        onMigrateFirst={handleMigrateFirst}
        onMigrateAdditional={handleMigrateAdditional}
        existingProfilesCount={profiles.length}
      />
    </AuthContext.Provider>
  );
}
