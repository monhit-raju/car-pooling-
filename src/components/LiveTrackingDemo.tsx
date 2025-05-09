
import React, { useState, useEffect } from 'react';
import { Navigation, MapPin, Car } from 'lucide-react';

const LiveTrackingDemo = () => {
  const [carPosition, setCarPosition] = useState({ x: 20, y: 50 });
  
  // Simulate car movement along a predefined route
  useEffect(() => {
    const interval = setInterval(() => {
      setCarPosition(prevPos => {
        // Move the car along a circular path
        const angle = Math.atan2(50 - prevPos.y, 50 - prevPos.x);
        const newX = 50 + (prevPos.x - 50) * Math.cos(0.05) - (prevPos.y - 50) * Math.sin(0.05);
        const newY = 50 + (prevPos.x - 50) * Math.sin(0.05) + (prevPos.y - 50) * Math.cos(0.05);
        return { x: newX, y: newY };
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-xl font-bold text-slate-800 flex items-center">
          <Navigation className="mr-2 text-primary" size={22} />
          Live Tracking
        </h3>
        <p className="text-gray-600 mt-2">Watch your journey in real-time and share your location with trusted contacts.</p>
      </div>
      
      <div className="relative h-[300px] bg-slate-100 overflow-hidden">
        {/* Map visualization */}
        <div className="absolute inset-0 p-4">
          {/* Route line */}
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {/* Map roads */}
            <path d="M10,50 L90,50" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" />
            <path d="M50,10 L50,90" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" />
            
            {/* Route path - dashed line */}
            <circle cx="50" cy="50" r="30" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="3,3" />
            
            {/* Start point */}
            <circle cx="20" cy="50" r="3" fill="#10b981" />
            <text x="20" y="45" fontSize="3" textAnchor="middle" fill="#475569">Start</text>
            
            {/* End point */}
            <g transform="translate(80, 50)">
              <circle r="3" fill="#ef4444" />
              <text y="-5" fontSize="3" textAnchor="middle" fill="#475569">End</text>
            </g>
            
            {/* Car position */}
            <g transform={`translate(${carPosition.x}, ${carPosition.y})`}>
              <circle r="2.5" fill="#3b82f6" />
              <circle r="4" fill="#3b82f680" opacity="0.5">
                <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
              </circle>
            </g>
          </svg>
        </div>
        
        {/* Overlay info */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Car className="mr-2 text-primary" size={18} />
              <div>
                <p className="text-sm font-semibold">Toyota Camry XLE4</p>
                <p className="text-xs text-gray-500">15 mins to destination</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">12.4 km</p>
              <p className="text-xs text-gray-500">From current location</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gray-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <MapPin size={18} className="text-primary" />
            <span className="text-sm font-medium">Share Live Location</span>
          </div>
          <button className="text-sm px-3 py-1 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingDemo;
