import React from 'react';

interface TraitBarProps {
  label: string;
  value: number; // 1 to 10
  maxValue?: number;
}

export const TraitBar: React.FC<TraitBarProps> = ({
  label,
  value,
  maxValue = 10,
}) => {
  const percentage = (value / maxValue) * 100;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-stone-700 capitalize">{label}</span>
        <span className="text-xs font-semibold text-stone-500">{value}/{maxValue}</span>
      </div>
      <div className="w-full bg-stone-200/50 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-sage h-2.5 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
