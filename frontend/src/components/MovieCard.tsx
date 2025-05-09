// import React, { useState } from 'react';
// import { Media } from '../types';
// import './styles.css';

// interface MediaCardProps {
//   media: Media;
//   onClick?: () => void;
// }

// const MediaCard: React.FC<MediaCardProps> = ({ media, onClick }) => {
//   const [imageError, setImageError] = useState(false);
  
//   const handleImageError = () => {
//     setImageError(true);
//   };

//   const imageUrl = !media.poster_path || imageError
//     ? 'https://placehold.co/200x300?text=No+Image'
//     : media.poster_path.startsWith('http')
//       ? media.poster_path
//       : `https://image.tmdb.org/t/p/w200${media.poster_path}`;

//   const year = media.media_type === 'movie' 
//     ? media.release_date ? new Date(media.release_date).getFullYear() : ''
//     : media.first_air_date ? new Date(media.first_air_date).getFullYear() : '';

//   const title = media.media_type === 'movie' ? media.title : media.name || media.title;

//   return (
//     <div className="card media-card" onClick={onClick} style={{
//       cursor: 'pointer',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       background: 'var(--bg-panel)',
//       borderRadius: 12,
//       boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
//       border: '1px solid var(--border)',
//       padding: '8px',
//       transition: 'box-shadow 0.2s, transform 0.2s',
//       minHeight: 240,
//       minWidth: 140,
//       maxWidth: '100%',
//       margin: '0 auto',
//       width: '100%',
//       boxSizing: 'border-box'
//     }}
//     tabIndex={0}
//     aria-label={`Select ${media.media_type} ${title}`}
//     >
//       <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
//         <img 
//           src={imageUrl} 
//           alt={title} 
//           className="card-image" 
//           onError={handleImageError}
//           style={{
//             width: '100%',
//             maxWidth: 100,
//             height: 140,
//             objectFit: 'cover',
//             borderRadius: 8,
//             background: '#eee',
//             marginBottom: 12,
//             boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
//           }}
//         />
//         <div style={{
//           position: 'absolute',
//           top: 8,
//           right: 8,
//           background: 'var(--color-primary)',
//           color: 'white',
//           padding: '2px 6px',
//           borderRadius: 4,
//           fontSize: '0.75rem',
//           fontWeight: 'bold',
//           textTransform: 'uppercase'
//         }}>
//           {media.media_type}
//         </div>
//       </div>
//       <div className="card-title" title={title} style={{
//         fontFamily: 'var(--font-heading)',
//         fontWeight: 700,
//         fontSize: '1rem',
//         color: 'var(--color-midnight-black)',
//         textAlign: 'center',
//         marginTop: 4,
//         letterSpacing: '0.04em',
//         lineHeight: 1.2,
//         display: '-webkit-box',
//         WebkitLineClamp: 3,
//         WebkitBoxOrient: 'vertical',
//         overflow: 'hidden',
//         maxHeight: '3.9em', // ~3 lines
//         wordBreak: 'break-word',
//       }}>{title}</div>
//       <div className="card-year" style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: 2 }}>{year}</div>
//     </div>
//   );
// };

// export default MediaCard; 