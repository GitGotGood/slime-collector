import type { Profile } from './types';

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get yesterday's date as YYYY-MM-DD string
 */
export function getYesterdayString(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the date string for a grace window (27-hour rolling window)
 * This allows practice sessions to count for the previous day if done within 3 hours of midnight
 */
export function getGraceWindowDate(): string {
  const now = new Date();
  const hours = now.getHours();
  
  // Helper function to format date as YYYY-MM-DD in local timezone
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // If it's between midnight and 3 AM, count as previous day
  if (hours < 3) {
    const previousDay = new Date(now);
    previousDay.setDate(now.getDate() - 1);
    return formatLocalDate(previousDay);
  }
  
  // Otherwise, use today
  return formatLocalDate(now);
}

/**
 * Get the current week (Sunday to Saturday) as an array of date strings
 */
export function getCurrentWeek(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  
  // Helper function to format date as YYYY-MM-DD in local timezone
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  const week: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    week.push(formatLocalDate(date));
  }
  
  return week;
}

/**
 * Get a 7-day window centered on today (3 days before, today, 3 days after)
 */
export function getCenteredWeek(): string[] {
  const today = new Date();
  const week: string[] = [];
  
  // Helper function to format date as YYYY-MM-DD in local timezone
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  // Get 3 days before today
  for (let i = 3; i > 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    week.push(formatLocalDate(date));
  }
  
  // Add today
  week.push(formatLocalDate(today));
  
  // Get 3 days after today
  for (let i = 1; i <= 3; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    week.push(formatLocalDate(date));
  }
  
  return week;
}

/**
 * Initialize streak data for a new profile
 */
export function initializeStreakData(): Profile['streakData'] {
  const today = getTodayString();
  return {
    currentStreak: 1,
    longestStreak: 1,
    lastLoginDate: today,
    totalLogins: 1,
    streakHistory: [today]
  };
}

/**
 * Update streak data when a practice session is completed
 * This should be called when a player completes at least one math session
 */
export function updateStreakData(profile: Profile): { streakIncreased: boolean; newStreak: number } {
  const today = getTodayString();
  const yesterday = getYesterdayString();
  const graceDate = getGraceWindowDate();
  
  // Initialize streak data if it doesn't exist
  if (!profile.streakData) {
    profile.streakData = initializeStreakData();
    return { streakIncreased: false, newStreak: 1 };
  }
  
  const { currentStreak, longestStreak, lastLoginDate } = profile.streakData;
  let newStreak = currentStreak;
  let streakIncreased = false;
  
  // If already practiced today (or within grace window), no change
  if (lastLoginDate === graceDate) {
    return { streakIncreased: false, newStreak: currentStreak };
  }
  
  // If practiced yesterday (or within grace window), increment streak
  if (lastLoginDate === yesterday || (lastLoginDate === today && graceDate === yesterday)) {
    newStreak = currentStreak + 1;
    streakIncreased = true;
  } else {
    // Streak broken - reset to 1
    newStreak = 1;
  }
  
  // Update streak data
  profile.streakData.currentStreak = newStreak;
  profile.streakData.longestStreak = Math.max(longestStreak, newStreak);
  profile.streakData.lastLoginDate = graceDate; // Use grace date for consistency
  profile.streakData.totalLogins += 1;
  
  // Update streak history (last 7 days for calendar display)
  const centeredWeek = getCenteredWeek();
  profile.streakData.streakHistory = centeredWeek.map(date => {
    // Mark today as completed
    if (date === graceDate) return date;
    
    // Mark previous days as completed if they were part of the streak
    const daysAgo = Math.floor((Date.now() - new Date(date).getTime()) / (24 * 60 * 60 * 1000));
    if (daysAgo > 0 && daysAgo < newStreak) {
      return date;
    }
    
    // Mark as not completed
    return '';
  });
  
  return { streakIncreased, newStreak };
}

/**
 * Get streak display data for UI
 */
export function getStreakDisplayData(profile: Profile) {
  const streakData = profile.streakData;
  if (!streakData) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalLogins: 0,
      weekData: getCurrentWeek().map(date => ({ date, completed: false }))
    };
  }
  
  const currentWeek = getCurrentWeek();
  const weekData = currentWeek.map(date => ({
    date,
    completed: streakData.streakHistory.includes(date)
  }));
  
  return {
    currentStreak: streakData.currentStreak,
    longestStreak: streakData.longestStreak,
    totalLogins: streakData.totalLogins,
    weekData
  };
}

/**
 * Check if a streak badge should be awarded
 */
export function checkStreakBadges(profile: Profile): string[] {
  const currentStreak = profile.streakData?.currentStreak || 0;
  const newlyEarned: string[] = [];
  
  if (currentStreak >= 7 && !profile.badges?.unlocked?.streak_7) {
    newlyEarned.push('streak_7');
  }
  if (currentStreak >= 14 && !profile.badges?.unlocked?.streak_14) {
    newlyEarned.push('streak_14');
  }
  if (currentStreak >= 30 && !profile.badges?.unlocked?.streak_30) {
    newlyEarned.push('streak_30');
  }
  if (currentStreak >= 100 && !profile.badges?.unlocked?.streak_100) {
    newlyEarned.push('streak_100');
  }
  
  return newlyEarned;
}
