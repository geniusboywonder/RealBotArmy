import React, { useState, useEffect, useRef } from "react";

// Simple icon components to replace lucide-react
const Home = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const Send = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="22" y1="2" x2="11" y2="13"/>
    <polygon points="22,2 15,22 11,13 2,9 22,2"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"/>
  </svg>
);

const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6"/>
  </svg>
);

const Terminal = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="4,17 10,11 4,5"/>
    <line x1="12" y1="19" x2="20" y2="19"/>
  </svg>
);

const AlertCircle = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const CheckCircle = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 12l2 2 4-4"/>
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

const Clock = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const User = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const FileText = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
  </svg>
);

const ClipboardList = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
    <path d="m16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
    <path d="m9 14 2 2 4-4"/>
  </svg>
);

const Sliders = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="4" y1="21" x2="4" y2="14"/>
    <line x1="4" y1="10" x2="4" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="12"/>
    <line x1="12" y1="8" x2="12" y2="3"/>
    <line x1="20" y1="21" x2="20" y2="16"/>
    <line x1="20" y1="12" x2="20" y2="3"/>
    <line x1="1" y1="14" x2="7" y2="14"/>
    <line x1="9" y1="8" x2="15" y2="8"/>
    <line x1="17" y1="16" x2="23" y2="16"/>
  </svg>
);

