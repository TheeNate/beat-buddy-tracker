
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

      // For web environment, use browser download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', fileName);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);

      console.log('CSV file exported successfully:', fileName);
    } catch (error) {
      console.error('Failed to export CSV:', error);
      throw error;
    }
  }

  async requestPermissions(): Promise<void> {
    try {
      // In web environment, no explicit file permissions needed for downloads
      console.log('File permissions handled by browser');
    } catch (error) {
      console.error('Failed to request file permissions:', error);
      throw error;
    }
  }
}

export const fileService = new FileService();
