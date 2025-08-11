import React from 'react';
import { Agent } from '../../types';

interface AgentStatusIndicatorProps {
  agent: Agent;
}

const AgentStatusIndicator: React.FC<AgentStatusIndicatorProps> = ({ agent }) => {
  const statusConfig = {
    idle: { color: 'gray', icon: '⚪', label: 'Idle' },
    thinking: { color: 'yellow', icon: '🟡', label: 'Processing' },
    waiting: { color: 'blue', icon: '🔵', label: 'Waiting' },
    error: { color: 'red', icon: '🔴', label: 'Error' },
  };

  const config = statusConfig[agent.status];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-lg">{config.icon}</span>
      <span className="text-xs text-gray-500">
        {agent.confidence > 0 && `${Math.round(agent.confidence * 100)}%`}
      </span>
    </div>
  );
};

export default AgentStatusIndicator;
