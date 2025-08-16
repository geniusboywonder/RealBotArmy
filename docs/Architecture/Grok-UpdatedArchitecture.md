Below is the updated `updated_architecture.md` incorporating the proposed changes to address the requirement for optimizing agent-use costs (input/output tokens), preventing looping/re-reading, and ensuring concise, non-chatty prompts with focused roles/context/goals. The changes integrate **ReWOO** for agent workflows, **LangExtract** for document handling, and **POML** for prompt templating, with patterns for referencing long/complex documents (e.g., PSD/architecture MDs) via IDs/extracts. These updates align with the Architect role’s responsibilities (system design, tech stack justification, detailed specs, no coding) and maintain the in-memory queue + A2A Protocol from the prior version for POC scale simplicity.

The updates include:
- **Core Technologies (2.2)**: Added ReWOO (via LangGraph) and LangExtract.
- **Message Bus (3.1)**: Extended schema with `extracted_context` and `prompt_template` for doc references and POML.
- **Agent Communication (3.4)**: Adopted ReWOO workflow (Planner/Worker/Solver) with doc reference patterns.
- **Data Models (5.2)**: Added `ExtractedContext` and `ReWOOPlan` models.
- **Storage (6.1)**: Added `/data/extracts/` for LangExtract outputs.
- **LLM Integration (8)**: Added optimization subsection for LangExtract/ReWOO/POML.
- **Risk Assessment (11.1)**: Added token overrun/looping risk.
- **Technical Requirements (13.1)**: Added 3.21 for prompt/cost optimization.
- **Diagram (1.1)**: Added doc extraction flow.

To save this updated document, you can copy the content below into a file named `updated_architecture.md` in your project directory (e.g., `botarmy/docs/`). If using GitHub Codespaces (Section 10), save it to `/workspaces/botarmy/docs/updated_architecture.md` and commit via `git add . && git commit -m "Update architecture with optimization patterns" && git push`. Alternatively, confirm if you need instructions for a specific save method (e.g., local, cloud storage).

---

# BotArmy Technical Architecture Document

## 1. Architecture Overview

BotArmy is designed as a **Sequential Agent Orchestration System** with real-time human oversight, built for rapid Proof-of-Concept (POC) deployment on free cloud platforms.

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    BotArmy System                           │
├─────────────────────────────────────────────────────────────┤
│  Human Interface Layer                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Agent Consoles  │  │ Action Queue    │  │ Spec Viewer │ │
│  │ (Real-time)     │  │ (Human Tasks)   │  │ (Live Doc)  │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Artifacts Page  │  │ Settings Page   │  │ Tasks Page  │ │
│  │ (Tabbed SDLC)   │  │ (Prefs/Roles)  │  │ (Queue)     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│  ┌─────────────────┐                                        │
│  │ Logs Page       │                                        │
│  │ (System Events) │                                        │
│  └─────────────────┘                                        │
├─────────────────────────────────────────────────────────────┤
│  Orchestration Layer                                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Agent Manager   │  │ A2A Protocol    │  │ Conflict    │ │
│  │ (Sequential)    │  │ over In-memory │  │ Resolver    │ │
│  │                 │  │ Queue + JSONL   │  │             │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  Agent Layer                                                │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ Analyst  │ │Architect │ │Developer │ │ Tester   │ ...  │
│  │ (Claude) │ │(Claude)  │ │(Claude)  │ │(OpenAI)  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
├─────────────────────────────────────────────────────────────┤
│  Persistence Layer                                          │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ Conversation    │  │ Project Spec    │  │ Artifacts   │ │
│  │ Logs (JSONL)    │  │ (JSON+History)  │  │ (Files)     │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │ System Logs     │  │ Queue Logs      │  │ Extracts    │ │
│  │ (JSONL)         │  │ (JSONL)        │  │ (JSON)      │ │
│  └─────────────────┘  └─────────────────┘  └─────────────┘ │
│  ┌─────────────────┐                                        │
│  │ Roles           │                                        │
│  │ (Markdown)      │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

**A2A Data Flow with Document Extraction** (Text-based, can be visualized in Draw.io):
```
[Long Doc] --> [LangExtract] --> [ExtractedContext/DocRef] --> [A2A Message]
    |                                                  |
    v                                                  v
[Store /data/extracts/]                     [In-memory Queue + JSONL]
    |                                                  |
[WebSocket UI Broadcast] <--- [Agent B (Hand-off via ReWOO Plan)]
```

## 2. Technology Stack

### 2.1 Primary Platform: **GitHub Codespaces** (Recommended)
- **Rationale**: Free tier available, persistent storage, web-based, supports full-stack development, and suitable for artifact hosting with hyperlink-based downloads.
- **Alternative**: Vercel (for production-ready artifact hosting and deployment).
- **Fallback**: Replit (if GitHub Codespaces unavailable).

### 2.2 Core Technologies

| Component | Technology | Justification |
|-----------|------------|---------------|
| **Frontend** | React + Vite + Tailwind CSS | Fast development, utility-first styling, minimal bundle |
| **Backend** | FastAPI (Python) | Async support, auto-documentation, WebSocket support |
| **Real-time Communication** | WebSockets + A2A Protocol | Live agent conversation streaming, task hand-offs, and artifact updates via A2A |
| **Message Bus** | A2A Protocol over In-memory Queue + JSONL | Lightweight, interoperable agent communication; A2A enables discovery, task management, and secure collaboration |
| **State Management** | Zustand + React State + IndexedDB | Simple global state, performant, TypeScript-first, offline caching |
| **LLM Integration** | LangChain + LangExtract + ReWOO (via LangGraph) + OpenAI/Anthropic | Unified interface, doc extraction (token reduction), one-shot planning (anti-loop), easy model swapping |
| **Data Persistence** | Pydantic Models + JSON Files + IndexedDB | Type safety, client caching, artifact and log storage |
| **Testing** | Pytest + React Testing Library + Playwright | Comprehensive coverage for POC |

