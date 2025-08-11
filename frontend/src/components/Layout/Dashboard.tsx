import React, { useState } from 'react';
import Header from './Header';
import TabNavigation from './TabNavigation';
import AgentConsole from '../AgentConsole/AgentConsole';
import ActionQueue from '../ActionQueue/ActionQueue';
import { Agent } from '../../types';

// Mock data for initial development
const mockAgents: Agent[] = [
  {
    id: 'analyst',
    type: 'analyst',
    name: 'Requirements Analyst',
    status: 'idle',
    lastActivity: new Date().toISOString(),
    confidence: 0.0,
  },
  {
    id: 'architect',
    type: 'architect',
    name: 'System Architect',
    status: 'idle',
    lastActivity: new Date().toISOString(),
    confidence: 0.0,
  },
  {
    id: 'developer',
    type: 'developer',
    name: 'Full-Stack Developer',
    status: 'idle',
    lastActivity: new Date().toISOString(),
    confidence: 0.0,
  },
  {
    id: 'tester',
    type: 'tester',
    name: 'QA Tester',
    status: 'idle',
    lastActivity: new Date().toISOString(),
    confidence: 0.0,
  },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('analyst');
  const [isActionQueueOpen, setIsActionQueueOpen] = useState<boolean>(true);

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Agent Consoles Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <TabNavigation
            agents={mockAgents}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          {/* Active Agent Console */}
          <div className="flex-1 p-6">
            <AgentConsole agentId={activeTab} />
          </div>
        </div>
        
        {/* Action Queue Sidebar */}
        <ActionQueue 
          isOpen={isActionQueueOpen}
          onToggle={() => setIsActionQueueOpen(!isActionQueueOpen)}
        />
      </div>
    </div>
  );
};

export default Dashboard;
