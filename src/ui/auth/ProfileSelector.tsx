import React from 'react';
import { motion } from 'framer-motion';
import { Plus, User, X, Trash2 } from 'lucide-react';
import type { KidProfile } from '../../lib/profiles';
import { loadSaveForProfile } from '../../lib/saves';
import { levelFromTotalXP } from '../../core/progression';
import { getBiomeForSkill } from '../../assets/biomes';
import { SKILLS } from '../../core/skills';
import Slime from '../components/Slime';

interface ProfileSelectorProps {
  profiles: KidProfile[];
  activeProfileId: string | null;
  onSelectProfile: (profileId: string) => void;
  onCreateProfile: () => void;
  onDeleteProfile?: (profileId: string) => void;
  onClose?: () => void;
  onExitOfflineMode?: () => void;
  parentEmail?: string;
  isOfflineMode?: boolean;
}

interface ProfileStats {
  level: number;
  goo: number;
  xp: number;
  activeSkin: string;
  biomesUnlocked: number;
  badgesEarned: number;
  slimesCollected: number;
  currentSkill: string;
}

function ProfileCard({ profile, isActive, onSelect, onDelete, isOfflineMode = false }: { 
  profile: KidProfile; 
  isActive: boolean; 
  onSelect: () => void;
  onDelete?: () => void;
  isOfflineMode?: boolean;
}) {
  const [stats, setStats] = React.useState<ProfileStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  
  // Debug logging removed - delete functionality working

  React.useEffect(() => {
    const loadStats = async () => {
      try {
        let saveData;
        
        if (isOfflineMode) {
          // In offline mode, profile IS the save data (local storage profiles)
          saveData = profile as any;
        } else {
          // In online mode, fetch from cloud
          saveData = await loadSaveForProfile(profile.id);
        }
        
        if (saveData) {
          const level = levelFromTotalXP(saveData.xp || 0).level;
          const biomesUnlocked = saveData.unlocks?.biomes?.length || 1;
          const badgesEarned = Object.keys(saveData.badges?.unlocked || {}).length;
          const slimesCollected = saveData.unlocks?.skins?.length || 1;
          const currentSkill = saveData.settings?.currentSkill || 'add_1_10';
          
          setStats({
            level,
            goo: saveData.goo || 0,
            xp: saveData.xp || 0,
            activeSkin: saveData.settings?.activeSkin || 'green',
            biomesUnlocked,
            badgesEarned,
            slimesCollected,
            currentSkill
          });
        } else {
          // New profile with no save data
          setStats({
            level: 1,
            goo: 0,
            xp: 0,
            activeSkin: 'green',
            biomesUnlocked: 1,
            badgesEarned: 0,
            slimesCollected: 1,
            currentSkill: 'add_1_10'
          });
        }
      } catch (error) {
        console.error('Failed to load profile stats:', error);
        setStats({
          level: 1,
          goo: 0,
          xp: 0,
          activeSkin: 'green',
          biomesUnlocked: 1,
          badgesEarned: 0,
          slimesCollected: 1,
          currentSkill: 'add_1_10'
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, [profile.id, isOfflineMode]);

  return (
    <motion.button
      onClick={onSelect}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`w-full p-4 rounded-xl border-2 transition-all ${
        isActive
          ? 'border-emerald-500 bg-emerald-50'
          : 'border-emerald-200 hover:border-emerald-300 bg-white hover:bg-emerald-50'
      }`}
    >
      <div className="flex items-center gap-4">
        {/* Slime Avatar */}
        <div className="w-16 h-16 flex items-center justify-center">
          {loading ? (
            <div className="w-12 h-12 rounded-full bg-emerald-100 animate-pulse" />
          ) : (
            <Slime 
              skinId={stats?.activeSkin || 'green'}
              className="w-14 h-14"
              bobDuration={2.5 + Math.random() * 0.5}
              bobDelay={Math.random() * 2}
            />
          )}
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-left">
          <div className="font-bold text-emerald-800 text-lg">{profile.name}</div>
          {loading ? (
            <div className="text-xs text-emerald-600">Loading...</div>
          ) : (
            <div className="space-y-1">
              <div className="text-xs text-emerald-700">
                Lv {stats?.level} • 🟡 {stats?.goo} Goo
              </div>
              <div className="text-xs text-emerald-600">
                🌍 {stats?.biomesUnlocked} biomes • 🏆 {stats?.badgesEarned} badges • 🎨 {stats?.slimesCollected} slimes
              </div>
              <div className="text-xs text-emerald-500 capitalize">
                Working on: {getBiomeForSkill(stats?.currentSkill as any).replace('_', ' ')}
              </div>
            </div>
          )}
        </div>

        {/* Delete & Selection Indicator */}
        <div className="flex items-center gap-2">
          {/* TEMPORARILY COMMENTED OUT FOR RELEASE - DELETE FEATURE NEEDS PIN SYSTEM
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`Delete ${profile.name}'s profile? This cannot be undone.`)) {
                  onDelete();
                }
              }}
              className="w-8 h-8 rounded-full hover:bg-red-100 flex items-center justify-center text-red-500 hover:text-red-700 transition-colors border border-red-300"
              title="Delete profile"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          */}
          {isActive && (
            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          )}
        </div>
      </div>
    </motion.button>
  );
}

export function ProfileSelector({ 
  profiles, 
  activeProfileId, 
  onSelectProfile, 
  onCreateProfile,
  onDeleteProfile,
  onClose,
  onExitOfflineMode,
  parentEmail,
  isOfflineMode = false
}: ProfileSelectorProps) {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full border border-emerald-100 max-h-[80vh] flex flex-col">
      {/* Header */}
      <div className="relative text-center mb-6 flex-shrink-0">
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-0 right-0 w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <h3 className="text-2xl font-extrabold text-emerald-800 mb-1">Choose Player</h3>
        {isOfflineMode ? (
          <p className="text-sm text-orange-600 flex items-center justify-center gap-1">
            📵 Offline Mode - Progress saved locally
          </p>
        ) : parentEmail ? (
          <p className="text-sm text-emerald-600">Signed in as {parentEmail}</p>
        ) : null}
        {profiles.length > 4 && (
          <p className="text-xs text-gray-500 mt-1">{profiles.length} profiles • scroll for more</p>
        )}
      </div>

      {/* Scrollable Profile Grid */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 -mr-2">
        {profiles.map((profile) => (
          <ProfileCard
            key={profile.id}
            profile={profile}
            isActive={activeProfileId === profile.id}
            onSelect={() => onSelectProfile(profile.id)}
            onDelete={onDeleteProfile ? () => onDeleteProfile(profile.id) : undefined}
            isOfflineMode={isOfflineMode}
          />
        ))}

        {/* Add New Profile Button */}
        <motion.button
          onClick={onCreateProfile}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 rounded-xl border-2 border-dashed border-emerald-300 hover:border-emerald-400 transition-all flex items-center gap-4 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
        >
          <div className="w-16 h-16 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <Plus size={24} />
            </div>
          </div>
          <div className="flex-1 text-left">
            <div className="font-bold text-lg text-emerald-800">Add New Player</div>
            <div className="text-xs text-emerald-600">Create another profile</div>
          </div>
        </motion.button>
      </div>

      {/* Exit Offline Mode Button */}
      {isOfflineMode && onExitOfflineMode && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={onExitOfflineMode}
            className="w-full text-center text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            🌐 Exit Offline Mode & Sign In
          </button>
        </div>
      )}
    </div>
  );
}

interface CreateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProfile: (name: string) => Promise<void>;
}

export function CreateProfileModal({ isOpen, onClose, onCreateProfile }: CreateProfileModalProps) {
  const [name, setName] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      await onCreateProfile(name.trim());
      setName('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Add New Player</h3>
            <p className="text-gray-600 text-sm">What should we call this player?</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter player name..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={50}
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || isLoading}
              className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating...' : 'Create Profile'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
