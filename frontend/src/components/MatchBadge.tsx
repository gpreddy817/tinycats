import React from 'react';

interface MatchBadgeProps {
  score: number;
}

export const MatchBadge: React.FC<MatchBadgeProps> = ({ score }) => {
  return (
    <div className="inline-flex items-center gap-1 bg-accent/15 border border-accent/40 text-primary-hover px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
      <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
      <span>{score}% Match</span>
    </div>
  );
};
