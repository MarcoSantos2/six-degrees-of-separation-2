import React from 'react';
import { useGame } from '../context/GameContext';
import './SettingsModal.css';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { state, updateSettings } = useGame();

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
                <h3 className="settings-section-title">Too easy? Try playing with these settings</h3>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SettingsModal; 