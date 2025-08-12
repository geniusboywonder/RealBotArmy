import React from 'react';
import ActionItem from './ActionItem';
import { HumanAction } from '../../types';

interface ActionQueueProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Mock actions for development
const mockActions: HumanAction[] = [
  {
    id: 'action_001',
    priority: 'high',
    title: 'Technology Stack Decision',
    description: 'Conflict between Analyst and Architect on database choice',
    options: [
      {
        id: 'opt_1',
        label: 'PostgreSQL',
        description: 'Robust relational database',
      },
      {
        id: 'opt_2',
        label: 'MongoDB',
        description: 'Flexible document database',
      },
    ],
    context: {
      analyst_preference: 'PostgreSQL',
      architect_preference: 'MongoDB',
      project_requirements: 'Complex queries with ACID compliance needed',
    },
  },
  {
    id: 'action_002',
    priority: 'medium',
    title: 'UI Framework Selection',
    description: 'Multiple options available for frontend implementation',
    options: [
      { id: 'opt_3', label: 'React', description: 'Component-based library' },
      { id: 'opt_4', label: 'Vue.js', description: 'Progressive framework' },
    ],
    context: {
      team_experience: 'React',
      project_complexity: 'Medium',
    },
  },
];

const ActionQueue: React.FC<ActionQueueProps> = ({ isOpen, onToggle }) => {
  if (!isOpen) {
    return (
      <div className="w-12 bg-white border-l border-gray-200 flex flex-col items-center py-4">
        <button
          onClick={onToggle}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          title="Open Action Queue"
        >
          <span className="text-lg">📋</span>
        </button>
        {mockActions.length > 0 && (
          <div className="mt-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {mockActions.length}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Action Queue</h3>
          <button
            onClick={onToggle}
            className="p-1 text-gray-500 hover:text-gray-700 rounded"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {mockActions.length} pending decision
          {mockActions.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Actions List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {mockActions.length > 0 ? (
          mockActions.map(action => (
            <ActionItem key={action.id} action={action} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No pending actions</p>
            <p className="text-sm mt-2">Human decisions will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActionQueue;
