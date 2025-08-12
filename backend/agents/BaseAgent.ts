import {
  IAgent,
  AgentType,
  AgentStatus,
  AgentConfig,
  AgentConfigSchema,
  Task,
  TaskResult,
  AgentHealth,
} from '@/types';
import { logger } from '@/utils/logger';
import { generateId, timeout } from '@/utils/helpers';

export abstract class BaseAgent implements IAgent {
  public readonly id: string;
  public readonly name: string;
  public readonly type: AgentType;
  public status: AgentStatus = AgentStatus.STOPPED;
  public config: AgentConfig;

  private startTime: number = 0;
  private tasksCompleted: number = 0;
  private tasksActive: number = 0;
  private lastHeartbeat: Date = new Date();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  constructor(
    name: string,
    type: AgentType,
    config: Partial<AgentConfig> = {}
  ) {
    this.id = generateId();
    this.name = name;
    this.type = type;
    this.config = AgentConfigSchema.parse(config);
  }

  async initialize(): Promise<void> {
    try {
      logger.info(`🔧 Initializing agent: ${this.name} (${this.id})`);

      // Validate configuration
      this.config = AgentConfigSchema.parse(this.config);

      // Call subclass initialization
      await this.onInitialize();

      this.status = AgentStatus.IDLE;
      this.startTime = Date.now();

      logger.info(`✅ Agent initialized: ${this.name}`);
    } catch (error) {
      this.status = AgentStatus.ERROR;
      logger.error(`❌ Failed to initialize agent ${this.name}:`, error);
      throw error;
    }
  }

  async start(): Promise<void> {
    if (this.status === AgentStatus.RUNNING) {
      logger.warn(`⚠️ Agent ${this.name} is already running`);
      return;
    }

    try {
      await this.onStart();

      this.status = AgentStatus.IDLE;
      this.startHealthCheck();

      logger.info(`🚀 Agent started: ${this.name}`);
    } catch (error) {
      this.status = AgentStatus.ERROR;
      logger.error(`❌ Failed to start agent ${this.name}:`, error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.status === AgentStatus.STOPPED) {
      return;
    }

    try {
      this.stopHealthCheck();
      await this.onStop();

      this.status = AgentStatus.STOPPED;

      logger.info(`🛑 Agent stopped: ${this.name}`);
    } catch (error) {
      this.status = AgentStatus.ERROR;
      logger.error(`❌ Failed to stop agent ${this.name}:`, error);
      throw error;
    }
  }

  async execute(task: Task): Promise<TaskResult> {
    if (this.status !== AgentStatus.IDLE) {
      throw new Error(
        `Agent ${this.name} is not available (status: ${this.status})`
      );
    }

    const startTime = Date.now();
    this.status = AgentStatus.BUSY;
    this.tasksActive++;

    try {
      logger.info(`🎯 Executing task ${task.id} on agent ${this.name}`);

      // Apply timeout if specified
      const taskTimeout = task.timeout || this.config.timeout;
      const result = await timeout(this.onExecute(task), taskTimeout);

      const duration = Date.now() - startTime;
      this.tasksCompleted++;
      this.tasksActive--;
      this.status = AgentStatus.IDLE;

      const taskResult: TaskResult = {
        taskId: task.id,
        agentId: this.id,
        status: 'success',
        result,
        duration,
        timestamp: new Date(),
        metadata: {
          agentName: this.name,
          agentType: this.type,
        },
      };

      logger.info(`✅ Task ${task.id} completed successfully in ${duration}ms`);
      return taskResult;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.tasksActive--;
      this.status = AgentStatus.IDLE;

      const taskResult: TaskResult = {
        taskId: task.id,
        agentId: this.id,
        status:
          error instanceof Error && error.message.includes('timed out')
            ? 'timeout'
            : 'failure',
        error: error instanceof Error ? error.message : String(error),
        duration,
        timestamp: new Date(),
        metadata: {
          agentName: this.name,
          agentType: this.type,
        },
      };

      logger.error(`❌ Task ${task.id} failed:`, error);
      return taskResult;
    }
  }

  getHealth(): AgentHealth {
    const uptime = this.startTime > 0 ? Date.now() - this.startTime : 0;

    return {
      status: this.status,
      uptime,
      tasksCompleted: this.tasksCompleted,
      tasksActive: this.tasksActive,
      lastHeartbeat: this.lastHeartbeat,
      memoryUsage: process.memoryUsage(),
      customMetrics: this.getCustomMetrics(),
    };
  }

  /**
   * Start health check monitoring
   */
  private startHealthCheck(): void {
    this.healthCheckInterval = setInterval(() => {
      this.lastHeartbeat = new Date();
      this.onHealthCheck();
    }, this.config.healthCheckInterval);
  }

  /**
   * Stop health check monitoring
   */
  private stopHealthCheck(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
  }

  // Abstract methods to be implemented by subclasses
  protected abstract onInitialize(): Promise<void>;
  protected abstract onStart(): Promise<void>;
  protected abstract onStop(): Promise<void>;
  protected abstract onExecute(task: Task): Promise<unknown>;

  // Optional methods for subclasses to override
  protected onHealthCheck(): void {
    // Default implementation - subclasses can override
  }

  protected getCustomMetrics(): Record<string, unknown> {
    // Default implementation - subclasses can override
    return {};
  }
}
