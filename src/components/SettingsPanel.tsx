
import { AppSettings } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface SettingsPanelProps {
  settings: AppSettings;
  onSettingsChange: (settings: AppSettings) => void;
  onExportCSV: () => void;
}

export function SettingsPanel({ settings, onSettingsChange, onExportCSV }: SettingsPanelProps) {
  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="deviceName">Bluetooth Device Name</Label>
          <Input
            id="deviceName"
            value={settings.deviceName}
            onChange={(e) => updateSetting('deviceName', e.target.value)}
            placeholder="e.g., Beats Studio3"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="tracking">Enable Tracking</Label>
            <div className="text-sm text-muted-foreground">
              Monitor Bluetooth connection events
            </div>
          </div>
          <Switch
            id="tracking"
            checked={settings.trackingEnabled}
            onCheckedChange={(checked) => updateSetting('trackingEnabled', checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="location">Enable Location</Label>
            <div className="text-sm text-muted-foreground">
              Record GPS coordinates with events
            </div>
          </div>
          <Switch
            id="location"
            checked={settings.locationEnabled}
            onCheckedChange={(checked) => updateSetting('locationEnabled', checked)}
          />
        </div>

        <div className="pt-4 border-t">
          <Button onClick={onExportCSV} variant="outline" className="w-full">
            Export Events to CSV
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
