'use client';

import React from 'react';
import { Play, Clock, ArrowUpRight } from 'lucide-react';
import { PortfolioItem } from '@/types/portfolio';
import { Badge } from '@/components/ui/Badge';

interface PortfolioCardProps {
  project: PortfolioItem;
  onSelect: (project: PortfolioItem) => void;
}

export function PortfolioCard({ project, onSelect }: PortfolioCardProps) {
  return (
    <div
      onClick={() => onSelect(project)}
      className="group cursor-pointer rounded-2xl bg-surface border border-border overflow-hidden flex flex-col justify-between hover:border-slate-500 hover:shadow-card-hover transition-all duration-300 transform hover:-translate-y-1"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(project);
        }
      }}
      aria-label={`View details for ${project.title}`}
    >
      <div>
        {/* Thumbnail Aspect Box */}
        <div
          className={`relative aspect-video w-full bg-gradient-to-tr ${project.gradientTheme} p-5 flex flex-col justify-between overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] group-hover:bg-black/25 transition-colors" />

          {/* Top category & Demo badge */}
          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-md border border-white/10 font-mono">
              {project.categoryLabel}
            </span>

            {project.isDemoOrConcept && (
              <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded bg-accent-purple/90 text-white backdrop-blur-md">
                {project.conceptLabel || 'Concept Edit'}
              </span>
            )}
          </div>

          {/* Center Play Button Icon */}
          <div className="relative z-10 mx-auto w-12 h-12 rounded-full bg-black/60 border border-white/30 text-white flex items-center justify-center group-hover:scale-110 group-hover:bg-accent-purple transition-all duration-200 shadow-lg">
            <Play className="w-5 h-5 ml-0.5 fill-current" />
          </div>

          {/* Bottom Duration & Ratio */}
          <div className="relative z-10 flex items-center justify-between text-[11px] text-white/90 font-mono">
            <span className="flex items-center gap-1 bg-black/60 px-2 py-0.5 rounded">
              <Clock className="w-3 h-3 text-accent-cyan" />
              {project.duration}
            </span>
            <span className="bg-black/60 px-2 py-0.5 rounded">
              {project.aspectRatio}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-accent-cyan transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="text-sm text-slate-400 leading-relaxed mb-4 line-clamp-2">
            {project.shortDescription}
          </p>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-900 border border-border text-slate-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-6 pt-0 border-t border-border/60 mt-4 flex items-center justify-between text-xs text-slate-400">
        <span className="font-mono text-[11px]">
          {project.softwareUsed?.[0] || 'NLE Suite'}
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-accent-cyan group-hover:underline">
          View Project Case
          <ArrowUpRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
}
