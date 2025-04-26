import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import HomePage from './pages/HomePage';
import StartPage from './pages/StartPage';
import MovieSelectionPage from './pages/MovieSelectionPage';
import CastSelectionPage from './pages/CastSelectionPage';
import EndPage from './pages/EndPage';

const App: React.FC = () => {
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
          </Routes>
        </div>
      </Router>
    </GameProvider>
  );
};

export default App; 