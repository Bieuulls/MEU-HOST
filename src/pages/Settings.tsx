import React, { useState } from 'react';
import { Check, X } from 'lucide-react';

const GeneralSettings = () => (
  <div>
    <p>General settings content here</p>
  </div>
);

const ShippingSettings = () => (
  <div>
    <p>Shipping settings content here</p>
  </div>
);

const PaymentSettings = () => (
  <div>
    <p>Payment settings content here</p>
  </div>
);

const sections = [
  { id: 'general', title: 'General', content: <GeneralSettings /> },
  { id: 'shipping', title: 'Shipping', content: <ShippingSettings /> },
  { id: 'payments', title: 'Payments', content: <PaymentSettings /> },
  // Add more sections as needed
];

export const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('general');

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="flex border-b mb-6">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-6 py-3 text-sm font-medium ${
              activeSection === section.id
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {section.title}
          </button>
        ))}
      </div>

      <div className="p-4 border rounded-lg">
        {sections.find((section) => section.id === activeSection)?.content}
      </div>

      <div className="mt-6 flex justify-end">
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
          Cancel
        </button>
        <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Save
        </button>
      </div>
    </div>
  );
};
