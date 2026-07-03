import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Cat, Menu, X, Heart, RefreshCw } from 'lucide-react';
import { useAppSelector } from '@/app/hooks';
import { selectSavedBreeds, selectCompareList } from '@/features/breeds/breedsSlice';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const savedBreeds = useAppSelector(selectSavedBreeds);
  const compareIds = useAppSelector(selectCompareList);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Quiz', path: '/quiz' },
    { name: 'Browse Breeds', path: '/browse' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass shadow-premium py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-primary text-white p-2 rounded-xl group-hover:scale-105 transition-transform duration-200">
              <Cat size={24} />
            </div>
            <span className="font-display font-extrabold text-xl tracking-tight text-primary">
              Tiny<span className="text-primary-container">Cats</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium text-sm transition-colors duration-200 ${
                    isActive
                      ? 'text-primary border-b-2 border-primary pb-1'
                      : 'text-stone-600 hover:text-primary'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action Badges */}
          <div className="hidden md:flex items-center gap-4">
            {compareIds.length > 0 && (
              <Link
                to="/compare"
                className="flex items-center gap-1.5 text-xs font-semibold bg-sage/10 text-sage px-3 py-1.5 rounded-full hover:bg-sage/20 transition-all duration-200"
              >
                <RefreshCw size={14} className="animate-spin-slow" />
                <span>Compare ({compareIds.length})</span>
              </Link>
            )}

            <Link
              to="/browse?saved=true"
              className="relative p-2 text-stone-600 hover:text-primary transition-colors"
              title="Saved Breeds"
            >
              <Heart size={22} className={savedBreeds.length > 0 ? 'fill-primary text-primary' : ''} />
              {savedBreeds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5.5 h-5.5 rounded-full flex items-center justify-center border-2 border-surface-bg">
                  {savedBreeds.length}
                </span>
              )}
            </Link>

            <Link
              to="/quiz"
              className="bg-primary text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-primary-hover transition-colors shadow-sm"
            >
              Find My Match
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <Link
              to="/browse?saved=true"
              className="relative p-1.5 text-stone-600 hover:text-primary"
            >
              <Heart size={20} className={savedBreeds.length > 0 ? 'fill-primary text-primary' : ''} />
              {savedBreeds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {savedBreeds.length}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-md text-stone-600 hover:text-primary hover:bg-stone-100 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-stone-200/50 mt-2 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-stone-700 hover:bg-stone-100 hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
          {compareIds.length > 0 && (
            <Link
              to="/compare"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-sage hover:bg-stone-100"
            >
              <RefreshCw size={16} />
              Compare ({compareIds.length})
            </Link>
          )}
          <Link
            to="/quiz"
            onClick={() => setIsOpen(false)}
            className="block text-center bg-primary text-white px-4 py-2.5 rounded-full font-medium text-sm shadow-sm"
          >
            Find My Match
          </Link>
        </div>
      )}
    </nav>
  );
};
