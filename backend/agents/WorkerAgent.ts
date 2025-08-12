import { BaseAgent } from './BaseAgent';
import { AgentType, Task, AgentConfig } from '@/types';
import { logger } from '@/utils/logger';
import { sleep } from '@/utils/helpers';

/**
 * A simple worker agent that can handle basic tasks
 */
export class WorkerAgent extends BaseAgent {
  constructor(name: string, config: Partial<AgentConfig> = {}) {
    super(name, AgentType.WORKER, {
      capabilities: ['basic', 'processing'],
      ...config,
    });
  }

  protected async onInitialize(): Promise<void> {
    logger.info(`🔧 Initializing WorkerAgent: ${this.name}`);
    // Custom initialization logic for worker agents
  }

  protected async onStart(): Promise<void> {
    logger.info(`🚀 Starting WorkerAgent: ${this.name}`);
    // Custom start logic for worker agents
  }

  protected async onStop(): Promise<void> {
    logger.info(`🛑 Stopping WorkerAgent: ${this.name}`);
    // Custom stop logic for worker agents
  }

  protected async onExecute(task: Task): Promise<unknown> {
    logger.info(
      `⚙️ WorkerAgent ${this.name} executing task ${task.id} of type: ${task.type}`
    );

    // Simulate different types of work based on task type
    switch (task.type) {
      case 'process':
        return this.processTask(task);
      case 'calculate':
        return this.calculateTask(task);
      case 'transform':
        return this.transformTask(task);
      default:
        return this.defaultTask(task);
    }
  }

  private async processTask(
    task: Task
  ): Promise<{ processed: boolean; data: unknown }> {
    // Simulate processing work
    await sleep(1000 + Math.random() * 2000); // 1-3 seconds

    return {
      processed: true,
      data: task.payload,
    };
  }

  private async calculateTask(task: Task): Promise<{ result: number }> {
    // Simulate calculation work
    await sleep(500 + Math.random() * 1000); // 0.5-1.5 seconds

    const { a = 1, b = 1 } = task.payload as { a?: number; b?: number };

    return {
      result: a + b,
    };
  }

  private async transformTask(task: Task): Promise<{ transformed: unknown }> {
    // Simulate transformation work
    await sleep(800 + Math.random() * 1200); // 0.8-2 seconds

    const data = task.payload;

    return {
      transformed: {
        original: data,
        processed: true,
        transformedAt: new Date().toISOString(),
      },
    };
  }

  private async defaultTask(task: Task): Promise<{ completed: boolean }> {
    // Default task handling
    await sleep(500 + Math.random() * 500); // 0.5-1 seconds

    logger.info(
      `🔄 WorkerAgent ${this.name} completed default task ${task.id}`
    );

    return {
      completed: true,
    };
  }

  protected getCustomMetrics(): Record<string, unknown> {
    return {
      agentType: 'worker',
      capabilities: this.config.capabilities,
    };
  }
}
