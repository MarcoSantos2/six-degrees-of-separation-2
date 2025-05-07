import React, { useRef, useState } from 'react';
import './ConnectednessWord.css';

const WORD = 'CONNECTEDNESS';
const TOGGLE_WORD = 'YOUAREAWESOME';
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
const CHANGE_SOUND_URL = '/sounds/change.mp3';

const ConnectednessWord: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [toggled, setToggled] = useState<boolean[]>(Array(WORD.length).fill(false));
  const [muted, setMuted] = useState(false);
  const popAudioRef = useRef<HTMLAudioElement | null>(null);
  const [displayedWord, setDisplayedWord] = useState<string[]>(WORD.split(''));
  const changeAudioRef = useRef<HTMLAudioElement | null>(null);
  const [triangleClicked, setTriangleClicked] = useState(false);

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
    // Also mute/unmute audio elements
    if (popAudioRef.current) popAudioRef.current.muted = !muted;
    if (changeAudioRef.current) changeAudioRef.current.muted = !muted;
  };

  // Animate letter change on triangle click (only once)
  const handleTriangleClick = async () => {
    if (triangleClicked) return;
    setTriangleClicked(true);
    for (let i = 0; i < WORD.length; i++) {
      setDisplayedWord(prev => {
        const next = [...prev];
        next[i] = TOGGLE_WORD[i] || '';
        return next;
      });
      // Play change sound if not muted
      if (!muted && changeAudioRef.current) {
        changeAudioRef.current.currentTime = 0;
        changeAudioRef.current.play();
      }
      await new Promise(res => setTimeout(res, 200));
    }
  };

  return (
    <div
      ref={containerRef}
      className="connectedness-word-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1000px',
        minHeight: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingBottom: '1.5rem',
        textTransform: 'uppercase',
        cursor: 'default',
        userSelect: 'none',
        position: 'relative',
      }}
    >
      {/* Hidden audio elements for pop and change sounds */}
      <audio ref={popAudioRef} src={POP_SOUND_URL} preload="auto" />
      <audio ref={changeAudioRef} src={CHANGE_SOUND_URL} preload="auto" />
      {/* Triangle SVG always visible and centered above the word, clickable */}
      <div className="connectedness-word-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', width: 'fit-content', margin: '30px 0 0 0', textAlign: 'center' }}>
        <span
          className="connectedness-triangle-global"
          style={{ display: 'block', margin: '0 auto 0.1em auto', cursor: triangleClicked ? 'default' : 'pointer' }}
          onClick={handleTriangleClick}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="triangle-svg">
            <circle cx="16" cy="16" r="3" fill="currentColor" />
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
      </div>
      {/* Word and sound button wrapper */}
      <div className="connectedness-word-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
        <p
          className="connectedness-word"
          style={{
            fontSize: 'clamp(1.5rem, 6vw, 4rem)',
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
            width: '100%',
            willChange: 'transform',
            transition: '1000ms cubic-bezier(0.03, 0.98, 0.52, 0.99)',
            transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale3d(${transform.scale}, ${transform.scale}, 1)`
          }}
        >
          {displayedWord.map((char, i) => (
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
                {char}
                <span className="connectedness-stripe" />
              </span>
            </span>
          ))}
          {/* Move the sound toggle button here, inline after the last letter */}
          <button
            className="sound-toggle-btn"
            onClick={handleToggleMute}
            aria-label={muted ? 'Unmute sound' : 'Mute sound'}
            style={{
              background: 'transparent',
              border: 'none',
              borderRadius: 0,
              width: 'clamp(1.2rem, 3vw, 2.2rem)',
              height: 'clamp(1.2rem, 3vw, 2.2rem)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              zIndex: 10,
              padding: 0,
              boxShadow: 'none',
              outline: 'none',
              transition: 'transform 0.15s, filter 0.15s',
              color: '#222',
              marginLeft: '0.5em', // space from last letter
              position: 'static', // remove absolute
            }}
            onMouseDown={e => e.preventDefault()}
          >
            {muted ? (
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{filter: 'grayscale(0.5)'}}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
            ) : (
              <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15 9.34a4 4 0 0 1 0 5.32" /><path d="M17.7 7.7a8 8 0 0 1 0 8.6" /></svg>
            )}
          </button>
        </p>
      </div>
    </div>
  );
};

export default ConnectednessWord; 