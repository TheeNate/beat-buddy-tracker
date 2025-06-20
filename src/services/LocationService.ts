
import { BluetoothEvent } from '../types';

// Mock position interface for web environment
interface Position {
  coords: {
    latitude: number;
    longitude: number;
  };
}

export class LocationService {
  private watchId: string | null = null;

  async initialize() {
    try {
      // Check if geolocation is available in the browser
      if ('geolocation' in navigator) {
        console.log('Location service initialized (browser geolocation)');
      } else {
        console.log('Location service initialized (fallback mode)');
      }
    } catch (error) {
      console.error('Failed to initialize location service:', error);
      throw error;
    }
  }

  async getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    try {
      if ('geolocation' in navigator) {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            },
            (error) => {
              console.error('Geolocation error:', error);
              // Return fallback location (San Francisco)
              resolve({
                latitude: 37.7749,
                longitude: -122.4194
              });
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 300000
            }
          );
        });
      } else {
        // Return fallback location if geolocation is not available
        return {
          latitude: 37.7749,
          longitude: -122.4194
        };
      }
    } catch (error) {
      console.error('Failed to get current position:', error);
      // Return fallback location
      return {
        latitude: 37.7749,
        longitude: -122.4194
      };
    }
  }

  async startWatching(callback: (position: Position) => void) {
    if (this.watchId || !('geolocation' in navigator)) return;

    try {
      const watchId = navigator.geolocation.watchPosition(
        callback,
        (error) => {
          console.error('Location watching error:', error);
        },
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 600000
        }
      );
      
      this.watchId = watchId.toString();
      console.log('Started location watching');
    } catch (error) {
      console.error('Failed to start location watching:', error);
    }
  }

  async stopWatching() {
    if (this.watchId && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(parseInt(this.watchId));
      this.watchId = null;
      console.log('Stopped location watching');
    }
  }
}

export const locationService = new LocationService();
