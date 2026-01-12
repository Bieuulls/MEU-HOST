import React from 'react';
import { useThemeSettings } from './contexts/ThemeSettingsContext';
import { ThemeSetting, ThemeSettingOption } from './config/settings_schema';

const ThemeSettingsForm: React.FC = () => {
  const { settings, schema, updateSettings, resetSettings, isLoading } = useThemeSettings();

  if (isLoading) {
    return <div>Loading settings...</div>;
  }

  const handleSettingChange = (settingId: string, value: any) => {
    updateSettings({ [settingId]: value });
  };

  const renderSettingInput = (setting: ThemeSetting) => {
    switch (setting.type) {
      case 'color':
        return (
          <input
            type="color"
            value={settings[setting.id] || setting.default || '#000000'}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="w-full h-10 rounded border border-gray-300"
          />
        );
      case 'text':
        return (
          <input
            type="text"
            value={settings[setting.id] || setting.default || ''}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            placeholder={setting.placeholder}
            className="w-full px-3 py-2 rounded border border-gray-300"
          />
        );
      case 'select':
        return (
          <select
            value={settings[setting.id] || setting.default}
            onChange={(e) => handleSettingChange(setting.id, e.target.value)}
            className="w-full px-3 py-2 rounded border border-gray-300"
          >
            {setting.options?.map((option: ThemeSettingOption) => (
              <option key={String(option.value)} value={String(option.value)}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={settings[setting.id] || setting.default || false}
            onChange={(e) => handleSettingChange(setting.id, e.target.checked)}
            className="w-5 h-5 rounded border border-gray-300"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Theme Settings</h2>
        <button
          onClick={resetSettings}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Reset to Defaults
        </button>
      </div>

      {schema.map((section) => (
        <div key={section.name} className="mb-8">
          <h3 className="text-xl font-semibold mb-4 capitalize">{section.name.replace('_', ' ')}</h3>
          <div className="space-y-4">
            {section.settings.map((setting) => (
              <div key={setting.id} className="flex flex-col">
                <label className="mb-2 font-medium">{setting.label}</label>
                {setting.info && (
                  <p className="text-sm text-gray-500 mb-2">{setting.info}</p>
                )}
                {renderSettingInput(setting)}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ThemeSettingsForm;