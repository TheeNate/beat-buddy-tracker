
import { BluetoothDevice } from '../types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConnectionStatusProps {
  device: BluetoothDevice | null;
  isSimulating: boolean;
}

export function ConnectionStatus({ device, isSimulating }: ConnectionStatusProps) {
  if (!device) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-gray-400"></div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-500">No Device Connected</h3>
              <p className="text-sm text-gray-400">Waiting for Bluetooth device...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getConnectionColor = () => {
    if (!device.connected) return 'bg-red-500';
    if (device.leftConnected && device.rightConnected) return 'bg-green-500';
    return 'bg-yellow-500';
  };

  const getConnectionText = () => {
    if (!device.connected) return 'Disconnected';
    if (device.leftConnected && device.rightConnected) return 'Both Connected';
    if (device.leftConnected) return 'Left Only';
    if (device.rightConnected) return 'Right Only';
    return 'Connected';
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-16 h-16 rounded-full ${getConnectionColor()} flex items-center justify-center ${device.connected ? 'beat-pulse' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm"></div>
              </div>
              {device.connected && isSimulating && (
                <div className={`absolute inset-0 rounded-full ${getConnectionColor()} pulse-ring`}></div>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold">{device.name}</h3>
              <p className="text-sm text-muted-foreground">
                Last seen: {device.lastSeen.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <Badge variant={device.connected ? 'default' : 'secondary'} className="mb-2">
              {getConnectionText()}
            </Badge>
            <div className="flex space-x-2">
              <div className={`w-3 h-3 rounded-full ${device.leftConnected ? 'bg-green-500' : 'bg-gray-300'}`} title="Left Earbud"></div>
              <div className={`w-3 h-3 rounded-full ${device.rightConnected ? 'bg-green-500' : 'bg-gray-300'}`} title="Right Earbud"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
