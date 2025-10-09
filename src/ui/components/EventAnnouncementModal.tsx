import { useState, useEffect } from 'react';
import { getEventState } from '../../core/events';

export function EventAnnouncementModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [eventState, setEventState] = useState(getEventState());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setEventState(getEventState());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  if (!open || !eventState.isEventActive || !eventState.currentEvent) return null;
  
  const { currentEvent } = eventState;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-2xl">
        <div className="text-center">
          <h2 
            className="text-3xl font-bold mb-2"
            style={{ color: currentEvent.theme.colors.primary }}
          >
            {currentEvent.theme.decorations.header}
          </h2>
          
          <p className="text-gray-700 mb-4">
            {currentEvent.description}
          </p>
          
          {/* Coming Soon */}
          <div className="bg-gray-100 rounded-lg p-4 mb-4">
            <div 
              className="font-mono text-2xl font-bold"
              style={{ color: currentEvent.theme.colors.secondary }}
            >
              COMING SOON
            </div>
          </div>
          
          {/* Event Highlights */}
          <div className="text-left mb-4">
            <p className="text-sm font-semibold mb-2">What's New:</p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {currentEvent.biomes.length} new spooky biomes to explore</li>
              <li>• {currentEvent.exclusiveSkins.length} exclusive slimes to collect</li>
              <li>• {currentEvent.badges.length} special badges to earn</li>
            </ul>
          </div>
          
          <button 
            onClick={onClose}
            className="w-full py-3 px-6 rounded-lg text-white font-bold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: currentEvent.theme.colors.primary }}
          >
            Start Exploring!
          </button>
        </div>
      </div>
    </div>
  );
}
