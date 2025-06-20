
import { BluetoothEvent } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface EventsListProps {
  events: BluetoothEvent[];
  onViewLocation: (event: BluetoothEvent) => void;
}

export function EventsList({ events, onViewLocation }: EventsListProps) {
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

  if (events.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <MapPin className="w-8 h-8" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Events Yet</h3>
          <p className="text-gray-500">Bluetooth connection events will appear here</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connection Events ({events.length})</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {events.map((event) => (
            <div key={event.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(event.connectionStatus)}`}></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{event.deviceName}</span>
                      <Badge variant="outline" className="text-xs">
                        {getStatusText(event.connectionStatus)}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDistanceToNow(event.timestamp, { addSuffix: true })} • {event.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onViewLocation(event)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <MapPin className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
