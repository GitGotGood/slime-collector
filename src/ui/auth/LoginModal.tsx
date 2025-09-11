import React from 'react';
import { motion } from 'framer-motion';
import { signInWithGoogle } from '../../lib/supabase';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUseOfflineMode?: () => void;
}

export function LoginModal({ isOpen, onClose, onUseOfflineMode }: LoginModalProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
      // Note: onClose will be called by the auth state change handler
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="text-center space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Slime Collector!
            </h2>
            <p className="text-gray-600">
              Sign in to save your progress and play across all your devices
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <span className="text-gray-700">Save progress across devices</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">👨‍👩‍👧‍👦</span>
              </div>
              <span className="text-gray-700">Multiple kid profiles</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm">🔒</span>
              </div>
              <span className="text-gray-700">Secure family accounts</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            <span className="font-medium text-gray-700">
              {isLoading ? 'Signing in...' : 'Continue with Google'}
            </span>
          </button>

          {/* Offline/Local Mode Button */}
          {onUseOfflineMode && (
            <button
              onClick={onUseOfflineMode}
              className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 flex items-center justify-center gap-3 hover:bg-gray-200 transition-colors"
            >
              <span className="text-2xl">📱</span>
              <span className="font-medium text-gray-700">Play Offline (No Account)</span>
            </button>
          )}

          {/* Help text */}
          <p className="text-xs text-center text-gray-500">
            Progress saved locally on this device only
          </p>
        </div>
      </motion.div>
    </div>
  );
}
