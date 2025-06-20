
import { useState } from 'react';
import { useBluetoothTracking } from '../hooks/useBluetoothTracking';
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
    isSimulating,
    setSettings,
    simulateConnection,
    toggleSimulation,
    exportToCSV,
  } = useBluetoothTracking();

  const [selectedEvent, setSelectedEvent] = useState<BluetoothEvent | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="gradient-beat text-white py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Beat Buddy Tracker</h1>
              <p className="text-white/80">Monitor your Bluetooth device connections</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                {events.length} events logged
              </Badge>
              <Button
                onClick={toggleSimulation}
                variant={isSimulating ? "destructive" : "secondary"}
                size="lg"
              >
                {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Current Status */}
        <div className="mb-8">
          <ConnectionStatus device={currentDevice} isSimulating={isSimulating} />
        </div>

        {/* Demo Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Demo Controls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={simulateConnection} 
                variant="outline"
                disabled={!settings.trackingEnabled}
              >
                Simulate Connection Event
              </Button>
              <Button 
                onClick={() => setSelectedEvent(events[0] || null)} 
                variant="outline"
                disabled={events.length === 0}
              >
                View Latest Event Location
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              * This is a web simulation. The real Android app would automatically detect Bluetooth events.
            </p>
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

        {/* Technical Note */}
        <Card className="mt-8 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-blue-900 mb-2">🚀 Ready for Mobile Conversion</h3>
            <p className="text-blue-700 text-sm">
              This web app can be converted to a native Android app using Capacitor. The real Android implementation would include:
              native Bluetooth APIs, background services, precise GPS tracking, and full Google Maps integration.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
