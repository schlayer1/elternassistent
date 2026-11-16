import React, { useEffect, useRef } from 'react';
import { JarvisStatus } from '../../types/assistant';

interface JarvisReactorProps {
  status: JarvisStatus;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

interface StateVisualConfig {
  targetMorph: number; // 0 = Siegel voll im Vordergrund, 1 = volle 3D-Punktsphäre mit Wasserzeichen-Siegel
  speed: number;
  primary: [number, number, number];
  secondary: [number, number, number];
  dotCountMd: number;
  dotCountSm: number;
  ariaText: string;
}

const STATE_CONFIG: Record<JarvisStatus, StateVisualConfig> = {
  idle: {
    targetMorph: 0,
    speed: 0.65,
    primary: [11, 123, 167],   // HBS Tiefblau (#0B7BA7)
    secondary: [0, 168, 150],  // HBS Teal (#00A896)
    dotCountMd: 56,
    dotCountSm: 14,
    ariaText: 'HBS Elternassistent bereit',
  },
  searching: {
    targetMorph: 1,
    speed: 1.45,
    primary: [0, 168, 150],    // HBS Teal
    secondary: [11, 123, 167], // HBS Tiefblau
    dotCountMd: 88,
    dotCountSm: 16,
    ariaText: 'Durchsuche Schulwissensbasis',
  },
  thinking: {
    targetMorph: 1,
    speed: 1.7,
    primary: [11, 123, 167],
    secondary: [0, 168, 150],
    dotCountMd: 44, // Konstellations-Netz mit Verbindungslinien
    dotCountSm: 14,
    ariaText: 'KI analysiert Frage',
  },
  listening: {
    targetMorph: 0.9,
    speed: 1.9,
    primary: [0, 168, 150],
    secondary: [230, 126, 34], // Warm-Orange Akzent
    dotCountMd: 68,
    dotCountSm: 16,
    ariaText: 'Spracheingabe aktiv',
  },
  speaking: {
    targetMorph: 0.32, // Siegel gut lesbar, warme Wellen umgeben den Kern
    speed: 1.8,
    primary: [230, 126, 34],   // HBS Warm-Orange (#E67E22)
    secondary: [245, 158, 11], // Amber (#F59E0B)
    dotCountMd: 64,
    dotCountSm: 14,
    ariaText: 'Sprachausgabe aktiv',
  },
  retrying: {
    targetMorph: 1,
    speed: 2.5,
    primary: [245, 158, 11],   // Amber Surge
    secondary: [11, 123, 167],
    dotCountMd: 46,
    dotCountSm: 14,
    ariaText: 'Wechsle KI-Modell',
  },
};

const SIZE_PX: Record<'sm' | 'md' | 'lg', number> = {
  sm: 28,
  md: 112,
  lg: 176,
};

let cachedSealImage: HTMLImageElement | null = null;
function getSealImage(): HTMLImageElement | null {
  if (typeof Image === 'undefined') return null;
  if (!cachedSealImage) {
    cachedSealImage = new Image();
    cachedSealImage.src = '/siegel_bunt.png';
  }
  return cachedSealImage;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function rgba(rgb: [number, number, number], alpha: number): string {
  const a = Math.max(0, Math.min(1, alpha));
  return `rgba(${Math.round(rgb[0])},${Math.round(rgb[1])},${Math.round(rgb[2])},${a.toFixed(3)})`;
}

function project3D(
  x: number,
  y: number,
  z: number,
  yaw: number,
  pitch: number,
  cx: number,
  cy: number
): [number, number, number] {
  const cyw = Math.cos(yaw);
  const syw = Math.sin(yaw);
  const x1 = x * cyw - z * syw;
  const z1 = x * syw + z * cyw;
  const cph = Math.cos(pitch);
  const sph = Math.sin(pitch);
  const y2 = y * cph - z1 * sph;
  const z2 = y * sph + z1 * cph;
  return [cx + x1, cy + y2, z2];
}

function drawHexFrame(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  color: [number, number, number],
  alpha: number
) {
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 - Math.PI / 2;
    const x = cx + Math.cos(angle) * radius;
    const y = cy + Math.sin(angle) * radius;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.strokeStyle = rgba(color, alpha);
  ctx.lineWidth = radius > 30 ? 1.8 : 1.1;
  ctx.stroke();
  ctx.restore();
}

function drawSchoolSeal(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  alpha: number,
  ringColor: string,
  isSmall: boolean
) {
  if (alpha <= 0.02) return;
  const img = getSealImage();
  ctx.save();
  ctx.globalAlpha = alpha;

  // Weißer Kontrast-Hintergrund + feiner HBS-Ring
  ctx.beginPath();
  ctx.arc(cx, cy, radius + (isSmall ? 1 : 2.5), 0, Math.PI * 2);
  ctx.fillStyle = '#FFFFFF';
  ctx.fill();
  ctx.lineWidth = isSmall ? 1.2 : 1.8;
  ctx.strokeStyle = ringColor;
  ctx.stroke();

  if (img && img.complete && img.naturalWidth > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, cx - radius, cy - radius, radius * 2, radius * 2);
  }
  ctx.restore();
}

/**
 * Konzept C: Morphing Dot-Matrix Avatar × HBS Schullogo JARVIS.
 * Kombiniert das HBS-Schulsiegel im JARVIS-Hex-Rahmen mit einer 2D-Canvas 3D-Punktsphäre
 * (Thinking Orbs Architektur: z-sortierte Fibonacci-Sphäre, Scan-Meridian, Konstellationsnetz).
 */
export const JarvisReactor: React.FC<JarvisReactorProps> = ({
  status,
  size = 'md',
  label,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const statusRef = useRef<JarvisStatus>(status);
  statusRef.current = status;

  const pxSize = SIZE_PX[size];
  const isSmall = size === 'sm';
  const activeCfg = STATE_CONFIG[status];
  const isActive = status !== 'idle';
  const isWarm = status === 'speaking' || status === 'retrying';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(2, (typeof devicePixelRatio !== 'undefined' && devicePixelRatio) || 1);
    canvas.width = Math.round(pxSize * dpr);
    canvas.height = Math.round(pxSize * dpr);

    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let morph = STATE_CONFIG[statusRef.current].targetMorph;
    let phase = 0;
    let lastNow = performance.now();
    let curPrimary: [number, number, number] = [...STATE_CONFIG[statusRef.current].primary];
    let curSecondary: [number, number, number] = [...STATE_CONFIG[statusRef.current].secondary];
    let curSpeed = STATE_CONFIG[statusRef.current].speed;

    const img = getSealImage();
    const renderFrame = (dtSec: number) => {
      const st = statusRef.current;
      const cfg = STATE_CONFIG[st];

      // Sanfte Übergänge zwischen Zuständen (ohne Sprung)
      const smooth = reducedMotion ? 1 : Math.min(1, dtSec * 5.5);
      morph = lerp(morph, cfg.targetMorph, smooth);
      curSpeed = lerp(curSpeed, cfg.speed, smooth);
      curPrimary = [
        lerp(curPrimary[0], cfg.primary[0], smooth),
        lerp(curPrimary[1], cfg.primary[1], smooth),
        lerp(curPrimary[2], cfg.primary[2], smooth),
      ];
      curSecondary = [
        lerp(curSecondary[0], cfg.secondary[0], smooth),
        lerp(curSecondary[1], cfg.secondary[1], smooth),
        lerp(curSecondary[2], cfg.secondary[2], smooth),
      ];
      if (!reducedMotion) {
        phase += dtSec * curSpeed;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, pxSize, pxSize);

      const cx = pxSize / 2;
      const cy = pxSize / 2;
      const outerR = pxSize * (isSmall ? 0.42 : 0.42);

      // 1. Weiche Radial-Aura bei aktiven States
      if (morph > 0.15) {
        const grad = ctx.createRadialGradient(cx, cy, outerR * 0.1, cx, cy, outerR * 1.15);
        grad.addColorStop(0, rgba(curPrimary, 0.22 * morph));
        grad.addColorStop(0.6, rgba(curSecondary, 0.08 * morph));
        grad.addColorStop(1, rgba(curPrimary, 0));
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, outerR * 1.15, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. JARVIS Hexagon-Rahmen (schimmert im Idle & Speaking um das Siegel)
      if (!isSmall) {
        const hexAlpha = lerp(0.45, 0.18, morph) + (st !== 'idle' ? 0.12 * Math.sin(phase * 3) : 0);
        const hexR = lerp(pxSize * 0.34, pxSize * 0.27, morph);
        drawHexFrame(ctx, cx, cy, hexR, curPrimary, hexAlpha);
      }

      // 3. Schulsiegel im Zentrum (skaliert & blendet bei morph -> 1 sanft zum Wasserzeichen ab)
      const sealRadius = isSmall
        ? pxSize * lerp(0.32, 0.18, morph)
        : pxSize * lerp(0.265, 0.17, morph);
      const sealAlpha = isSmall
        ? lerp(0.96, 0.18, morph)
        : lerp(1.0, 0.24, morph);
      drawSchoolSeal(ctx, cx, cy, sealRadius, sealAlpha, rgba(curPrimary, 0.85), isSmall);

      // 4. 3D Fibonacci-Punktsphäre & zustandsabhängige Effekte (Thinking Orbs Prinzip)
      const count = isSmall ? cfg.dotCountSm : cfg.dotCountMd;
      const pts: Array<{ x: number; y: number; z: number; idx: number }> = [];
      const rotSpeed = lerp(0.25, 0.85, morph);
      const sphereBaseR = outerR * lerp(0.95, 1.0, morph);

      for (let i = 0; i < count; i++) {
        const phi = Math.acos(1 - 2 * ((i + 0.5) / count));
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;

        let radialMod = 1;
        if (st === 'listening' || st === 'speaking') {
          radialMod = 1 + 0.11 * Math.sin(phase * 3.8 + phi * 4 + theta * 2);
        } else if (st === 'retrying') {
          radialMod = 1 + 0.1 * Math.sin(phase * 5 + i);
        } else if (st === 'idle') {
          radialMod = 0.96 + 0.04 * Math.sin(phase * 1.6 + i * 0.3);
        }

        const r = sphereBaseR * radialMod;
        const x = Math.sin(phi) * Math.cos(theta) * r;
        const y = Math.cos(phi) * r;
        const z = Math.sin(phi) * Math.sin(theta) * r;

        const pitch = 0.34 + Math.sin(phase * 0.45) * 0.18;
        const [px, py, pz] = project3D(x, y, z, phase * rotSpeed, pitch, cx, cy);
        pts.push({ x: px, y: py, z: pz, idx: i });
      }

      // Verbindungslinien bei thinking & retrying (Konstellations-Web)
      if (!isSmall && (st === 'thinking' || st === 'retrying')) {
        const maxDist = pxSize * 0.21;
        for (let i = 0; i < pts.length; i++) {
          for (let j = i + 1; j < pts.length; j++) {
            const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
            if (d < maxDist) {
              const lineAlpha = 0.28 * (1 - d / maxDist) * Math.min(1, morph + 0.2);
              ctx.beginPath();
              ctx.moveTo(pts[i].x, pts[i].y);
              ctx.lineTo(pts[j].x, pts[j].y);
              ctx.strokeStyle = rgba(curPrimary, lineAlpha);
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }
        }
      }

      // Z-sortierte Punkte zeichnen (Hinten -> Vorne)
      pts.sort((a, b) => a.z - b.z);
      for (const p of pts) {
        const depth = (p.z / sphereBaseR + 1) / 2;
        const isSecondary = p.idx % 3 === 0;
        let col = isSecondary ? curSecondary : curPrimary;

        // Scan-Meridian Highlight beim Suchen
        let scanBoost = 0;
        if (st === 'searching') {
          const angle = Math.atan2(p.y - cy, p.x - cx);
          scanBoost = Math.pow(Math.max(0, Math.cos(angle - phase * 2.6)), 5);
          if (scanBoost > 0.45) col = curSecondary;
        }

        const baseDotR = isSmall ? 1.05 + depth * 0.95 : 1.1 + depth * 1.7;
        const dotR = baseDotR + scanBoost * (isSmall ? 0.7 : 1.4);
        const alpha =
          lerp(0.16 + 0.42 * depth, 0.28 + 0.72 * depth, morph) + scanBoost * 0.35;

        ctx.beginPath();
        ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
        ctx.fillStyle = rgba(col, alpha);
        ctx.fill();
      }
    };

    const onImgLoad = () => {
      if (reducedMotion) renderFrame(0);
    };
    if (img && !img.complete) {
      img.addEventListener('load', onImgLoad);
    }

    if (reducedMotion) {
      renderFrame(0);
      return () => {
        img?.removeEventListener('load', onImgLoad);
      };
    }

    let rafId = 0;
    let running = false;
    let visible = true;

    const tick = (now: number) => {
      const dt = Math.min(0.1, Math.max(0.001, (now - lastNow) / 1000));
      lastNow = now;
      renderFrame(dt);
      if (running) {
        rafId = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      lastNow = performance.now();
      rafId = requestAnimationFrame(tick);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };

    renderFrame(0.016);

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
            if (visible && document.visibilityState !== 'hidden') start();
            else stop();
          })
        : null;
    io?.observe(canvas);

    const onVisChange = () => {
      if (document.visibilityState === 'hidden') stop();
      else if (visible) start();
    };
    document.addEventListener('visibilitychange', onVisChange);

    if (!io) start();

    return () => {
      stop();
      io?.disconnect();
      document.removeEventListener('visibilitychange', onVisChange);
      img?.removeEventListener('load', onImgLoad);
    };
  }, [pxSize, isSmall]);

  return (
    <div className={`flex flex-col items-center justify-center select-none ${isSmall ? '' : 'p-2'}`}>
      <div
        className="relative flex items-center justify-center"
        style={{ width: pxSize, height: pxSize }}
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={label || activeCfg.ariaText}
          style={{ width: pxSize, height: pxSize, display: 'block' }}
        />
      </div>

      {/* Status-Pill & Equalizer unter dem Kognitionskern (md / lg) */}
      {label && !isSmall && (
        <div className="mt-3 flex flex-col items-center">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-school-blue/10 border border-school-blue/20 rounded-full shadow-xs">
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isWarm ? 'bg-orange-400' : 'bg-school-teal'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isWarm ? 'bg-orange-500' : 'bg-school-blue'
                }`}
              />
            </span>
            <span className="text-xs font-semibold text-school-blue tracking-wide uppercase">
              {label}
            </span>
          </div>

          {isActive && (
            <div className="flex items-end gap-1 mt-2 h-4">
              {[0.4, 0.8, 0.3, 0.95, 0.6, 0.85, 0.45, 0.7, 0.35].map((scale, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isWarm ? 'bg-orange-500' : 'bg-school-teal'
                  }`}
                  style={{
                    height: `${scale * 100}%`,
                    animation: `pulse-glow ${0.6 + (i % 3) * 0.2}s infinite alternate`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
