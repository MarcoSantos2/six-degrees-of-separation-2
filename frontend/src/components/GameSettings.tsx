import React from 'react';
import { useGame } from '../context/GameContext';

const GameSettings: React.FC = () => {
  const { state, updateSettings } = useGame();

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({
      ...state.settings,
      filterByWestern: event.target.checked
    });
  };

  return (
    <div className="settings-panel">
      <div className="setting-item">
        <label>
          <input
            type="checkbox"
            checked={state.settings?.filterByWestern ?? true}
            onChange={handleFilterChange}
          />
          Filter by Western actors only
        </label>
      </div>
    </div>
  );
};

export default GameSettings; 