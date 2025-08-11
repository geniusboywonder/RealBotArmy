import React from 'react';
import { AgentMessage } from '../../types';

interface MessageItemProps {
  message: AgentMessage;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const messageTypeStyles = {
    handoff: 'bg-blue-50 border-blue-200',
    conflict: 'bg-red-50 border-red-200',
    agreement: 'bg-green-50 border-green-200',
    escalation: 'bg-yellow-50 border-yellow-200',
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className={`p-4 rounded-lg border ${messageTypeStyles[message.message_type] || 'bg-gray-50 border-gray-200'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="font-medium text-sm text-gray-900">
            {message.from_agent}
          </span>
          {message.to_agent && (
            <>
              <span className="text-gray-400">→</span>
              <span className="text-sm text-gray-600">{message.to_agent}</span>
            </>
          )}
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
            {message.message_type}
          </span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          {message.content.confidence && (
            <span className="bg-white px-2 py-1 rounded">
              {Math.round(message.content.confidence * 100)}% confident
            </span>
          )}
          <span>{formatTimestamp(message.timestamp)}</span>
        </div>
      </div>
      
      <div className="text-gray-800 mb-3">
        {message.content.text}
      </div>
      
      {Object.keys(message.content.metadata).length > 0 && (
        <div className="bg-white p-2 rounded text-xs">
          <div className="font-medium text-gray-700 mb-1">Metadata:</div>
          <pre className="text-gray-600 whitespace-pre-wrap">
            {JSON.stringify(message.content.metadata, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default MessageItem;
