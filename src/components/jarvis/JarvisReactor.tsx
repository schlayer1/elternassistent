import React from 'react';

interface JarvisReactorProps {
  status: 'idle' | 'thinking' | 'speaking';
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const JarvisReactor: React.FC<JarvisReactorProps> = ({
  status,
  size = 'md',
  label
}) => {
  const isThinking = status === 'thinking';
  const isSpeaking = status === 'speaking';
  const isActive = isThinking || isSpeaking;

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-28 h-28',
    lg: 'w-44 h-44',
  }[size];

  const ringSizes = {
    sm: { r1: 22, r2: 17, r3: 12, stroke: 1.5 },
    md: { r1: 52, r2: 40, r3: 28, stroke: 2 },
    lg: { r1: 82, r2: 64, r3: 45, stroke: 2.5 },
  }[size];

  return (
    <div className="flex flex-col items-center justify-center p-2 select-none">
      {/* Outer Glow Container */}
      <div className={`relative ${sizeClasses} flex items-center justify-center`}>
        {/* Animated Ripple Waves when Active */}
        {isActive && (
          <>
            <div className="absolute inset-0 rounded-full bg-[#0B7BA7]/20 animate-ping" />
            <div className="absolute -inset-2 rounded-full border border-[#00A896]/40 animate-pulse-glow" />
            <div className="absolute -inset-4 rounded-full border border-[#E67E22]/30 animate-pulse-glow" style={{ animationDelay: '0.4s' }} />
          </>
        )}

        {/* SVG Hologram Arc Reactor */}
        <svg
          viewBox="0 0 200 200"
          className={`w-full h-full transform transition-all duration-700 ${
            isActive ? 'scale-105 filter drop-shadow-[0_0_15px_rgba(11,123,167,0.6)]' : 'opacity-85'
          }`}
        >
          <defs>
            <linearGradient id="jarvisBlue" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B7BA7" />
              <stop offset="100%" stopColor="#00A896" />
            </linearGradient>
            <linearGradient id="jarvisAmber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E67E22" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00A896" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#0B7BA7" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#085A7A" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central Radial Energy Aura */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="url(#coreGlow)"
            className={isActive ? 'animate-pulse' : 'opacity-30'}
          />

          {/* Outer Segmented Ring 1 (Rotates Clockwise) */}
          <g className={isActive ? 'animate-spin-slow origin-center' : ''}>
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="#0B7BA7"
              strokeWidth="2.5"
              strokeDasharray="25 15 45 10 15 15"
              strokeOpacity="0.85"
            />
            {/* Tech Nodes on Outer Ring */}
            <circle cx="100" cy="10" r="3.5" fill="#00A896" />
            <circle cx="190" cy="100" r="3.5" fill="#E67E22" />
            <circle cx="100" cy="190" r="3.5" fill="#00A896" />
            <circle cx="10" cy="100" r="3.5" fill="#0B7BA7" />
          </g>

          {/* Inner Counter-Rotating Ring 2 (Rotates Counter-Clockwise) */}
          <g className={isActive ? 'animate-spin-reverse origin-center' : ''}>
            <circle
              cx="100"
              cy="100"
              r="72"
              fill="none"
              stroke="#00A896"
              strokeWidth="2"
              strokeDasharray="18 12 30 18"
              strokeOpacity="0.75"
            />
            <circle
              cx="100"
              cy="100"
              r="62"
              fill="none"
              stroke="#E67E22"
              strokeWidth="1.5"
              strokeDasharray="4 8"
              strokeOpacity="0.6"
            />
          </g>

          {/* Core Shield & HBS Emblem */}
          <g className="origin-center">
            {/* Hexagonal Shield Core */}
            <polygon
              points="100,46 142,68 142,122 100,144 58,122 58,68"
              fill="#085A7A"
              stroke={isActive ? '#00A896' : '#0B7BA7'}
              strokeWidth="2.5"
              className={isActive ? 'animate-pulse' : ''}
            />

            {/* Pulsing Energy Core */}
            <circle
              cx="100"
              cy="95"
              r={isActive ? '24' : '20'}
              fill={isSpeaking ? 'url(#jarvisAmber)' : 'url(#jarvisBlue)'}
              className="transition-all duration-300"
            />

            {/* School Stylized "H" / Crest Icon */}
            <path
              d="M87 84V106M113 84V106M87 95H113"
              stroke="#FFFFFF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Crown / Star Element */}
            <polygon
              points="100,74 104,82 96,82"
              fill="#F59E0B"
            />
          </g>

          {/* Sound / Frequency Rays when Speaking or Thinking */}
          {isActive && (
            <g stroke="#E67E22" strokeWidth="2" strokeLinecap="round" opacity="0.9">
              <line x1="100" y1="26" x2="100" y2="34" className="animate-pulse" />
              <line x1="100" y1="166" x2="100" y2="174" className="animate-pulse" />
              <line x1="26" y1="100" x2="34" y2="100" className="animate-pulse" />
              <line x1="166" y1="100" x2="174" y2="100" className="animate-pulse" />
            </g>
          )}
        </svg>
      </div>

      {/* Futuristic Status Indicator & Sound Wave Bars */}
      {label && (
        <div className="mt-3 flex flex-col items-center">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-school-blue/10 border border-school-blue/20 rounded-full shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isSpeaking ? 'bg-orange-400' : 'bg-school-teal'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isSpeaking ? 'bg-orange-500' : 'bg-school-blue'
              }`} />
            </span>
            <span className="text-xs font-semibold text-school-blue tracking-wide uppercase">
              {label}
            </span>
          </div>

          {/* Frequency Equalizer Visualizer */}
          {isActive && (
            <div className="flex items-end gap-1 mt-2 h-4">
              {[0.4, 0.8, 0.3, 0.95, 0.6, 0.85, 0.45, 0.7, 0.35].map((scale, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-200 ${
                    isSpeaking ? 'bg-orange-500' : 'bg-school-teal'
                  }`}
                  style={{
                    height: `${scale * 100}%`,
                    animation: `pulse-glow ${0.6 + (i % 3) * 0.2}s infinite alternate`
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
