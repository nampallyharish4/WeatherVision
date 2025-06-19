import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { majorIndianCities } from '../data/indianCities';
import { getWeatherSeverity } from '../utils/weatherHelpers';
import { mockWeatherData } from '../utils/weatherApi';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WeatherMapProps {
  currentLocation: { lat: number; lon: number };
  onLocationSelect: (lat: number, lon: number, name: string) => void;
}

const WeatherMap: React.FC<WeatherMapProps> = ({ currentLocation, onLocationSelect }) => {
  const mapRef = useRef<L.Map | null>(null);

  // Custom marker icons based on weather severity
  const createWeatherIcon = (severity: string, color: string) => {
    return new L.DivIcon({
      className: 'custom-weather-marker',
      html: `<div style="background-color: ${color}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.2);"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
  };

  const MapController = () => {
    const map = useMap();
    
    useEffect(() => {
      mapRef.current = map;
      map.setView([currentLocation.lat, currentLocation.lon], 10);
    }, [map, currentLocation]);

    return null;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden" style={{ position: 'relative', zIndex: 1 }}>
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-xl font-bold text-gray-900">Interactive Weather Map</h3>
        <p className="text-sm text-gray-500">Click on any city to view detailed weather information</p>
      </div>
      
      <div style={{ height: '500px', width: '100%', position: 'relative', zIndex: 1 }}>
        <MapContainer
          center={[20.5937, 78.9629]} // Center of India
          zoom={5}
          style={{ height: '100%', width: '100%', zIndex: 1 }}
          zoomControl={true}
        >
          <MapController />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Current location marker */}
          <Marker
            position={[currentLocation.lat, currentLocation.lon]}
            icon={new L.Icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
              shadowSize: [41, 41]
            })}
          >
            <Popup>
              <div className="text-center">
                <p className="font-semibold">Your Location</p>
                <p className="text-sm text-gray-600">Current position</p>
              </div>
            </Popup>
          </Marker>

          {/* Major cities with weather indicators */}
          {majorIndianCities.map((city) => {
            // For demo purposes, using mock weather data with some variation
            const severity = getWeatherSeverity(mockWeatherData.weather, 
              city.name.includes('Mumbai') ? { '1h': 2 } : undefined);
            
            return (
              <Marker
                key={`${city.name}-${city.state}`}
                position={[city.lat, city.lon]}
                icon={createWeatherIcon(severity.level, severity.color)}
                eventHandlers={{
                  click: () => {
                    onLocationSelect(city.lat, city.lon, city.name);
                  }
                }}
              >
                <Popup>
                  <div className="text-center">
                    <p className="font-semibold">{city.name}</p>
                    <p className="text-sm text-gray-600">{city.state}</p>
                    <div className="mt-2 p-2 rounded" style={{ backgroundColor: severity.color + '20', color: severity.color }}>
                      <p className="text-xs font-medium">{severity.description}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
      
      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Weather Severity Legend</h4>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Clear Sky</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span>Light Rain</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Moderate Rain</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Heavy Rain</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 rounded-full bg-gray-500"></div>
            <span>Cloudy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherMap;