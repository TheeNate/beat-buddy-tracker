
export interface BluetoothEvent {
  id: string;
  timestamp: Date;
  deviceName: string;
  connectionStatus: 'both' | 'left' | 'right' | 'disconnected';
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}

export interface AppSettings {
  deviceName: string;
  trackingEnabled: boolean;
  locationEnabled: boolean;
}

export interface BluetoothDevice {
  name: string;
  connected: boolean;
  leftConnected: boolean;
  rightConnected: boolean;
  lastSeen: Date;
}
