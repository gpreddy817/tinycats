import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Activity, CheckCircle, Search } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { fetchBreeds, selectAllBreeds } from '@/features/breeds/breedsSlice';
import { BreedCard } from '@/features/breeds/BreedCard';
import { Button } from '@/components/ui/button';

export const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const breeds = useAppSelector(selectAllBreeds);

  useEffect(() => {
    dispatch(fetchBreeds());
  }, [dispatch]);

  // Featured 3 breeds to show
  const featuredBreeds = breeds.slice(0, 3);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative rounded-4xl overflow-hidden h-[500px] md:h-[600px] shadow-premium border border-stone-100 flex items-center">
        {/* Background Image with overlay */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=1600')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/80 via-stone-950/50 to-transparent" />

        {/* Hero Content */}
        <div className="relative max-w-2xl mx-auto md:mx-0 px-6 sm:px-12 text-left space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-accent/25 border border-accent/40 text-accent-foreground px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-white">
            <Sparkles size={14} className="text-accent animate-pulse" />
            <span>AI-Powered Recommendations</span>
          </div>

          <h1 className="font-display font-black text-4xl sm:text-6xl text-white leading-tight tracking-tight">
            Find the Cat that <span className="text-accent">Fits Your Life</span>
          </h1>

          <p className="text-base sm:text-lg text-stone-200 leading-relaxed font-body">
            Over 70 recognized breeds, all with distinct personalities. Answer a simple quiz, and let our Gemini AI match you with your perfect feline partner.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <Link to="/quiz" className="flex-1 sm:flex-initial">
              <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-2">
                <span>Start Match Quiz</span>
                <ArrowRight size={18} />
              </Button>
            </Link>

            <Link to="/browse" className="flex-1 sm:flex-initial">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 hover:text-white flex items-center justify-center gap-2">
                <span>Browse Breeds</span>
                <Search size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-display font-black text-3xl text-stone-900">How TinyCats Works</h2>
          <p className="text-stone-500 text-sm mt-2">Connecting pet searchers with optimal feline matches through technology.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Personality Quiz */}
          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm flex flex-col justify-between hover:shadow-premium transition-all duration-300">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20">
                <CheckCircle size={24} />
              </div>
              <h3 className="font-display font-bold text-xl text-stone-900">1. Take the Quiz</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Tell us about your home space, activity preference, allergy sensitivities, and experience level.
              </p>
            </div>
            <Link to="/quiz" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover mt-6 group">
              <span>Start quiz</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: AI Recommendations */}
          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm flex flex-col justify-between hover:shadow-premium transition-all duration-300">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-sage/10 text-sage rounded-2xl flex items-center justify-center border border-sage/20">
                <Sparkles size={24} />
              </div>
              <h3 className="font-display font-bold text-xl text-stone-900">2. Gemini Matchmaking</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Our customized Google Gemini model evaluates your answers against raw MCP breed records to compute your match score.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage mt-6">
              <span>Highly Personalized</span>
            </div>
          </div>

          {/* Card 3: Interactive Chat */}
          <div className="bg-white rounded-3xl p-8 border border-stone-100 shadow-sm flex flex-col justify-between hover:shadow-premium transition-all duration-300">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-accent/10 text-primary-hover rounded-2xl flex items-center justify-center border border-accent/20">
                <Activity size={24} />
              </div>
              <h3 className="font-display font-bold text-xl text-stone-900">3. Chat and Detail</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Chat with the AI assistant to ask further questions about diet, lifespan, grooming, and child safety.
              </p>
            </div>
            <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover mt-6 group">
              <span>Explore breeds</span>
              <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Breeds Section */}
      {featuredBreeds.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
            <div className="text-left">
              <h2 className="font-display font-black text-3xl text-stone-900">Popular Cat Breeds</h2>
              <p className="text-stone-500 text-sm mt-1">Get to know some of the most beloved cat breeds in the world.</p>
            </div>
            <Link to="/browse">
              <Button variant="outline" className="flex items-center gap-2">
                <span>View All Breeds</span>
                <ArrowRight size={16} />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredBreeds.map((breed) => (
              <BreedCard key={breed.id} breed={breed} />
            ))}
          </div>
        </section>
      )}

      {/* Stats / Banner Section */}
      <section className="bg-sage rounded-4xl p-10 sm:p-16 text-center text-white relative overflow-hidden shadow-premium">
        {/* Subtle decorative circles */}
        <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-12 -right-12 w-64 h-64 rounded-full bg-white/5" />

        <div className="max-w-xl mx-auto space-y-6 relative z-10">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-white">Find Your Purrfect Companion Today</h2>
          <p className="text-stone-200 text-sm leading-relaxed">
            Stop scrolling static blog posts. Spend 2 minutes with our personality quiz and get real, scientifically structured breed recommendations.
          </p>
          <div className="pt-2">
            <Link to="/quiz">
              <Button variant="primary" size="lg" className="bg-white text-sage hover:bg-stone-100 hover:text-sage-hover">
                <span>Start Personality Test</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