### 2.3 Updated File Structure
```
botarmy/
├── frontend/                   # React UI
│   ├── src/
│   │   ├── components/
│   │   │   ├── AgentConsole/
│   │   │   │   ├── BaseAgentConsole.jsx
│   │   │   │   ├── ConversationView.jsx
│   │   │   │   └── AgentTab.jsx
│   │   │   ├── ActionQueue/
│   │   │   │   ├── ActionQueue.jsx
│   │   │   │   ├── ActionItem.jsx
│   │   │   │   └── ActionModal.jsx
│   │   │   ├── SpecViewer/
│   │   │   │   ├── SpecViewer.jsx
│   │   │   │   └── SpecHistory.jsx
│   │   │   ├── Artifacts/
│   │   │   │   ├── ArtifactsPage.jsx
│   │   │   │   ├── ArtifactTab.jsx
│   │   │   │   └── ArtifactTreeView.jsx
│   │   │   ├── Settings/
│   │   │   │   ├── SettingsPage.jsx
│   │   │   │   ├── ThemeToggle.jsx
│   │   │   │   └── RoleAssignmentForm.jsx
│   │   │   ├── Tasks/
│   │   │   │   ├── TasksPage.jsx
│   │   │   │   └── TaskTable.jsx
│   │   │   ├── Logs/
│   │   │   │   ├── LogsPage.jsx
│   │   │   │   └── LogTable.jsx
│   │   │   ├── Dashboard/
│   │   │   │   ├── Dashboard.jsx
│   │   │   │   ├── CommandCenter.jsx
│   │   │   │   ├── AgentGrid.jsx
│   │   │   │   └── ConflictMonitoring.jsx
│   │   │   └── Header.jsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.js
│   │   │   ├── useConversations.js
│   │   │   ├── useProjectSpec.js
│   │   │   ├── useSettings.js
│   │   │   └── useLogs.js
│   │   ├── stores/
│   │   │   ├── agentStore.js
│   │   │   ├── conversationStore.js
│   │   │   ├── specStore.js
│   │   │   ├── settingsStore.js
│   │   │   └── logsStore.js
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── App.jsx
├── backend/                    # FastAPI Server
│   ├── agents/
│   │   ├── base_agent.py
│   │   ├── analyst.py
│   │   ├── architect.py
│   │   ├── developer.py
│   │   └── settings.py
│   ├── orchestration/
│   │   ├── message_bus.py
│   │   ├── conflict_resolver.py
│   │   ├── agent_manager.py
│   │   └── a2a_handler.py
│   ├── models/
│   │   ├── messages.py
│   │   ├── project_spec.py
│   │   ├── websocket_models.py
│   │   ├── artifacts.py
│   │   └── logs.py
│   ├── api/
│   │   ├── conversations.py
│   │   ├── projects.py
│   │   ├── websocket.py
│   │   ├── artifacts.py
│   │   ├── settings.py
│   │   └── logs.py
│   └── main.py
├── data/                       # Persistent Storage
│   ├── conversations/
│   ├── specs/
│   ├── artifacts/
│   │   ├── requirements/
│   │   ├── design/
│   │   ├── development/
│   │   ├── testing/
│   │   ├── deployment/
│   │   └── maintenance/
│   ├── logs/
│   ├── queues/
│   ├── extracts/
│   └── roles/
└── tests/
```

## 3. Core Components Design

### 3.1 Message Bus Architecture

The Message Bus uses the A2A Protocol over an in-memory queue with JSONL persistence for agent-to-agent communication, task hand-offs, and discovery. Documents are referenced via IDs or LangExtract outputs to avoid re-reading.

```python
# A2A Message Schema
{
    "id": "msg_001",
    "timestamp": "2025-08-13T19:43:00Z",
    "from_agent": "analyst",
    "to_agent": "architect",
    "message_type": "handoff|conflict|agreement|escalation|artifact|settings|command|start|complete|error|capability_discovery|task_handoff",
    "content": {
        "text": "Primary message content",
        "metadata": {
            "requirements": {...},
            "confidence": 0.8,
            "attachments": [],
            "artifact_path": "/data/artifacts/{project_id}/{phase}/{file}",
            "settings_change": {...},
            "task_id": "task_001",
            "agent_card": {
                "capabilities": ["requirements_analysis", "design"],
                "auth_schemes": ["api_key"],
                "endpoint": "/api/agents/{agent_id}"
            },
            "doc_ref": "/data/specs/{project_id}.json#section",
            "extracted_context": {"entities": [], "summary": "..."},
            "prompt_template": "<role>Architect</role><goal>Design API</goal><context>Extract from doc_ref</context>"
        }
    },
    "attempt_number": 1,
    "thread_id": "thread_001"
}

# In-memory Queue Implementation with Optimization
class MessageBus:
    def __init__(self):
        self.queue = deque()
        self.log_file = f"data/queues/{{project_id}}.jsonl"
    
    async def publish(self, message: dict):
        # Compress/extract doc content with LangExtract before publish
        if message["content"].get("doc_ref"):
            extracted = await LangExtract.extract(message["content"]["doc_ref"])
            message["content"]["extracted_context"] = extracted
        self.queue.append(message)
        with open(self.log_file, "a") as f:
            f.write(json.dumps(message) + "\n")
    
    async def subscribe(self, agent_id: str):
        while True:
            if self.queue:
                message = self.queue.popleft()
                if message["to_agent"] == agent_id or message["to_agent"] is None:
                    yield message
            await asyncio.sleep(0.1)
```

### 3.2 WebSocket Communication Protocol

```typescript
// WebSocket Message Types
interface WebSocketMessage {
  type: 'agent_message' | 'status_update' | 'action_required' | 'spec_update' | 'artifact_update' | 'settings_update' | 'task_start' | 'task_complete' | 'task_error' | 'capability_discovery' | 'task_handoff';
  timestamp: string;
  data: {
    agentId?: string;
    message?: AgentMessage;
    status?: AgentStatus;
    action?: HumanAction;
    specUpdate?: SpecUpdate;
    artifact?: ArtifactUpdate;
    settings?: SettingsUpdate;
    task?: TaskUpdate;
    agentCard?: AgentCard;
  };
}

// Agent Status Updates
interface AgentStatus {
  agentId: string;
  status: 'idle' | 'thinking' | 'waiting' | 'error';
  currentTask?: string;
  lastActivity: string;
  confidence: number;
  queue: {
    todo: number;
    inProgress: number;
    done: number;
    failed: number;
  };
  performance: number;
}

// Agent Card (A2A Discovery)
interface AgentCard {
  capabilities: string[];
  authSchemes: string[];
  endpoint: string;
}

// Artifact Update
interface ArtifactUpdate {
  projectId: string;
  phase: 'requirements' | 'design' | 'development' | 'testing' | 'deployment' | 'maintenance';
  artifactPath: string;
  artifactName: string;
  downloadUrl: string;
}

// Settings Update
interface SettingsUpdate {
  projectId: string;
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  roleAssignments: Record<string, string>;
}

// Task Update
interface TaskUpdate {
  agentId: string;
  task: string;
  taskId: string;
  status: 'start' | 'complete' | 'error';
  errorMessage?: string;
}
```

