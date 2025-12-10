import React from 'react';
import { District } from '../types';

interface SingleDistrictViewProps {
  district: District;
  onBack: () => void;
}

const SingleDistrictView: React.FC<SingleDistrictViewProps> = ({ district, onBack }) => {
  const getGradient = (division: string) => {
    switch (division) {
      case 'Barishal': return 'from-blue-500 to-cyan-400 shadow-blue-200';
      case 'Chattogram': return 'from-emerald-500 to-teal-400 shadow-emerald-200';
      case 'Dhaka': return 'from-rose-500 to-pink-400 shadow-rose-200';
      case 'Khulna': return 'from-orange-500 to-amber-400 shadow-orange-200';
      case 'Mymensingh': return 'from-teal-600 to-emerald-400 shadow-teal-200';
      case 'Rajshahi': return 'from-yellow-500 to-orange-400 shadow-yellow-200';
      case 'Rangpur': return 'from-purple-600 to-indigo-400 shadow-purple-200';
      case 'Sylhet': return 'from-green-600 to-lime-400 shadow-green-200';
      default: return 'from-slate-600 to-slate-400 shadow-slate-200';
    }
  };

  const gradientClass = getGradient(district.division);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-12 animate-fade-in-up">
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="group mb-8 flex items-center text-slate-500 hover:text-indigo-600 transition-colors duration-200 font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Directory
      </button>

      {/* Hero Section */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradientClass} text-white shadow-xl p-8 sm:p-12 mb-10 transform transition-all hover:scale-[1.01]`}>
        <div className="relative z-10 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-semibold tracking-wide uppercase mb-4">
            {district.division} Division
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4 drop-shadow-sm">
            {district.name}
          </h1>
          {district.aliases.length > 0 && (
             <p className="text-lg text-white/90 font-medium">
               Also known as: {district.aliases.join(', ')}
             </p>
          )}
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Famous Foods Column */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 animate-fade-in-up delay-100 flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mr-4 text-2xl shadow-sm">
              🍽️
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Famous Foods</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {district.famousFoods.map((food, idx) => (
              <div 
                key={idx} 
                className="flex items-center p-4 rounded-xl bg-amber-50 border border-amber-100 hover:bg-amber-100 transition-colors cursor-default animate-float"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 mr-3"></div>
                <span className="text-slate-700 font-semibold">{food}</span>
              </div>
            ))}
            {district.famousFoods.length === 0 && (
              <p className="text-slate-400 italic">No specific famous foods listed.</p>
            )}
          </div>
        </div>

        {/* Places to Visit Column */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 animate-fade-in-up delay-200 flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mr-4 text-2xl shadow-sm">
              📍
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Places to Visit</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
             {district.placesOfInterest.map((place, idx) => (
              <div 
                key={idx} 
                className="flex items-start p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm hover:border-indigo-200 transition-all cursor-default"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mt-0.5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span className="text-slate-700 font-medium leading-tight">{place}</span>
              </div>
            ))}
            {district.placesOfInterest.length === 0 && (
              <p className="text-slate-400 italic">No specific places listed.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleDistrictView;