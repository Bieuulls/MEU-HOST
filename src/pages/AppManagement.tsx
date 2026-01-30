import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';

interface App {
  id: string;
  name: string;
  description: string;
  installed: boolean;
}

const apps: App[] = [
  { id: '1', name: 'Shopify Analytics', description: 'Detailed sales data', installed: true },
  { id: '2', name: 'Email Marketing', description: 'Send marketing emails', installed: false },
  { id: '3', name: 'Custom App 1', description: 'Your custom app', installed: false },
  // Add more apps here
];

export const AppManagement: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">App Management</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search apps..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
          </div>
          <button
            onClick={() => setIsAddAppModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add App
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  App Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{app.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{app.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {app.installed ? (
                      <span className="text-green-600">Installed</span>
                    ) : (
                      <button className="text-blue-600 hover:text-blue-900">Install</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add App Modal (Placeholder) */}
      {isAddAppModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Add New App</h2>
            <p>Add app functionality here</p>
            <button onClick={() => setIsAddAppModalOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
