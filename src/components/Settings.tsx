import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Card, Title, TextInput, Select, SelectItem, Button, ColorPicker } from '@tremor/react';
import api from '../utils/api';

interface Settings {
  companyName: string;
  timezone: string;
  dateFormat: string;
  primaryColor: string;
  secondaryColor: string;
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    companyName: '',
    timezone: '',
    dateFormat: '',
    primaryColor: '',
    secondaryColor: '',
  });
  const { theme, updateTheme } = useTheme();

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSettingChange = (key: keyof Settings, value: string) => {
    setSettings({ ...settings, [key]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/settings', settings);
      updateTheme({
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
      });
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <Card>
      <Title>Settings</Title>
      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
            Company Name
          </label>
          <TextInput
            id="companyName"
            value={settings.companyName}
            onChange={(e) => handleSettingChange('companyName', e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
            Timezone
          </label>
          <Select
            id="timezone"
            value={settings.timezone}
            onValueChange={(value) => handleSettingChange('timezone', value)}
          >
            <SelectItem value="UTC">UTC</SelectItem>
            <SelectItem value="America/New_York">Eastern Time</SelectItem>
            <SelectItem value="America/Chicago">Central Time</SelectItem>
            <SelectItem value="America/Denver">Mountain Time</SelectItem>
            <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
          </Select>
        </div>

        <div>
          <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
            Date Format
          </label>
          <Select
            id="dateFormat"
            value={settings.dateFormat}
            onValueChange={(value) => handleSettingChange('dateFormat', value)}
          >
            <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
            <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
            <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
          </Select>
        </div>

        <div>
          <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700">
            Primary Color
          </label>
          <ColorPicker
            color={settings.primaryColor}
            onValueChange={(value) => handleSettingChange('primaryColor', value)}
          />
        </div>

        <div>
          <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700">
            Secondary Color
          </label>
          <ColorPicker
            color={settings.secondaryColor}
            onValueChange={(value) => handleSettingChange('secondaryColor', value)}
          />
        </div>

        <div>
          <Button type="submit" style={{ backgroundColor: theme.primaryColor }}>
            Save Settings
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Settings;