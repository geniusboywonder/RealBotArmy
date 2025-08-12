import { config } from '@/config';
import { logger } from '@/utils/logger';
import { AgentManager } from '@/core/AgentManager';

async function main() {
  try {
    logger.info('🤖 Starting RealBotArmy...');

    // Initialize configuration
    await config.initialize();
    logger.info('✅ Configuration loaded');

    // Initialize Agent Manager
    const agentManager = new AgentManager();
    await agentManager.initialize();
    logger.info('✅ Agent Manager initialized');

    // Start the application
    await agentManager.start();
    logger.info('🚀 RealBotArmy is running!');
  } catch (error) {
    logger.error('❌ Failed to start RealBotArmy:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('📴 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  logger.info('📴 Shutting down gracefully...');
  process.exit(0);
});

// Start the application
main().catch(error => {
  logger.error('💥 Unhandled error:', error);
  process.exit(1);
});
