import { AgentManager } from '../backend/core/AgentManager';
import { WorkerAgent } from '../backend/agents';
import { TaskSchema } from '../backend/types';
import { generateId } from '../backend/utils/helpers';
import { config } from '../backend/config';
import { logger } from '../backend/utils/logger';

async function basicExample() {
  try {
    logger.info('🚀 Starting Basic Agent Example');

    // Initialize configuration
    await config.initialize();

    // Create agent manager
    const agentManager = new AgentManager();
    await agentManager.initialize();
    await agentManager.start();

    // Create and register some worker agents
    const agent1 = new WorkerAgent('worker-1');
    const agent2 = new WorkerAgent('worker-2');

    await agentManager.registerAgent(agent1);
    await agentManager.registerAgent(agent2);

    // Start the agents
    await agent1.start();
    await agent2.start();

    // Create some tasks
    const tasks = [
      TaskSchema.parse({
        id: generateId(),
        type: 'process',
        payload: { data: 'Hello World' },
        priority: 1,
      }),
      TaskSchema.parse({
        id: generateId(),
        type: 'calculate',
        payload: { a: 10, b: 5 },
        priority: 2,
      }),
      TaskSchema.parse({
        id: generateId(),
        type: 'transform',
        payload: { input: 'Transform this data' },
        priority: 3,
      }),
    ];

    // Submit tasks
    logger.info('📋 Submitting tasks...');
    tasks.forEach(task => {
      agentManager.submitTask(task);
    });

    // Wait for tasks to complete
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Get status
    const queueStatus = agentManager.getTaskQueueStatus();
    const agents = agentManager.getAgents();

    logger.info('📊 Final Status:');
    logger.info(`Queue size: ${queueStatus.size}`);
    agents.forEach(agent => {
      const health = agent.getHealth();
      logger.info(
        `Agent ${agent.name}: ${health.tasksCompleted} tasks completed`
      );
    });

    // Cleanup
    await agentManager.stop();

    logger.info('✅ Example completed successfully');
  } catch (error) {
    logger.error('❌ Example failed:', error);
    process.exit(1);
  }
}

// Run the example
if (require.main === module) {
  basicExample();
}

export { basicExample };
