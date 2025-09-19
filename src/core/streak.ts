import type { Profile } from './types';

/**
 * Get today's date as YYYY-MM-DD string
 */
export function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Get yesterday's date as YYYY-MM-DD string
 */
export function getYesterdayString(): string {
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return yesterday.toISOString().slice(0, 10);
}

/**
 * Get the current week (Sunday to Saturday) as an array of date strings
 */
export function getCurrentWeek(): string[] {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const sunday = new Date(today);
  sunday.setDate(today.getDate() - dayOfWeek);
  
  const week: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    week.push(date.toISOString().slice(0, 10));
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
 * Update streak data when a session is completed
 * This should be called when a player completes at least one math session
 */
export function updateStreakData(profile: Profile): { streakIncreased: boolean; newStreak: number } {
  const today = getTodayString();
  const yesterday = getYesterdayString();
  
  // Initialize streak data if it doesn't exist
  if (!profile.streakData) {
    profile.streakData = initializeStreakData();
    return { streakIncreased: false, newStreak: 1 };
  }
  
  const { currentStreak, longestStreak, lastLoginDate } = profile.streakData;
  let newStreak = currentStreak;
  let streakIncreased = false;
  
  // If already logged in today, no change
  if (lastLoginDate === today) {
    return { streakIncreased: false, newStreak: currentStreak };
  }
  
  // If logged in yesterday, increment streak
  if (lastLoginDate === yesterday) {
    newStreak = currentStreak + 1;
    streakIncreased = true;
  } else {
    // Streak broken - reset to 1
    newStreak = 1;
  }
  
  // Update streak data
  profile.streakData.currentStreak = newStreak;
  profile.streakData.longestStreak = Math.max(longestStreak, newStreak);
  profile.streakData.lastLoginDate = today;
  profile.streakData.totalLogins += 1;
  
  // Update streak history (last 7 days for calendar display)
  const currentWeek = getCurrentWeek();
  profile.streakData.streakHistory = currentWeek.map(date => {
    // Mark today as completed
    if (date === today) return date;
    
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
