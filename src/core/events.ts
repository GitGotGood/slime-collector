export type SeasonalEvent = {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  biomes: string[];
  exclusiveSkins: string[];
  badges: string[];
  isActive: boolean;
  theme: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    decorations: {
      header: string;
      icon: string;
    };
  };
}

export type EventState = {
  currentEvent: SeasonalEvent | null;
  isEventActive: boolean;
  daysRemaining: number;
  hoursRemaining: number;
  minutesRemaining: number;
  secondsRemaining: number;
}

// Easy to customize event configuration
export const EVENT_CONFIG = {
  // Event details - easy to change
  EVENT_ID: "spooky_season_2024",
  EVENT_NAME: "Something Spooky This Way Comes", // Can be changed to anything
  EVENT_DESCRIPTION: "Ancient spirits are awakening. Get ready to collect spooky slimes and explore haunted realms.",
  
  // Dates - easy to adjust (set to be live now)
  START_DATE: "2025-10-09T00:00:00Z",
  END_DATE: "2025-10-31T23:59:59Z",
  
  // Content - easy to modify
  BIOMES: ["pumpkin_patch", "graveyard", "haunted_house"],
  EXCLUSIVE_SKINS: [
    "jack_o_lantern", "ghost", "vampire", "witch", 
    "zombie", "spider", "bat", "candy_corn", "haunted_house"
  ],
  BADGES: [
    "first_spooky", "pumpkin_master", "ghost_hunter",
    "spooky_collector", "haunted_explorer"
  ],
  
  // Theme - easy to customize
  THEME: {
    colors: {
      primary: "#ff6b35",
      secondary: "#8b5cf6", 
      accent: "#fbbf24"
    },
    decorations: {
      header: "🎃 Something Spooky This Way Comes 🎃",
      icon: "🎃"
    }
  }
};

export function getCurrentEvent(): SeasonalEvent | null {
  const now = new Date();
  const startDate = new Date(EVENT_CONFIG.START_DATE);
  const endDate = new Date(EVENT_CONFIG.END_DATE);
  
  if (now >= startDate && now <= endDate) {
    return {
      id: EVENT_CONFIG.EVENT_ID,
      name: EVENT_CONFIG.EVENT_NAME,
      description: EVENT_CONFIG.EVENT_DESCRIPTION,
      startDate: EVENT_CONFIG.START_DATE,
      endDate: EVENT_CONFIG.END_DATE,
      biomes: EVENT_CONFIG.BIOMES,
      exclusiveSkins: EVENT_CONFIG.EXCLUSIVE_SKINS,
      badges: EVENT_CONFIG.BADGES,
      isActive: true,
      theme: EVENT_CONFIG.THEME
    };
  }
  
  return null;
}

export function getEventState(): EventState {
  const currentEvent = getCurrentEvent();
  
  if (!currentEvent) {
    return {
      currentEvent: null,
      isEventActive: false,
      daysRemaining: 0,
      hoursRemaining: 0,
      minutesRemaining: 0,
      secondsRemaining: 0
    };
  }
  
  const now = new Date();
  const endDate = new Date(currentEvent.endDate);
  const timeRemaining = endDate.getTime() - now.getTime();
  
  const daysRemaining = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
  const hoursRemaining = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesRemaining = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  const secondsRemaining = Math.floor((timeRemaining % (1000 * 60)) / 1000);
  
  return {
    currentEvent,
    isEventActive: true,
    daysRemaining,
    hoursRemaining,
    minutesRemaining,
    secondsRemaining
  };
}

// Helper for testing - temporarily set event dates
export function setTestEventDates(start: string, end: string) {
  EVENT_CONFIG.START_DATE = start;
  EVENT_CONFIG.END_DATE = end;
}

// Helper for testing - set event to be active now for 1 hour
export function setTestEventActive() {
  const now = new Date();
  const start = new Date(now.getTime() - 1000 * 60 * 60); // 1 hour ago
  const end = new Date(now.getTime() + 1000 * 60 * 60); // 1 hour from now
  
  EVENT_CONFIG.START_DATE = start.toISOString();
  EVENT_CONFIG.END_DATE = end.toISOString();
}

// Helper for testing - set event to be starting in 1 hour
export function setTestEventStarting() {
  const now = new Date();
  const start = new Date(now.getTime() + 1000 * 60 * 60); // 1 hour from now
  const end = new Date(now.getTime() + 1000 * 60 * 60 * 24); // 1 day from now
  
  EVENT_CONFIG.START_DATE = start.toISOString();
  EVENT_CONFIG.END_DATE = end.toISOString();
}

// Helper to check if a specific biome is part of the current event
export function isEventBiome(biomeId: string): boolean {
  const event = getCurrentEvent();
  return event ? event.biomes.includes(biomeId) : false;
}

// Helper to check if a specific skin is part of the current event
export function isEventSkin(skinId: string): boolean {
  const event = getCurrentEvent();
  return event ? event.exclusiveSkins.includes(skinId) : false;
}
