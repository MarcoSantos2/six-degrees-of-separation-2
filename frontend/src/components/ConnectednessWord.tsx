import React, { useRef, useState } from 'react';
import './ConnectednessWord.css';

const WORD = 'CONNECTEDNESS';
const TOGGLE_WORD = 'INTERCONNECTS';
const COLORS = [
  '#2563eb', // blue-600
  '#22c55e', // green-600
  '#e11d48', // red-600
  '#a21caf', // fuchsia-600
  '#10b981', // emerald-600
  '#ec4899', // pink-600
  '#f59e42', // orange-500
  '#fbbf24', // yellow-400
  '#6366f1', // indigo-500
  '#0ea5e9', // sky-500
  '#f43f5e', // rose-500
  '#14b8a6', // teal-500
  '#eab308', // gold-500
];

// Pop sound (public domain, short click/pop)
const POP_SOUND_URL = '/sounds/pop.mp3';

const ConnectednessWord: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [toggled, setToggled] = useState<boolean[]>(Array(WORD.length).fill(false));
  const [muted, setMuted] = useState(false);
  const popAudioRef = useRef<HTMLAudioElement | null>(null);

  // Mouse move handler for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setTransform({
      rotateX: y * 40, // up/down
      rotateY: x * 3, // left/right
      scale: 1.04,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
    setHoveredIndex(null);
  };

  // Toggle letter on SVG click and play pop sound
  const handleSvgClick = (i: number) => {
    setToggled(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
    // Play pop sound if not muted
    if (!muted && popAudioRef.current) {
      popAudioRef.current.currentTime = 0;
      popAudioRef.current.play();
    }
  };

  // Toggle mute state
  const handleToggleMute = () => {
    setMuted(m => !m);
  };

  return (
    <div
      ref={containerRef}
      className="connectedness-word-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        minHeight: 'calc(100vh - 146px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '5rem',
        textTransform: 'uppercase',
        cursor: 'default',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* Hidden audio element for pop sound */}
      <audio ref={popAudioRef} src={POP_SOUND_URL} preload="auto" />
      {/* Word and sound button wrapper */}
      <div className="connectedness-word-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
        {/* Mute/unmute button */}
        <button
          className="sound-toggle-btn"
          onClick={handleToggleMute}
          aria-label={muted ? 'Unmute sound' : 'Mute sound'}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            background: 'transparent',
            border: 'none',
            borderRadius: 0,
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 10,
            padding: 0,
            boxShadow: 'none',
            outline: 'none',
            transition: 'transform 0.15s, filter 0.15s',
            color: '#222', // Ensure icon is visible
          }}
          onMouseDown={e => e.preventDefault()} // Prevents focus ring on click
        >
          {muted ? (
            // Muted icon
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{filter: 'grayscale(0.5)'}}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
          ) : (
            // Classic sound on icon (speaker with waves)
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15 9.34a4 4 0 0 1 0 5.32" /><path d="M17.7 7.7a8 8 0 0 1 0 8.6" /></svg>
          )}
        </button>
        <p
          className="connectedness-word"
          style={{
            fontSize: 'clamp(3rem, 12vw, 8rem)',
            fontWeight: 650,
            letterSpacing: '0.08em',
            lineHeight: 1.05,
            minHeight: '1em',
            padding: 0,
            margin: 0,
            display: 'flex',
            gap: '0.05em',
            alignItems: 'center',
            justifyContent: 'center',
            willChange: 'transform',
            transition: '1000ms cubic-bezier(0.03, 0.98, 0.52, 0.99)',
            transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale3d(${transform.scale}, ${transform.scale}, 1)`
          }}
        >
          {WORD.split('').map((char, i) => (
            <span
              key={i}
              className="connectedness-letter-wrapper"
            >
              <span
                id={`connectedness-letter-${i}`}
                className={`connectedness-letter group/char${hoveredIndex === i ? ' hovered' : ''}`}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  color: hoveredIndex === i ? COLORS[i % COLORS.length] : undefined,
                  transition: 'color 500ms, letter-spacing 400ms, transform 1000ms cubic-bezier(0.03, 0.98, 0.52, 0.99)',
                  fontWeight: 650,
                  position: 'relative',
                  cursor: 'crosshair',
                  letterSpacing: hoveredIndex === i ? '0.18em' : undefined,
                  zIndex: hoveredIndex === i ? 2 : 1,
                }}
              >
                {/* Render toggled or original letter */}
                {toggled[i] ? TOGGLE_WORD[i] : char}
                {/* Animated underline/stripe */}
                <span className="connectedness-stripe" />
              </span>
              {/* SVG above hovered letter, only visible on hover of wrapper */}
              <span
                className="connectedness-triangle"
                style={{ pointerEvents: 'auto', cursor: 'pointer' }}
                onClick={() => handleSvgClick(i)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="triangle-svg">
                  {/* Central dot */}
                  <circle cx="16" cy="16" r="3" fill="currentColor" />
                  {/* 6 radiating lines and end dots, evenly spaced */}
                  <line x1="16" y1="16" x2="16" y2="4" />
                  <circle cx="16" cy="4" r="2" fill="currentColor" />
                  <line x1="16" y1="16" x2="28" y2="10" />
                  <circle cx="28" cy="10" r="2" fill="currentColor" />
                  <line x1="16" y1="16" x2="24" y2="26" />
                  <circle cx="24" cy="26" r="2" fill="currentColor" />
                  <line x1="16" y1="16" x2="8" y2="26" />
                  <circle cx="8" cy="26" r="2" fill="currentColor" />
                  <line x1="16" y1="16" x2="4" y2="10" />
                  <circle cx="4" cy="10" r="2" fill="currentColor" />
                  <line x1="16" y1="16" x2="16" y2="28" />
                  <circle cx="16" cy="28" r="2" fill="currentColor" />
                </svg>
              </span>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

export default ConnectednessWord; 