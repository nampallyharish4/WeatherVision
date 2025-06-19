import React, { useState } from 'react';
import Header from './components/Header';
import WeatherCard from './components/WeatherCard';
import ForecastCard from './components/ForecastCard';
import WeatherMap from './components/WeatherMap';
import WeatherAnalytics from './components/WeatherAnalytics';
import LocationSearch from './components/LocationSearch';
import WeatherAlerts from './components/WeatherAlerts';
import RealTimeIndicator from './components/RealTimeIndicator';
import { useWeatherData } from './hooks/useWeatherData';
import { Loader, TrendingUp, Map, Settings } from 'lucide-react';

function App() {
  const [currentLocation, setCurrentLocation] = useState({ lat: 28.6139, lon: 77.2090 });
  const [locationName, setLocationName] = useState('Delhi');
  const [showLocationSearch, setShowLocationSearch] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'map'>('overview');
  const [temperatureUnit, setTemperatureUnit] = useState<'C' | 'F'>('C');

  // Use the new real-time weather hook
  const {
    currentWeather,
    forecast,
    isLoading,
    error,
    lastUpdated,
    refreshData
  } = useWeatherData({
    lat: currentLocation.lat,
    lon: currentLocation.lon,
    locationName,
    refreshInterval: 300000 // 5 minutes
  });

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    setCurrentLocation({ lat, lon });
    setLocationName(name);
  };

  const handleSettingsClick = () => {
    setTemperatureUnit(temperatureUnit === 'C' ? 'F' : 'C');
  };

  if (isLoading && !currentWeather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">Loading real-time weather data...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching latest forecasts for {locationName}</p>
        </div>
      </div>
    );
  }

  if (error && !currentWeather) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">Weather Service Unavailable</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header
        currentLocation={locationName}
        onLocationClick={() => setShowLocationSearch(true)}
        onSettingsClick={handleSettingsClick}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Status Indicator */}
        <div className="mb-6">
          <RealTimeIndicator
            lastUpdated={lastUpdated}
            isLoading={isLoading}
            error={error}
            onRefresh={refreshData}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-1 shadow-lg">
            <nav className="flex space-x-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === 'overview'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'analytics'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === 'map'
                    ? 'bg-blue-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Map</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && currentWeather && forecast && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <WeatherCard weather={currentWeather} unit={temperatureUnit} />
              <WeatherAlerts weather={currentWeather} showRealTimeAlerts={true} />
            </div>
            <div>
              <ForecastCard forecast={forecast.list} unit={temperatureUnit} />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && forecast && (
          <WeatherAnalytics forecast={forecast.list} unit={temperatureUnit} />
        )}

        {activeTab === 'map' && (
          <WeatherMap
            currentLocation={currentLocation}
            onLocationSelect={handleLocationSelect}
          />
        )}

        {/* Unit indicator */}
        <div className="fixed bottom-6 right-6">
          <div className="bg-white rounded-full px-4 py-2 shadow-lg border border-gray-200">
            <span className="text-sm font-medium text-gray-600">
              Temperature: °{temperatureUnit}
            </span>
          </div>
        </div>
      </main>

      <LocationSearch
        isOpen={showLocationSearch}
        onClose={() => setShowLocationSearch(false)}
        onLocationSelect={handleLocationSelect}
      />
    </div>
  );
}

export default App;