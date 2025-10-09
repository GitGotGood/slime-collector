import { useState, useEffect } from 'react';
import { getEventState } from '../../core/events';

export function EventHUD() {
  const [eventState, setEventState] = useState(getEventState());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setEventState(getEventState());
    }, 1000); // Update every second
    
    return () => clearInterval(interval);
  }, []);
  
  if (!eventState.isEventActive || !eventState.currentEvent) return null;
  
  // Hide event timer for now
  return null;
  
  const { currentEvent } = eventState;
  
  return (
    <div className="fixed top-4 right-4 z-40">
      <div 
        className="text-white px-3 py-2 rounded-lg shadow-lg border-2"
        style={{ 
          backgroundColor: currentEvent.theme.colors.primary,
          borderColor: currentEvent.theme.colors.secondary
        }}
      >
        <div className="flex items-center space-x-2">
          <span className="text-lg">{currentEvent.theme.decorations.icon}</span>
          <div className="text-sm">
            <div className="font-semibold">Event Ends:</div>
            <div className="font-mono text-xs">
              {eventState.daysRemaining}d {eventState.hoursRemaining}h {eventState.minutesRemaining}m {eventState.secondsRemaining}s
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
