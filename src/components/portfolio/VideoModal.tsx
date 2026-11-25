'use client';

import React from 'react';
import { X, Play, Clock, Sparkles, Tag, Check, Film, Info } from 'lucide-react';
import { PortfolioItem } from '@/types/portfolio';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface VideoModalProps {
  project: PortfolioItem | null;
  onClose: () => void;
}

export function VideoModal({ project, onClose }: VideoModalProps) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-3xl rounded-2xl bg-surface border border-border shadow-2xl overflow-hidden z-10 flex flex-col my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-slate-950/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-accent-cyan uppercase tracking-wider font-semibold">
              {project.categoryLabel}
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400 font-mono">
              {project.aspectRatio} Aspect
            </span>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Concept Stage */}
        <div
          className={`relative aspect-video w-full bg-gradient-to-tr ${project.gradientTheme} flex flex-col items-center justify-center p-6 text-center overflow-hidden`}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />

          <div className="relative z-10 space-y-3 max-w-lg">
            <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto shadow-glow-purple">
              <Play className="w-7 h-7 ml-1 fill-current text-white" />
            </div>

            <p className="text-lg font-bold text-white">
              {project.title}
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 text-xs text-slate-200 border border-white/10 font-mono">
              <Clock className="w-3.5 h-3.5 text-accent-cyan" />
              <span>Duration: {project.duration}</span>
              <span className="text-slate-500">|</span>
              <span>Format: {project.aspectRatio}</span>
            </div>
          </div>

          {project.isDemoOrConcept && (
            <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-[11px] text-white/80 bg-black/60 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md">
              <span className="inline-flex items-center gap-1.5 font-semibold text-accent-purple-light">
                <Info className="w-3.5 h-3.5 text-accent-cyan" />
                {project.conceptLabel || 'Demonstration Showcase Edit'}
              </span>
              <span className="hidden sm:inline text-slate-400">
                Created to demonstrate editing pace, audio & graphic capabilities
              </span>
            </div>
          )}
        </div>

        {/* Details Content */}
        <div className="p-6 sm:p-7 space-y-6 bg-surface">
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Project Brief & Editorial Strategy
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed">
              {project.fullDescription}
            </p>
          </div>

          {project.softwareUsed && project.softwareUsed.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Production Toolchain
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.softwareUsed.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs font-mono px-2.5 py-1 rounded-md bg-slate-900 border border-border text-slate-300"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Techniques Demonstrated
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-accent-purple/10 border border-accent-purple/20 text-accent-purple-light font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              Need a similar edit for your channel or brand?
            </p>
            <Button
              href="/contact"
              variant="primary"
              size="md"
              className="w-full sm:w-auto shadow-glow-purple"
              onClick={onClose}
            >
              <Sparkles className="w-4 h-4 text-accent-cyan" />
              <span>Request Quote for This Style</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
