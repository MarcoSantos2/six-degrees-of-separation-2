import React from 'react';
import { Actor, Media } from '../types';
import './styles.css';

interface PathStep {
  actor: Actor;
  media?: Media;
}

interface PathSummaryProps {
  path: PathStep[];
  arrowSvgPath?: string; // Optional, for custom arrow SVG
}

const getActorImageUrl = (actor: Actor) => {
  if (actor.profile_path) {
    return `https://image.tmdb.org/t/p/w200${actor.profile_path}`;
  }
  return 'https://placehold.co/80x120?text=No+Image';
};

const getMediaPosterUrl = (media?: Media) => {
  if (media?.poster_path) {
    return `https://image.tmdb.org/t/p/w200${media.poster_path}`;
  }
  return 'https://placehold.co/80x120?text=No+Image';
};

const PathSummary: React.FC<PathSummaryProps> = ({ path, arrowSvgPath = '/arrows/stairUp.svg' }) => {
  return (
    <div className="interactive-path" style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', whiteSpace: 'nowrap', marginTop: 12, justifyContent: 'center' }}>
      {path.map((step, index) => (
        <React.Fragment key={index}>
          <div className="path-step" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="path-actor-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 80, padding: 8, borderRadius: 8, background: '#fff', boxShadow: '#00000020 1px 4px 8px' }}>
              <img 
                src={getActorImageUrl(step.actor)}
                alt={step.actor.name}
                className="path-actor-image"
                style={{ width: 56, height: 84, borderRadius: 8, objectFit: 'cover', background: '#eee' }}
              />
              <div className="path-actor-name" style={{ color: 'var(--color-midnight-black)', fontWeight: 600, fontSize: '1.05rem', textAlign: 'center', maxWidth: 90, whiteSpace: 'normal', wordBreak: 'break-word' }}>{step.actor.name}</div>
              {step.media && (
                <>
                  <div className="path-movie-title" style={{ color: '#666666', fontWeight: 500, fontSize: '0.75rem', textAlign: 'center', maxWidth: 90, whiteSpace: 'normal', wordBreak: 'break-word', marginTop: 2 }}>
                    {step.media.media_type === 'movie' ? step.media.title : step.media.name}
                  </div>
                </>
              )}
            </div>
          </div>
          {index < path.length - 1 && (
            <div className="path-arrow" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 48, minHeight: 48 }}>
              <img 
                src={arrowSvgPath} 
                alt="arrow" 
                style={{ 
                  width: 48, 
                  height: 48, 
                  objectFit: 'contain', 
                  filter: 'drop-shadow(0 1px 2px #0002)', 
                  transform: index % 2 === 1 ? 'scaleY(-1)' : undefined 
                }} 
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default PathSummary; 