'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';

interface Tilt3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  perspective?: number;
  scale?: number;
  glareColor?: string;
  disabled?: boolean;
}

/**
 * Interactive 3D perspective card wrapper with pointer-tracking tilt and specular glare.
 * Automatically disables motion on touch-only devices or when prefers-reduced-motion is set.
 */
export function Tilt3D({
  children,
  className = '',
  maxTilt = 8,
  perspective = 1100,
  scale = 1.02,
  glareColor = 'rgba(25, 195, 184, 0.16)',
  disabled = false,
}: Tilt3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [canAnimate, setCanAnimate] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });

  useEffect(() => {
    if (disabled || typeof window === 'undefined') {
      setCanAnimate(false);
      return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointer = window.matchMedia('(pointer: coarse)');

    const updateCapability = () => {
      setCanAnimate(!reducedMotion.matches && !coarsePointer.matches);
    };

    updateCapability();
    reducedMotion.addEventListener('change', updateCapability);
    coarsePointer.addEventListener('change', updateCapability);

    return () => {
      reducedMotion.removeEventListener('change', updateCapability);
      coarsePointer.removeEventListener('change', updateCapability);
    };
  }, [disabled]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!canAnimate || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const relX = (e.clientX - rect.left) / rect.width;
      const relY = (e.clientY - rect.top) / rect.height;

      const rotateY = (relX - 0.5) * 2 * maxTilt;
      const rotateX = (0.5 - relY) * 2 * maxTilt;

      setTilt({
        rotateX,
        rotateY,
        glareX: relX * 100,
        glareY: relY * 100,
      });
    },
    [canAnimate, maxTilt]
  );

  const handleMouseEnter = useCallback(() => {
    if (!canAnimate) return;
    setIsHovering(true);
  }, [canAnimate]);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50 });
  }, []);

  const transformStyle: React.CSSProperties = canAnimate
    ? {
        transform: `perspective(${perspective}px) rotateX(${tilt.rotateX.toFixed(2)}deg) rotateY(${tilt.rotateY.toFixed(2)}deg) scale3d(${isHovering ? scale : 1}, ${isHovering ? scale : 1}, 1)`,
        transformStyle: 'preserve-3d',
        transition: isHovering
          ? 'transform 120ms cubic-bezier(0.22, 1, 0.36, 1)'
          : 'transform 480ms cubic-bezier(0.22, 1, 0.36, 1)',
        willChange: isHovering ? 'transform' : 'auto',
      }
    : {};

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={transformStyle}
      className={`relative ${className}`}
    >
      {children}

      {canAnimate && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-300 z-20"
          style={{
            opacity: isHovering ? 1 : 0,
            background: `radial-gradient(circle 340px at ${tilt.glareX}% ${tilt.glareY}%, ${glareColor}, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
}
