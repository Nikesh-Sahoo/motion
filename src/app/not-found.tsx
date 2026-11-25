import React from 'react';
import Link from 'next/link';
import { Film, Home, ArrowLeft } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="py-24 sm:py-32 bg-background min-h-[70vh] flex items-center">
      <Container size="narrow">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-surface border border-border text-accent-cyan flex items-center justify-center mx-auto shadow-glow-purple">
            <Film className="w-8 h-8" />
          </div>

          <span className="font-mono text-xs uppercase tracking-widest text-accent-purple font-semibold">
            ERROR 404 • FRAME NOT FOUND
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            This Sequence Doesn&apos;t Exist.
          </h1>

          <p className="text-sm sm:text-base text-slate-400 max-w-md mx-auto leading-relaxed">
            The page or timeline sequence you were looking for may have been moved, renamed, or deleted from the project file.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button href="/" variant="primary" size="md">
              <Home className="w-4 h-4 mr-1" />
              <span>Back to Home</span>
            </Button>
            <Button href="/services" variant="secondary" size="md">
              <span>View All Services</span>
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
}
