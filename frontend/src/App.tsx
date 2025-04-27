import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import HomePage from './pages/HomePage';
import StartPage from './pages/StartPage';
import MovieSelectionPage from './pages/MovieSelectionPage';
import CastSelectionPage from './pages/CastSelectionPage';
import EndPage from './pages/EndPage';

const App: React.FC = () => {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate checking network connectivity or other initialization
    const checkApiConnection = async () => {
      try {
        console.log('Initializing the application...');
        // Wait a moment to ensure everything is loaded
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize:', err);
        setError('Failed to connect to API. Please refresh the page.');
      }
    };

    checkApiConnection();
  }, []);

  if (error) {
    return (
      <div className="error-container">
        <h1>Error</h1>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (!isReady) {
    return <div className="loading">Initializing application...</div>;
  }

  return (
    <GameProvider>
      <Router>
        <div className="container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/start" element={<StartPage />} />
            <Route path="/movies" element={<MovieSelectionPage />} />
            <Route path="/cast" element={<CastSelectionPage />} />
            <Route path="/end" element={<EndPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
};

export default App; 