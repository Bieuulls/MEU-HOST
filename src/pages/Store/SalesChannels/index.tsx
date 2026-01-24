import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SalesChannel {
  id: string;
  name: string;
  type: 'online_store' | 'marketplace' | 'social_media';
  status: 'active' | 'inactive';
  settings: Record<string, any>;
}

const SalesChannels: React.FC = () => {
  const [channels, setChannels] = useState<SalesChannel[]>([
    {
      id: '1',
      name: 'Online Store',
      type: 'online_store',
      status: 'active',
      settings: {
        domain: 'mystore.com',
        theme: 'default'
      }
    }
  ]);

  const handleAddChannel = () => {
    // Implementation for adding new sales channel
    console.log('Add new channel');
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sales Channels</h1>
        <Button onClick={handleAddChannel}>
          <Plus className="w-4 h-4 mr-2" />
          Add Channel
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <Card key={channel.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {channel.name}
                <span className={`text-sm px-2 py-1 rounded ${channel.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                  {channel.status}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Type: {channel.type}</p>
                {channel.type === 'online_store' && (
                  <>
                    <p className="text-sm text-gray-600">Domain: {channel.settings.domain}</p>
                    <p className="text-sm text-gray-600">Theme: {channel.settings.theme}</p>
                  </>
                )}
              </div>
              <div className="mt-4 space-x-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SalesChannels;