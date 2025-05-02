import React from 'react';
import { useLocation } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { state, updateSettings } = useGame();
  const location = useLocation();
  const isStartPage = location.pathname === '/';

  const handlePopularActorsToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({
      ...state.settings,
      filterByWestern: event.target.checked
    });
  };

  const handleThemeToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTheme = event.target.checked ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    updateSettings({
      ...state.settings,
      theme: newTheme
    });
  };

  const handleMaxHopsChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newMaxHops = parseInt(event.target.value);
    updateSettings({
      ...state.settings,
      maxHops: newMaxHops
    });
  };

  return (
    <>
      {isOpen && (
        <div className="settings-modal-overlay" onClick={onClose}>
          <div className="settings-modal-content" onClick={e => e.stopPropagation()}>
            <div className="settings-modal-header">
              <h2>Settings</h2>
              <button className="close-button" onClick={onClose}>×</button>
            </div>
            <div className="settings-modal-body">
              <div className="settings-group">
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={state.settings?.theme === 'dark'}
                    onChange={handleThemeToggle}
                  />
                  <span className="toggle-label">Dark Mode</span>
                </label>
              </div>
              
              <div className="settings-section">
                <h3 className="settings-section-title">Too easy? Try playing around with these settings</h3>
                <div className="settings-group">
                  <label className="settings-toggle">
                    <input
                      type="checkbox"
                      checked={state.settings?.filterByWestern ?? true}
                      onChange={handlePopularActorsToggle}
                    />
                    <span className="toggle-label">Only display the most popular actors</span>
                  </label>
                </div>
                <div className="settings-group">
                  <div className="select-container">
                    <label className="settings-toggle">
                      <input
                        type="checkbox"
                        checked={state.settings.maxHopsEnabled}
                        onChange={() => {
                          updateSettings({
                            ...state.settings,
                            maxHopsEnabled: !state.settings.maxHopsEnabled
                          });
                        }}
                      />
                      <span className="toggle-label">
                        Max Hops Limit
                        <span 
                          className="tooltip-icon" 
                          title="A hop is one complete move: selecting an actor and then a movie they starred in. For example, going from Actor A → Movie → Actor B counts as one hop."
                        >
                          ?
                        </span>
                      </span>
                    </label>
                  </div>
                  {state.settings.maxHopsEnabled && (
                    <div className="select-container" style={{ marginTop: '1em' }}>
                      <label className="select-label" htmlFor="maxHops">Max hops:</label>
                      <select
                        id="maxHops"
                        className={`hops-select ${!isStartPage ? 'disabled' : ''}`}
                        value={state.settings.maxHops}
                        onChange={handleMaxHopsChange}
                        disabled={!isStartPage}
                      >
                        {[6, 5, 4, 3, 2, 1].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                      {!isStartPage && (
                        <div className="settings-hint">
                          Max hops can only be changed before starting the game
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="settings-group">
                  <div className="select-container">
                    <label className="settings-toggle">
                      <input
                        type="checkbox"
                        checked={state.settings.timerEnabled}
                        onChange={() => {
                          updateSettings({
                            ...state.settings,
                            timerEnabled: !state.settings.timerEnabled
                          });
                        }}
                      />
                      <span className="toggle-label">Enable Timer</span>
                    </label>
                  </div>
                  {state.settings.timerEnabled && (
                    <div className="select-container" style={{ marginTop: '1em' }}>
                      <label className="select-label" htmlFor="timerDuration">Timer Duration:</label>
                      <select
                        id="timerDuration"
                        className="hops-select"
                        value={state.settings.timerDuration}
                        onChange={(e) => {
                          updateSettings({
                            ...state.settings,
                            timerDuration: parseInt(e.target.value)
                          });
                        }}
                      >
                        {[7, 6, 5, 4, 3, 2, 1].map((num) => (
                          <option key={num} value={num}>
                            {num} {num === 1 ? 'minute' : 'minutes'}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsModal; 