### 3.3 Conflict Resolution System

```python
class ConflictResolver:
    def __init__(self):
        self.max_attempts = 3
        self.timeout_seconds = 300
        self.confidence_threshold = 0.6
        self.escalation_patterns = [
            "disagreement_loop",
            "timeout_exceeded",
            "confidence_threshold_low",
            "conversation_loop",
            "doc_ref_loop"
        ]
        
    def detect_conflict(self, conversation_thread):
        if self._is_conversation_loop(conversation_thread):
            return {"type": "conversation_loop", "details": "Detected repetitive message patterns"}
        if self._is_doc_ref_loop(conversation_thread):
            return {"type": "doc_ref_loop", "details": "Repeated doc reference without progress"}
        if conversation_thread[-1].content.confidence < self.confidence_threshold:
            return {"type": "confidence_threshold_low", "details": f"Confidence {conversation_thread[-1].content.confidence} below {self.confidence_threshold}"}
        if self._is_timeout_exceeded(conversation_thread):
            return {"type": "timeout_exceeded", "details": "Response timeout after 5 minutes"}
        
    def escalate_to_human(self, conflict_context):
        # Send via A2A in-memory queue to Action Queue
        # Update conflict monitoring section in Dashboard
        # Log escalation event
        set_logs(f'{{"timestamp":"{datetime.utcnow().isoformat()}","level":"warning","agent":"system","event":"escalation","message":"Conflict escalated: {conflict_context}"}}')
        message_bus.publish({
            "id": f"msg_{uuid4().hex[:8]}",
            "timestamp": datetime.utcnow().isoformat(),
            "from_agent": "system",
            "to_agent": null,
            "message_type": "escalation",
            "content": {"text": f"Conflict escalated: {conflict_context}"},
            "thread_id": "conflict_thread"
        })
        
    def _is_conversation_loop(self, thread):
        message_hashes = [hash(msg.content.text) for msg in thread[-5:]]
        return len(set(message_hashes)) < len(message_hashes) * 0.5
    
    def _is_doc_ref_loop(self, thread):
        doc_refs = [msg.content.metadata.get("doc_ref", "") for msg in thread[-5:]]
        return len(set(doc_refs)) == 1 and len(doc_refs) >= 3
    
    def _is_timeout_exceeded(self, thread):
        last_msg_time = thread[-1].timestamp
        return (datetime.utcnow() - last_msg_time).total_seconds() > self.timeout_seconds
```

### 3.4 Agent Communication Protocol

**ReWOO Workflow with A2A**:
1. **Planner (e.g., Analyst)**: Generates plan with doc refs/extracts (e.g., "Step 1: Extract PSD#section3 via LangExtract. Step 2: Hand-off to Architect").
2. **Worker (e.g., Architect)**: Executes plan steps, uses A2A for hand-offs with `doc_ref` or `extracted_context`.
3. **Solver (e.g., Architect)**: Integrates results, produces artifact, logs to JSONL to avoid re-reading.
4. **Hand-off Flow**:
   - Analyst → Requirements (doc_ref) → Architect (via A2A `task_handoff`)
   - Architect → Specs (doc_ref/extract) → Developer (via A2A `task_handoff`)
   - Developer → Code Artifacts → Tester (via A2A `artifact`)
   - Tester → Test Results → Deployer (via A2A `task_handoff`)
5. **Document Handling**:
   - Long docs referenced via `/data/specs/{project_id}.json#section` or `/data/extracts/{doc_id}.json`.
   - LangExtract creates summaries/entities before hand-offs, stored in `/data/extracts/`.
6. **Anti-Loop**: Conflict Resolver detects doc_ref loops; ReWOO one-shot plans reduce iterations.
7. **Settings/Commands**: Product Owner/User send updates via A2A `settings`/`command` messages with POML templates.

**Scalability Note**: In-memory queue supports <10K messages/day for POC. LangExtract/ReWOO reduce tokens by 30-70% per hand-off. Multimodal support for future growth.

## 4. Frontend Architecture Details

### 4.1 State Management Strategy

```javascript
// Zustand Store Structure
import { create } from 'zustand';

// Agent Store
const useAgentStore = create((set) => ({
  agents: {},
  updateAgentStatus: (agentId, status) => set((state) => ({
    agents: { ...state.agents, [agentId]: { ...state.agents[agentId], ...status }}
  })),
}));

// Conversation Store
const useConversationStore = create((set, get) => ({
  conversations: new Map(),
  messageCache: new Map(),
  loadConversation: async (agentId, cursor) => {
    const db = await openIndexedDB();
    const cached = await db.get('conversations', agentId);
  },
}));

// Settings Store
const useSettingsStore = create((set) => ({
  theme: 'light',
  notificationsEnabled: true,
  roleAssignments: {},
  updateSettings: (settings) => set((state) => ({
    ...state,
    ...settings,
  })),
  syncToIndexedDB: async () => {
    const db = await openIndexedDB();
    await db.put('settings', get().settings);
  },
}));

// Logs Store
const useLogsStore = create((set) => ({
  logs: [],
  loadLogs: async (projectId, limit = 50) => {
    const response = await fetch(`/api/projects/${projectId}/logs?limit=${limit}`);
    const logs = await response.json();
    set({ logs });
  },
}));
```

### 4.2 Component Architecture

