'use client';

import React, { useEffect, useRef } from 'react';

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

interface FloatingShape {
  center: Vec3;
  size: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  speedX: number;
  speedY: number;
  speedZ: number;
  driftSpeed: number;
  phase: number;
  color: string;
  kind: 'cube' | 'octahedron';
}

const CUBE_VERTICES: Vec3[] = [
  { x: -1, y: -1, z: -1 },
  { x: 1, y: -1, z: -1 },
  { x: 1, y: 1, z: -1 },
  { x: -1, y: 1, z: -1 },
  { x: -1, y: -1, z: 1 },
  { x: 1, y: -1, z: 1 },
  { x: 1, y: 1, z: 1 },
  { x: -1, y: 1, z: 1 },
];

const CUBE_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 0],
  [4, 5], [5, 6], [6, 7], [7, 4],
  [0, 4], [1, 5], [2, 6], [3, 7],
];

const OCTA_VERTICES: Vec3[] = [
  { x: 0, y: 1.3, z: 0 },
  { x: 1, y: 0, z: 0 },
  { x: 0, y: 0, z: 1 },
  { x: -1, y: 0, z: 0 },
  { x: 0, y: 0, z: -1 },
  { x: 0, y: -1.3, z: 0 },
];

const OCTA_EDGES: [number, number][] = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [5, 1], [5, 2], [5, 3], [5, 4],
  [1, 2], [2, 3], [3, 4], [4, 1],
];

function rotatePoint(p: Vec3, rx: number, ry: number, rz: number): Vec3 {
  // X-axis rotation
  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const y1 = p.y * cosX - p.z * sinX;
  const z1 = p.y * sinX + p.z * cosX;

  // Y-axis rotation
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x2 = p.x * cosY + z1 * sinY;
  const z2 = -p.x * sinY + z1 * cosY;

  // Z-axis rotation
  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const x3 = x2 * cosZ - y1 * sinZ;
  const y3 = x2 * sinZ + y1 * cosZ;

  return { x: x3, y: y3, z: z2 };
}

/**
 * Interactive 3D perspective wireframe stage rendered on HTML5 Canvas.
 * Projects a receding 3D studio floor grid and rotating 3D polyhedra reacting to mouse parallax.
 */
