import React from 'react';
import { District } from '../types';

interface DistrictCardProps {
  district: District;
  onViewGuides?: (districtName: string) => void;
}

const getDivisionColor = (division: string) => {
  switch (division) {
    case 'Barishal': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Chattogram': return 'bg-green-100 text-green-800 border-green-200';
    case 'Dhaka': return 'bg-red-100 text-red-800 border-red-200';
    case 'Khulna': return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Mymensingh': return 'bg-teal-100 text-teal-800 border-teal-200';
    case 'Rajshahi': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Rangpur': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Sylhet': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const DistrictCard: React.FC<DistrictCardProps> = ({ district, onViewGuides }) => {
  const badgeClass = getDivisionColor(district.division);

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 overflow-hidden group flex flex-col h-full">
      <div className="p-5 flex-grow flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div>
             <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
              {district.name}
            </h3>
            {district.aliases.length > 0 && (
              <p className="text-xs text-slate-400 mt-1">
                Also: {district.aliases.join(', ')}
              </p>
            )}
          </div>
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border whitespace-nowrap ml-2 ${badgeClass}`}>
            {district.division}
          </span>
        </div>
        
        <div className="space-y-4 mt-4 flex-grow">
          {/* Famous Foods */}
          {district.famousFoods.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2 flex items-center">
                <span className="mr-1">🍽️</span> Famous For
              </p>
              <div className="flex flex-wrap gap-1.5">
                {district.famousFoods.map((food, idx) => (
                  <span key={idx} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                    {food}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Places of Interest */}
          {district.placesOfInterest.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-2 flex items-center">
                 <span className="mr-1">📍</span> Places to Visit
              </p>
              <ul className="grid grid-cols-1 gap-1">
                {district.placesOfInterest.map((place, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-start">
                    <span className="text-indigo-400 mr-1.5">•</span>
                    <span className="line-clamp-1 hover:line-clamp-none transition-all">{place}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Action Button */}
        {onViewGuides && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <button 
              onClick={() => onViewGuides(district.name)}
              className="w-full py-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white"
            >
              View Local Guides
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DistrictCard;