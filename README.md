# RealBotArmy 🤖

The real bot army - A comprehensive platform for managing and deploying intelligent agents.

[![CI/CD Pipeline](https://github.com/Geniusboywonder/RealBotArmy/actions/workflows/ci.yml/badge.svg)](https://github.com/Geniusboywonder/RealBotArmy/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/Geniusboywonder/RealBotArmy/branch/main/graph/badge.svg)](https://codecov.io/gh/Geniusboywonder/RealBotArmy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Overview

RealBotArmy is designed to create, manage, and coordinate multiple AI agents working together to accomplish complex tasks efficiently and safely.

## ✨ Features

- **🔧 Modular Agent Architecture** - Easy to extend and customize
- **⚡ High Performance** - Efficient task processing and resource management
- **🛡️ Type Safety** - Full TypeScript support with strict typing
- **📊 Monitoring & Health Checks** - Built-in agent monitoring and reporting
- **🔄 Task Queue Management** - Priority-based task scheduling
- **🎯 Capability Matching** - Intelligent task-to-agent assignment
- **🔒 Security First** - Secure by design with proper validation
- **🧪 Comprehensive Testing** - Unit, integration, and end-to-end tests

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/Geniusboywonder/RealBotArmy.git
cd RealBotArmy

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Build the project
npm run build

# Start development server
npm run dev
```

### Basic Usage

```typescript
import { AgentManager, WorkerAgent } from 'realbotarmy';

// Create agent manager
const manager = new AgentManager();
await manager.initialize();
await manager.start();

// Create and register agents
const worker = new WorkerAgent('my-worker');
await manager.registerAgent(worker);
await worker.start();

// Submit a task
manager.submitTask({
  id: 'task-1',
  type: 'process',
  payload: { data: 'Hello World' },
  priority: 5,
});
```

## 📁 Project Structure

```
RealBotArmy/
├── backend/
│   ├── agents/         # Agent implementations
│   ├── core/          # Core functionality
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   ├── config/        # Configuration modules
│   └── index.ts       # Main entry point
├── tests/             # Test files
├── docs/              # Documentation
├── examples/          # Usage examples
├── scripts/           # Utility scripts
└── .github/           # GitHub workflows and templates
```

## 🛠️ Development

### Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server

# Testing
npm test                # Run all tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
npm run test:unit       # Run unit tests only
npm run test:integration # Run integration tests
npm run test:e2e        # Run end-to-end tests

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting
npm run type-check      # Run TypeScript type checking

# Git
npm run commit          # Commit with conventional commits
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
NODE_ENV=development
LOG_LEVEL=info
PORT=3000
MAX_AGENTS=10
DEFAULT_TIMEOUT=30000
# ... see .env.example for all options
```

## 🤖 Agent Types

### WorkerAgent

Basic agent for general task processing:

- Process tasks
- Calculate operations
- Transform data

### Custom Agents

Extend `BaseAgent` to create specialized agents:

```typescript
import { BaseAgent, AgentType, Task } from 'realbotarmy';

class CustomAgent extends BaseAgent {
  constructor(name: string) {
    super(name, AgentType.SPECIALIST, {
      capabilities: ['custom', 'specialized'],
    });
  }

  protected async onExecute(task: Task): Promise<any> {
    // Your custom logic here
    return { result: 'Custom processing complete' };
  }
}
```

## 📊 Monitoring

### Health Checks

All agents provide health status:

```typescript
const health = agent.getHealth();
console.log({
  status: health.status,
  uptime: health.uptime,
  tasksCompleted: health.tasksCompleted,
  memoryUsage: health.memoryUsage,
});
```

### Events

Listen to agent manager events:

```typescript
manager.on('task:completed', event => {
  console.log(`Task ${event.data.taskId} completed`);
});

manager.on('agent:error', event => {
  console.error(`Agent ${event.agentId} error:`, event.data);
});
```

## 🔒 Security

- **Branch Protection** - Main branch requires PR approval
- **Input Validation** - All inputs validated with Zod schemas
- **Type Safety** - Full TypeScript coverage
- **Dependency Scanning** - Automated security checks
- **Rate Limiting** - Built-in rate limiting support

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit: `npm run commit`
6. Push: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 Documentation

- [Getting Started Guide](docs/getting-started.md)
- [API Reference](docs/api-reference.md)
- [Agent Development](docs/agent-development.md)
- [Examples](examples/)

## 🔧 Configuration

See [Configuration Guide](docs/configuration.md) for detailed configuration options.

## 🚀 Deployment

See [Deployment Guide](docs/deployment.md) for production deployment instructions.

## 📈 Roadmap

- [ ] Web UI for agent management
- [ ] Database persistence layer
- [ ] Distributed agent deployment
- [ ] Advanced scheduling algorithms
- [ ] Plugin system
- [ ] REST API endpoints

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with TypeScript and Node.js
- Testing with Jest
- CI/CD with GitHub Actions
- Code quality with ESLint and Prettier

## 💬 Support

- 📝 [Create an issue](https://github.com/Geniusboywonder/RealBotArmy/issues) for bug reports
- 💭 [Start a discussion](https://github.com/Geniusboywonder/RealBotArmy/discussions) for questions
- 📧 Contact the maintainers

---

**Made with ❤️ by the RealBotArmy team**
