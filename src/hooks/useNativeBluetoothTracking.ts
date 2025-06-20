
import { useState, useEffect, useCallback } from 'react';
import { BluetoothEvent, BluetoothDevice, AppSettings } from '../types';
import { toast } from 'sonner';
import { bluetoothService } from '../services/BluetoothService';
import { locationService } from '../services/LocationService';
import { databaseService } from '../services/DatabaseService';
import { fileService } from '../services/FileService';

export const useNativeBluetoothTracking = () => {
  const [events, setEvents] = useState<BluetoothEvent[]>([]);
  const [currentDevice, setCurrentDevice] = useState<BluetoothDevice | null>(null);
  const [settings, setSettings] = useState<AppSettings>({
    deviceName: 'Beats Studio3',
    trackingEnabled: true,
    locationEnabled: true,
  });
  const [isTracking, setIsTracking] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize all services
  const initializeServices = useCallback(async () => {
    try {
      await databaseService.initialize();
      await bluetoothService.initialize();
      await locationService.initialize();
      await fileService.requestPermissions();
      
      // Load saved data
      const savedSettings = await databaseService.getSettings();
      const savedEvents = await databaseService.getEvents();
      
      setSettings(savedSettings);
      setEvents(savedEvents);
      
      bluetoothService.setTargetDevice(savedSettings.deviceName);
      setIsInitialized(true);
      
      console.log('All services initialized successfully');
    } catch (error) {
      console.error('Failed to initialize services:', error);
      toast.error('Failed to initialize native services');
    }
  }, []);

  // Handle Bluetooth connection events
  const handleConnectionEvent = useCallback(async (eventData: Omit<BluetoothEvent, 'location'>) => {
    if (!settings.trackingEnabled) return;

    try {
      // Get current location if enabled
      let location = { latitude: 0, longitude: 0 };
      if (settings.locationEnabled) {
        location = await locationService.getCurrentPosition();
      }

      const event: BluetoothEvent = {
        ...eventData,
        location
      };

      // Save to database
      await databaseService.saveEvent(event);
      
      // Update state
      setEvents(prev => [event, ...prev]);
      
      // Update current device status
      setCurrentDevice({
        name: event.deviceName,
        connected: event.connectionStatus !== 'disconnected',
        leftConnected: event.connectionStatus === 'both' || event.connectionStatus === 'left',
        rightConnected: event.connectionStatus === 'both' || event.connectionStatus === 'right',
        lastSeen: event.timestamp,
      });

      const statusText = {
        'both': 'Both earbuds connected',
        'left': 'Left earbud only',
        'right': 'Right earbud only',
        'disconnected': 'Disconnected'
      }[event.connectionStatus];

      toast.success(`${event.deviceName}: ${statusText}`, {
        description: settings.locationEnabled 
          ? `Location: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
          : 'Location tracking disabled',
      });
    } catch (error) {
      console.error('Failed to handle connection event:', error);
      toast.error('Failed to log connection event');
    }
  }, [settings]);

  // Start native tracking
  const startTracking = useCallback(async () => {
    if (!isInitialized || isTracking) return;

    try {
      bluetoothService.setConnectionChangeCallback(handleConnectionEvent);
      await bluetoothService.startMonitoring();
      setIsTracking(true);
      toast.success('Started native Bluetooth tracking');
    } catch (error) {
      console.error('Failed to start tracking:', error);
      toast.error('Failed to start Bluetooth tracking');
    }
  }, [isInitialized, isTracking, handleConnectionEvent]);

  // Stop native tracking
  const stopTracking = useCallback(async () => {
    if (!isTracking) return;

    try {
      await bluetoothService.stopMonitoring();
      setIsTracking(false);
      toast.success('Stopped native Bluetooth tracking');
    } catch (error) {
      console.error('Failed to stop tracking:', error);
      toast.error('Failed to stop Bluetooth tracking');
    }
  }, [isTracking]);

  // Update settings
  const updateSettings = useCallback(async (newSettings: AppSettings) => {
    try {
      await databaseService.saveSettings(newSettings);
      setSettings(newSettings);
      bluetoothService.setTargetDevice(newSettings.deviceName);
      
      // Restart tracking if device name changed
      if (isTracking && newSettings.deviceName !== settings.deviceName) {
        await stopTracking();
        setTimeout(() => startTracking(), 1000);
      }
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast.error('Failed to save settings');
    }
  }, [settings, isTracking, startTracking, stopTracking]);

  // Export to CSV using native file system
  const exportToCSV = useCallback(async () => {
    try {
      await fileService.exportEventsToCSV(events);
      toast.success('Events exported to Documents folder');
    } catch (error) {
      console.error('Failed to export CSV:', error);
      toast.error('Failed to export events');
    }
  }, [events]);

  // Initialize on mount
  useEffect(() => {
    initializeServices();
  }, [initializeServices]);

  // Auto-start tracking when enabled
  useEffect(() => {
    if (isInitialized && settings.trackingEnabled && !isTracking) {
      startTracking();
    } else if (isInitialized && !settings.trackingEnabled && isTracking) {
      stopTracking();
    }
  }, [isInitialized, settings.trackingEnabled, isTracking, startTracking, stopTracking]);

  return {
    events,
    currentDevice,
    settings,
    isTracking,
    isInitialized,
    setSettings: updateSettings,
    startTracking,
    stopTracking,
    exportToCSV,
  };
};
