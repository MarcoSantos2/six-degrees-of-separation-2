import React from 'react';
import { useGame } from '../context/GameContext';
import { MediaFilter } from '../types';

const SettingsPage: React.FC = () => {
  const { state, updateSettings } = useGame();

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({
      ...state.settings,
      theme: e.target.value as 'light' | 'dark'
    });
  };

  const handleMaxHopsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      updateSettings({
        ...state.settings,
        maxHops: value
      });
    }
  };

  const handleMaxHopsToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({
      ...state.settings,
      maxHopsEnabled: e.target.checked
    });
  };

  const handleTimerToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSettings({
      ...state.settings,
      timerEnabled: e.target.checked
    });
  };

  const handleTimerDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      updateSettings({
        ...state.settings,
        timerDuration: value
      });
    }
  };

  const handleMediaFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSettings({
      ...state.settings,
      mediaFilter: e.target.value as MediaFilter
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="space-y-6">
        <div>
          <label className="block text-lg font-medium mb-2">Theme</label>
          <select
            value={state.settings.theme}
            onChange={handleThemeChange}
            className="w-full p-2 border rounded"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <label className="block text-lg font-medium mb-2">Media Type</label>
          <select
            value={state.settings.mediaFilter}
            onChange={handleMediaFilterChange}
            className="w-full p-2 border rounded"
          >
            <option value="ALL_MEDIA">All Media (Movies & TV Shows)</option>
            <option value="MOVIES_ONLY">Movies Only</option>
            <option value="TV_ONLY">TV Shows Only</option>
          </select>
        </div>

        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="maxHopsEnabled"
              checked={state.settings.maxHopsEnabled}
              onChange={handleMaxHopsToggle}
              className="mr-2"
            />
            <label htmlFor="maxHopsEnabled" className="text-lg font-medium">
              Enable Maximum Hops
            </label>
          </div>
          {state.settings.maxHopsEnabled && (
            <input
              type="number"
              value={state.settings.maxHops}
              onChange={handleMaxHopsChange}
              min="1"
              className="w-full p-2 border rounded"
              placeholder="Maximum number of hops"
            />
          )}
        </div>

        <div>
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="timerEnabled"
              checked={state.settings.timerEnabled}
              onChange={handleTimerToggle}
              className="mr-2"
            />
            <label htmlFor="timerEnabled" className="text-lg font-medium">
              Enable Timer
            </label>
          </div>
          {state.settings.timerEnabled && (
            <input
              type="number"
              value={state.settings.timerDuration}
              onChange={handleTimerDurationChange}
              min="1"
              className="w-full p-2 border rounded"
              placeholder="Timer duration in minutes"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 