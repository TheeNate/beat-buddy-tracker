
import { BluetoothLe, BleDevice, BleService } from '@capacitor/bluetooth-le';
import { BluetoothEvent } from '../types';

export class BluetoothService {
  private deviceId: string | null = null;
  private isScanning = false;
  private targetDeviceName = '';
  private onConnectionChange?: (event: BluetoothEvent) => void;

  async initialize() {
    try {
      await BluetoothLe.initialize();
      console.log('Bluetooth initialized');
    } catch (error) {
      console.error('Failed to initialize Bluetooth:', error);
      throw error;
    }
  }

  setTargetDevice(deviceName: string) {
    this.targetDeviceName = deviceName;
  }

  setConnectionChangeCallback(callback: (event: BluetoothEvent) => void) {
    this.onConnectionChange = callback;
  }

  async startMonitoring() {
    if (this.isScanning) return;
    
    try {
      this.isScanning = true;
      
      // Start scanning for devices
      await BluetoothLe.requestLEScan(
        {
          services: [], // Empty array to scan for all devices
          allowDuplicates: false,
          scanMode: 1 // SCAN_MODE_LOW_POWER for battery efficiency
        },
        (result) => {
          this.handleDeviceFound(result);
        }
      );

      console.log('Started Bluetooth monitoring');
    } catch (error) {
      console.error('Failed to start Bluetooth monitoring:', error);
      this.isScanning = false;
    }
  }

  async stopMonitoring() {
    if (!this.isScanning) return;
    
    try {
      await BluetoothLe.stopLEScan();
      this.isScanning = false;
      console.log('Stopped Bluetooth monitoring');
    } catch (error) {
      console.error('Failed to stop Bluetooth monitoring:', error);
    }
  }

  private async handleDeviceFound(device: BleDevice) {
    if (!device.name || !device.name.includes(this.targetDeviceName)) {
      return;
    }

    try {
      // Try to connect to determine connection status
      await BluetoothLe.connect({ deviceId: device.deviceId });
      
      // Get services to determine if it's left, right, or both
      const services = await BluetoothLe.getServices({ deviceId: device.deviceId });
      const connectionStatus = this.determineConnectionStatus(services);
      
      // Trigger connection event
      if (this.onConnectionChange) {
        const event: Omit<BluetoothEvent, 'location'> = {
          id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          deviceName: device.name,
          connectionStatus
        };
        // Location will be added by the calling service
        this.onConnectionChange(event as BluetoothEvent);
      }

      this.deviceId = device.deviceId;
    } catch (error) {
      // Device disconnected or connection failed
      if (this.onConnectionChange) {
        const event: Omit<BluetoothEvent, 'location'> = {
          id: `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          deviceName: device.name || this.targetDeviceName,
          connectionStatus: 'disconnected'
        };
        this.onConnectionChange(event as BluetoothEvent);
      }
    }
  }

  private determineConnectionStatus(services: BleService[]): BluetoothEvent['connectionStatus'] {
    // This is a simplified implementation
    // In a real app, you'd need to check specific service UUIDs
    // for stereo devices to determine left/right status
    
    // For now, assume 'both' if connected successfully
    return 'both';
  }

  async disconnect() {
    if (this.deviceId) {
      try {
        await BluetoothLe.disconnect({ deviceId: this.deviceId });
        this.deviceId = null;
      } catch (error) {
        console.error('Failed to disconnect:', error);
      }
    }
  }
}

export const bluetoothService = new BluetoothService();
