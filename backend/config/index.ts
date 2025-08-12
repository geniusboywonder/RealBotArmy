import { z } from 'zod';
import { config as dotenvConfig } from 'dotenv';
import { logger } from '@/utils/logger';

// Load environment variables
dotenvConfig();

// Configuration Schema
const ConfigSchema = z.object({
  // Environment
  nodeEnv: z.enum(['development', 'production', 'test']).default('development'),

  // Server
  port: z.coerce.number().default(3000),
  host: z.string().default('localhost'),

  // Logging
  logLevel: z.enum(['error', 'warn', 'info', 'debug']).default('info'),

  // Agent Configuration
  agents: z
    .object({
      maxAgents: z.coerce.number().default(10),
      defaultTimeout: z.coerce.number().default(30000),
      healthCheckInterval: z.coerce.number().default(10000),
      maxRetries: z.coerce.number().default(3),
    })
    .default({}),

  // Task Queue Configuration
  taskQueue: z
    .object({
      maxSize: z.coerce.number().default(1000),
      processInterval: z.coerce.number().default(1000),
      priorityLevels: z.coerce.number().default(10),
    })
    .default({}),

  // Security
  security: z
    .object({
      enableRateLimit: z.coerce.boolean().default(true),
      rateLimitWindow: z.coerce.number().default(900000), // 15 minutes
      rateLimitMax: z.coerce.number().default(100),
    })
    .default({}),
});

type Config = z.infer<typeof ConfigSchema>;

class ConfigManager {
  private _config: Config | null = null;

  async initialize(): Promise<void> {
    try {
      const rawConfig = {
        nodeEnv: process.env.NODE_ENV,
        port: process.env.PORT,
        host: process.env.HOST,
        logLevel: process.env.LOG_LEVEL,

        // Agent config
        agents: {
          maxAgents: process.env.MAX_AGENTS,
          defaultTimeout: process.env.DEFAULT_TIMEOUT,
          healthCheckInterval: process.env.HEALTH_CHECK_INTERVAL,
          maxRetries: process.env.MAX_RETRIES,
        },

        // Task queue config
        taskQueue: {
          maxSize: process.env.TASK_QUEUE_MAX_SIZE,
          processInterval: process.env.TASK_QUEUE_PROCESS_INTERVAL,
          priorityLevels: process.env.TASK_QUEUE_PRIORITY_LEVELS,
        },

        // Security config
        security: {
          enableRateLimit: process.env.ENABLE_RATE_LIMIT,
          rateLimitWindow: process.env.RATE_LIMIT_WINDOW,
          rateLimitMax: process.env.RATE_LIMIT_MAX,
        },
      };

      this._config = ConfigSchema.parse(rawConfig);
      logger.info('✅ Configuration loaded successfully');
    } catch (error) {
      logger.error('❌ Failed to load configuration:', error);
      throw new Error('Configuration validation failed');
    }
  }

  get config(): Config {
    if (!this._config) {
      throw new Error(
        'Configuration not initialized. Call initialize() first.'
      );
    }
    return this._config;
  }

  get nodeEnv(): string {
    return this.config.nodeEnv;
  }

  get isDevelopment(): boolean {
    return this.config.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.config.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.config.nodeEnv === 'test';
  }
}

// Export singleton instance
export const config = new ConfigManager();
export type { Config };
