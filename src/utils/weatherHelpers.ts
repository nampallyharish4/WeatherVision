import { WeatherData, WeatherSeverity } from '../types/weather';

export const getWeatherSeverity = (weather: WeatherData[], rain?: any, snow?: any): WeatherSeverity => {
  const mainWeather = weather[0]?.main.toLowerCase();
  
  if (rain && rain['1h'] > 5) {
    return {
      level: 'heavy',
      color: '#EF4444',
      description: 'Heavy Rain'
    };
  }
  
  if (rain && rain['1h'] > 1) {
    return {
      level: 'moderate',
      color: '#F59E0B',
      description: 'Moderate Rain'
    };
  }
  
  if (rain || mainWeather.includes('rain') || mainWeather.includes('drizzle')) {
    return {
      level: 'light',
      color: '#3B82F6',
      description: 'Light Rain'
    };
  }
  
  if (mainWeather.includes('cloud') || mainWeather.includes('mist') || mainWeather.includes('fog')) {
    return {
      level: 'moderate',
      color: '#6B7280',
      description: 'Cloudy'
    };
  }
  
  return {
    level: 'clear',
    color: '#10B981',
    description: 'Clear Sky'
  };
};

export const getWeatherIcon = (iconCode: string): string => {
  const iconMap: { [key: string]: string } = {
    '01d': '☀️',
    '01n': '🌙',
    '02d': '⛅',
    '02n': '☁️',
    '03d': '☁️',
    '03n': '☁️',
    '04d': '☁️',
    '04n': '☁️',
    '09d': '🌧️',
    '09n': '🌧️',
    '10d': '🌦️',
    '10n': '🌦️',
    '11d': '⛈️',
    '11n': '⛈️',
    '13d': '❄️',
    '13n': '❄️',
    '50d': '🌫️',
    '50n': '🌫️'
  };
  
  return iconMap[iconCode] || '🌤️';
};

export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  if (unit === 'F') {
    return `${Math.round((temp * 9/5) + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

export const getWindDirection = (degrees: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};