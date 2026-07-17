import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { loginUser, registerUser, selectAuthStatus, selectAuthError, clearError, selectCurrentUser } from '@/features/auth/authSlice';
import { Cat, Mail, User, Lock, ArrowRight, Loader2 } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);
  const user = useAppSelector(selectCurrentUser);

  useEffect(() => {
    // Clear errors when toggling modes
    dispatch(clearError());
  }, [isLogin, dispatch]);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      dispatch(loginUser({ email, password }));
    } else {
      dispatch(registerUser({ username, email, password }));
    }
  };

  const isLoading = status === 'loading';

  return (
    <div
      className="relative h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-stone-900 bg-no-repeat bg-cover bg-center"
      style={{
        backgroundImage: "url('/cat.jpg')",
      }}
    >
      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-stone-950/45 pointer-events-none z-0" />

      {/* Background Liquid Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-primary/20 blur-[60px] sm:blur-[100px] animate-pulse duration-4000 pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-accent/20 blur-[60px] sm:blur-[100px] animate-pulse duration-6000 pointer-events-none z-0" />

      {/* Liquid Glass Card */}
      <div className="relative z-10 w-full max-w-md p-8 water-card animate-fade-in text-black">
        {/* Top Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-primary text-white p-3 rounded-2xl shadow-md mb-3">
            <Cat size={28} />
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-black">
            Welcome to TinyCats
          </h2>
          <p className="text-stone-800 text-xs mt-1">
            {isLogin ? 'Sign in to access personalized cat breed care and advice' : 'Create an account to begin matching with your perfect feline'}
          </p>
        </div>

        {/* Sliding Toggle Switch */}
        <div className="relative bg-stone-900/5 p-1 rounded-full flex items-center mb-8 border border-stone-900/5">
          {/* Active Highlight Slider */}
          <div
            className={`absolute top-1 bottom-1 rounded-full bg-primary shadow-sm transition-all duration-300 ease-out`}
            style={{
              left: isLogin ? '4px' : 'calc(50% + 2px)',
              right: isLogin ? 'calc(50% + 2px)' : '4px',
            }}
          />
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2.5 text-xs font-bold rounded-full relative z-10 transition-colors duration-200 cursor-pointer ${
              isLogin ? 'text-white' : 'text-stone-800 hover:text-black'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2.5 text-xs font-bold rounded-full relative z-10 transition-colors duration-200 cursor-pointer ${
              !isLogin ? 'text-white' : 'text-stone-800 hover:text-black'
            }`}
          >
            Register
          </button>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs font-semibold text-primary-hover animate-fade-in text-left">
            {error}
          </div>
        )}

        {/* Input Forms */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          {/* Username (Register only) */}
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-stone-900 uppercase tracking-wider pl-1">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  required
                  placeholder="tinycatlover"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-sm text-black bg-white/50 border border-stone-200/60 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all backdrop-blur-sm"
                />
              </div>
            </div>
          )}

          {/* Email Address */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-900 uppercase tracking-wider pl-1">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                <Mail size={16} />
              </span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm text-black bg-white/50 border border-stone-200/60 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-stone-900 uppercase tracking-wider pl-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-stone-400">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-sm text-black bg-white/50 border border-stone-200/60 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-primary hover:bg-primary-hover text-white text-sm font-bold py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
