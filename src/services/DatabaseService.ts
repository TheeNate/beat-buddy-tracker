
import { BluetoothEvent, AppSettings } from '../types';

// For now, we'll use localStorage as a bridge until we can integrate proper SQLite
// In a real Android app, this would use Capacitor SQLite plugin

export class DatabaseService {
  private readonly EVENTS_KEY = 'bluetooth_events';
  private readonly SETTINGS_KEY = 'app_settings';

  async initialize() {
    console.log('Database service initialized');
  }

  async saveEvent(event: BluetoothEvent): Promise<void> {
    try {
      const events = await this.getEvents();
      events.unshift(event);
      localStorage.setItem(this.EVENTS_KEY, JSON.stringify(events));
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  }

  async getEvents(): Promise<BluetoothEvent[]> {
    try {
      const stored = localStorage.getItem(this.EVENTS_KEY);
      if (!stored) return [];
      
      const events = JSON.parse(stored);
      // Convert timestamp strings back to Date objects
      return events.map((event: any) => ({
        ...event,
        timestamp: new Date(event.timestamp)
      }));
    } catch (error) {
      console.error('Failed to get events:', error);
      return [];
    }
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }

  async getSettings(): Promise<AppSettings> {
    try {
      const stored = localStorage.getItem(this.SETTINGS_KEY);
      if (!stored) {
        return {
          deviceName: 'Beats Studio3',
          trackingEnabled: true,
          locationEnabled: true,
        };
      }
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to get settings:', error);
      return {
        deviceName: 'Beats Studio3',
        trackingEnabled: true,
        locationEnabled: true,
      };
    }
  }

  async clearEvents(): Promise<void> {
    localStorage.removeItem(this.EVENTS_KEY);
  }
}

export const databaseService = new DatabaseService();
