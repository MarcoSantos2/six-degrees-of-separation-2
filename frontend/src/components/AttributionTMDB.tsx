import React from 'react';

const AttributionTMDB: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, marginTop: 24, marginBottom: 8, justifyContent: 'center', fontSize: '0.95rem', color: '#888' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <img
        src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg"
        alt="TMDB Logo"
        style={{ height: 28, width: 'auto', opacity: 0.85 }}
      />
      <span>
        This website uses TMDB and the TMDB APIs but is not endorsed, certified, or otherwise approved by TMDB.
      </span>
    </div>
    <div style={{ fontSize: '0.92rem', color: '#aaa', marginTop: 4 }}>
      © 2025 - All rights reserved.
    </div>
  </div>
);

export default AttributionTMDB; 