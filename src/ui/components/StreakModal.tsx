import React from "react";
import Dialog from "./Dialog";

interface StreakModalProps {
  open: boolean;
  onClose: () => void;
  currentStreak: number;
  longestStreak: number;
  totalLogins: number;
  weekData: Array<{ date: string; completed: boolean }>;
  streakIncreased?: boolean;
}

export default function StreakModal({
  open,
  onClose,
  currentStreak,
  longestStreak,
  totalLogins,
  weekData,
  streakIncreased = false
}: StreakModalProps) {
  const dayLabels = ['Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa'];
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      title="Daily Login Streak" 
      maxWidth="max-w-sm"
      footer={
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Continue
          </button>
        </div>
      }
    >
      <div className="text-center space-y-6">
        {/* Streak Counter */}
        <div className="space-y-3">
          <div className="relative inline-block">
            {/* Flame Icon */}
            <div className="w-20 h-20 mx-auto bg-gradient-to-b from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
              <div className="text-white text-2xl font-bold">
                {currentStreak}
              </div>
              {/* Small arrow inside flame - green if streak increased */}
              <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${
                streakIncreased ? 'bg-green-500' : 'bg-orange-500'
              }`}>
                <div className="text-white text-xs">↑</div>
              </div>
            </div>
          </div>
          
          <div className="text-2xl font-bold text-orange-600">
            day login streak!
          </div>
        </div>

        {/* Weekly Calendar */}
        <div className="space-y-3">
          <div className="grid grid-cols-7 gap-2">
            {dayLabels.map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-xs text-gray-600 mb-1">{day}</div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  weekData[index]?.completed 
                    ? 'bg-orange-500 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {weekData[index]?.completed ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="text-sm text-gray-600 space-y-1">
          <div>Best login streak: <span className="font-semibold text-orange-600">{longestStreak} days</span></div>
          <div>Total logins: <span className="font-semibold text-orange-600">{totalLogins} days</span></div>
        </div>

        {/* Explanation */}
        <div className="text-sm text-gray-500">
          A <span className="text-orange-600 font-semibold">login streak</span> counts how many days<br />you've practiced in a row.
        </div>
      </div>
    </Dialog>
  );
}
