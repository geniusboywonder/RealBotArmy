import React from 'react';
import { Agent } from '../../types';
import AgentStatusIndicator from '../AgentConsole/AgentStatusIndicator';

interface TabNavigationProps {
  agents: Agent[];
  activeTab: string;
  onTabChange: (agentId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  agents,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <nav className="flex space-x-8 px-6">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => onTabChange(agent.id)}
            className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
              activeTab === agent.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <span>{agent.name}</span>
              <AgentStatusIndicator agent={agent} />
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
