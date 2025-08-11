import React from 'react';
import MessageItem from './MessageItem';
import { AgentMessage } from '../../types';

interface ConversationViewProps {
  agentId: string;
}

// Mock conversation data for development
const mockMessages: AgentMessage[] = [
  {
    id: 'msg_001',
    timestamp: new Date().toISOString(),
    from_agent: 'analyst',
    to_agent: 'architect',
    message_type: 'handoff',
    content: {
      text: 'Requirements analysis complete. Ready to hand off to architecture design.',
      metadata: {
        requirements_count: 15,
        user_stories: 8,
      },
      confidence: 0.9,
      attachments: [],
    },
    thread_id: 'thread_001',
    attempt_number: 1,
  },
  {
    id: 'msg_002',
    timestamp: new Date().toISOString(),
    from_agent: 'architect',
    to_agent: 'developer',
    message_type: 'handoff',
    content: {
      text: 'System architecture design completed. Technical specifications ready for implementation.',
      metadata: {
        components: 12,
        apis: 5,
      },
      confidence: 0.85,
      attachments: [],
    },
    thread_id: 'thread_001',
    attempt_number: 1,
  },
];

const ConversationView: React.FC<ConversationViewProps> = ({ agentId }) => {
  // Filter messages for current agent
  const agentMessages = mockMessages.filter(
    msg => msg.from_agent === agentId || msg.to_agent === agentId
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {agentMessages.length > 0 ? (
          agentMessages.map((message) => (
            <MessageItem key={message.id} message={message} />
          ))
        ) : (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet for {agentId}</p>
            <p className="text-sm mt-2">Agent conversations will appear here in real-time</p>
          </div>
        )}
      </div>
      
      {/* Message input area */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder={`Send message to ${agentId}...`}
            className="flex-1 input-field"
          />
          <button className="btn-primary">
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationView;
