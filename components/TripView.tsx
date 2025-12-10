import React, { useState } from 'react';
import { District, Guide } from '../types';
import MapComponent from './MapComponent';
import WeatherWidget from './WeatherWidget';

interface TripViewProps {
  startDistrict: District;
  endDistrict: District;
  bookedGuide: Guide | null;
  onBack: () => void;
  onViewGuides: (districtName: string) => void;
}

const TimelineDistrict: React.FC<{ district: District; index: number; type: 'start' | 'end' | 'waypoint'; onViewGuides: (name: string) => void }> = ({ district, index, type, onViewGuides }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Styling based on type
  let nodeColor = 'bg-white dark:bg-slate-800 border-indigo-400 dark:border-indigo-500';
  let labelText = 'Passing By';
  let labelColor = 'text-slate-400 dark:text-slate-500';
  
  if (type === 'start') {
    nodeColor = 'bg-indigo-600 border-indigo-200 dark:border-indigo-800 ring-4 ring-indigo-50 dark:ring-indigo-900/30';
    labelText = 'Starting Point';
    labelColor = 'text-indigo-600 dark:text-indigo-400';
  } else if (type === 'end') {
    nodeColor = 'bg-red-500 border-red-200 dark:border-red-800 ring-4 ring-red-50 dark:ring-red-900/30';
    labelText = 'Destination';
    labelColor = 'text-red-500 dark:text-red-400';
  }

  return (
    <div className="relative pl-8 pb-8 last:pb-0 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
      {/* Connector Line */}
      <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 last:hidden"></div>
      
      {/* Node Dot */}
      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 z-10 ${nodeColor}`}></div>
      
      <div className={`bg-white dark:bg-slate-900 rounded-xl p-5 border ${isExpanded ? 'border-indigo-200 dark:border-indigo-800 shadow-md' : 'border-slate-100 dark:border-slate-800 shadow-sm'} hover:shadow-md transition-all duration-300`}>
        <div className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <span className={`text-xs font-bold uppercase tracking-wide mb-1 block ${labelColor}`}>{labelText}</span>
              <div className="flex items-center flex-wrap gap-y-2">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mr-1">{district.name}</h3>
                <WeatherWidget lat={district.coordinates.lat} lng={district.coordinates.lng} compact={true} />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{district.division} Division</p>
            </div>
            
            <div className={`text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 p-1.5 rounded-full transform transition-transform duration-300 flex-shrink-0 ml-2 ${isExpanded ? 'rotate-180' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        
          {/* Always visible small summary */}
          {!isExpanded && (
            <div className="mt-3 flex gap-2 overflow-hidden">
               {district.famousFoods.slice(0, 2).map((f, i) => (
                  <span key={i} className="text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 px-2 py-1 rounded-full">{f}</span>
               ))}
               {district.famousFoods.length > 2 && <span className="text-xs text-slate-400 dark:text-slate-600 py-1">+{district.famousFoods.length - 2} more</span>}
            </div>
          )}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in-up">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">🍽️ Foods to Try</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {district.famousFoods.map((f, i) => (
                      <span key={i} className="px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 text-xs rounded border border-amber-100 dark:border-amber-900/30">
                        {f}
                      </span>
                    ))}
                  </div>
               </div>
               <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">📍 Sights</h4>
                  <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
                    {district.placesOfInterest.map((p, i) => (
                      <li key={i} className="flex items-start">
                        <span className="mr-2 text-indigo-400 dark:text-indigo-500">•</span> {p}
                      </li>
                    ))}
                  </ul>
               </div>
             </div>
             {/* Full weather widget in expanded view as well for details */}
             <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">Current Conditions</h4>
                <WeatherWidget lat={district.coordinates.lat} lng={district.coordinates.lng} />
             </div>
             
             {/* View Guides Button */}
             <button 
               onClick={() => onViewGuides(district.name)}
               className="mt-4 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center"
             >
               <span className="mr-2">🧭</span> View Guides in {district.name}
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

const TripView: React.FC<TripViewProps> = ({ startDistrict, endDistrict, bookedGuide, onBack, onViewGuides }) => {
  const [routeStats, setRouteStats] = useState<{ distance: number; duration: number } | null>(null);
  const [intermediateDistricts, setIntermediateDistricts] = useState<District[]>([]);

  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(1);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours} hr ${minutes} min`;
    }
    return `${minutes} min`;
  };

  // Combine all into one ordered list
  const journeyTimeline = [
    { ...startDistrict, type: 'start' as const },
    ...intermediateDistricts.map(d => ({ ...d, type: 'waypoint' as const })),
    { ...endDistrict, type: 'end' as const }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-12 animate-fade-in-up">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Plan Another Trip
      </button>
      
      {/* Booked Guide Banner */}
      {bookedGuide && (
          <div className="mb-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 flex items-center animate-fade-in-up">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500 mr-4">
                  <img src={bookedGuide.photo} alt={bookedGuide.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow">
                  <h3 className="font-bold text-green-900 dark:text-green-300">Guide Booked: {bookedGuide.name}</h3>
                  <p className="text-xs text-green-700 dark:text-green-400">
                    Phone: {bookedGuide.phone} | Email: {bookedGuide.email}
                  </p>
              </div>
              <div className="text-2xl">✅</div>
          </div>
      )}

      {/* Map Section */}
      <div className="w-full h-80 sm:h-96 bg-slate-200 dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg mb-8 border border-slate-300 dark:border-slate-700 relative">
        <MapComponent 
          startLat={startDistrict.coordinates.lat} 
          startLng={startDistrict.coordinates.lng}
          endLat={endDistrict.coordinates.lat}
          endLng={endDistrict.coordinates.lng}
          onRouteFound={(dist, dur) => setRouteStats({ distance: dist, duration: dur })}
          onIntermediatesFound={setIntermediateDistricts}
        />
        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm text-xs font-medium z-[400] text-slate-600 dark:text-slate-300">
          Trip Route
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-12 -mt-16 relative z-[500] px-4">
        {routeStats && (
            <>
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-indigo-50 dark:border-indigo-900/50 p-4 flex items-center min-w-[150px] animate-fade-in-up delay-100">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-3 text-indigo-600 dark:text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                </div>
                <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Distance</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{formatDistance(routeStats.distance)} <span className="text-sm font-medium text-slate-500 dark:text-slate-400">km</span></p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-indigo-50 dark:border-indigo-900/50 p-4 flex items-center min-w-[150px] animate-fade-in-up delay-200">
                <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-3 text-indigo-600 dark:text-indigo-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide">Est. Time</p>
                <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{formatDuration(routeStats.duration)}</p>
                </div>
            </div>
            </>
        )}
      </div>

      {/* Unified Journey Timeline */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-grow"></div>
          <h2 className="px-4 text-xl font-bold text-slate-700 dark:text-slate-200">Journey Itinerary</h2>
          <div className="h-px bg-slate-200 dark:bg-slate-700 flex-grow"></div>
        </div>
        
        <div className="relative pl-4">
          {journeyTimeline.map((district, idx) => (
            <TimelineDistrict 
              key={`${district.name}-${idx}`} 
              district={district} 
              index={idx} 
              type={district.type}
              onViewGuides={onViewGuides}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TripView;