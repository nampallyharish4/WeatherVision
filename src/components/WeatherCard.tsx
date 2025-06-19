import React from 'react';
import { CurrentWeather } from '../types/weather';
import { formatTemperature, getWeatherIcon, formatTime } from '../utils/weatherHelpers';
import { Thermometer, Droplets, Wind, Eye, Sunrise, Sunset } from 'lucide-react';

interface WeatherCardProps {
  weather: CurrentWeather;
  unit: 'C' | 'F';
}

const WeatherCard: React.FC<WeatherCardProps> = ({ weather, unit }) => {
  const weatherIcon = getWeatherIcon(weather.weather[0].icon);
  
  return (
    <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">{weather.name}</h2>
          <p className="text-blue-100 capitalize">{weather.weather[0].description}</p>
        </div>
        <div className="text-6xl">{weatherIcon}</div>
      </div>

      <div className="flex items-end space-x-4 mb-6">
        <div className="text-5xl font-light">
          {formatTemperature(weather.main.temp, unit)}
        </div>
        <div className="text-blue-100 mb-2">
          Feels like {formatTemperature(weather.main.feels_like, unit)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-2">
          <Thermometer className="w-4 h-4 text-blue-200" />
          <span className="text-sm text-blue-100">
            {formatTemperature(weather.main.temp_min, unit)} / {formatTemperature(weather.main.temp_max, unit)}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Droplets className="w-4 h-4 text-blue-200" />
          <span className="text-sm text-blue-100">{weather.main.humidity}%</span>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-blue-200" />
          <span className="text-sm text-blue-100">{weather.wind.speed} m/s</span>
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-blue-200" />
          <span className="text-sm text-blue-100">{(weather.visibility / 1000).toFixed(1)} km</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-blue-100">
        <div className="flex items-center space-x-1">
          <Sunrise className="w-4 h-4" />
          <span>{formatTime(weather.sys.sunrise)}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Sunset className="w-4 h-4" />
          <span>{formatTime(weather.sys.sunset)}</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;