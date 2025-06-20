
import { useState, useEffect, useCallback } from 'react';
import { BluetoothEvent, BluetoothDevice, AppSettings } from '../types';
import { toast } from 'sonner';

export const useBluetoothTracking = () => {
  const [events, setEvents] = useState<BluetoothEvent[]>([]);
  const [currentDevice, setCurrentDevice] = useState<BluetoothDevice | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    deviceName: 'Beats Studio3',
    trackingEnabled: true,
    locationEnabled: true,
  });
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulate getting current location
  const getCurrentLocation = useCallback((): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => {
            // Fallback to simulated location (San Francisco)
            resolve({
              latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
              longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
            });
          }
        );
      } else {
        // Fallback location
        resolve({
          latitude: 37.7749 + (Math.random() - 0.5) * 0.01,
          longitude: -122.4194 + (Math.random() - 0.5) * 0.01,
        });
      }
    });
  }, []);

  // Create a new Bluetooth event
  const createEvent = useCallback(async (status: BluetoothEvent['connectionStatus']) => {
    if (!settings.trackingEnabled) return;

    const location = await getCurrentLocation();
    const newEvent: BluetoothEvent = {
      id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      deviceName: settings.deviceName,
      connectionStatus: status,
      location,
    };

    setEvents(prev => [newEvent, ...prev]);
    
    const statusText = {
      'both': 'Both earbuds connected',
      'left': 'Left earbud only',
      'right': 'Right earbud only',
      'disconnected': 'Disconnected'
    }[status];

    toast.success(`${settings.deviceName}: ${statusText}`, {
      description: `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
    });
  }, [settings, getCurrentLocation]);

  // Simulate Bluetooth device connection changes
  const simulateConnection = useCallback(() => {
    if (!settings.trackingEnabled) return;

    const statuses: BluetoothEvent['connectionStatus'][] = ['both', 'left', 'right', 'disconnected'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    setCurrentDevice({
      name: settings.deviceName,
      connected: randomStatus !== 'disconnected',
      leftConnected: randomStatus === 'both' || randomStatus === 'left',
      rightConnected: randomStatus === 'both' || randomStatus === 'right',
      lastSeen: new Date(),
    });

    createEvent(randomStatus);
  }, [settings.trackingEnabled, settings.deviceName, createEvent]);

  // Start/stop simulation
  const toggleSimulation = useCallback(() => {
    setIsSimulating(prev => !prev);
  }, []);

  // Auto-simulation effect
  useEffect(() => {
    if (!isSimulating || !settings.trackingEnabled) return;

    const interval = setInterval(() => {
      simulateConnection();
    }, Math.random() * 10000 + 5000); // Random interval between 5-15 seconds

    return () => clearInterval(interval);
  }, [isSimulating, settings.trackingEnabled, simulateConnection]);

  // Export events to CSV
  const exportToCSV = useCallback(() => {
    if (events.length === 0) {
      toast.error('No events to export');
      return;
    }

    const headers = ['Timestamp', 'Device Name', 'Connection Status', 'Latitude', 'Longitude'];
    const csvContent = [
      headers.join(','),
      ...events.map(event => [
        event.timestamp.toISOString(),
        `"${event.deviceName}"`,
        event.connectionStatus,
        event.location.latitude,
        event.location.longitude,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `bluetooth-events-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Events exported to CSV');
    }
  }, [events]);

  return {
    events,
    currentDevice,
    settings,
    isSimulating,
    setSettings,
    simulateConnection,
    toggleSimulation,
    exportToCSV,
  };
};
