import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Smartphone, Copy, Check } from 'lucide-react';

interface MigrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onMigrateFirst: (playerName: string) => Promise<string>;
  onMigrateAdditional: (playerName: string, familyCode: string) => Promise<void>;
  existingProfilesCount: number;
}

export function MigrationModal({ 
  isOpen, 
  onClose, 
  onMigrateFirst, 
  onMigrateAdditional, 
  existingProfilesCount 
}: MigrationModalProps) {
  const [step, setStep] = React.useState<'detect' | 'name' | 'code' | 'success'>('detect');
  const [playerName, setPlayerName] = React.useState('');
  const [familyCode, setFamilyCode] = React.useState('');
  const [inputCode, setInputCode] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copiedCode, setCopiedCode] = React.useState(false);

  const isFirstDevice = existingProfilesCount === 0;

  const handleCopyCode = async () => {
    if (familyCode) {
      await navigator.clipboard.writeText(familyCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleMigrate = async () => {
    if (!playerName.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      if (isFirstDevice) {
        // First device migration
        const code = await onMigrateFirst(playerName.trim());
        setFamilyCode(code);
        setStep('success');
      } else {
        // Additional device migration
        await onMigrateAdditional(playerName.trim(), inputCode.trim());
        setStep('success');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Migration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFirstDevice) {
      handleMigrate();
    } else {
      setStep('code');
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleMigrate();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl"
      >
        {step === 'detect' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Progress Found!
              </h2>
              <p className="text-gray-600">
                We found existing game progress on this device. Would you like to save it to your cloud account?
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-green-800">Your progress will be preserved</div>
                  <div className="text-sm text-green-700">All slimes, goo, and achievements will be saved</div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Skip for now
              </button>
              <button
                onClick={() => setStep('name')}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Progress
              </button>
            </div>
          </div>
        )}

        {step === 'name' && (
          <form onSubmit={handleNameSubmit} className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What's this player's name?
              </h2>
              <p className="text-gray-600">
                We'll create a profile for this player's progress
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter player name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={50}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('detect')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!playerName.trim() || isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : (isFirstDevice ? 'Create Profile' : 'Next')}
              </button>
            </div>
          </form>
        )}

        {step === 'code' && !isFirstDevice && (
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Enter Family Code
              </h2>
              <p className="text-gray-600">
                Enter the 6-digit code from your first device to link this player's progress
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                placeholder="ABC123"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-wider"
                maxLength={6}
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('name')}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={inputCode.length !== 6 || isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Linking...' : 'Link Device'}
              </button>
            </div>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {isFirstDevice ? 'Profile Created!' : 'Device Linked!'}
              </h2>
              <p className="text-gray-600">
                {playerName}'s progress has been safely saved to the cloud.
              </p>
            </div>

            {familyCode && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-center space-y-3">
                  <div className="text-sm text-blue-700 font-medium">Family Code</div>
                  <div className="text-3xl font-mono tracking-wider text-blue-900 bg-white px-4 py-2 rounded border">
                    {familyCode}
                  </div>
                  <div className="text-xs text-blue-600">
                    Use this code on other devices to link additional players (expires in 24 hours)
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                  >
                    {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Continue Playing
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}