const Circle = ({ className }) => (
  <svg className={className} width="12" height="12" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="currentColor"/>
  </svg>
);

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "Agent Manager initialized.", type: "system" },
  ]);
  const [agents, setAgents] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      role: i % 3 === 0 ? "Researcher" : i % 3 === 1 ? "Writer" : "Editor",
      status: "idle",
      queue: { todo: Math.floor(Math.random() * 3), inProgress: 0, done: Math.floor(Math.random() * 5), failed: 0 },
      currentTask: null,
      chat: [],
      handoff: null,
      expanded: false,
    }))
  );

  const chatEndRef = useRef(null);
  const logsEndRef = useRef(null);
  const [logs, setLogs] = useState([
    `{"agent":"System","task":"boot","level":"info","msg":"Agent Manager initialized","ts":"${new Date().toISOString()}"}`,
  ]);

  // Simulate live behavior
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) => {
        const next = prev.map((agent) => {
          let updated = { ...agent };
          const roll = Math.random();

          if (roll < 0.02) {
            const newStatus = ["working", "idle", "error"][Math.floor(Math.random() * 3)];
            updated.status = newStatus;

            if (newStatus === "working") {
              const tasks = ["Research topic", "Write draft", "Review content", "Format output", "Verify sources"];
              updated.currentTask = tasks[Math.floor(Math.random() * tasks.length)];
              updated.queue.inProgress = 1;
              updated.queue.todo = Math.max(0, updated.queue.todo - 1);

              setChatMessages((m) => [
                ...m,
                {
                  id: Date.now(),
                  text: `Agent ${agent.id} started: "${updated.currentTask}"`,
                  type: "agent",
                },
              ]);
              setLogs((l) => [
                ...l,
                `{"agent":"Agent${agent.id}","task":"start","level":"info","msg":"Started task: ${updated.currentTask}","ts":"${new Date().toISOString()}"}`,
              ]);
            }

            if (newStatus === "error") {
              updated.queue.failed += 1;
              updated.queue.inProgress = 0;
              const errorMsg = ["Auth failed", "Rate limited", "Timeout", "Missing data"][Math.floor(Math.random() * 4)];
              updated.currentTask = null;

              setChatMessages((m) => [
                ...m,
                {
                  id: Date.now(),
                  text: `Agent ${agent.id} failed: ${errorMsg}`,
                  type: "error",
                },
              ]);
              setLogs((l) => [
                ...l,
                `{"agent":"Agent${agent.id}","task":"error","level":"error","msg":"${errorMsg}","ts":"${new Date().toISOString()}"}`,
              ]);
            }

            if (newStatus === "idle") {
              if (agent.currentTask) {
                updated.queue.done += 1;
                updated.queue.inProgress = 0;
                setChatMessages((m) => [
                  ...m,
                  {
                    id: Date.now(),
                    text: `Agent ${agent.id} completed: "${agent.currentTask}"`,
                    type: "success",
                  },
                ]);
              }
              updated.currentTask = null;
            }
          }

          if (roll < 0.01 && agent.status === "working" && !agent.handoff) {
            const otherAgent = Math.floor(Math.random() * 6) + 1;
            if (otherAgent !== agent.id) {
              updated.handoff = `Agent ${otherAgent}`;
              setChatMessages((m) => [
                ...m,
                {
                  id: Date.now(),
                  text: `Agent ${agent.id} handing off to ${otherAgent}`,
                  type: "handoff",
                },
              ]);
            }
          }

          return updated;
        });
        return next;
      });
    }, 3000);

    const logInterval = setInterval(() => {
      const msgs = [
        { text: "All agents responsive.", type: "system" },
        { text: "Health check passed.", type: "system" },
        { text: "Task queue optimized.", type: "system" },
      ];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      setChatMessages((m) => [...m, { id: Date.now(), ...msg }]);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, []);

  useEffect(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), [chatMessages]);
  useEffect(() => logsEndRef.current?.scrollIntoView({ behavior: "auto" }), [logs]);

  const toggleAgentExpand = (id) =>
    setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, expanded: !a.expanded } : a)));

  const navItems = [
    { name: "Dashboard", icon: Home, id: "dashboard" },
    { name: "Tasks", icon: ClipboardList, id: "tasks" },
    { name: "Logs", icon: Terminal, id: "logs" },
    { name: "Settings", icon: Sliders, id: "settings" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "working": return "bg-emerald-500";
      case "error": return "bg-red-500";
      default: return "bg-gray-400";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Researcher": return "text-blue-600 dark:text-blue-400";
      case "Writer": return "text-purple-600 dark:text-purple-400";
      default: return "text-amber-600 dark:text-amber-400";
    }
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? "dark" : ""}`}>
      <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 min-h-screen">
        {/* Header */}
        <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white p-4 shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Agent Manager
            </h1>
            <div className="flex gap-3 text-sm opacity-90">
              <span className="flex items-center gap-1">
                <Circle className={`w-3 h-3 fill-current ${getStatusColor(agents.some(a => a.status === "error") ? "error" : "working")}`} />
                {agents.some(a => a.status === "error") ? "Errors" : "Running"}
              </span>
              <span>Active: {agents.filter(a => a.status === "working").length}/10</span>
              <span>Queue: {agents.reduce((sum, a) => sum + a.queue.todo + a.queue.inProgress, 0)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 rounded hover:bg-white/20"
            >
              {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 rounded bg-white/20 text-sm"
            >
              {darkMode ? "◐" : "◑"}
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <nav className={`flex-shrink-0 border-r bg-white dark:bg-gray-800 transition-all ${sidebarCollapsed ? "w-16" : "w-60"}`}>
            <div className="p-3 space-y-1">
              {navItems.map((item) => (
                <div key={item.id} className="group relative">
                  <button
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
                      activePage === item.id
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <item.icon />
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </button>
                  {sidebarCollapsed && (
                    <div className="fixed left-16 ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded pointer-events-none opacity-0 group-hover:opacity-100 z-50 whitespace-nowrap">
                      {item.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto">
            {/* Dashboard */}
            {activePage === "dashboard" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300">
                  Dashboard
                </h2>

                {/* Chat */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 h-60 flex flex-col">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-1 overflow-y-auto space-y-2">
                    {chatMessages.slice(-8).map((msg, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 text-sm ${
                          msg.type === "error"
                            ? "text-red-600 dark:text-red-400"
                            : msg.type === "success"
                            ? "text-emerald-600 dark:text-emerald-400"
                            : msg.type === "handoff"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {msg.type === "error" && <AlertCircle />}
                        {msg.type === "success" && <CheckCircle />}
                        {msg.type === "handoff" && <User />}
                        {msg.type === "system" && <FileText />}
                        <span className="font-mono">• {msg.text}</span>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex gap-2">
                    <input
                      type="text"
                      placeholder="Send instruction..."
                      className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700"
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && e.target.value) {
                          setChatMessages((m) => [...m, { id: Date.now(), text: `You: ${e.target.value}`, type: "user" }]);
                          e.target.value = "";
                        }
                      }}
                    />
                    <button className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded hover:from-blue-700 hover:to-purple-700">
                      <Send />
                    </button>
                  </div>
                </div>

                {/* Agents Grid */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300">
                    Agents
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent) => (
                      <div
                        key={agent.id}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-5 hover:shadow-lg transition cursor-pointer"
                        onClick={() => toggleAgentExpand(agent.id)}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">Agent {agent.id}</h3>
                          <div className="flex items-center gap-2">
                            <span className={`${getRoleColor(agent.role)} text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-700`}>
                              {agent.role}
                            </span>
                            <Circle className={`w-3 h-3 fill-current ${getStatusColor(agent.status)}`} />
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3 capitalize">
                          {agent.status === "working" && <><Clock className="inline mr-1 text-emerald-500" /> Working</>}
                          {agent.status === "error" && <><AlertCircle className="inline mr-1 text-red-500" /> Error</>}
                          {agent.status === "idle" && "Idle"}
                        </div>
                        <div className="text-xs text-gray-500 mb-3">
                          Queue: {agent.queue.todo} todo, {agent.queue.inProgress} in progress
                        </div>
                        {agent.currentTask && (
                          <div className="mb-3 p-2 bg-gray-50 dark:bg-gray-700/50 rounded text-xs truncate">
                            <span className="font-medium">Task:</span> {agent.currentTask}
                          </div>
                        )}
                        {agent.handoff && (
                          <div className="text-xs text-amber-600 dark:text-amber-400">🔄 Handing to {agent.handoff}</div>
                        )}
                        {agent.expanded && (
                          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs">
                            <div className="font-mono text-gray-600 dark:text-gray-400 space-y-1 h-16 overflow-y-auto">
                              {agent.chat.length ? agent.chat.map((msg, i) => <div key={i}>• {msg}</div>) : <div className="text-gray-400">No history</div>}
                            </div>
                            <div className="mt-2 text-gray-500 dark:text-gray-400">
                              Done: {agent.queue.done} | Failed: {agent.queue.failed}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tasks */}
            {activePage === "tasks" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300">
                  Task Monitor
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-50 dark:bg-gray-750 text-left text-sm">
                      <tr>
                        <th className="p-4 font-medium">Task Name</th>
                        <th>Status</th>
                        <th>Agent Role</th>
                        <th>Time Taken</th>
                        <th>Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        { name: "Scrape news sites", status: "Done", role: "Researcher", time: "2m 10s", feedback: "—" },
                        { name: "Draft blog post", status: "WIP", role: "Writer", time: "—", feedback: "Waiting on stats" },
                        { name: "Review content", status: "Waiting", role: "Editor", time: "—", feedback: "Awaiting approval" },
                        { name: "Publish article", status: "To Do", role: "Publisher", time: "—", feedback: "—" },
                        { name: "Update metadata", status: "Error", role: "Publisher", time: "15s", feedback: "Auth token expired" },
                      ].map((task, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="p-4 font-medium">{task.name}</td>
                          <td>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              task.status === "Done" ? "bg-green-100 text-green-800" :
                              task.status === "Error" ? "bg-red-100 text-red-800" :
                              task.status === "WIP" ? "bg-blue-100 text-blue-800" :
                              task.status === "Waiting" ? "bg-yellow-100 text-yellow-800" :
                              "bg-gray-100 text-gray-800"
                            }`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="text-gray-600 dark:text-gray-400">{task.role}</td>
                          <td className="text-gray-600 dark:text-gray-400">{task.time}</td>
                          <td className="text-gray-600 dark:text-gray-400">{task.feedback}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Logs */}
            {activePage === "logs" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300">
                  Logs (JSONL)
                </h2>
                <div className="bg-black text-green-400 rounded-xl p-4 font-mono text-sm h-96 overflow-y-auto">
                  {logs.slice(-200).map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            )}

            {/* Settings */}
            {activePage === "settings" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-700 to-slate-900 dark:from-slate-100 dark:to-slate-300">
                  Settings
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 border border-gray-200 dark:border-gray-700 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { label: "Max Agents Allowed", value: "10" },
                      { label: "Health Check Interval (ms)", value: "10000" },
                      { label: "Max Retries", value: "3" },
                      { label: "Queue Size", value: "3" },
                      { label: "Process Interval (ms)", value: "1000" },
                      { label: "Priority Levels", value: "10" },
                    ].map((field, i) => (
                      <div key={i}>
                        <label className="block text-sm font-medium mb-1">{field.label}</label>
                        <input
                          type="text"
                          defaultValue={field.value}
                          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Agent Role Files</h3>
                    <div className="space-y-3">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <div key={n} className="flex gap-3 items-center">
                          <span className="w-12">Agent {n}:</span>
                          <input type="file" className="p-1 border border-gray-300 dark:border-gray-600 rounded text-sm flex-1 dark:bg-gray-700" />
                          {n <= 2 && <span className="text-xs text-green-600">Uploaded: role_agent{n}.json</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded hover:from-blue-700 hover:to-purple-700">
                    Save Settings
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}