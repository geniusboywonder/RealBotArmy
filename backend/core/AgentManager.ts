import { EventEmitter } from 'events';
import {
  IAgent,
  AgentType,
  AgentStatus,
  Task,
  TaskResult as _TaskResult,
  AgentEvent,
  AgentManagerEvent,
} from '@/types';
import { logger } from '@/utils/logger';
import { generateId as _generateId } from '@/utils/helpers';
import { config } from '@/config';

export class AgentManager extends EventEmitter {
  private agents: Map<string, IAgent> = new Map();
  private taskQueue: Task[] = [];
  private isRunning: boolean = false;
  private processInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.setupEventHandlers();
  }

  async initialize(): Promise<void> {
    logger.info('🔧 Initializing Agent Manager...');

    // Initialize any default agents here
    // For now, we'll start with an empty agent pool

    logger.info('✅ Agent Manager initialized');
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      logger.warn('⚠️ Agent Manager is already running');
      return;
    }

    this.isRunning = true;

    // Start task processing loop
    this.processInterval = setInterval(() => {
      this.processTasks().catch(error => {
        logger.error('❌ Error processing tasks:', error);
      });
    }, config.config.taskQueue.processInterval);

    logger.info('🚀 Agent Manager started');
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;

    // Clear processing interval
    if (this.processInterval) {
      clearInterval(this.processInterval);
      this.processInterval = null;
    }

    // Stop all agents
    const stopPromises = Array.from(this.agents.values()).map(agent =>
      agent
        .stop()
        .catch(error =>
          logger.error(`❌ Error stopping agent ${agent.id}:`, error)
        )
    );

    await Promise.all(stopPromises);

    logger.info('🛑 Agent Manager stopped');
  }

  /**
   * Register a new agent
   */
  async registerAgent(agent: IAgent): Promise<void> {
    if (this.agents.has(agent.id)) {
      throw new Error(`Agent with ID ${agent.id} already exists`);
    }

    if (this.agents.size >= config.config.agents.maxAgents) {
      throw new Error('Maximum number of agents reached');
    }

    try {
      await agent.initialize();
      this.agents.set(agent.id, agent);

      this.emit(AgentManagerEvent.AGENT_CREATED, {
        type: AgentManagerEvent.AGENT_CREATED,
        agentId: agent.id,
        timestamp: new Date(),
        data: { agent: agent.name, type: agent.type },
      } as AgentEvent);

      logger.info(`✅ Agent registered: ${agent.name} (${agent.id})`);
    } catch (error) {
      logger.error(`❌ Failed to register agent ${agent.id}:`, error);
      throw error;
    }
  }

  /**
   * Unregister an agent
   */
  async unregisterAgent(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Agent with ID ${agentId} not found`);
    }

    try {
      await agent.stop();
      this.agents.delete(agentId);

      logger.info(`✅ Agent unregistered: ${agent.name} (${agentId})`);
    } catch (error) {
      logger.error(`❌ Failed to unregister agent ${agentId}:`, error);
      throw error;
    }
  }

  /**
   * Submit a task to the queue
   */
  submitTask(task: Task): void {
    if (this.taskQueue.length >= config.config.taskQueue.maxSize) {
      throw new Error('Task queue is full');
    }

    // Insert task in priority order (higher priority = lower number)
    const insertIndex = this.taskQueue.findIndex(
      t => t.priority > task.priority
    );
    if (insertIndex === -1) {
      this.taskQueue.push(task);
    } else {
      this.taskQueue.splice(insertIndex, 0, task);
    }

    logger.info(`📋 Task submitted: ${task.id} (priority: ${task.priority})`);
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): IAgent | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get all agents
   */
  getAgents(): IAgent[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agents by type
   */
  getAgentsByType(type: AgentType): IAgent[] {
    return this.getAgents().filter(agent => agent.type === type);
  }

  /**
   * Get available agents (idle status)
   */
  getAvailableAgents(): IAgent[] {
    return this.getAgents().filter(agent => agent.status === AgentStatus.IDLE);
  }

  /**
   * Get task queue status
   */
  getTaskQueueStatus(): { size: number; maxSize: number; tasks: Task[] } {
    return {
      size: this.taskQueue.length,
      maxSize: config.config.taskQueue.maxSize,
      tasks: [...this.taskQueue],
    };
  }

  /**
   * Process tasks from the queue
   */
  private async processTasks(): Promise<void> {
    if (this.taskQueue.length === 0) {
      return;
    }

    const availableAgents = this.getAvailableAgents();
    if (availableAgents.length === 0) {
      return;
    }

    // Process as many tasks as we have available agents
    const tasksToProcess = this.taskQueue.splice(0, availableAgents.length);

    for (let i = 0; i < tasksToProcess.length; i++) {
      const task = tasksToProcess[i];

      if (!task) continue; // Skip if task is undefined

      // Find best agent for this task
      const bestAgent = this.findBestAgentForTask(task, availableAgents);
      if (bestAgent) {
        this.assignTaskToAgent(task, bestAgent);
      } else {
        // Put task back in queue if no suitable agent found
        this.taskQueue.unshift(task);
      }
    }
  }

  /**
   * Find the best agent for a given task
   */
  private findBestAgentForTask(
    task: Task,
    availableAgents: IAgent[]
  ): IAgent | null {
    // Filter agents that have required capabilities
    const capableAgents = availableAgents.filter(agent => {
      return task.requiredCapabilities.every(capability =>
        agent.config.capabilities.includes(capability)
      );
    });

    if (capableAgents.length === 0) {
      return null;
    }

    // For now, just return the first capable agent
    // In the future, we could implement more sophisticated selection logic
    return capableAgents[0] || null;
  }

  /**
   * Assign a task to an agent
   */
  private async assignTaskToAgent(task: Task, agent: IAgent): Promise<void> {
    try {
      this.emit(AgentManagerEvent.TASK_ASSIGNED, {
        type: AgentManagerEvent.TASK_ASSIGNED,
        agentId: agent.id,
        timestamp: new Date(),
        data: { taskId: task.id, taskType: task.type },
      } as AgentEvent);

      logger.info(`🎯 Assigning task ${task.id} to agent ${agent.name}`);

      // Execute task (this will be async, we don't wait for completion here)
      this.executeTaskOnAgent(task, agent);
    } catch (error) {
      logger.error(
        `❌ Failed to assign task ${task.id} to agent ${agent.id}:`,
        error
      );
    }
  }

  /**
   * Execute a task on an agent
   */
  private async executeTaskOnAgent(task: Task, agent: IAgent): Promise<void> {
    const startTime = Date.now();

    try {
      const result = await agent.execute(task);
      const duration = Date.now() - startTime;

      this.emit(AgentManagerEvent.TASK_COMPLETED, {
        type: AgentManagerEvent.TASK_COMPLETED,
        agentId: agent.id,
        timestamp: new Date(),
        data: { taskId: task.id, result, duration },
      } as AgentEvent);

      logger.info(
        `✅ Task ${task.id} completed by ${agent.name} in ${duration}ms`
      );
    } catch (error) {
      const duration = Date.now() - startTime;

      this.emit(AgentManagerEvent.TASK_FAILED, {
        type: AgentManagerEvent.TASK_FAILED,
        agentId: agent.id,
        timestamp: new Date(),
        data: {
          taskId: task.id,
          error: error instanceof Error ? error.message : String(error),
          duration,
        },
      } as AgentEvent);

      logger.error(`❌ Task ${task.id} failed on ${agent.name}:`, error);
    }
  }

  /**
   * Setup event handlers
   */
  private setupEventHandlers(): void {
    this.on(AgentManagerEvent.AGENT_ERROR, (event: AgentEvent) => {
      logger.error(`🔥 Agent error event:`, event);
    });

    this.on(AgentManagerEvent.TASK_FAILED, (event: AgentEvent) => {
      logger.warn(`⚠️ Task failed event:`, event);
    });
  }
}
