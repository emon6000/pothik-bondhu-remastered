
import React, { useState, useMemo, useEffect } from 'react';
import { districts } from '../data/districts';
import Fuse from 'fuse.js';
import { Guide, User } from '../types';
import { api } from '../services/api';

interface GuideFinderProps {
  onClose: () => void;
  initialDistrict?: string | null;
  currentUser: User | null;
  onOpenAuth: () => void;
  onGuideBooked: (guide: Guide) => void;
}

const GuideFinder: React.FC<GuideFinderProps> = ({ onClose, initialDistrict, currentUser, onOpenAuth, onGuideBooked }) => {
  const [selectedDistrictName, setSelectedDistrictName] = useState<string | null>(initialDistrict || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [allGuides, setAllGuides] = useState<Record<string, Guide[]>>({});
  const [loading, setLoading] = useState(false);
  
  // Load real guides from DB
  useEffect(() => {
    const loadGuides = async () => {
        setLoading(true);
        try {
            const guidesMap: Record<string, Guide[]> = {};
            const realGuides = await api.guides.list();

            realGuides.forEach(g => {
                const d = g.district || 'Dhaka';
                if (!guidesMap[d]) guidesMap[d] = [];
                guidesMap[d].push(g);
            });

            setAllGuides(guidesMap);
        } catch (e) {
            console.error("Error loading guides", e);
        } finally {
            setLoading(false);
        }
    };

    loadGuides();
  }, []); 

  // Update selected district if initialDistrict prop changes
  useEffect(() => {
    if (initialDistrict) {
      setSelectedDistrictName(initialDistrict);
    }
  }, [initialDistrict]);


  const handleBook = async (guide: Guide) => {
    if (!currentUser) {
        onOpenAuth();
        return;
    }
    
    // Check if user is trying to book themselves
    if (currentUser.id === guide.id) {
        alert("You cannot book yourself!");
        return;
    }

    if (window.confirm(`Send booking request to ${guide.name}?`)) {
        try {
            await api.bookings.create({
                userId: currentUser.id,
                guideId: guide.id,
                tripStart: selectedDistrictName || 'Unknown',
                tripEnd: selectedDistrictName || 'Unknown'
            });
            onGuideBooked(guide);
            alert(`Request sent to ${guide.name}! You can track status in your Profile.`);
        } catch (e) {
            alert('Request failed. Please try again.');
        }
    }
  };

  // Level 1: District Search
  const fuse = useMemo(() => {
    return new Fuse(districts, {
      keys: ['name', 'aliases', 'bnName'],
      threshold: 0.45, 
      ignoreLocation: true,
      minMatchCharLength: 2
    });
  }, []);

  const filteredDistricts = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') return districts;
    return fuse.search(searchQuery.trim()).map(res => res.item);
  }, [searchQuery, fuse]);

  // Level 2: Guide View Logic
  const selectedGuides = selectedDistrictName ? (allGuides[selectedDistrictName] || []) : [];

  if (selectedDistrictName) {
    return (
      <div className="h-full flex flex-col">
        {/* Header with Back Button */}
        <div className="flex items-center mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setSelectedDistrictName(null)}
            className="mr-4 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{selectedDistrictName} Guides</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {loading ? 'Loading...' : `${selectedGuides.length} verified local guides available`}
            </p>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '60vh' }}>
          {selectedGuides.length === 0 && (
              <div className="col-span-full text-center py-10 text-slate-400">
                  <p>No guides found in this district yet.</p>
                  <p className="text-sm mt-2">Be the first to register!</p>
              </div>
          )}
          {selectedGuides.map(guide => (
            <div key={guide.id} className={`bg-white dark:bg-slate-800 border ${guide.isAvailable ? 'border-slate-200 dark:border-slate-700' : 'border-red-200 dark:border-red-900/50 bg-slate-50 dark:bg-slate-900/50'} rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4 animate-fade-in-up relative`}>
              
              {/* Availability Badge */}
              <div className="absolute top-4 right-4">
                  {guide.isAvailable ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ● Available
                      </span>
                  ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          ● Busy
                      </span>
                  )}
              </div>

              <div className="flex flex-row gap-4">
                  <div className="flex-shrink-0">
                    <img 
                      src={guide.photo} 
                      alt={guide.name} 
                      className={`w-20 h-20 rounded-full object-cover border-2 shadow-sm ${guide.isAvailable ? 'border-white dark:border-slate-600' : 'border-slate-200 grayscale'}`}
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start pr-20">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{guide.name}</h3>
                    </div>
                    
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1 flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Experience: {guide.experience}
                    </p>
                    
                    <div className="text-sm text-slate-500 dark:text-slate-400 space-y-1 mb-2">
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        {guide.location}
                      </div>
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-1.5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"></path></svg>
                        {guide.languages.join(', ')}
                      </div>
                    </div>

                    {/* Display Only Rating */}
                    <div className="flex items-center mb-2">
                       {guide.rating > 0 ? (
                           <>
                           <div className="flex text-yellow-400 mr-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                <svg key={star} className="w-4 h-4" fill={star <= Math.round(guide.rating) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                </svg>
                                ))}
                           </div>
                           <span className="text-xs text-slate-500 font-medium">({guide.rating} / 5) • {guide.ratingCount} votes</span>
                           </>
                       ) : (
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                               NEW
                           </span>
                       )}
                    </div>
                  </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-auto">
                   {guide.isAvailable ? (
                        <button 
                            onClick={() => handleBook(guide)}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold py-3 rounded-lg text-center transition-colors shadow-sm flex items-center justify-center"
                        >
                            Request Booking
                        </button>
                   ) : (
                       <button disabled className="w-full bg-slate-100 dark:bg-slate-700 text-slate-400 text-sm font-bold py-3 rounded-lg cursor-not-allowed border border-slate-200 dark:border-slate-600">
                           Unavailable
                       </button>
                   )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // View 1: List Districts
  return (
    <div className="h-full flex flex-col">
       <div className="mb-6">
         <div className="relative">
            <input
              type="text"
              placeholder="Search district (Bangla/English)..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
         </div>
       </div>

       <div className="overflow-y-auto pr-2 custom-scrollbar" style={{ maxHeight: '60vh' }}>
         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredDistricts.map(district => {
              const guideCount = (allGuides[district.name] || []).filter(g => g.isAvailable).length; // Only show available count
              return (
                <button
                  key={district.name}
                  onClick={() => setSelectedDistrictName(district.name)}
                  className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-xl text-left hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group"
                >
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 truncate">
                    {district.name}
                  </h3>
                  <div className="flex items-center mt-2 text-xs text-slate-500 dark:text-slate-400">
                     <span className={`w-2 h-2 rounded-full mr-2 ${guideCount > 0 ? 'bg-green-500' : 'bg-slate-300'}`}></span>
                     {guideCount} Available
                  </div>
                </button>
              );
            })}
         </div>
       </div>
    </div>
  );
};

export default GuideFinder;
