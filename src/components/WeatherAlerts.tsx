import React from 'react';
import { AlertTriangle, Info, CheckCircle, XCircle, Thermometer, Droplets, Wind, Eye } from 'lucide-react';
import { CurrentWeather } from '../types/weather';

interface WeatherAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  icon: React.ReactNode;
  severity: 'low' | 'medium' | 'high' | 'extreme';
}

interface WeatherAlertsProps {
  weather: CurrentWeather;
  showRealTimeAlerts?: boolean;
}

const WeatherAlerts: React.FC<WeatherAlertsProps> = ({ weather, showRealTimeAlerts = true }) => {
  const generateAlerts = (weather: CurrentWeather): WeatherAlert[] => {
    const alerts: WeatherAlert[] = [];
    
    // Extreme temperature alerts
    if (weather.main.temp > 45) {
      alerts.push({
        id: 'extreme-heat',
        type: 'error',
        severity: 'extreme',
        title: 'EXTREME HEAT WARNING',
        message: `Dangerous temperature of ${Math.round(weather.main.temp)}°C. Avoid all outdoor activities. Risk of heat stroke is very high.`,
        icon: <Thermometer className="w-5 h-5" />
      });
    } else if (weather.main.temp > 40) {
      alerts.push({
        id: 'heatwave',
        type: 'error',
        severity: 'high',
        title: 'Heat Wave Alert',
        message: `Temperature is ${Math.round(weather.main.temp)}°C. Stay hydrated, seek shade, and limit outdoor exposure.`,
        icon: <AlertTriangle className="w-5 h-5" />
      });
    } else if (weather.main.temp > 35) {
      alerts.push({
        id: 'hot',
        type: 'warning',
        severity: 'medium',
        title: 'Hot Weather Advisory',
        message: `Temperature is ${Math.round(weather.main.temp)}°C. Take precautions when going outside.`,
        icon: <AlertTriangle className="w-5 h-5" />
      });
    }

    // Cold temperature alerts
    if (weather.main.temp < 5) {
      alerts.push({
        id: 'extreme-cold',
        type: 'error',
        severity: 'high',
        title: 'Extreme Cold Warning',
        message: `Temperature is ${Math.round(weather.main.temp)}°C. Risk of hypothermia. Dress warmly and limit exposure.`,
        icon: <Thermometer className="w-5 h-5" />
      });
    }
    
    // Humidity alerts
    if (weather.main.humidity > 90) {
      alerts.push({
        id: 'extreme-humidity',
        type: 'warning',
        severity: 'medium',
        title: 'Extreme Humidity',
        message: `Humidity is ${weather.main.humidity}%. Very uncomfortable conditions. Stay in air-conditioned areas if possible.`,
        icon: <Droplets className="w-5 h-5" />
      });
    } else if (weather.main.humidity > 80) {
      alerts.push({
        id: 'high-humidity',
        type: 'info',
        severity: 'low',
        title: 'High Humidity',
        message: `Humidity is ${weather.main.humidity}%. You may feel uncomfortable due to high moisture levels.`,
        icon: <Droplets className="w-5 h-5" />
      });
    }
    
    // Wind alerts
    if (weather.wind.speed > 15) {
      alerts.push({
        id: 'strong-wind',
        type: 'error',
        severity: 'high',
        title: 'Strong Wind Warning',
        message: `Wind speed is ${weather.wind.speed.toFixed(1)} m/s. Dangerous conditions for outdoor activities. Secure loose objects.`,
        icon: <Wind className="w-5 h-5" />
      });
    } else if (weather.wind.speed > 10) {
      alerts.push({
        id: 'moderate-wind',
        type: 'warning',
        severity: 'medium',
        title: 'Moderate Wind Advisory',
        message: `Wind speed is ${weather.wind.speed.toFixed(1)} m/s. Be cautious of flying debris and secure loose objects.`,
        icon: <Wind className="w-5 h-5" />
      });
    }
    
    // Visibility alerts
    if (weather.visibility < 500) {
      alerts.push({
        id: 'poor-visibility',
        type: 'error',
        severity: 'high',
        title: 'Severe Visibility Warning',
        message: `Visibility is only ${(weather.visibility / 1000).toFixed(1)} km. Extremely dangerous driving conditions.`,
        icon: <Eye className="w-5 h-5" />
      });
    } else if (weather.visibility < 1000) {
      alerts.push({
        id: 'reduced-visibility',
        type: 'warning',
        severity: 'medium',
        title: 'Poor Visibility Alert',
        message: `Visibility is ${(weather.visibility / 1000).toFixed(1)} km. Drive carefully and use headlights.`,
        icon: <Eye className="w-5 h-5" />
      });
    }

    // Rain alerts based on weather conditions
    if (weather.weather[0].main === 'Rain') {
      if (weather.rain && weather.rain['1h'] && weather.rain['1h'] > 10) {
        alerts.push({
          id: 'heavy-rain',
          type: 'error',
          severity: 'high',
          title: 'Heavy Rain Warning',
          message: `Heavy rainfall detected. Risk of flooding. Avoid low-lying areas and drive carefully.`,
          icon: <AlertTriangle className="w-5 h-5" />
        });
      } else {
        alerts.push({
          id: 'rain',
          type: 'info',
          severity: 'low',
          title: 'Rain Advisory',
          message: 'Rain is currently falling. Carry an umbrella and drive carefully.',
          icon: <Info className="w-5 h-5" />
        });
      }
    }

    // Thunderstorm alerts
    if (weather.weather[0].main === 'Thunderstorm') {
      alerts.push({
        id: 'thunderstorm',
        type: 'error',
        severity: 'extreme',
        title: 'THUNDERSTORM WARNING',
        message: 'Thunderstorm activity detected. Seek shelter immediately. Avoid open areas and tall objects.',
        icon: <AlertTriangle className="w-5 h-5" />
      });
    }
    
    // Pleasant weather
    if (weather.main.temp >= 20 && weather.main.temp <= 30 && 
        weather.main.humidity < 70 && weather.wind.speed < 5 && 
        weather.weather[0].main === 'Clear') {
      alerts.push({
        id: 'pleasant',
        type: 'success',
        severity: 'low',
        title: 'Perfect Weather',
        message: 'Excellent weather conditions! Ideal time for outdoor activities and recreation.',
        icon: <CheckCircle className="w-5 h-5" />
      });
    }
    
    return alerts.sort((a, b) => {
      const severityOrder = { extreme: 4, high: 3, medium: 2, low: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  };

  const alerts = generateAlerts(weather);
  
  const getAlertStyles = (type: string, severity: string) => {
    const baseStyles = 'border-l-4';
    
    switch (type) {
      case 'error':
        return `${baseStyles} bg-red-50 border-red-500 text-red-800`;
      case 'warning':
        return `${baseStyles} bg-yellow-50 border-yellow-500 text-yellow-800`;
      case 'info':
        return `${baseStyles} bg-blue-50 border-blue-500 text-blue-800`;
      case 'success':
        return `${baseStyles} bg-green-50 border-green-500 text-green-800`;
      default:
        return `${baseStyles} bg-gray-50 border-gray-500 text-gray-800`;
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-blue-500';
      case 'success':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const getSeverityBadge = (severity: string) => {
    const badges = {
      extreme: 'bg-red-600 text-white',
      high: 'bg-red-500 text-white',
      medium: 'bg-yellow-500 text-white',
      low: 'bg-blue-500 text-white'
    };

    return (
      <span className={`px-2 py-1 text-xs font-bold rounded-full ${badges[severity as keyof typeof badges]}`}>
        {severity.toUpperCase()}
      </span>
    );
  };

  if (alerts.length === 0) {
    return showRealTimeAlerts ? (
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Weather Alerts</h3>
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-600">No weather alerts at this time</p>
          <p className="text-sm text-gray-500 mt-1">Current conditions are within normal ranges</p>
        </div>
      </div>
    ) : null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">Weather Alerts</h3>
        {showRealTimeAlerts && (
          <div className="flex items-center space-x-1 text-xs text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live Updates</span>
          </div>
        )}
      </div>
      
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl ${getAlertStyles(alert.type, alert.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={getIconColor(alert.type)}>
                  {alert.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold">{alert.title}</h4>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <p className="text-sm opacity-90">{alert.message}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherAlerts;