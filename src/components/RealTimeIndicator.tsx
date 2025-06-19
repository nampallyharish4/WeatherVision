import React from 'react';
import { RefreshCw, Wifi, WifiOff, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface RealTimeIndicatorProps {
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const RealTimeIndicator: React.FC<RealTimeIndicatorProps> = ({
  lastUpdated,
  isLoading,
  error,
  onRefresh
}) => {
  const getStatusColor = () => {
    if (error) return 'text-red-500';
    if (isLoading) return 'text-blue-500';
    return 'text-green-500';
  };

  const getStatusIcon = () => {
    if (error) return <WifiOff className="w-4 h-4" />;
    if (isLoading) return <RefreshCw className="w-4 h-4 animate-spin" />;
    return <Wifi className="w-4 h-4" />;
  };

  const getStatusText = () => {
    if (error) return 'Connection Error';
    if (isLoading) return 'Updating...';
    if (lastUpdated) {
      return `Updated ${formatDistanceToNow(lastUpdated, { addSuffix: true })}`;
    }
    return 'Real-time Data';
  };

  return (
    <div className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2">
        <div className={getStatusColor()}>
          {getStatusIcon()}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Live Weather</p>
          <p className={`text-xs ${getStatusColor()}`}>
            {getStatusText()}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {lastUpdated && (
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="w-3 h-3" />
            <span className="text-xs">
              {lastUpdated.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        )}
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
          title="Refresh weather data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
    </div>
  );
};

export default RealTimeIndicator;