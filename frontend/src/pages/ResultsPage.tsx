import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { RecommendationList } from '@/features/recommendations/RecommendationList';
import { ChatPanel } from '@/features/chat/ChatPanel';
import { setChatContext } from '@/features/chat/chatSlice';
import {
  selectRecommendations,
} from '@/features/recommendations/recommendationsSlice';
import { selectQuizAnswers } from '@/features/quiz/quizSlice';
import { fetchBreeds } from '@/features/breeds/breedsSlice';
import { Button } from '@/components/ui/button';
import { Share2, Scale, RotateCcw } from 'lucide-react';
import { encodeQuizAnswers } from '@/utils/shareUtils';

export const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const recommendations = useAppSelector(selectRecommendations);
  const answers = useAppSelector(selectQuizAnswers);

  useEffect(() => {
    dispatch(fetchBreeds());
  }, [dispatch]);

  // Set chat context when recommendations load
  useEffect(() => {
    if (recommendations.length > 0) {
      dispatch(
        setChatContext({
          quizAnswers: answers as any,
          topRecommendationIds: recommendations.slice(0, 3).map((r) => r.breedId),
        })
      );
    }
  }, [recommendations, answers, dispatch]);

  const handleShare = () => {
    const encoded = encodeQuizAnswers(answers as any);
    const shareUrl = `${window.location.origin}/quiz?share=${encoded}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Shareable link copied to clipboard!');
  };

  const handleRestart = () => {
    navigate('/quiz');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 text-left space-y-8">
      {/* Header Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-display font-black text-3xl sm:text-5xl text-stone-900 tracking-tight mb-2">
            Your Match Results
          </h1>
          <p className="text-stone-500 text-sm">
            AI-driven results based on your home, allergy, and active traits.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={handleShare} className="flex items-center gap-1.5">
            <Share2 size={16} />
            <span>Share Link</span>
          </Button>

          <Button variant="outline" size="sm" onClick={() => navigate('/compare')} className="flex items-center gap-1.5">
            <Scale size={16} />
            <span>Compare Page</span>
          </Button>

          <Button variant="ghost" size="sm" onClick={handleRestart} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-800">
            <RotateCcw size={16} />
            <span>Retake Quiz</span>
          </Button>
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recommendations */}
        <div className="lg:col-span-7 space-y-6">
          <RecommendationList />
        </div>

        {/* Right Column: Chat Panel */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 h-[calc(100vh-160px)] min-h-[500px]">
          <ChatPanel />
        </div>
      </div>
    </div>
  );
};
