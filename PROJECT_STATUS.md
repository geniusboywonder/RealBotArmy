# BotArmy - AI Agent Orchestration System

## Architecture Overview

This project follows the enhanced architecture outlined in the technical specification documents:

```
botarmy/
├── frontend/          # React + Vite + Tailwind CSS
├── backend/           # Python FastAPI + WebSockets  
├── data/              # Persistent storage (JSONL, JSON)
└── tests/             # Testing infrastructure
```

## Quick Start

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:5173

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

The backend API will be available at http://localhost:8000

### Environment Configuration

Copy `.env.example` to `.env` and configure your API keys:

```bash
cp .env.example .env
# Edit .env with your OpenAI and Anthropic API keys
```

## Development Status

### ✅ Completed - Phase 1: Project Setup
- [x] Frontend directory structure with React + Vite + Tailwind CSS
- [x] Backend directory structure with FastAPI
- [x] Core TypeScript type definitions  
- [x] Basic component scaffolding
- [x] WebSocket connection setup
- [x] Development environment configuration

### 🔄 In Progress - Phase 2: Core Infrastructure  
- [ ] Agent store implementation with Zustand
- [ ] WebSocket hooks for real-time communication
- [ ] Message bus architecture
- [ ] LLM provider integration
- [ ] JSONL conversation logging

### 📋 Pending - Phase 3: Agent Orchestration
- [ ] Multi-agent system implementation
- [ ] Conflict resolution with human escalation
- [ ] JSON Patch spec versioning
- [ ] IndexedDB client-side caching

## Architecture Highlights

This implementation follows the technical architecture document specifications:

- **Sequential Agent Orchestration** with real-time human oversight
- **WebSocket-based real-time communication** with auto-reconnection
- **Optimistic UI updates** with server confirmation and rollback
- **Multi-provider LLM integration** with automatic fallback
- **JSON Patch operations** for granular state updates
- **IndexedDB caching** for offline-first functionality

## Next Steps

Follow the `frontend_next_steps_plan.md` for detailed implementation steps. The immediate priorities are:

1. Implement WebSocket hooks for real-time agent communication
2. Build Zustand stores for state management  
3. Create agent-specific console components
4. Add human action queue with priority-based notifications
5. Integrate LLM providers for agent responses

## File Structure

The current scaffolding includes:

### Frontend Components
- **Layout/** - Dashboard, Header, TabNavigation
- **AgentConsole/** - AgentConsole, ConversationView, MessageItem, AgentStatusIndicator  
- **ActionQueue/** - ActionQueue, ActionItem, ActionModal
- **stores/** - Zustand state management (to be implemented)
- **hooks/** - Custom React hooks (to be implemented)
- **types/** - Comprehensive TypeScript definitions

### Backend Infrastructure  
- **main.py** - FastAPI application with WebSocket support
- **models/** - Pydantic models for type safety
- **agents/** - Agent implementations (existing)
- **api/** - REST endpoints (to be implemented)
- **orchestration/** - Message bus and conflict resolution (to be implemented)

This foundation provides a solid base for implementing the full BotArmy system according to the technical specification.
