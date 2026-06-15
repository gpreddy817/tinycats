import { cn } from '@/lib/utils';

interface TraitBarProps {
  label: string;
  value: number;         // 1–10
  maxValue?: number;     // defaults to 10
  inverted?: boolean;    // lower = better (grooming, allergenLevel)
  showValue?: boolean;
  className?: string;
}

export function TraitBar({
  label,
  value,
  maxValue = 10,
  inverted = false,
  showValue = true,
  className,
}: TraitBarProps) {
  const pct = Math.round((value / maxValue) * 100);

  // Color logic: inverted traits (grooming, allergen) use green for low scores
  const fillColor = inverted
    ? value <= 2
      ? '#34D399'  // success green — very low = great
      : value <= 4
        ? '#86EFAC'  // light green
        : value <= 6
          ? '#FBBF24'  // warning
          : '#F87171'  // danger — high = problematic
    : '#7C5CBF';   // primary purple for normal traits

  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span
        className="text-sm font-medium shrink-0"
        style={{ color: 'var(--color-text-secondary)', minWidth: '7rem' }}
      >
        {label}
      </span>
      <div
        className="flex-1 rounded-full overflow-hidden"
        style={{ height: '8px', backgroundColor: 'var(--color-border)' }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={1}
        aria-valuemax={maxValue}
        aria-label={`${label}: ${value} out of ${maxValue}`}
      >
        <div
          className="h-full rounded-full trait-bar-fill"
          style={{
            width: `${pct}%`,
            backgroundColor: fillColor,
          }}
        />
      </div>
      {showValue && (
        <span
          className="text-sm font-semibold tabular-nums shrink-0 w-10 text-right"
          style={{ color: 'var(--color-text-primary)' }}
        >
          {value}/{maxValue}
        </span>
      )}
    </div>
  );
}

export default TraitBar;
