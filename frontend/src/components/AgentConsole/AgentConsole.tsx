import React from 'react';
import ConversationView from './ConversationView';

interface AgentConsoleProps {
  agentId: string;
}

const AgentConsole: React.FC<AgentConsoleProps> = ({ agentId }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 capitalize">
          {agentId} Console
        </h2>
        <div className="flex space-x-2">
          <button className="btn-secondary text-sm">Clear History</button>
          <button className="btn-primary text-sm">Send Message</button>
        </div>
      </div>

      <div className="flex-1 card">
        <ConversationView agentId={agentId} />
      </div>
    </div>
  );
};

export default AgentConsole;