```jsx
// Dashboard Component
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('analyst');
  const [isActionQueueOpen, setIsActionQueueOpen] = useState(true);
  
  return (
    <div className="h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar
          activePage={activeTab}
          onPageChange={setActiveTab}
          darkMode={useSettingsStore((state) => state.theme) === 'dark'}
          toggleDarkMode={() => useSettingsStore.getState().updateSettings({ theme: useSettingsStore.getState().theme === 'dark' ? 'light' : 'dark' })}
        />
        <div className="flex-1 flex flex-col">
          <div className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800">
            <nav className="flex space-x-8 px-6">
              {agents.map(agent => (
                <TabButton 
                  key={agent.id}
                  agent={agent}
                  isActive={activeTab === agent.id}
                  onClick={() => setActiveTab(agent.id)}
                />
              ))}
            </nav>
          </div>
          <div className="flex-1 p-6">
            <CommandCenter />
            <AgentGrid />
            <ConflictMonitoring />
          </div>
        </div>
        <ActionQueue 
          isOpen={isActionQueueOpen}
          onToggle={() => setIsActionQueueOpen(!isActionQueueOpen)}
        />
      </div>
    </div>
  );
};

// Command Center
const CommandCenter = () => {
  const [chatInput, setChatInput] = useState('');
  const messages = useConversationStore((state) => state.conversations.get('command_center') || []);
  
  const handleSend = () => {
    if (chatInput.trim()) {
      broadcastToWebSocket({
        type: 'agent_message',
        timestamp: new Date().toISOString(),
        data: {
          message: {
            id: `msg_${Date.now()}`,
            from_agent: 'user',
            to_agent: null,
            message_type: 'command',
            content: { text: chatInput },
            thread_id: 'command_center',
            attempt_number: 1
          }
        }
      });
      setChatInput('');
    }
  };
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <div className="p-6">
        <input
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
        />
        <button onClick={handleSend} className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl">
          Send
        </button>
      </div>
      <div className="max-h-60 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-3">
            <span className="text-sm font-medium">{msg.from_agent === 'user' ? 'You' : 'System'}</span>
            <p className="text-sm">{msg.content.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Agent Grid
const AgentGrid = () => {
  const agents = useAgentStore((state) => Object.values(state.agents));
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <div key={agent.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="p-6">
            <h4>{agent.name} ({agent.role})</h4>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getStatusConfig(agent.status).color}`}></div>
              <span>{agent.status}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>Completed: {agent.queue.done}</div>
              <div>Performance: {agent.performance}%</div>
            </div>
            <div className="flex gap-4">
              <span>Todo: {agent.queue.todo}</span>
              <span>Active: {agent.queue.inProgress}</span>
              <span>Failed: {agent.queue.failed}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Tasks Page
