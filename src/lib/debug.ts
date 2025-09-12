/**
 * Professional logging utility for Slime Collector
 * 
 * Features:
 * - Centralized log control
 * - Production-safe by default
 * - Optional debug mode via VITE_DEBUG=1
 * - Categorized logging
 * - Always preserves errors
 */

type LogCategory = 'auth' | 'save' | 'shop' | 'game' | 'ui' | 'network' | 'general';

interface LogConfig {
  enableLogs: boolean;
  enableWarns: boolean;
  enableErrors: boolean;
}

let config: LogConfig = {
  enableLogs: true,    // Default: enabled (will be controlled by hushLogsInProd)
  enableWarns: true,   // Default: enabled
  enableErrors: true,  // Always enabled - errors should always show
};

/**
 * Call this once at app startup to silence logs/warns in production
 * unless VITE_DEBUG=1 is set
 */
export function hushLogsInProd(): void {
  const isProduction = import.meta.env.PROD;
  const debugEnabled = import.meta.env.VITE_DEBUG === '1';
  
  if (isProduction && !debugEnabled) {
    config.enableLogs = false;
    config.enableWarns = false;
    // errors always stay enabled for production debugging
  }
  
  // Log the debug config on startup
  if (config.enableLogs) {
    console.log('🔧 Debug logging enabled', { 
      isProduction, 
      debugEnabled, 
      config 
    });
  }
}

/**
 * Enhanced logging with categories
 */
export function log(category: LogCategory, message: string, ...args: any[]): void {
  if (!config.enableLogs) return;
  
  const emoji = getCategoryEmoji(category);
  console.log(`${emoji} [${category}] ${message}`, ...args);
}

/**
 * Warning logs - important but not critical
 */
export function warn(category: LogCategory, message: string, ...args: any[]): void {
  if (!config.enableWarns) return;
  
  const emoji = getCategoryEmoji(category);
  console.warn(`⚠️ ${emoji} [${category}] ${message}`, ...args);
}

/**
 * Error logs - always shown, even in production
 */
export function error(category: LogCategory, message: string, ...args: any[]): void {
  if (!config.enableErrors) return;
  
  const emoji = getCategoryEmoji(category);
  console.error(`❌ ${emoji} [${category}] ${message}`, ...args);
}

/**
 * Simple log without category (for quick debugging)
 */
export function debug(message: string, ...args: any[]): void {
  if (!config.enableLogs) return;
  console.log(`🐛 ${message}`, ...args);
}

/**
 * Get emoji for log category
 */
function getCategoryEmoji(category: LogCategory): string {
  const emojis: Record<LogCategory, string> = {
    auth: '🔐',
    save: '💾',
    shop: '🛒',
    game: '🎮',
    ui: '🎨',
    network: '🌐',
    general: '📝'
  };
  
  return emojis[category] || '📝';
}

/**
 * Utility for measuring performance
 */
export function logPerformance(category: LogCategory, label: string, startTime: number): void {
  if (!config.enableLogs) return;
  
  const duration = performance.now() - startTime;
  const emoji = getCategoryEmoji(category);
  console.log(`⏱️ ${emoji} [${category}] ${label}: ${duration.toFixed(2)}ms`);
}

/**
 * Create a category-specific logger (advanced usage)
 */
export function createLogger(category: LogCategory) {
  return {
    log: (message: string, ...args: any[]) => log(category, message, ...args),
    warn: (message: string, ...args: any[]) => warn(category, message, ...args),
    error: (message: string, ...args: any[]) => error(category, message, ...args),
    perf: (label: string, startTime: number) => logPerformance(category, label, startTime),
  };
}

// Export category-specific loggers for convenience
export const authLogger = createLogger('auth');
export const saveLogger = createLogger('save');
export const shopLogger = createLogger('shop');
export const gameLogger = createLogger('game');
export const uiLogger = createLogger('ui');
export const networkLogger = createLogger('network');
