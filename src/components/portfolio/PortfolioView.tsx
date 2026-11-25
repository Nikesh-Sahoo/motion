'use client';

import React, { useState, useMemo } from 'react';
import { portfolioProjects } from '@/data/portfolio';
import { PortfolioCategory, PortfolioItem } from '@/types/portfolio';
import { PortfolioFilter } from '@/components/portfolio/PortfolioFilter';
import { PortfolioCard } from '@/components/portfolio/PortfolioCard';
import { VideoModal } from '@/components/portfolio/VideoModal';
import { Film, Sparkles, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PortfolioView() {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<PortfolioCategory, number> = {
      all: portfolioProjects.length,
      'short-form': 0,
      'long-form': 0,
      podcast: 0,
      business: 0,
      promotional: 0,
    };

    portfolioProjects.forEach((item) => {
      if (counts[item.category] !== undefined) {
        counts[item.category] += 1;
      }
    });

    return counts;
  }, []);

  // Filter projects
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return portfolioProjects;
    return portfolioProjects.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  return (
    <div>
      {/* Category Filter Pills */}
      <PortfolioFilter
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        counts={categoryCounts}
      />

      {/* Grid or Empty State */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <PortfolioCard
              key={project.id}
              project={project}
              onSelect={setSelectedProject}
            />
          ))}
        </div>
      ) : (
        /* Polished Empty State */
        <div className="p-12 sm:p-16 rounded-2xl bg-surface/50 border border-dashed border-border text-center max-w-xl mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Inbox className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">
            No projects currently in this category
          </h3>
          <p className="text-sm text-slate-400 mb-6">
            We are curating demonstration reels for this category. In the meantime, browse our other categories or submit a custom inquiry.
          </p>
          <Button
            onClick={() => setActiveCategory('all')}
            variant="secondary"
            size="sm"
          >
            Show All Projects
          </Button>
        </div>
      )}

      {/* Modal Dialog */}
      <VideoModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  );
}
