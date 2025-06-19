import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { ForecastItem } from '../types/weather';
import { formatDate } from '../utils/weatherHelpers';

interface WeatherAnalyticsProps {
  forecast: ForecastItem[];
  unit: 'C' | 'F';
}

const WeatherAnalytics: React.FC<WeatherAnalyticsProps> = ({ forecast, unit }) => {
  // Process data for charts
  const temperatureData = forecast.slice(0, 24).map((item, index) => ({
    time: index % 4 === 0 ? formatDate(item.dt) : '',
    temperature: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
    humidity: item.main.humidity
  }));

  const dailyData = forecast
    .reduce((acc: any[], item) => {
      const date = formatDate(item.dt);
      const existing = acc.find(d => d.date === date);
      if (existing) {
        existing.rainfall += (item.rain?.['3h'] || 0);
        existing.wind = Math.max(existing.wind, item.wind.speed);
      } else {
        acc.push({
          date,
          rainfall: item.rain?.['3h'] || 0,
          wind: item.wind.speed,
          pressure: item.main.pressure
        });
      }
      return acc;
    }, [])
    .slice(0, 7);

  const weatherTypes = forecast.slice(0, 40).reduce((acc: any, item) => {
    const type = item.weather[0].main;
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(weatherTypes).map(([type, count]) => ({
    name: type,
    value: count
  }));

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Weather Analytics</h3>
        
        {/* Temperature Trends */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Temperature & Humidity Trends</h4>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={temperatureData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  name={`Temperature (°${unit})`}
                />
                <Line 
                  type="monotone" 
                  dataKey="feels_like" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }}
                  name={`Feels Like (°${unit})`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rainfall & Wind */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Daily Rainfall</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="rainfall" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Rainfall (mm)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Wind Speed</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="wind" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                    name="Wind Speed (m/s)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Weather Distribution */}
        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Weather Pattern Distribution</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span className="text-sm text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherAnalytics;