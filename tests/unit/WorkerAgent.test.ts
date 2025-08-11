import { WorkerAgent } from '@/agents';
import { AgentType, AgentStatus, TaskSchema } from '@/types';
import { generateId } from '@/utils/helpers';

describe('WorkerAgent', () => {
  let agent: WorkerAgent;

  beforeEach(() => {
    agent = new WorkerAgent('test-worker');
  });

  afterEach(async () => {
    if (agent.status !== AgentStatus.STOPPED) {
      await agent.stop();
    }
  });

  describe('initialization', () => {
    it('should create agent with correct properties', () => {
      expect(agent.name).toBe('test-worker');
      expect(agent.type).toBe(AgentType.WORKER);
      expect(agent.status).toBe(AgentStatus.STOPPED);
      expect(agent.id).toBeDefined();
      expect(agent.config).toBeDefined();
      expect(agent.config.capabilities).toContain('basic');
      expect(agent.config.capabilities).toContain('processing');
    });

    it('should initialize successfully', async () => {
      await agent.initialize();
      expect(agent.status).toBe(AgentStatus.IDLE);
    });

    it('should start successfully after initialization', async () => {
      await agent.initialize();
      await agent.start();
      expect(agent.status).toBe(AgentStatus.IDLE);
    });
  });

  describe('task execution', () => {
    beforeEach(async () => {
      await agent.initialize();
      await agent.start();
    });

    it('should execute a process task', async () => {
      const task = TaskSchema.parse({
        id: generateId(),
        type: 'process',
        payload: { data: 'test' },
        priority: 5,
      });

      const result = await agent.execute(task);

      expect(result.status).toBe('success');
      expect(result.taskId).toBe(task.id);
      expect(result.agentId).toBe(agent.id);
      expect(result.result).toHaveProperty('processed', true);
      expect(result.duration).toBeGreaterThan(0);
    });

    it('should execute a calculate task', async () => {
      const task = TaskSchema.parse({
        id: generateId(),
        type: 'calculate',
        payload: { a: 5, b: 3 },
        priority: 5,
      });

      const result = await agent.execute(task);

      expect(result.status).toBe('success');
      expect(result.result).toHaveProperty('result', 8);
    });

    it('should execute a transform task', async () => {
      const task = TaskSchema.parse({
        id: generateId(),
        type: 'transform',
        payload: { input: 'test data' },
        priority: 5,
      });

      const result = await agent.execute(task);

      expect(result.status).toBe('success');
      expect(result.result).toHaveProperty('transformed');
    });

    it('should handle unknown task types with default behavior', async () => {
      const task = TaskSchema.parse({
        id: generateId(),
        type: 'unknown',
        payload: {},
        priority: 5,
      });

      const result = await agent.execute(task);

      expect(result.status).toBe('success');
      expect(result.result).toHaveProperty('completed', true);
    });

    it('should respect task timeout', async () => {
      const task = TaskSchema.parse({
        id: generateId(),
        type: 'process',
        payload: {},
        priority: 5,
        timeout: 100, // Very short timeout
      });

      const result = await agent.execute(task);

      expect(result.status).toBe('timeout');
      expect(result.error).toContain('timed out');
    });
  });

  describe('health monitoring', () => {
    beforeEach(async () => {
      await agent.initialize();
      await agent.start();
    });

    it('should provide health status', () => {
      const health = agent.getHealth();

      expect(health.status).toBe(AgentStatus.IDLE);
      expect(health.uptime).toBeGreaterThanOrEqual(0);
      expect(health.tasksCompleted).toBe(0);
      expect(health.tasksActive).toBe(0);
      expect(health.lastHeartbeat).toBeInstanceOf(Date);
      expect(health.memoryUsage).toBeDefined();
    });

    it('should update task counters after execution', async () => {
      const task = TaskSchema.parse({
        id: generateId(),
        type: 'process',
        payload: {},
        priority: 5,
      });

      await agent.execute(task);
      const health = agent.getHealth();

      expect(health.tasksCompleted).toBe(1);
      expect(health.tasksActive).toBe(0);
    });
  });

  describe('lifecycle management', () => {
    it('should stop successfully', async () => {
      await agent.initialize();
      await agent.start();
      await agent.stop();

      expect(agent.status).toBe(AgentStatus.STOPPED);
    });

    it('should not execute tasks when stopped', async () => {
      const task = TaskSchema.parse({
        id: generateId(),
        type: 'process',
        payload: {},
        priority: 5,
      });

      await expect(agent.execute(task)).rejects.toThrow('not available');
    });
  });
});
