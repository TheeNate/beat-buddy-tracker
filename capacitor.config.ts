
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.beatbuddytracker',
  appName: 'Beat Buddy Tracker',
  webDir: 'dist',
  server: {
    url: 'https://a9bc7122-c9fc-45da-a8f1-6bc6a4413198.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: "Scanning for Bluetooth devices...",
        cancel: "Cancel",
        availableDevices: "Available devices",
        noDeviceFound: "No Bluetooth device found"
      }
    },
    Geolocation: {
      permissions: {
        location: "always"
      }
    },
    BackgroundMode: {
      notificationTitle: "Beat Buddy Tracker",
      notificationText: "Monitoring Bluetooth connections",
      enableWebViewOptimizations: true
    }
  }
};

export default config;
