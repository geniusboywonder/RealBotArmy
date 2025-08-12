import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">BotArmy</h1>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Connected</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="btn-secondary">View Spec</button>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Project:</span>
            <span className="font-medium">Default POC</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
