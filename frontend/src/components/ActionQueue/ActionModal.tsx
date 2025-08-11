import React, { useState } from 'react';
import { HumanAction } from '../../types';

interface ActionModalProps {
  action: HumanAction;
  isOpen: boolean;
  onClose: () => void;
  onDecision: (optionId: string) => void;
}

const ActionModal: React.FC<ActionModalProps> = ({
  action,
  isOpen,
  onClose,
  onDecision,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (selectedOption) {
      onDecision(selectedOption);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {action.title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          <p className="text-gray-600 mt-2">{action.description}</p>
        </div>
        
        {/* Context Information */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-medium text-gray-900 mb-3">Context</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap">
              {JSON.stringify(action.context, null, 2)}
            </pre>
          </div>
        </div>
        
        {/* Options */}
        <div className="p-6">
          <h3 className="font-medium text-gray-900 mb-4">Choose an option:</h3>
          <div className="space-y-3">
            {action.options.map((option) => (
              <label
                key={option.id}
                className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="decision"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-gray-600 mt-1">
                      {option.description}
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedOption}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Confirm Decision
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActionModal;
