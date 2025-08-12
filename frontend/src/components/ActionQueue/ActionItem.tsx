import React, { useState } from 'react';
import { HumanAction } from '../../types';
import ActionModal from './ActionModal';

interface ActionItemProps {
  action: HumanAction;
}

const ActionItem: React.FC<ActionItemProps> = ({ action }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const priorityStyles = {
    low: 'bg-gray-100 text-gray-800 border-gray-200',
    medium: 'bg-blue-100 text-blue-800 border-blue-200',
    high: 'bg-orange-100 text-orange-800 border-orange-200',
    urgent: 'bg-red-100 text-red-800 border-red-200',
  };

  const priorityIcons = {
    low: '📝',
    medium: '⚠️',
    high: '🔥',
    urgent: '🚨',
  };

  return (
    <>
      <div
        className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${priorityStyles[action.priority]}`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{priorityIcons[action.priority]}</span>
            <span className="text-xs font-medium uppercase tracking-wide">
              {action.priority}
            </span>
          </div>
          {action.deadline && (
            <span className="text-xs">
              Due: {new Date(action.deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        <h4 className="font-medium text-sm mb-2">{action.title}</h4>
        <p className="text-xs text-gray-700 mb-3 line-clamp-2">
          {action.description}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">
            {action.options.length} option
            {action.options.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-xs bg-white hover:bg-gray-50 px-2 py-1 rounded border"
          >
            Decide
          </button>
        </div>
      </div>

      <ActionModal
        action={action}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDecision={optionId => {
          console.log('Decision made:', optionId);
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default ActionItem;
