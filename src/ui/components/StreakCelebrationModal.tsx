import React from "react";
import Dialog from "./Dialog";

interface StreakCelebrationModalProps {
  open: boolean;
  onClose: () => void;
  currentStreak: number;
  longestStreak: number;
  totalLogins: number;
  weekData: Array<{ 
    date: string; 
    completed: boolean; 
    isToday: boolean; 
    isPast: boolean; 
    isMissed: boolean; 
  }>;
}

export default function StreakCelebrationModal({
  open,
  onClose,
  currentStreak,
  longestStreak,
  totalLogins,
  weekData
}: StreakCelebrationModalProps) {
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      title="🔥 Streak Increased!" 
      maxWidth="max-w-sm"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Awesome!
          </button>
        </div>
      }
    >
      <div className="text-center space-y-6">
        {/* Celebration Message */}
        <div className="space-y-3">
          <div className="text-lg font-semibold text-orange-600">
            Nice! You practiced today.
          </div>
          <div className="text-sm text-gray-600">
            You answered 5+ questions and kept your streak going!
          </div>
        </div>

        {/* Streak Counter */}
        <div className="space-y-3">
          <div className="relative inline-block">
            {/* Flame Icon */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-b from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-white text-3xl font-bold">
                {currentStreak}
              </div>
              {/* Green arrow for celebration */}
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center bg-green-500">
                <div className="text-white text-xs">↑</div>
              </div>
            </div>
          </div>
          
          <div className="text-2xl font-bold text-orange-600">
            day streak!
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="space-y-3">
          <div className="grid grid-cols-7 gap-2">
            {weekData.map((dayData, index) => {
              // Parse date correctly to avoid timezone issues
              const [year, month, day] = dayData.date.split('-').map(Number);
              const date = new Date(year, month - 1, day); // month is 0-indexed
              const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
              
              return (
                <div key={dayData.date} className="flex flex-col items-center">
                  <div className={`text-xs mb-1 w-8 text-center ${
                    dayData.isToday ? 'text-orange-600 font-bold' : 'text-gray-600'
                  }`}>
                    {dayName}
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    dayData.completed 
                      ? 'bg-orange-500 text-white' 
                      : dayData.isMissed
                      ? 'bg-blue-500 text-white'
                      : dayData.isToday
                      ? 'bg-orange-200 text-orange-600 border-2 border-orange-400'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    {dayData.completed ? '✓' : dayData.isMissed ? '✗' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="text-sm text-gray-600 space-y-1">
          <div>Best practice streak: <span className="font-semibold text-orange-600">{longestStreak} days</span></div>
          <div>Total practice days: <span className="font-semibold text-orange-600">{totalLogins} days</span></div>
        </div>

        {/* Next Target */}
        {currentStreak < 7 && (
          <div className="text-sm text-orange-600 font-medium">
            {7 - currentStreak} more days for a 7-day streak!
          </div>
        )}
        {currentStreak >= 7 && currentStreak < 30 && (
          <div className="text-sm text-orange-600 font-medium">
            {30 - currentStreak} more days for a 30-day streak!
          </div>
        )}
        {currentStreak >= 30 && (
          <div className="text-sm text-orange-600 font-medium">
            Incredible dedication! You're a streak master!
          </div>
        )}
      </div>
    </Dialog>
  );
}
