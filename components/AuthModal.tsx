import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { districts } from '../data/districts';
import { api } from '../services/api';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<UserRole>('traveler');
  
  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Guide Specific States
  const [phone, setPhone] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(districts[0].name);
  const [startDate, setStartDate] = useState('');
  const [languages, setLanguages] = useState('Bangla, English');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await api.auth.login({ email, password });
      onLogin(user);
      onClose();
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!name || !email || !password) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    try {
      const userData: any = { name, email, password, role };

      if (role === 'guide') {
        if (!phone || !startDate) {
          setError('Guides must provide phone and experience start date');
          setIsLoading(false);
          return;
        }
        userData.phone = phone;
        userData.district = selectedDistrict;
        userData.location = selectedDistrict;
        userData.experienceStartDate = startDate;
        userData.languages = languages.split(',').map(l => l.trim());
      }

      const user = await api.auth.register(userData);
      onLogin(user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] overflow-y-auto custom-scrollbar">
      <div className="flex border-b border-slate-200 dark:border-slate-700 mb-6">
        <button 
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${mode === 'login' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => { setMode('login'); setError(''); }}
        >
          Login
        </button>
        <button 
          className={`flex-1 py-3 text-sm font-bold border-b-2 transition-colors ${mode === 'register' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          onClick={() => { setMode('register'); setError(''); }}
        >
          Register
        </button>
      </div>

      <form onSubmit={mode === 'login' ? handleLogin : handleRegister} className="space-y-4">
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${role === 'traveler' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700'}`}
              onClick={() => setRole('traveler')}
            >
              <div className="text-2xl mb-1">🎒</div>
              <div className="font-bold text-sm">Traveler</div>
            </div>
            <div 
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${role === 'guide' ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-200 dark:border-slate-700'}`}
              onClick={() => setRole('guide')}
            >
              <div className="text-2xl mb-1">🧭</div>
              <div className="font-bold text-sm">Guide</div>
            </div>
          </div>
        )}

        {mode === 'register' && (
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
          <input 
            type="email" 
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
          <input 
            type="password" 
            className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Guide Specific Fields */}
        {mode === 'register' && role === 'guide' && (
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 mt-4">
            <h4 className="font-bold text-slate-800 dark:text-slate-200">Guide Profile</h4>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Service District</label>
              <select 
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
              >
                {districts.map(d => (
                  <option key={d.name} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Career Start Date</label>
              <input 
                type="date" 
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                required
              />
              <p className="text-[10px] text-slate-400 mt-1">We calculate your experience from this date.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
              <input 
                type="tel" 
                placeholder="+880..."
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Languages (comma separated)</label>
              <input 
                type="text" 
                className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 outline-none"
                value={languages}
                onChange={e => setLanguages(e.target.value)}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all mt-4 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? 'Processing...' : (mode === 'login' ? 'Log In' : 'Create Account')}
        </button>
      </form>
    </div>
  );
};

export default AuthModal;