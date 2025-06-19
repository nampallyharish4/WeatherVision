import React, { useState, useEffect } from 'react';
import { Search, MapPin, X, Loader } from 'lucide-react';
import { majorIndianCities } from '../data/indianCities';
import { LocationData } from '../types/weather';

interface LocationSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect: (lat: number, lon: number, name: string) => void;
}

const LocationSearch: React.FC<LocationSearchProps> = ({ 
  isOpen, 
  onClose, 
  onLocationSelect 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [filteredCities, setFilteredCities] = useState(majorIndianCities);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = majorIndianCities.filter(city =>
        city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        city.state.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(majorIndianCities);
    }
  }, [searchQuery]);

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    onLocationSelect(lat, lon, name);
    onClose();
  };

  const handleCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          handleLocationSelect(latitude, longitude, 'Current Location');
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
          // Fallback to Delhi coordinates
          handleLocationSelect(28.6139, 77.2090, 'Delhi');
        }
      );
    } else {
      setIsLoadingLocation(false);
      // Fallback to Delhi coordinates
      handleLocationSelect(28.6139, 77.2090, 'Delhi');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Select Location</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search cities in India..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
            />
          </div>

          <button
            onClick={handleCurrentLocation}
            disabled={isLoadingLocation}
            className="w-full flex items-center justify-center space-x-2 p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors duration-200 mb-4 disabled:opacity-50"
          >
            {isLoadingLocation ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <MapPin className="w-5 h-5" />
            )}
            <span>{isLoadingLocation ? 'Getting Location...' : 'Use Current Location'}</span>
          </button>

          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredCities.map((city) => (
              <button
                key={`${city.name}-${city.state}`}
                onClick={() => handleLocationSelect(city.lat, city.lon, city.name)}
                className="w-full text-left p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-gray-200"
              >
                <div className="font-medium text-gray-900">{city.name}</div>
                <div className="text-sm text-gray-500">{city.state}</div>
              </button>
            ))}
          </div>

          {filteredCities.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No cities found matching your search</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LocationSearch;