
import React, { useEffect, useState } from 'react';
import { User, Booking } from '../types';
import { api } from '../services/api';

interface UserProfileProps {
  user: User;
  onClose: () => void;
  onUpdate: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onClose, onUpdate }) => {
  const [myBookings, setMyBookings] = useState<Booking[]>([]); // Bookings I made (Traveler)
  const [jobRequests, setJobRequests] = useState<Booking[]>([]); // Bookings sent to me (Guide)
  
  const [activeTab, setActiveTab] = useState<'info' | 'trips' | 'jobs'>('trips');
  const [loading, setLoading] = useState(false);

  // Rating Modal State
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [selectedBookingForRating, setSelectedBookingForRating] = useState<Booking | null>(null);
  const [ratingValue, setRatingValue] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
        // Load trips I am taking (Traveler role)
        const myTrips = await api.bookings.listByUser(user.id);
        setMyBookings(myTrips);

        // If I am a guide, load jobs sent to me
        if (user.role === 'guide') {
            const myJobs = await api.bookings.listByGuide(user.id);
            setJobRequests(myJobs);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Set default tab based on role if needed
    if (user.role === 'guide' && activeTab === 'trips' && myBookings.length === 0) {
        setActiveTab('jobs');
    }
  }, [user.id, user.role]);

  // --- Actions for Traveler ---
  const handleCancel = async (bookingId: string) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
        try {
            await api.bookings.cancel(bookingId);
            loadData();
            onUpdate();
        } catch (e) {
            alert('Cancellation failed');
        }
    }
  };

  const handleComplete = async (bookingId: string) => {
      if (window.confirm("Mark trip as completed?")) {
          try {
              await api.bookings.complete(bookingId);
              loadData();
              onUpdate();
          } catch (e) {
              alert('Update failed');
          }
      }
  };

  const openRatingModal = (booking: Booking) => {
      setSelectedBookingForRating(booking);
      setRatingValue(5);
      setReviewText('');
      setIsRatingModalOpen(true);
  };

  const submitRating = async () => {
      if (!selectedBookingForRating) return;
      try {
          await api.bookings.rate(selectedBookingForRating.id, ratingValue, reviewText);
          alert("Rating submitted successfully!");
          setIsRatingModalOpen(false);
          loadData(); // Refresh list to show stars
          onUpdate();
      } catch (e) {
          alert("Failed to submit rating.");
      }
  };

  // --- Actions for Guide ---
  const handleAcceptJob = async (bookingId: string) => {
      try {
          await api.bookings.accept(bookingId);
          loadData();
          onUpdate();
          alert("Booking Accepted! You are now marked as busy.");
      } catch (e) {
          alert('Acceptance failed');
      }
  };

  const handleRejectJob = async (bookingId: string) => {
      if(window.confirm("Reject this booking request?")) {
        try {
            await api.bookings.reject(bookingId);
            loadData();
            onUpdate();
        } catch (e) {
            alert('Rejection failed');
        }
      }
  };

  const renderStatusBadge = (status: Booking['status']) => {
      switch (status) {
          case 'pending': return <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-0.5 rounded-full uppercase">⏳ Pending</span>;
          case 'active': return <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-0.5 rounded-full uppercase animate-pulse">● Active</span>;
          case 'completed': return <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-0.5 rounded-full uppercase">✔ Done</span>;
          case 'cancelled': return <span className="bg-red-50 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full uppercase">✕ Cancelled</span>;
          case 'rejected': return <span className="bg-red-50 text-red-500 text-xs font-bold px-2 py-0.5 rounded-full uppercase">⛔ Rejected</span>;
      }
  };

  const renderStars = (rating: number) => {
      return (
          <div className="flex text-yellow-400">
              {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4" fill={star <= rating ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
              ))}
          </div>
      );
  };

  return (
    <div className="h-full flex flex-col relative">
       {/* Tab Headers */}
       <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6 overflow-x-auto">
          <button 
             onClick={() => setActiveTab('info')}
             className={`flex-1 min-w-[80px] py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'info' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500'}`}
          >
             Profile Info
          </button>
          
          <button 
             onClick={() => setActiveTab('trips')}
             className={`flex-1 min-w-[80px] py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'trips' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500'}`}
          >
             My Trips
          </button>

          {user.role === 'guide' && (
            <button 
                onClick={() => setActiveTab('jobs')}
                className={`flex-1 min-w-[80px] py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'jobs' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500'}`}
            >
                Job Requests {jobRequests.filter(j => j.status === 'pending').length > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 rounded-full">{jobRequests.filter(j => j.status === 'pending').length}</span>}
            </button>
          )}
       </div>

       <div className="flex-grow overflow-y-auto custom-scrollbar p-1">
          {/* PROFILE INFO TAB */}
          {activeTab === 'info' && (
             <div className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-400 overflow-hidden">
                        {user.role === 'guide' ? (
                            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=128`} alt="Profile" />
                        ) : user.name.charAt(0)}
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-3">
                   <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Full Name</p>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{user.name}</p>
                   </div>
                   <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Email</p>
                      <p className="font-medium text-slate-800 dark:text-slate-200">{user.email}</p>
                   </div>
                   <div>
                      <p className="text-xs text-slate-400 uppercase font-bold">Role</p>
                      <p className="font-medium capitalize text-slate-800 dark:text-slate-200">{user.role}</p>
                   </div>
                   {user.role === 'guide' && (
                       <>
                       <div>
                           <p className="text-xs text-slate-400 uppercase font-bold">Status</p>
                           <p className={`font-medium capitalize ${user.isAvailable ? 'text-green-600' : 'text-red-500'}`}>
                               {user.isAvailable ? 'Available for Hire' : 'Busy / Unavailable'}
                           </p>
                       </div>
                       <div>
                           <p className="text-xs text-slate-400 uppercase font-bold">Overall Rating</p>
                           <div className="flex items-center gap-2">
                               {user.rating ? renderStars(user.rating) : <span className="text-sm">No ratings yet</span>}
                               {user.rating && <span className="text-xs text-slate-500">({user.rating.toFixed(1)})</span>}
                           </div>
                       </div>
                       </>
                   )}
                </div>
             </div>
          )}

          {/* MY TRIPS TAB (Traveler View) */}
          {activeTab === 'trips' && (
             <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-slate-400">Loading trips...</div>
                ) : myBookings.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <p>No trip history found.</p>
                        <p className="text-xs mt-2">Book a guide to start your journey!</p>
                    </div>
                ) : (
                    myBookings.map(booking => (
                        <div key={booking.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                {renderStatusBadge(booking.status)}
                                <span className="text-xs text-slate-400">{new Date(booking.bookingDate).toLocaleDateString()}</span>
                            </div>

                            <div className="flex items-start gap-4 mb-4">
                                <img src={booking.guidePhoto} alt={booking.guideName} className="w-16 h-16 rounded-full object-cover border border-slate-200" />
                                <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{booking.guideName}</h4>
                                    <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                                        Trip: {booking.tripStart}
                                    </p>
                                    
                                    {booking.status === 'active' && (
                                        <div className="mt-2 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-700">
                                            <p>📞 {booking.guidePhone}</p>
                                            <p>✉️ {booking.guideEmail}</p>
                                        </div>
                                    )}
                                    {booking.status === 'pending' && (
                                        <div className="mt-2 text-xs text-orange-600 dark:text-orange-400 italic">
                                            Waiting for guide to accept...
                                        </div>
                                    )}

                                    {/* Rating Display */}
                                    {booking.status === 'completed' && booking.isRated && (
                                        <div className="mt-2">
                                            <div className="flex items-center gap-1 mb-1">
                                                <span className="text-xs font-bold text-slate-500">Your Rating:</span>
                                                {renderStars(booking.userRating || 0)}
                                            </div>
                                            {booking.userReview && <p className="text-xs text-slate-500 italic">"{booking.userReview}"</p>}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
                                {booking.status === 'active' && (
                                    <>
                                    <button 
                                        onClick={() => handleComplete(booking.id)}
                                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors"
                                    >
                                        Complete
                                    </button>
                                    <button 
                                        onClick={() => handleCancel(booking.id)}
                                        className="py-2 px-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    </>
                                )}
                                {booking.status === 'pending' && (
                                    <button 
                                        onClick={() => handleCancel(booking.id)}
                                        className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-bold transition-colors"
                                    >
                                        Cancel Request
                                    </button>
                                )}
                                {booking.status === 'completed' && !booking.isRated && (
                                     <button 
                                        onClick={() => openRatingModal(booking)}
                                        className="w-full py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-lg text-sm font-bold transition-colors shadow-sm animate-pulse"
                                    >
                                        ★ Rate Guide
                                    </button>
                                )}
                                {['cancelled', 'rejected'].includes(booking.status) && (
                                    <div className="w-full text-center text-xs text-slate-400">
                                        Closed
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
             </div>
          )}

          {/* JOBS TAB (Guide View) */}
          {activeTab === 'jobs' && user.role === 'guide' && (
             <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-10 text-slate-400">Loading jobs...</div>
                ) : jobRequests.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        <p>No job requests yet.</p>
                        <p className="text-xs mt-2">Make sure your status is set to 'Available'!</p>
                    </div>
                ) : (
                    jobRequests.map(job => (
                        <div key={job.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl p-4 shadow-sm relative overflow-hidden">
                            {/* Visual highlight for pending jobs */}
                            {job.status === 'pending' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-400"></div>}
                            
                            <div className="flex justify-between items-start mb-3 pl-2">
                                {renderStatusBadge(job.status)}
                                <span className="text-xs text-slate-400">{new Date(job.bookingDate).toLocaleDateString()}</span>
                            </div>

                            <div className="mb-4 pl-2">
                                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Trip Request</h4>
                                <p className="text-sm text-slate-600 dark:text-slate-300">
                                    Location: <span className="font-medium text-indigo-600">{job.tripStart}</span>
                                </p>
                                {job.isRated && (
                                    <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/10 p-2 rounded border border-yellow-100 dark:border-yellow-900/30">
                                        <p className="text-xs font-bold text-yellow-800 dark:text-yellow-400">Review Received:</p>
                                        <div className="flex text-yellow-500 my-1">
                                            {renderStars(job.userRating || 0)}
                                        </div>
                                        {job.userReview && <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{job.userReview}"</p>}
                                    </div>
                                )}
                            </div>

                            <div className="pt-3 border-t border-slate-100 dark:border-slate-700 pl-2">
                                {job.status === 'pending' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => handleAcceptJob(job.id)}
                                            className="py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-bold transition-colors shadow-sm"
                                        >
                                            Accept
                                        </button>
                                        <button 
                                            onClick={() => handleRejectJob(job.id)}
                                            className="py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-bold transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                                {job.status === 'active' && (
                                    <button 
                                        onClick={() => handleComplete(job.id)}
                                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-colors"
                                    >
                                        Mark as Completed
                                    </button>
                                )}
                                {['completed', 'cancelled', 'rejected'].includes(job.status) && (
                                    <div className="text-center text-xs text-slate-400">
                                        Archived
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
             </div>
          )}
       </div>

       {/* Rating Modal */}
       {isRatingModalOpen && selectedBookingForRating && (
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 rounded-xl">
               <div className="bg-white dark:bg-slate-800 w-full max-w-sm p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 animate-pop-in">
                   <h3 className="text-xl font-bold text-center text-slate-800 dark:text-white mb-2">Rate Your Experience</h3>
                   <p className="text-center text-slate-500 text-sm mb-6">How was your trip with <span className="font-bold text-indigo-500">{selectedBookingForRating.guideName}</span>?</p>
                   
                   <div className="flex justify-center gap-2 mb-6">
                       {[1, 2, 3, 4, 5].map((star) => (
                           <button 
                                key={star}
                                onClick={() => setRatingValue(star)}
                                className={`text-3xl transition-transform hover:scale-110 focus:outline-none ${star <= ratingValue ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600'}`}
                           >
                               ★
                           </button>
                       ))}
                   </div>

                   <textarea
                        className="w-full p-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-yellow-400 outline-none resize-none"
                        rows={3}
                        placeholder="Write a short review (optional)..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                   />

                   <div className="flex gap-3 mt-6">
                       <button 
                            onClick={() => setIsRatingModalOpen(false)}
                            className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                       >
                           Skip
                       </button>
                       <button 
                            onClick={submitRating}
                            className="flex-1 py-2.5 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold rounded-xl text-sm shadow-lg shadow-yellow-200 dark:shadow-none transition-colors"
                       >
                           Submit Rating
                       </button>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};

export default UserProfile;
