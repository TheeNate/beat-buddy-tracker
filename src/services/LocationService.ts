
import { Geolocation, Position } from '@capacitor/geolocation';

export class LocationService {
  private watchId: string | null = null;

  async initialize() {
    try {
      // Request permissions
      const permissions = await Geolocation.requestPermissions();
      if (permissions.location !== 'granted') {
        throw new Error('Location permission not granted');
      }
      console.log('Location service initialized');
    } catch (error) {
      console.error('Failed to initialize location service:', error);
      throw error;
    }
  }

  async getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false, // Use network location for battery efficiency
        timeout: 10000,
        maximumAge: 300000 // Cache for 5 minutes
      });

      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };
    } catch (error) {
      console.error('Failed to get current position:', error);
      // Return a fallback location (San Francisco)
      return {
        latitude: 37.7749,
        longitude: -122.4194
      };
    }
  }

  async startWatching(callback: (position: Position) => void) {
    if (this.watchId) return;

    try {
      this.watchId = await Geolocation.watchPosition(
        {
          enableHighAccuracy: false,
          timeout: 30000,
          maximumAge: 600000 // Cache for 10 minutes for battery efficiency
        },
        callback
      );
      console.log('Started location watching');
    } catch (error) {
      console.error('Failed to start location watching:', error);
    }
  }

  async stopWatching() {
    if (this.watchId) {
      await Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
      console.log('Stopped location watching');
    }
  }
}

export const locationService = new LocationService();
