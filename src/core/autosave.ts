/**
 * Smart Event-Driven Autosave System for Slime Collector
 * 
 * Features:
 * - Event-driven saves (only when data changes)
 * - Trailing debounce to batch rapid changes
 * - Safety interval as fallback
 * - Configurable timing via environment variables
 * - Save status integration
 * - Global window access for easy integration
 */

import { saveLogger } from '../lib/debug';

interface AutosaveConfig {
  save: (data: any) => Promise<void>;
  getCurrentData: () => any;
  onSaveStart?: () => void;
  onSaveSuccess?: () => void;
  onSaveError?: (error: any) => void;
  debounceMs?: number;
  safetyMs?: number;
}

interface AutosaveInstance {
  markDirty: () => void;
  forceSave: () => Promise<void>;
  destroy: () => void;
  isScheduled: () => boolean;
}

export function initAutosave(config: AutosaveConfig): AutosaveInstance {
  // Get timing configuration from environment variables
  const debounceMs = config.debounceMs ?? 
    parseInt(import.meta.env.VITE_AUTOSAVE_DEBOUNCE_MS || '8000');
  const safetyMs = config.safetyMs ?? 
    parseInt(import.meta.env.VITE_AUTOSAVE_SAFETY_MS || '60000');

  let debounceTimer: NodeJS.Timeout | null = null;
  let safetyTimer: NodeJS.Timeout | null = null;
  let isDestroyed = false;
  let lastSaveTime = Date.now();

  saveLogger.log('Autosave system initialized', { 
    debounceMs, 
    safetyMs,
    timestamp: new Date().toISOString()
  });

  // Core save function with error handling and status updates
  async function performSave(reason: 'debounce' | 'safety' | 'forced'): Promise<void> {
    if (isDestroyed) return;

    try {
      config.onSaveStart?.();
      saveLogger.log('Save triggered', { reason, timestamp: new Date().toISOString() });
      
      const data = config.getCurrentData();
      await config.save(data);
      
      lastSaveTime = Date.now();
      config.onSaveSuccess?.();
      saveLogger.log('Save completed', { reason, timestamp: new Date().toISOString() });
      
    } catch (error) {
      config.onSaveError?.(error);
      saveLogger.error('Save failed', { reason, error });
      throw error; // Re-throw to allow caller to handle
    }
  }

  // Schedule a debounced save
  function scheduleDebouncedSave(): void {
    if (isDestroyed) return;

    // Clear existing debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Schedule new debounced save
    debounceTimer = setTimeout(async () => {
      debounceTimer = null;
      try {
        await performSave('debounce');
      } catch (error) {
        // Error already logged in performSave
      }
    }, debounceMs);

    saveLogger.log('Debounced save scheduled', { 
      debounceMs, 
      willSaveAt: new Date(Date.now() + debounceMs).toISOString()
    });
  }

  // Initialize safety timer
  function initSafetyTimer(): void {
    if (isDestroyed) return;

    safetyTimer = setTimeout(async () => {
      const timeSinceLastSave = Date.now() - lastSaveTime;
      
      // Only save if it's been a while since last save
      if (timeSinceLastSave >= safetyMs * 0.8) {
        try {
          await performSave('safety');
        } catch (error) {
          // Error already logged in performSave
        }
      }
      
      // Reschedule safety timer
      initSafetyTimer();
    }, safetyMs);
  }

  // Start safety timer
  initSafetyTimer();

  // Public API
  const instance: AutosaveInstance = {
    markDirty(): void {
      if (isDestroyed) return;
      saveLogger.log('Data marked as dirty, scheduling save', {});
      scheduleDebouncedSave();
    },

    async forceSave(): Promise<void> {
      if (isDestroyed) return;
      
      // Cancel any pending debounced save
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      
      await performSave('forced');
    },

    destroy(): void {
      if (isDestroyed) return;
      
      isDestroyed = true;
      
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      
      if (safetyTimer) {
        clearTimeout(safetyTimer);
        safetyTimer = null;
      }
      
      // Remove from global window if it exists
      if (typeof window !== 'undefined' && (window as any).SC_autosave === instance) {
        delete (window as any).SC_autosave;
        delete (window as any).SC_markDirty;
      }
      
      saveLogger.log('Autosave system destroyed', {});
    },

    isScheduled(): boolean {
      return debounceTimer !== null;
    }
  };

  // Expose to global window for easy access during development/debugging
  if (typeof window !== 'undefined') {
    (window as any).SC_autosave = instance;
    (window as any).SC_markDirty = instance.markDirty;
    saveLogger.log('Autosave exposed to window', { 
      global: 'window.SC_autosave',
      shortcut: 'window.SC_markDirty()'
    });
  }

  // Handle page unload - force save any pending changes
  if (typeof window !== 'undefined') {
    const handleBeforeUnload = () => {
      if (instance.isScheduled()) {
        // Use sendBeacon for reliable save on page unload
        const data = config.getCurrentData();
        const dataStr = JSON.stringify({ type: 'autosave', data });
        
        try {
          navigator.sendBeacon('/api/save', dataStr);
          saveLogger.log('Emergency save via sendBeacon', {});
        } catch (error) {
          saveLogger.warn('sendBeacon failed, attempting sync save', { error });
          // Fallback to synchronous save (may be interrupted)
          try {
            instance.forceSave();
          } catch (syncError) {
            saveLogger.error('Emergency save failed', { syncError });
          }
        }
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Clean up event listener when destroyed
    const originalDestroy = instance.destroy;
    instance.destroy = () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      originalDestroy();
    };
  }

  return instance;
}

/**
 * Utility to create a markDirty function bound to a specific autosave instance
 */
export function createMarkDirty(autosave: AutosaveInstance): () => void {
  return () => autosave.markDirty();
}

/**
 * Global access to autosave (for debugging)
 */
export function getGlobalAutosave(): AutosaveInstance | null {
  if (typeof window !== 'undefined') {
    return (window as any).SC_autosave || null;
  }
  return null;
}
