'use client';

import React from 'react';
import { portfolioCategories } from '@/data/portfolio';
import { PortfolioCategory } from '@/types/portfolio';

interface PortfolioFilterProps {
  activeCategory: PortfolioCategory;
  onSelectCategory: (category: PortfolioCategory) => void;
  counts: Record<PortfolioCategory, number>;
}

export function PortfolioFilter({
  activeCategory,
  onSelectCategory,
  counts,
}: PortfolioFilterProps) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mb-12">
      {portfolioCategories.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = counts[cat.id as PortfolioCategory] || 0;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id as PortfolioCategory)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 flex items-center gap-2 border ${
              isActive
                ? 'bg-accent-purple text-white border-accent-purple shadow-glow-purple'
                : 'bg-surface/80 text-slate-300 border-border hover:border-slate-500 hover:text-white hover:bg-surface'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                isActive
                  ? 'bg-black/30 text-white'
                  : 'bg-slate-900 text-slate-400'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
