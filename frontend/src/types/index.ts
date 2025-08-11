// Agent Types
export type AgentType = 'analyst' | 'architect' | 'developer' | 'tester' | 'deployer';
export type AgentStatus = 'idle' | 'thinking' | 'waiting' | 'error';
export type MessageType = 'handoff' | 'conflict' | 'agreement' | 'escalation';

// Agent Interface
export interface Agent {
  id: string;
  type: AgentType;
  name: string;
  status: AgentStatus;
  currentTask?: string;
  lastActivity: string;
  confidence: number;
}

// Message Content
export interface MessageContent {
  text: string;
  metadata: Record<string, any>;
  confidence?: number;
  attachments: string[];
}

// Agent Message
export interface AgentMessage {
  id: string;
  timestamp: string;
  from_agent: string;
  to_agent: string | null;
  message_type: MessageType;
  content: MessageContent;
  thread_id: string;
  attempt_number: number;
}

// Human Action
export interface HumanAction {
  id: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  title: string;
  description: string;
  options: Array<{
    id: string;
    label: string;
    description?: string;
  }>;
  deadline?: string;
  context: Record<string, any>;
}

// Project Spec
export interface ProjectSpec {
  project_id: string;
  version: number;
  updated_by: string;
  updated_at: string;
  changes: string[];
  spec: Record<string, any>;
  history: SpecVersion[];
}

export interface SpecVersion {
  version: number;
  updated_at: string;
  updated_by: string;
  changes: string[];
  spec: Record<string, any>;
}

// JSON Patch Operation
export interface JSONPatchOperation {
  op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
  path: string;
  value?: any;
  from?: string;
}

// WebSocket Message Types
export interface WebSocketMessage {
  type: 'agent_message' | 'status_update' | 'action_required' | 'spec_update' | 'system_notification';
  timestamp: string;
  project_id: string;
  data: WebSocketMessageData;
}

export interface WebSocketMessageData {
  message?: AgentMessage;
  status?: Agent;
  action?: HumanAction;
  spec_update?: {
    version: number;
    updated_by: string;
    changes: string[];
    patch_operations: JSONPatchOperation[];
  };
}

// Conversation Thread
export interface ConversationThread {
  thread_id: string;
  project_id: string;
  participants: string[];
  messages: AgentMessage[];
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ConversationResponse {
  conversations: ConversationThread[];
  cursor?: string;
  has_more: boolean;
  total_count: number;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  updated_spec?: ProjectSpec;
}

// Store State Types
export interface AgentStore {
  agents: Record<string, Agent>;
  updateAgentStatus: (agentId: string, status: Partial<Agent>) => void;
  setAgents: (agents: Record<string, Agent>) => void;
}

export interface ConversationStore {
  conversations: Map<string, ConversationThread>;
  messageCache: Map<string, AgentMessage[]>;
  loadConversation: (agentId: string, cursor?: string) => Promise<void>;
  addMessage: (message: AgentMessage) => void;
  clearConversations: () => void;
}

export interface ActionQueueStore {
  actions: HumanAction[];
  addAction: (action: HumanAction) => void;
  removeAction: (actionId: string) => void;
  updateAction: (actionId: string, updates: Partial<HumanAction>) => void;
  clearActions: () => void;
}

export interface SpecStore {
  currentSpec: ProjectSpec | null;
  specHistory: SpecVersion[];
  updateSpec: (spec: ProjectSpec) => void;
  applyPatch: (operations: JSONPatchOperation[]) => void;
  loadSpec: (projectId: string) => Promise<void>;
}
