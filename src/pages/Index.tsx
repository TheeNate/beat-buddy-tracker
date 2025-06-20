import { useState } from 'react';
import { useNativeBluetoothTracking } from '../hooks/useNativeBluetoothTracking';
import { ConnectionStatus } from '../components/ConnectionStatus';
import { EventsList } from '../components/EventsList';
import { MapView } from '../components/MapView';
import { SettingsPanel } from '../components/SettingsPanel';
import { BluetoothEvent } from '../types';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const {
    events,
    currentDevice,
    settings,
    isTracking,
    isInitialized,
    setSettings,
    startTracking,
    stopTracking,
    exportToCSV,
  } = useNativeBluetoothTracking();

  const [selectedEvent, setSelectedEvent] = useState<BluetoothEvent | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="gradient-beat text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Beat Buddy Tracker</h1>
              <p className="text-white/80">Native Android Bluetooth Tracker</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {events.length} events logged
              </Badge>
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {isInitialized ? (isTracking ? 'Tracking Active' : 'Ready') : 'Initializing...'}
              </Badge>
              <Button
                onClick={isTracking ? stopTracking : startTracking}
                variant={isTracking ? "destructive" : "secondary"}
                size="lg"
                disabled={!isInitialized}
              >
                {isTracking ? 'Stop Tracking' : 'Start Tracking'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Current Status */}
        <div className="mb-8">
          <ConnectionStatus device={currentDevice} isSimulating={isTracking} />
        </div>

        {/* Native Features Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Native Android Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isInitialized ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span>Native Services: {isInitialized ? 'Ready' : 'Initializing'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>Bluetooth Monitoring: {isTracking ? 'Active' : 'Stopped'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${settings.locationEnabled ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span>GPS Tracking: {settings.locationEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events">Events Log</TabsTrigger>
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-6">
            <EventsList 
              events={events} 
              onViewLocation={setSelectedEvent}
            />
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            {selectedEvent ? (
              <MapView 
                event={selectedEvent} 
                onClose={() => setSelectedEvent(null)}
              />
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-gray-400 mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">🗺️</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">Select an Event</h3>
                  <p className="text-gray-500">Choose an event from the Events Log to view its location</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SettingsPanel
              settings={settings}
              onSettingsChange={setSettings}
              onExportCSV={exportToCSV}
            />
          </TabsContent>
        </Tabs>

        {/* Updated Technical Note */}
        <Card className="mt-8 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-green-900 mb-2">✅ Native Android App Ready</h3>
            <p className="text-green-700 text-sm mb-3">
              This app now uses Capacitor with native Android services for real Bluetooth and GPS tracking. 
              The native features include background monitoring, proper permissions, and local database storage.
            </p>
            <div className="text-green-600 text-xs space-y-1">
              <div>• Real Bluetooth Low Energy scanning and device monitoring</div>
              <div>• Native GPS location services with battery optimization</div>
              <div>• Local SQLite database for persistent event storage</div>
              <div>• Native file system access for CSV export to Documents folder</div>
              <div>• Background service capabilities for continuous monitoring</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