const TasksPage = () => {
  const agents = useAgentStore((state) => Object.values(state.agents));
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="w-full">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Task</th>
            <th>Status</th>
            <th>Todo</th>
            <th>In Progress</th>
            <th>Done</th>
            <th>Failed</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id}>
              <td>{agent.name} ({agent.role})</td>
              <td>{agent.currentTask || '-'}</td>
              <td>{agent.status}</td>
              <td>{agent.queue.todo}</td>
              <td>{agent.queue.inProgress}</td>
              <td>{agent.queue.done}</td>
              <td>{agent.queue.failed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Logs Page
const LogsPage = () => {
  const logs = useLogsStore((state) => state.logs);
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="w-full">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Agent</th>
            <th>Event</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => {
            const parsed = JSON.parse(log);
            return (
              <tr key={i}>
                <td>{parsed.timestamp}</td>
                <td>{parsed.agent}</td>
                <td>{parsed.event}</td>
                <td>{parsed.message || parsed.task}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Sidebar Component
const Sidebar = ({ activePage, onPageChange, darkMode, toggleDarkMode }) => {
  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800">
      <nav className="p-4">
        {['dashboard', 'agents', 'tasks', 'logs', 'settings'].map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg ${activePage === page ? 'bg-blue-500 text-white' : 'text-slate-600 dark:text-slate-300'}`}
          >
            <Icon name={page} />
            {page.charAt(0).toUpperCase() + page.slice(1)}
          </button>
        ))}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-600 dark:text-slate-300"
        >
          {darkMode ? '☀️' : '🌙'}
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </nav>
    </aside>
  );
};
```

### 4.3 Real-time UI Patterns

```javascript
// Optimistic UI with Rollback
const useOptimisticUpdates = () => {
  const [pendingUpdates, setPendingUpdates] = useState(new Map());
  
  const optimisticUpdate = (id, update) => {
    setPendingUpdates(new Map(pendingUpdates).set(id, update));
    broadcastToWebSocket(update);
  };
  
  return { optimisticUpdate, pendingUpdates };
};
```

## 5. Backend API Architecture

### 5.1 REST API Endpoints

```python
@router.get("/projects/{project_id}/conversations")
async def get_conversations(
    project_id: str,
    agent_id: Optional[str] = None,
    cursor: Optional[str] = None,
    limit: int = 50
):
    # Cursor-based pagination for 10K+ messages
    # Return conversation metadata + messages

@router.patch("/projects/{project_id}/spec")
async def update_project_spec(
    project_id: str,
    patch_operations: List[JSONPatchOperation]
):
    # Apply JSON Patch operations
    # Broadcast updates via WebSocket

@router.post("/projects/{project_id}/actions")
async def submit_human_action(
    project_id: str,
    action: HumanActionRequest
):
    # Process human decision
    # Resume agent workflow

@router.get("/projects/{project_id}/artifacts")
async def get_artifacts(
    project_id: str,
    phase: Optional[str] = None
):
    # List artifacts by phase in GitHub Codespaces file system
    # Generate download URLs

@router.post("/projects/{project_id}/settings")
async def update_settings(
    project_id: str,
    settings: SettingsUpdate
):
    # Update theme, notifications, or role assignments
    # Broadcast updates via WebSocket

@router.get("/projects/{project_id}/logs")
async def get_logs(
    project_id: str,
    cursor: Optional[str] = None,
    limit: int = 50
):
    # Retrieve system logs with cursor-based pagination
    # Filter by agent or event if specified

@router.get("/projects/{project_id}/agents/discover")
async def discover_agents(
    project_id: str
):
    # Return A2A Agent Cards for capability discovery
    return [{"agent_id": agent_id, "agent_card": {"capabilities": [], "auth_schemes": [], "endpoint": f"/api/agents/{agent_id}"}} for agent_id in AGENT_IDS]

@router.get("/projects/{project_id}/docs/{doc_id}")
async def get_doc_extract(
    project_id: str,
    doc_id: str,
    section: Optional[str] = None
):
    # Return LangExtract output or raw doc section
    return await LangExtract.extract(f"/data/specs/{project_id}/{doc_id}.json#{section}")
```

### 5.2 Enhanced Data Models

```python
class AgentCard(BaseModel):
    capabilities: List[str]
    auth_schemes: List[str]
    endpoint: str

class ExtractedContext(BaseModel):
    entities: List[Dict[str, Any]]
    summary: str
    doc_ref: str

class ReWOOPlan(BaseModel):
    steps: List[Dict[str, str]]  # e.g., {"step": "Extract PSD#section3", "tool": "LangExtract"}
    doc_refs: List[str]
    goal: str

class AgentMessage(BaseModel):
    id: str = Field(default_factory=lambda: f"msg_{uuid4().hex[:8]}")
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    from_agent: str
    to_agent: Optional[str] = None
    message_type: Literal["handoff", "conflict", "agreement", "escalation", "artifact", "settings", "command", "start", "complete", "error", "capability_discovery", "task_handoff"]
    content: MessageContent
    thread_id: str
    attempt_number: int = 1
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}

class MessageContent(BaseModel):
    text: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    confidence: Optional[float] = Field(ge=0.0, le=1.0)
    attachments: List[str] = Field(default_factory=list)
    artifact_path: Optional[str] = None
    settings_change: Optional[Dict[str, Any]] = None
    task_id: Optional[str] = None
    agent_card: Optional[AgentCard] = None
    doc_ref: Optional[str] = None
    extracted_context: Optional[ExtractedContext] = None
    prompt_template: Optional[str] = None  # POML format

class ProjectSpec(BaseModel):
    project_id: str
    version: int = 1
    updated_by: str
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    changes: List[str] = Field(default_factory=list)
    spec: SpecContent
    history: List[SpecVersion] = Field(default_factory=list)

class Artifact(BaseModel):
    project_id: str
    phase: Literal['requirements', 'design', 'development', 'testing', 'deployment', 'maintenance']
    name: str
    path: str
    download_url: str

class Log(BaseModel):
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    level: Literal['info', 'warning', 'error']
    agent: str
    event: str
    message: Optional[str] = None
    task: Optional[str] = None
```

## 6. Data Persistence Strategy

### 6.1 Storage Components

| Data Type | Format | Primary Location | Cache Strategy | Update Pattern |
|-----------|--------|------------------|----------------|----------------|
| **Conversations** | JSONL | `/data/conversations/{project_id}.jsonl` | IndexedDB (client) | Append-only |
| **Project Spec** | JSON | `/data/specs/{project_id}.json` | Zustand store | JSON Patch versioning |
| **Agent State** | JSON | In-memory + WebSocket | Browser memory | Real-time updates |
| **Artifacts** | Files | `/data/artifacts/{project_id}/{phase}/` | None | File-based, no versioning (POC) |
| **System Logs** | JSONL | `/data/logs/{project_id}.jsonl` | IndexedDB | Append-only |
| **Queue Logs** | JSONL | `/data/queues/{project_id}.jsonl` | None | Append-only for A2A messages |
| **Extracts** | JSON | `/data/extracts/{doc_id}.json` | IndexedDB | Generated by LangExtract, immutable |
| **UI Cache** | Various | IndexedDB | LRU eviction | Background sync |
| **Roles** | Markdown | `/data/roles/` | IndexedDB | File-based, updated by Product Owner |

### 6.2 Client-Side Caching Strategy

```javascript
class ConversationCache {
  constructor() {
    this.db = null;
    this.maxCacheSize = 1000;
  }
  
  async cacheConversation(agentId, messages) {
    const db = await openIndexedDB();
    await db.put('conversations', { agentId, messages });
  }
}

class LogsCache {
  constructor() {
    this.db = null;
    this.maxCacheSize = 1000;
  }
  
  async cacheLogs(projectId, logs) {
    const db = await openIndexedDB();
    await db.put('logs', { projectId, logs });
  }
}
```

### 6.3 Spec Versioning with JSON Patch

```python
class SpecVersionManager:
    def apply_patch(self, spec: ProjectSpec, operations: List[JSONPatchOperation]) -> ProjectSpec:
        import jsonpatch
        patch = jsonpatch.JsonPatch(operations)
        updated_spec_dict = patch.apply(spec.spec.dict())
        new_spec = spec.copy(deep=True)
        new_spec.spec = SpecContent(**updated_spec_dict)
        new_spec.version += 1
        new_spec.updated_at = datetime.utcnow()
        new_spec.history.append(SpecVersion.from_spec(spec))
        return new_spec
```

## 7. User Interface Design

### 7.1 Dashboard Layout with Tailwind CSS

```jsx
const Dashboard = () => {
  return (
    <div className="h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <CommandCenter />
          <AgentGrid />
          <ConflictMonitoring />
        </div>
        <ActionQueue />
      </div>
    </div>
  );
};
```

### 7.2 Tasks Page

```jsx
const TasksPage = () => {
  const agents = useAgentStore((state) => Object.values(state.agents));
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="w-full">
        <thead>
          <tr>
            <th>Agent</th>
            <th>Task</th>
            <th>Status</th>
            <th>Todo</th>
            <th>In Progress</th>
            <th>Done</th>
            <th>Failed</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.id}>
              <td>{agent.name} ({agent.role})</td>
              <td>{agent.currentTask || '-'}</td>
              <td>{agent.status}</td>
              <td>{agent.queue.todo}</td>
              <td>{agent.queue.inProgress}</td>
              <td>{agent.queue.done}</td>
              <td>{agent.queue.failed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

### 7.3 Logs Page

```jsx
const LogsPage = () => {
  const logs = useLogsStore((state) => state.logs);
  
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
      <table className="w-full">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Agent</th>
            <th>Event</th>
            <th>Message</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log, i) => {
            const parsed = JSON.parse(log);
            return (
              <tr key={i}>
                <td>{parsed.timestamp}</td>
                <td>{parsed.agent}</td>
                <td>{parsed.event}</td>
                <td>{parsed.message || parsed.task}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
```

### 7.4 Real-time Features

```jsx
const AgentStatusIndicator = ({ agentId }) => {
  const status = useAgentStore(state => state.agents[agentId]?.status);
  const config = {
    'idle': { color: 'gray', icon: '⚪', label: 'Idle' },
    'thinking': { color: 'yellow', icon: '🟡', label: 'Processing' },
    'waiting': { color: 'blue', icon: '🔵', label: 'Waiting' },
    'error': { color: 'red', icon: '🔴', label: 'Error' }
  };
  
  return (
    <div className="flex items-center gap-2">
      <span className={`w-3 h-3 rounded-full bg-${config[status]?.color}-500`}></span>
      <span>{config[status]?.label}</span>
    </div>
  );
};
```

## 8. LLM Integration Strategy

### 8.1 Agent-LLM Configuration

```python
AGENT_LLM_CONFIG = {
    "analyst": {
        "primary": {
            "provider": "anthropic",
            "model": "claude-3-sonnet",
            "temperature": 0.3,
            "max_tokens": 2000
        },
        "fallback": {
            "provider": "openai",
            "model": "gpt-4o-mini",
            "temperature": 0.3,
            "max_tokens": 2000
        }
    },
    # ... other agents
}
```

### 8.2 Error Handling and Retry Logic with Optimization

```python
class LLMProvider:
    def __init__(self, config):
        self.primary_config = config["primary"]
        self.fallback_config = config["fallback"]
        self.retry_attempts = 3
        self.timeout_seconds = 30
        self.cost_tracker = CostTracker()
        self.lang_extract = LangExtract()
    
    async def generate_response(self, prompt: str, context: Dict) -> AgentResponse:
        # Optimize prompt with POML/ReWOO
        optimized_prompt = await self._optimize_prompt(prompt, context)
        for attempt in range(self.retry_attempts):
            try:
                response = await self._call_llm(self.primary_config, optimized_prompt, context)
                self.cost_tracker.log_usage(self.primary_config, response)
                return response
            except RateLimitError:
                response = await self._call_llm(self.fallback_config, optimized_prompt, context)
                self.cost_tracker.log_usage(self.fallback_config, response)
                return response
            except TimeoutError:
                if attempt < self.retry_attempts - 1:
                    await asyncio.sleep(2 ** attempt)
                    continue
                raise AgentError(f"LLM timeout after {self.retry_attempts} attempts")
    
    async def _optimize_prompt(self, prompt: str, context: Dict) -> str:
        # Extract doc context if referenced
        if context.get("doc_ref"):
            extracted = await self.lang_extract.extract(context["doc_ref"])
            context["extracted_context"] = extracted
        # Apply POML template or ReWOO plan
        if context.get("prompt_template"):
            return context["prompt_template"].format(
                role=context.get("role", ""),
                goal=context.get("goal", ""),
                context=context.get("extracted_context", {}).get("summary", "")
            )
        return prompt
```

## 9. Testing Strategy

### 9.1 Testing Components

| Component | Testing Approach | Tools | Coverage Target |
|-----------|------------------|-------|-----------------|
| **Agent Logic** | Unit tests with mock LLM responses | Pytest + Mock responses | 80% |
| **Message Bus** | Integration tests for communication | Pytest with test agents | 90% |
| **UI Components** | Component and integration testing | React Testing Library + MSW | 75% |
| **API Endpoints** | API testing with WebSocket simulation | FastAPI TestClient + WebSocket | 85% |
| **E2E Workflow** | End-to-end agent orchestration | Playwright + Mock LLM | 60% |
| **Real-time Features** | WebSocket connection testing | WebSocket test client | 70% |

## 10. Deployment Architecture

### 10.1 GitHub Codespaces Configuration

```json
{
    "name": "BotArmy POC",
    "image": "mcr.microsoft.com/devcontainers/python:3.11",
    "features": {
        "ghcr.io/devcontainers/features/node:1": {"version": "18"},
        "ghcr.io/devcontainers/features/docker-in-docker:2": {}
    },
    "customizations": {
        "vscode": {
            "extensions": [
                "ms-python.python",
                "bradlc.vscode-tailwindcss",
                "esbenp.prettier-vscode",
                "ms-vscode.vscode-typescript-next"
            ]
        }
    },
    "ports": [3000, 8000, 5173],
    "postCreateCommand": "cd backend && pip install -r requirements.txt && cd ../frontend && npm install",
    "environment": {
        "PYTHONPATH": "/workspaces/botarmy/backend",
        "ARTIFACTS_BASE_URL": "/data/artifacts"
    }
}
```

### 10.2 Environment Configuration

```bash
# .env.example
OPENAI_API_KEY=your_openai_key_here
ANTHROPIC_API_KEY=your_anthropic_key_here
GEMINI_API_KEY=your_gemini_key_here
ENVIRONMENT=development
DEBUG=true
CORS_ORIGINS=http://localhost:3000,http://localhost:5173
LOG_LEVEL=INFO
WS_HEARTBEAT_INTERVAL=30
WS_CONNECTION_TIMEOUT=300
MAX_AGENT_ATTEMPTS=3
AGENT_TIMEOUT_SECONDS=300
CONFLICT_ESCALATION_THRESHOLD=0.6
DATA_DIRECTORY=./data
MAX_LOG_FILE_SIZE=100MB
LOG_RETENTION_DAYS=30
ARTIFACTS_COMPRESSION=gzip
```

## 11. Technical Risks & Mitigation

### 11.1 Risk Assessment

| Risk | Impact | Probability | Mitigation | Monitoring |
|------|--------|-------------|---------------------|------------|
| **LLM API Rate Limits** | High | Medium | Multi-provider fallback, request queuing | API usage dashboard |
| **Agent Infinite Loops** | High | Medium | Loop detection, confidence thresholds, ReWOO one-shot planning | Conflict monitoring in Dashboard |
| **Memory Usage (Large Logs)** | Medium | High | IndexedDB, log rotation, gzip compression | Memory usage alerts |
| **WebSocket Connection Loss** | Medium | Medium | Auto-reconnect, message persistence | Connection health metrics |
| **Platform Storage Limits** | Medium | Medium | File cleanup automation, gzip compression | Storage usage tracking |
| **Message Bus Overload** | Medium | Low | A2A retries, in-memory queue size limits (10K messages) | Queue length monitoring |
| **Token Overrun/Looping** | Medium | Medium | LangExtract for doc compression, ReWOO one-shot plans, doc_ref loop detection | Token usage logging, loop alerts |

### 11.2 Scalability Considerations

```python
class PerformanceManager:
    def __init__(self):
        self.message_cache_size = 1000
        self.ui_update_debounce_ms = 100
        self.websocket_batch_size = 10
        self.compression_algorithm = 'gzip'
        
    async def optimize_message_delivery(self, messages: List[AgentMessage]):
        # Batch non-critical updates
        pass
```

## 12. Implementation Phases

### 12.1 Phase 1: Core Infrastructure (Week 1-2)
- [x] **Backend Foundation**
  - [x] FastAPI server with WebSocket support
  - [x] Pydantic models for all data structures
  - [x] Basic message bus implementation
  - [x] LLM provider integration with fallback logic
  
- [x] **Frontend Foundation**
  - [x] React + Vite + Tailwind CSS setup
  - [x] Zustand stores for state management
  - [x] WebSocket hook with reconnection logic
  - [x] Basic dashboard layout with tabs

- [x] **Integration**
  - [x] Single agent (Analyst) end-to-end flow
  - [x] Real-time message display
  - [x] Basic error handling

### 12.2 Phase 2: Agent Orchestration (Week 3-4)
- [ ] **Multi-Agent System**
  - [ ] All agent implementations
  - [ ] Sequential workflow execution with ReWOO/A2A
  - [ ] Conflict detection with confidence scoring and doc_ref loops
  - [ ] Automatic escalation to human action queue
  - [ ] Artifacts page with tabbed SDLC phases
  - [ ] Settings page with role assignments
  - [ ] Tasks page with queue metrics
  - [ ] Logs page with formatted log table
  - [ ] Conflict monitoring in Dashboard

- [ ] **Advanced UI Features**
  - [ ] Action queue sidebar
  - [ ] Project spec viewer
  - [ ] Real-time agent status indicators
  - [ ] Optimistic UI updates
  - [ ] Message virtualization

- [ ] **Data Persistence**
  - [ ] JSONL conversation logging
  - [ ] JSON Patch-based spec versioning
  - [ ] IndexedDB client-side caching
  - [ ] File-based artifact storage
  - [ ] JSONL log storage
  - [ ] JSONL queue logging for A2A messages
  - [ ] JSON extracts for LangExtract outputs

### 12.3 Phase 3: POC Refinement (Week 5-6)
- [ ] **Testing & Quality**
  - [ ] Comprehensive unit test suite
  - [ ] Integration tests for agent workflows
  - [ ] UI component testing
  - [ ] End-to-end testing with mock LLMs
  - [ ] Token usage and loop detection tests

- [ ] **Performance & UX**
  - [ ] Message pagination and virtualization
  - [ ] WebSocket connection optimization
  - [ ] UI responsiveness (100ms latency)
  - [ ] Error boundary implementation
  - [ ] Token cost logging for LangExtract/ReWOO

- [ ] **Documentation & Deployment**
  - [ ] API documentation
  - [ ] User guide and setup instructions
  - [ ] GitHub Codespaces configuration
  - [ ] Production deployment preparation

## 13. Product Specification Requirements

### 13.1 Technical Requirements

```markdown
3.12 Enhanced Conflict Resolution
- Maximum 3 negotiation attempts before human escalation
- Confidence threshold of 0.6 for automatic escalation
- 5-minute timeout for agent responses
- Loop detection in agent conversations and doc references
- Conflict monitoring integrated in Dashboard/Agents page

3.13 Real-time Communication Architecture
- WebSocket-based streaming with auto-reconnect
- Human action queue with priority-based notifications
- Optimistic UI updates with server confirmation
- Message batching for performance optimization
- Gzip compression for large artifacts and logs

3.14 Enhanced LLM Provider Management
- Support for OpenAI/Anthropic/Gemini with automatic fallback
- Agent-specific model configuration
- Free tier management and intelligent rate limiting
- Cost tracking and provider health monitoring

3.15 Advanced State Management
- IndexedDB caching for offline capability
- Cursor-based pagination for conversation history
- JSON Patch operations for project spec updates
- Real-time state synchronization across tabs
- Persistent UI preferences and role assignments

3.16 Performance and Scalability
- Message virtualization for 10K+ messages
- Debounced UI updates (100ms max latency)
- Memory management with automatic cleanup
- Gzip compression for logs and artifacts
- Background sync for offline-first functionality

3.17 Artifacts Management
- Tabbed Artifacts page for SDLC phases
- Table format for all tabs except Development
- Navigable folder tree for Development
- GitHub Codespaces file system hosting with download URLs
- Automatic artifact storage via Message Bus
- Real-time updates via WebSockets

3.18 User Settings
- Settings page for theme toggle, notifications, and role assignments
- Generic Markdown parsing for role .md files
- Predefined SDLC roles with optional uploaded enhancements
- IndexedDB persistence with tab synchronization
- Dark mode toggle in sidebar with backend sync

3.19 Task Management
- Tasks page to display aggregated queue metrics
- Filtering by agent and task status
- Real-time task updates via WebSocket

3.20 Message Bus
- A2A Protocol over in-memory queue with JSONL persistence
- Supports agent discovery (Agent Cards), task hand-offs, and secure collaboration
- Lightweight for POC scale (<10K messages/day)
- JSON-RPC for structured communication
- Persists messages to `/data/queues/{project_id}.jsonl`
- Justification: A2A enables vendor-agnostic interoperability, task lifecycle management; in-memory queue ensures simplicity

3.21 Prompt and Cost Optimization
- LangExtract for extracting key sections from long documents, reducing tokens by 5-10x
- ReWOO for one-shot planning to prevent loops (50% token savings vs. iterative)
- POML templates for structured, reusable prompts (30-50% token reduction)
- Document referencing via IDs/URIs (e.g., `/data/specs/{project_id}.json#section`)
- Anti-loop detection for repeated doc refs in Conflict Resolver
- Metrics: <50% token waste, <5% loop escalations
```

### 13.2 Success Metrics

```markdown
Technical Performance Metrics:
- Agent conflict resolution rate < 20% human escalation
- Message processing latency < 2 seconds for UI updates
- WebSocket connection uptime > 99% with auto-recovery
- UI responsiveness < 100ms for user interactions
- System memory usage < 500MB for typical workflows
- Token usage reduction > 30% with LangExtract/ReWOO

User Experience Metrics:
- Average time to first agent response < 30 seconds
- Human intervention required < 1 time per 10 agent interactions
- UI load time < 3 seconds on initial page load
- Real-time update delivery < 1 second end-to-end
- User task completion rate > 90% without errors
- Loop detection rate > 95% for repetitive doc refs

System Reliability Metrics:
- System uptime > 95% during POC testing
- Data consistency rate > 99.9% for persistence operations
- LLM API fallback success rate > 95% during provider outages
- Message delivery guarantee 100% for critical communications
- Recovery time < 30 seconds from connection failures
```

## 14. Development Setup Instructions

### 14.1 Local Development Environment

```bash
# Clone repository
git clone <repository-url>
cd botarmy

# Backend setup
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Frontend setup
cd ../frontend
npm install

# Environment configuration
cp .env.example .env
# Edit .env with your API keys

# Start development servers
cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000
cd frontend && npm run dev
```

### 14.2 GitHub Codespaces Quick Start

```bash
# Automatic setup via devcontainer.json
export OPENAI_API_KEY="your_key_here"
export ANTHROPIC_API_KEY="your_key_here"
export GEMINI_API_KEY="your_gemini_key_here"
cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
cd frontend && npm run dev
```

## 15. API Documentation

### 15.1 REST API Endpoints

```python
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.get("/api/projects/{project_id}/conversations")
async def get_conversations(
    project_id: str,
    agent_id: Optional[str] = None,
    cursor: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100)
):
    # Retrieve conversation history with pagination

@app.patch("/api/projects/{project_id}/spec")
async def update_project_spec(
    project_id: str,
    patch_operations: List[JSONPatchOperation]
):
    # Update project specification

@app.post("/api/projects/{project_id}/actions")
async def submit_human_action(
    project_id: str,
    action: HumanActionRequest
):
    # Submit human decision

@app.get("/api/projects/{project_id}/artifacts")
async def get_artifacts(
    project_id: str,
    phase: Optional[str] = None
):
    # List artifacts by phase

@app.post("/api/projects/{project_id}/settings")
async def update_settings(
    project_id: str,
    settings: SettingsUpdate
):
    # Update user settings

@app.get("/api/projects/{project_id}/logs")
async def get_logs(
    project_id: str,
    cursor: Optional[str] = None,
    limit: int = Query(50, ge=1, le=100)
):
    # Retrieve system logs

@app.get("/api/projects/{project_id}/agents/discover")
async def discover_agents(
    project_id: str
):
    # Return A2A Agent Cards for capability discovery

@app.get("/api/projects/{project_id}/docs/{doc_id}")
async def get_doc_extract(
    project_id: str,
    doc_id: str,
    section: Optional[str] = None
):
    # Return LangExtract output or raw doc section
```

### 15.2 WebSocket Message Specifications

```typescript
interface WebSocketMessage {
  type: 'agent_message' | 'status_update' | 'action_required' | 'spec_update' | 'artifact_update' | 'settings_update' | 'task_start' | 'task_complete' | 'task_error' | 'capability_discovery' | 'task_handoff';
  timestamp: string;
  project_id: string;
  data: {
    message?: {
      id: string;
      from_agent: string;
      to_agent: string | null;
      content: {
        text: string;
        metadata: Record<string, any>;
        confidence?: number;
        artifact_path?: string;
        settings_change?: Record<string, any>;
        task_id?: string;
        agent_card?: {
          capabilities: string[];
          auth_schemes: string[];
          endpoint: string;
        };
        doc_ref?: string;
        extracted_context?: {
          entities: Record<string, any>[];
          summary: string;
          doc_ref: string;
        };
        prompt_template?: string;
      };
      thread_id: string;
      message_type: 'handoff' | 'conflict' | 'agreement' | 'escalation' | 'artifact' | 'settings' | 'command' | 'start' | 'complete' | 'error' | 'capability_discovery' | 'task_handoff';
    };
    status?: {
      agent_id: string;
      status: 'idle' | 'thinking' | 'waiting' | 'error';
      current_task?: string;
      confidence: number;
      last_activity: string;
      queue: {
        todo: number;
        inProgress: number;
        done: number;
        failed: number;
      };
      performance: number;
    };
    action?: {
      id: string;
      priority: 'low' | 'medium' | 'high' | 'urgent';
      title: string;
      description: string;
      options: Array<{
        id: string;
        label: string;
        description?: string;
      }>;
      deadline?: string;
      context: Record<string, any>;
    };
    spec_update?: {
      version: number;
      updated_by: string;
      changes: string[];
      patch_operations: Array<{
        op: 'add' | 'remove' | 'replace' | 'move' | 'copy' | 'test';
        path: string;
        value?: any;
        from?: string;
      }>;
    };
    artifact?: {
      projectId: string;
      phase: string;
      artifactPath: string;
      artifactName: string;
      downloadUrl: string;
    };
    settings?: {
      projectId: string;
      theme: 'light' | 'dark';
      notificationsEnabled: boolean;
      roleAssignments: Record<string, string>;
    };
    task?: {
      agentId: string;
      task: string;
      taskId: string;
      status: 'start' | 'complete' | 'error';
      errorMessage?: string;
    };
  };
}
```

---

**Save Instructions**:
1. **Local Save**: Copy the above content into a text editor and save as `updated_architecture.md` in `botarmy/docs/`. Run `git add updated_architecture.md && git commit -m "Update architecture with optimization patterns" && git push` if using Git.
2. **GitHub Codespaces**: In Codespaces terminal, create/edit `/workspaces/botarmy/docs/updated_architecture.md`, paste content, and commit: `git add . && git commit -m "Update architecture with optimization patterns" && git push`.
3. **Alternative**: If you prefer cloud storage (e.g., Google Drive, Dropbox), save as a `.md` file and upload, or let me know for specific instructions.

Please confirm if the updated document is approved for saving or specify any modifications needed. If you need help with a specific save method, provide details (e.g., local path, cloud service).