export function Studio3DBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let animId = 0;

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const shapes: FloatingShape[] = [
      {
        center: { x: -420, y: -110, z: 320 },
        size: 52,
        rotX: 0.4,
        rotY: 0.2,
        rotZ: 0.1,
        speedX: 0.004,
        speedY: 0.007,
        speedZ: 0.002,
        driftSpeed: 0.0012,
        phase: 0,
        color: 'rgba(0, 240, 255, 0.42)',
        kind: 'cube',
      },
      {
        center: { x: 430, y: -150, z: 360 },
        size: 58,
        rotX: 0.2,
        rotY: 0.6,
        rotZ: 0.3,
        speedX: 0.003,
        speedY: -0.006,
        speedZ: 0.004,
        driftSpeed: 0.001,
        phase: 1.8,
        color: 'rgba(255, 0, 127, 0.42)',
        kind: 'octahedron',
      },
      {
        center: { x: 340, y: 120, z: 460 },
        size: 40,
        rotX: 0.8,
        rotY: 0.1,
        rotZ: 0.5,
        speedX: -0.005,
        speedY: 0.005,
        speedZ: 0.003,
        driftSpeed: 0.0015,
        phase: 3.1,
        color: 'rgba(0, 240, 255, 0.30)',
        kind: 'octahedron',
      },
      {
        center: { x: -350, y: 140, z: 500 },
        size: 44,
        rotX: 0.1,
        rotY: 0.9,
        rotZ: 0.2,
        speedX: 0.004,
        speedY: -0.004,
        speedZ: -0.003,
        driftSpeed: 0.0013,
        phase: 4.4,
        color: 'rgba(252, 238, 10, 0.26)',
        kind: 'cube',
      },
      {
        center: { x: 40, y: -230, z: 580 },
        size: 36,
        rotX: 0.5,
        rotY: 0.4,
        rotZ: 0.7,
        speedX: 0.003,
        speedY: 0.005,
        speedZ: 0.002,
        driftSpeed: 0.0011,
        phase: 2.3,
        color: 'rgba(157, 78, 221, 0.32)',
        kind: 'octahedron',
      },
    ];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (width === 0 || height === 0) return;
      pointer.targetX = (e.clientX / width - 0.5) * 2;
      pointer.targetY = (e.clientY / height - 0.5) * 2;
    };

    const project = (p: Vec3, fov = 560): { x: number; y: number; scale: number } | null => {
      const camX = pointer.x * 48;
      const camY = pointer.y * 28;
      const z = p.z + fov;
      if (z <= 40) return null;
      const scale = fov / z;
      return {
        x: width / 2 + (p.x - camX) * scale,
        y: height * 0.48 + (p.y - camY) * scale,
        scale,
      };
    };

    let tick = 0;

    const draw = () => {
      tick += 1;
      pointer.x += (pointer.targetX - pointer.x) * 0.05;
      pointer.y += (pointer.targetY - pointer.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Receding 3D Perspective Studio Floor Grid
      const gridY = 250;
      const gridMinX = -900;
      const gridMaxX = 900;
      const stepX = 120;
      const minZ = 40;
      const maxZ = 1000;
      const stepZ = 90;
      const zOffset = reducedMotion ? 0 : (tick * 0.9) % stepZ;

      ctx.lineWidth = 1;

      // Depth lines (converging toward 3D vanishing point)
      for (let gx = gridMinX; gx <= gridMaxX; gx += stepX) {
        const pNear = project({ x: gx, y: gridY, z: minZ });
        const pFar = project({ x: gx, y: gridY, z: maxZ });
        if (!pNear || !pFar) continue;

        const grad = ctx.createLinearGradient(pNear.x, pNear.y, pFar.x, pFar.y);
        grad.addColorStop(0, 'rgba(0, 240, 255, 0.22)');
        grad.addColorStop(0.55, 'rgba(157, 78, 221, 0.10)');
        grad.addColorStop(1, 'rgba(0, 240, 255, 0)');
        ctx.strokeStyle = grad;

        ctx.beginPath();
        ctx.moveTo(pNear.x, pNear.y);
        ctx.lineTo(pFar.x, pFar.y);
        ctx.stroke();
      }

      // Horizontal depth slices moving toward viewer
      for (let gz = minZ + stepZ - zOffset; gz <= maxZ; gz += stepZ) {
        const pLeft = project({ x: gridMinX, y: gridY, z: gz });
        const pRight = project({ x: gridMaxX, y: gridY, z: gz });
        if (!pLeft || !pRight) continue;

        const alpha = Math.max(0, (1 - gz / maxZ) * 0.20);
        ctx.strokeStyle = `rgba(255, 0, 127, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(pLeft.x, pLeft.y);
        ctx.lineTo(pRight.x, pRight.y);
        ctx.stroke();
      }

      // 2. Floating 3D Wireframe Cinema Polyhedra
      for (const shape of shapes) {
        if (!reducedMotion) {
          shape.rotX += shape.speedX;
          shape.rotY += shape.speedY;
          shape.rotZ += shape.speedZ;
        }

        const floatOffsetY = reducedMotion
          ? 0
          : Math.sin(tick * shape.driftSpeed * 12 + shape.phase) * 18;

        const vertices = shape.kind === 'cube' ? CUBE_VERTICES : OCTA_VERTICES;
        const edges = shape.kind === 'cube' ? CUBE_EDGES : OCTA_EDGES;

        const projected = vertices.map((v) => {
          const rotated = rotatePoint(v, shape.rotX, shape.rotY, shape.rotZ);
          return project({
            x: shape.center.x + rotated.x * shape.size,
            y: shape.center.y + floatOffsetY + rotated.y * shape.size,
            z: shape.center.z + rotated.z * shape.size,
          });
        });

        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 1.25;

        for (const [a, b] of edges) {
          const pa = projected[a];
          const pb = projected[b];
          if (!pa || !pb) continue;
          ctx.beginPath();
          ctx.moveTo(pa.x, pa.y);
          ctx.lineTo(pb.x, pb.y);
          ctx.stroke();
        }

        // Subtle glowing vertices
        ctx.fillStyle = shape.color;
        for (const pt of projected) {
          if (!pt) continue;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 1.8 * pt.scale, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (!reducedMotion) {
        animId = requestAnimationFrame(draw);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
    />
  );
}
