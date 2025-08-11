import { z } from 'zod';

// Base Agent interface
export interface IAgent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  config: AgentConfig;
  initialize(): Promise<void>;
  start(): Promise<void>;
  stop(): Promise<void>;
  execute(task: Task): Promise<TaskResult>;
  getHealth(): AgentHealth;
}

// Agent Types
export enum AgentType {
  WORKER = 'worker',
  COORDINATOR = 'coordinator',
  MONITOR = 'monitor',
  SPECIALIST = 'specialist',
}

// Agent Status
export enum AgentStatus {
  IDLE = 'idle',
  RUNNING = 'running',
  BUSY = 'busy',
  ERROR = 'error',
  STOPPED = 'stopped',
}

// Agent Configuration Schema
export const AgentConfigSchema = z.object({
  maxConcurrentTasks: z.number().min(1).default(5),
  timeout: z.number().min(1000).default(30000),
  retryAttempts: z.number().min(0).default(3),
  healthCheckInterval: z.number().min(1000).default(10000),
  capabilities: z.array(z.string()).default([]),
  metadata: z.record(z.unknown()).optional(),
});

export type AgentConfig = z.infer<typeof AgentConfigSchema>;

// Task Schema
export const TaskSchema = z.object({
  id: z.string(),
  type: z.string(),
  priority: z.number().min(1).max(10).default(5),
  payload: z.record(z.unknown()),
  requiredCapabilities: z.array(z.string()).default([]),
  timeout: z.number().optional(),
  retryAttempts: z.number().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type Task = z.infer<typeof TaskSchema>;

// Task Result Schema
export const TaskResultSchema = z.object({
  taskId: z.string(),
  agentId: z.string(),
  status: z.enum(['success', 'failure', 'timeout']),
  result: z.unknown().optional(),
  error: z.string().optional(),
  duration: z.number(),
  timestamp: z.date(),
  metadata: z.record(z.unknown()).optional(),
});

export type TaskResult = z.infer<typeof TaskResultSchema>;

// Agent Health
export interface AgentHealth {
  status: AgentStatus;
  uptime: number;
  tasksCompleted: number;
  tasksActive: number;
  lastHeartbeat: Date;
  memoryUsage?: NodeJS.MemoryUsage;
  customMetrics?: Record<string, unknown>;
}

// Event Types
export interface AgentEvent {
  type: string;
  agentId: string;
  timestamp: Date;
  data?: unknown;
}

// Agent Manager Events
export enum AgentManagerEvent {
  AGENT_CREATED = 'agent:created',
  AGENT_STARTED = 'agent:started',
  AGENT_STOPPED = 'agent:stopped',
  AGENT_ERROR = 'agent:error',
  TASK_ASSIGNED = 'task:assigned',
  TASK_COMPLETED = 'task:completed',
  TASK_FAILED = 'task:failed',
}
