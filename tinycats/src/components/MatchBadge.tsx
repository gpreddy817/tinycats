import { cn } from '@/lib/utils';

interface MatchBadgeProps {
  score: number;   // 0–100
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

function getScoreColor(score: number): string {
  if (score >= 85) return '#34D399';   // success green — excellent match
  if (score >= 70) return '#FBBF24';   // warning yellow — good match
  return '#F87171';                     // danger red — moderate match
}

export function MatchBadge({ score, className, size = 'md' }: MatchBadgeProps) {
  const color = getScoreColor(score);
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-bold tracking-wide',
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: color + '22',  // 13% opacity background
        color,
        border: `1.5px solid ${color}44`,
      }}
      aria-label={`${score}% match`}
    >
      <span
        className="inline-block rounded-full"
        style={{ width: '6px', height: '6px', backgroundColor: color }}
        aria-hidden="true"
      />
      {score}%
    </span>
  );
}

export default MatchBadge;
