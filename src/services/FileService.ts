
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { BluetoothEvent } from '../types';

export class FileService {
  async exportEventsToCSV(events: BluetoothEvent[]): Promise<void> {
    if (events.length === 0) {
      throw new Error('No events to export');
    }

    try {
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

      const fileName = `bluetooth-events-${new Date().toISOString().split('T')[0]}.csv`;

      await Filesystem.writeFile({
        path: fileName,
        data: csvContent,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });

      console.log('CSV file exported successfully:', fileName);
    } catch (error) {
      console.error('Failed to export CSV:', error);
      throw error;
    }
  }

  async requestPermissions(): Promise<void> {
    try {
      const permissions = await Filesystem.requestPermissions();
      if (permissions.publicStorage !== 'granted') {
        throw new Error('File system permission not granted');
      }
    } catch (error) {
      console.error('Failed to request file permissions:', error);
      throw error;
    }
  }
}

export const fileService = new FileService();
