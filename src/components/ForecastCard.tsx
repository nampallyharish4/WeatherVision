import React from 'react';
import { ForecastItem } from '../types/weather';
import { formatTemperature, getWeatherIcon, formatDate } from '../utils/weatherHelpers';
import { Droplets } from 'lucide-react';

interface ForecastCardProps {
  forecast: ForecastItem[];
  unit: 'C' | 'F';
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, unit }) => {
  // Group forecast by day and take the first item of each day
  const dailyForecast = forecast.reduce((acc: ForecastItem[], item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!acc.find(f => new Date(f.dt * 1000).toDateString() === date)) {
      acc.push(item);
    }
    return acc;
  }, []).slice(0, 7);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-6">7-Day Forecast</h3>
      
      <div className="space-y-4">
        {dailyForecast.map((item, index) => (
          <div key={item.dt} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200">
            <div className="flex items-center space-x-4">
              <div className="text-2xl">{getWeatherIcon(item.weather[0].icon)}</div>
              <div>
                <p className="font-medium text-gray-900">
                  {index === 0 ? 'Today' : formatDate(item.dt)}
                </p>
                <p className="text-sm text-gray-500 capitalize">
                  {item.weather[0].description}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-blue-500">
                <Droplets className="w-4 h-4" />
                <span className="text-sm">{Math.round(item.pop * 100)}%</span>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">
                  {formatTemperature(item.main.temp_max, unit)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatTemperature(item.main.temp_min, unit)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastCard;