import axios from 'axios';
import { CurrentWeather, ForecastResponse, LocationData } from '../types/weather';

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || 'demo_key';
const BASE_URL = import.meta.env.VITE_WEATHER_API_BASE_URL || 'https://api.openweathermap.org/data/2.5';
const GEO_URL = import.meta.env.VITE_GEO_API_BASE_URL || 'https://api.openweathermap.org/geo/1.0';

// Check if we have a valid API key
const hasValidApiKey = API_KEY && API_KEY !== 'demo_key' && API_KEY !== 'your_api_key_here';

export const weatherApi = {
  getCurrentWeather: async (lat: number, lon: number): Promise<CurrentWeather> => {
    if (!hasValidApiKey) {
      console.warn('Using mock data - Please add your OpenWeatherMap API key to .env file');
      return getMockWeatherData(lat, lon);
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching current weather:', error);
      // Fallback to mock data if API fails
      return getMockWeatherData(lat, lon);
    }
  },

  getForecast: async (lat: number, lon: number): Promise<ForecastResponse> => {
    if (!hasValidApiKey) {
      console.warn('Using mock data - Please add your OpenWeatherMap API key to .env file');
      return getMockForecastData(lat, lon);
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      // Fallback to mock data if API fails
      return getMockForecastData(lat, lon);
    }
  },

  searchLocation: async (query: string): Promise<LocationData[]> => {
    if (!hasValidApiKey) {
      console.warn('Using mock location search');
      return [];
    }

    try {
      const response = await axios.get(
        `${GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`,
        { timeout: 5000 }
      );
      return response.data;
    } catch (error) {
      console.error('Error searching location:', error);
      return [];
    }
  },

  getLocationByCoords: async (lat: number, lon: number): Promise<LocationData[]> => {
    if (!hasValidApiKey) {
      console.warn('Using mock reverse geocoding');
      return [];
    }

    try {
      const response = await axios.get(
        `${GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`,
        { timeout: 5000 }
      );
      return response.data;
    } catch (error) {
      console.error('Error getting location by coordinates:', error);
      return [];
    }
  }
};

// Enhanced mock data generator with realistic variations
const getMockWeatherData = (lat: number, lon: number): CurrentWeather => {
  const now = Date.now() / 1000;
  const baseTemp = 25 + Math.sin(lat * 0.1) * 10 + Math.cos(lon * 0.1) * 5;
  const variation = Math.sin(now / 3600) * 3; // Hourly variation
  
  return {
    coord: { lon, lat },
    weather: [
      {
        id: 800 + Math.floor(Math.random() * 4),
        main: ['Clear', 'Clouds', 'Rain', 'Mist'][Math.floor(Math.random() * 4)],
        description: ['clear sky', 'scattered clouds', 'light rain', 'mist'][Math.floor(Math.random() * 4)],
        icon: ['01d', '02d', '10d', '50d'][Math.floor(Math.random() * 4)]
      }
    ],
    base: 'stations',
    main: {
      temp: baseTemp + variation,
      feels_like: baseTemp + variation + 2,
      temp_min: baseTemp + variation - 3,
      temp_max: baseTemp + variation + 4,
      pressure: 1013 + Math.sin(now / 7200) * 20,
      humidity: 45 + Math.sin(now / 1800) * 25
    },
    visibility: 8000 + Math.random() * 4000,
    wind: {
      speed: 2 + Math.random() * 6,
      deg: Math.floor(Math.random() * 360)
    },
    clouds: {
      all: Math.floor(Math.random() * 100)
    },
    dt: now,
    sys: {
      country: 'IN',
      sunrise: now - (now % 86400) + 6 * 3600,
      sunset: now - (now % 86400) + 18 * 3600
    },
    timezone: 19800,
    id: Math.floor(Math.random() * 1000000),
    name: 'Current Location',
    cod: 200
  };
};

const getMockForecastData = (lat: number, lon: number): ForecastResponse => {
  const baseTemp = 25 + Math.sin(lat * 0.1) * 10 + Math.cos(lon * 0.1) * 5;
  
  return {
    cod: '200',
    message: 0,
    cnt: 40,
    list: Array.from({ length: 40 }, (_, i) => {
      const dt = Date.now() / 1000 + (i * 3 * 3600);
      const dailyVariation = Math.sin((i * 3 * 3600) / 86400 * 2 * Math.PI) * 8;
      const hourlyVariation = Math.sin((i * 3) / 24 * 2 * Math.PI) * 4;
      
      return {
        dt,
        main: {
          temp: baseTemp + dailyVariation + hourlyVariation,
          feels_like: baseTemp + dailyVariation + hourlyVariation + 2,
          temp_min: baseTemp + dailyVariation + hourlyVariation - 2,
          temp_max: baseTemp + dailyVariation + hourlyVariation + 3,
          pressure: 1013 + Math.sin(dt / 7200) * 15,
          humidity: 50 + Math.sin(dt / 3600) * 30
        },
        weather: [{
          id: 800 + (i % 4),
          main: ['Clear', 'Clouds', 'Rain', 'Mist'][i % 4],
          description: ['clear sky', 'scattered clouds', 'light rain', 'mist'][i % 4],
          icon: ['01d', '02d', '10d', '50d'][i % 4]
        }],
        clouds: { all: (i * 7) % 100 },
        wind: {
          speed: 2 + (i % 6),
          deg: (i * 15) % 360
        },
        visibility: 8000 + (i * 100) % 4000,
        pop: Math.sin(i * 0.5) * 0.5 + 0.3,
        rain: i % 5 === 0 ? { '3h': Math.random() * 3 } : undefined,
        sys: { pod: i % 8 < 4 ? 'd' : 'n' },
        dt_txt: new Date(dt * 1000).toISOString()
      };
    }),
    city: {
      id: Math.floor(Math.random() * 1000000),
      name: 'Current Location',
      coord: { lat, lon },
      country: 'IN',
      population: 1000000,
      timezone: 19800,
      sunrise: Date.now() / 1000,
      sunset: Date.now() / 1000 + 12 * 3600
    }
  };
};

// Export mock data for backward compatibility
export const mockWeatherData = getMockWeatherData(28.6139, 77.2090);