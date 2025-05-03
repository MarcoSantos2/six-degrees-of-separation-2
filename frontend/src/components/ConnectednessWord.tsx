import React, { useRef, useState } from 'react';
import './ConnectednessWord.css';

const WORD = 'CONNECTEDNESS';
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

const NUM_SPARKS = 12;

const ConnectednessWord: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, scale: 1 });
  const [sparks, setSparks] = useState<Array<{ x: number; y: number; color: string; angle: number; id: number }>>([]);

  // Mouse move handler for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1
    setTransform({
      rotateX: y * 10, // up/down
      rotateY: x * 2, // left/right
      scale: 1.04,
    });
  };

  const handleMouseLeave = () => {
    setTransform({ rotateX: 0, rotateY: 0, scale: 1 });
    setHoveredIndex(null);
  };

  const handleLetterClick = (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
    const x = e.clientX;
    const y = e.clientY;
    const color = COLORS[index % COLORS.length];
    const now = Date.now();
    const newSparks = Array.from({ length: NUM_SPARKS }).map((_, i) => ({
      x,
      y,
      color,
      angle: (i * 360) / NUM_SPARKS,
      id: now + i + Math.random(),
    }));
    setSparks(prev => [...prev, ...newSparks]);
    setTimeout(() => {
      setSparks(prev => prev.filter(spark => !newSparks.some(ns => ns.id === spark.id)));
    }, 500);
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
      }}
    >
      {sparks.map((spark) => (
        <div
          key={spark.id}
          className="spark-absolute"
          style={{
            left: spark.x,
            top: spark.y,
            backgroundColor: spark.color,
            '--spark-angle': `${spark.angle}deg`,
          } as React.CSSProperties}
        />
      ))}
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
            className={`connectedness-letter group/char${hoveredIndex === i ? ' hovered' : ''}`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={(e) => handleLetterClick(e, i)}
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
            {/* Dot with 6 radiating lines SVG above hovered letter */}
            {hoveredIndex === i && (
              <span className="connectedness-triangle">
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
            )}
            {char}
            {/* Animated underline/stripe */}
            <span className="connectedness-stripe" />
          </span>
        ))}
      </p>
    </div>
  );
};

export default ConnectednessWord; 