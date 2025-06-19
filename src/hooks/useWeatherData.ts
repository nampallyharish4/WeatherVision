import { useState, useEffect, useCallback, useRef } from 'react';
import { CurrentWeather, ForecastResponse } from '../types/weather';
import { weatherApi } from '../utils/weatherApi';

interface UseWeatherDataProps {
  lat: number;
  lon: number;
  locationName: string;
  refreshInterval?: number; // in milliseconds
}

interface WeatherDataState {
  currentWeather: CurrentWeather | null;
  forecast: ForecastResponse | null;
  isLoading: boolean;
  error: string | null;
  lastUpdated: Date | null;
}

export const useWeatherData = ({ 
  lat, 
  lon, 
  locationName, 
  refreshInterval = 300000 // 5 minutes default
}: UseWeatherDataProps) => {
  const [state, setState] = useState<WeatherDataState>({
    currentWeather: null,
    forecast: null,
    isLoading: true,
    error: null,
    lastUpdated: null
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchWeatherData = useCallback(async (showLoading = true) => {
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    if (showLoading) {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
    }

    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        weatherApi.getCurrentWeather(lat, lon),
        weatherApi.getForecast(lat, lon)
      ]);

      // Update location name in the response
      const updatedWeather = {
        ...weatherResponse,
        name: locationName
      };

      const updatedForecast = {
        ...forecastResponse,
        city: {
          ...forecastResponse.city,
          name: locationName
        }
      };

      setState({
        currentWeather: updatedWeather,
        forecast: updatedForecast,
        isLoading: false,
        error: null,
        lastUpdated: new Date()
      });

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return; // Request was cancelled, don't update state
      }

      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, [lat, lon, locationName]);

  // Initial fetch and setup auto-refresh
  useEffect(() => {
    fetchWeatherData(true);

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Set up auto-refresh
    if (refreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchWeatherData(false); // Don't show loading for background updates
      }, refreshInterval);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchWeatherData, refreshInterval]);

  const refreshData = useCallback(() => {
    fetchWeatherData(true);
  }, [fetchWeatherData]);

  return {
    ...state,
    refreshData
  };
};