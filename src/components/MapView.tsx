
import { BluetoothEvent } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface MapViewProps {
  event: BluetoothEvent;
  onClose: () => void;
}

export function MapView({ event, onClose }: MapViewProps) {
  const getStatusColor = (status: BluetoothEvent['connectionStatus']) => {
    switch (status) {
      case 'both': return 'bg-green-500';
      case 'left': case 'right': return 'bg-yellow-500';
      case 'disconnected': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: BluetoothEvent['connectionStatus']) => {
    switch (status) {
      case 'both': return 'Both Connected';
      case 'left': return 'Left Only';
      case 'right': return 'Right Only';
      case 'disconnected': return 'Disconnected';
      default: return 'Unknown';
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Event Location</CardTitle>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className={`w-4 h-4 rounded-full ${getStatusColor(event.connectionStatus)}`}></div>
            <span className="font-medium">{event.deviceName}</span>
            <Badge variant="outline">
              {getStatusText(event.connectionStatus)}
            </Badge>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>Time: {event.timestamp.toLocaleString()}</p>
            <p>Coordinates: {event.location.latitude.toFixed(6)}, {event.location.longitude.toFixed(6)}</p>
          </div>

          {/* Simulated map view */}
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <div 
              className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 80% 80%, rgba(34, 197, 94, 0.1) 0%, transparent 50%),
                  radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
                `
              }}
            ></div>
            
            {/* Center marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className={`w-6 h-6 rounded-full ${getStatusColor(event.connectionStatus)} border-2 border-white shadow-lg flex items-center justify-center`}>
                <MapPin className="w-3 h-3 text-white" />
              </div>
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {event.deviceName}
              </div>
            </div>

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="w-full h-full" style={{
                backgroundImage: `
                  linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}></div>
            </div>

            <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-600">
              Simulated Map View
            </div>
          </div>

          <p className="text-xs text-gray-500">
            * In a real app, this would show an interactive Google Maps view with the exact location
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
