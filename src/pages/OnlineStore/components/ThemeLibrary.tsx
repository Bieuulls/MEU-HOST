import React from 'react';

export const ThemeLibrary: React.FC = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-medium mb-4">Theme library</h2>
      <p className="text-gray-500">
        Try out new themes, work on seasonal versions, or test changes to your current theme.
      </p>
      <div className="mt-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <p className="text-gray-500">No themes available in your library</p>
          <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#404040] rounded-md hover:bg-[#303030]">
            Add theme
          </button>
        </div>
      </div>
    </div>
  );
};
