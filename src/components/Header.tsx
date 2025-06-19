import React from 'react';
import { Cloud, MapPin, Settings } from 'lucide-react';

interface HeaderProps {
  currentLocation: string;
  onLocationClick: () => void;
  onSettingsClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentLocation, onLocationClick, onSettingsClick }) => {
  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
              <Cloud className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">WeatherVision</h1>
              <p className="text-sm text-gray-500">India</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onLocationClick}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
            >
              <MapPin className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700 truncate max-w-32">
                {currentLocation}
              </span>
            </button>

            <button
              onClick={onSettingsClick}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;