import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      text: '[System] Agent Manager started.',
      time: Date.now(),
      type: 'system',
    },
  ]);
  const [agents, setAgents] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      role: i % 3 === 0 ? 'Researcher' : i % 3 === 1 ? 'Writer' : 'Editor',
      status: 'idle',
      queue: {
        todo: Math.floor(Math.random() * 3),
        inProgress: 0,
        done: Math.floor(Math.random() * 5),
        failed: 0,
      },
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

  // Simulate live agent behavior
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => {
        const next = prev.map(agent => {
          let updated = { ...agent };
          const roll = Math.random();

          // Randomly change status
          if (roll < 0.02) {
            const newStatus = ['working', 'idle', 'error'][
              Math.floor(Math.random() * 3)
            ];
            updated.status = newStatus;

            if (newStatus === 'working') {
              const tasks = [
                'Research topic',
                'Write draft',
                'Review content',
                'Format output',
                'Verify sources',
              ];
              updated.currentTask =
                tasks[Math.floor(Math.random() * tasks.length)];
              updated.queue.inProgress = 1;
              updated.queue.todo = Math.max(0, updated.queue.todo - 1);

              // Log event
              setChatMessages(m => [
                ...m,
                {
                  id: Date.now(),
                  text: `[Agent ${agent.id}] Started task: "${updated.currentTask}"`,
                  time: Date.now(),
                },
              ]);
              setLogs(l => [
                ...l,
                `{"agent":"Agent${agent.id}","task":"start","level":"info","msg":"Started task: ${updated.currentTask}","ts":"${new Date().toISOString()}"}`,
              ]);
            }

            if (newStatus === 'error') {
              updated.queue.failed += 1;
              updated.queue.inProgress = 0;
              const errorMsg = [
                'Auth failed',
                'Rate limited',
                'Timeout',
                'Missing data',
              ][Math.floor(Math.random() * 4)];
              updated.currentTask = null;

              setChatMessages(m => [
                ...m,
                {
                  id: Date.now(),
                  text: `[Agent ${agent.id}] Error: ${errorMsg}`,
                  time: Date.now(),
                },
              ]);
              setLogs(l => [
                ...l,
                `{"agent":"Agent${agent.id}","task":"error","level":"error","msg":"${errorMsg}","ts":"${new Date().toISOString()}"}`,
              ]);
            }

            if (newStatus === 'idle') {
              if (agent.currentTask) {
                updated.queue.done += 1;
                updated.queue.inProgress = 0;
                setChatMessages(m => [
                  ...m,
                  {
                    id: Date.now(),
                    text: `[Agent ${agent.id}] Completed: "${agent.currentTask}"`,
                    time: Date.now(),
                  },
                ]);
                setLogs(l => [
                  ...l,
                  `{"agent":"Agent${agent.id}","task":"complete","level":"info","msg":"Completed: ${agent.currentTask}","ts":"${new Date().toISOString()}"}`,
                ]);
              }
              updated.currentTask = null;
            }
          }

          // Random handoff
          if (roll < 0.01 && agent.status === 'working' && !agent.handoff) {
            const otherAgent = Math.floor(Math.random() * 6) + 1;
            if (otherAgent !== agent.id) {
              updated.handoff = `Agent ${otherAgent}`;
              setChatMessages(m => [
                ...m,
                {
                  id: Date.now(),
                  text: `[Agent ${agent.id}] Handing off to ${otherAgent}`,
                  time: Date.now(),
                },
              ]);
            }
          }

          return updated;
        });
        return next;
      });
    }, 3000);

    // Simulate random chat/log messages
    const logInterval = setInterval(() => {
      const msgTypes = [
        { text: '[System] All agents responsive.', level: 'info' },
        { text: '[Agent 3] Awaiting clarification.', level: 'warn' },
        { text: '[System] Health check passed.', level: 'info' },
      ];
      const msg = msgTypes[Math.floor(Math.random() * msgTypes.length)];
      setChatMessages(m => [
        ...m,
        { id: Date.now(), text: msg.text, time: Date.now() },
      ]);
    }, 8000);

    return () => {
      clearInterval(interval);
      clearInterval(logInterval);
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [logs]);

  const addLog = (agent, task, level, msg) => {
    setLogs(l => [
      ...l,
      `{"agent":"${agent}","task":"${task}","level":"${level}","msg":"${msg}","ts":"${new Date().toISOString()}"}`,
    ]);
  };

  const toggleAgentExpand = id => {
    setAgents(prev =>
      prev.map(a => (a.id === id ? { ...a, expanded: !a.expanded } : a))
    );
  };

  const navItems = [
    { name: 'Dashboard', icon: '🏠', id: 'dashboard' },
    { name: 'Tasks', icon: '✅', id: 'tasks' },
    { name: 'Logs', icon: '📜', id: 'logs' },
    { name: 'Settings', icon: '⚙️', id: 'settings' },
  ];

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold">Agent Manager</h1>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span
                  className={`w-3 h-3 rounded-full inline-block ${
                    agents.some(a => a.status === 'error')
                      ? 'bg-red-500'
                      : 'bg-green-500'
                  }`}
                ></span>
                {agents.some(a => a.status === 'error') ? 'Errors' : 'Running'}
              </span>
              <span>
                Active: {agents.filter(a => a.status === 'working').length}/10
              </span>
              <span>
                Queue:{' '}
                {agents.reduce(
                  (sum, a) => sum + a.queue.todo + a.queue.inProgress,
                  0
                )}
                / ∞
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-sm"
              title="Toggle Sidebar"
            >
              {sidebarCollapsed ? '▶' : '◀'}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm"
            >
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <nav
            className={`bg-gray-50 dark:bg-gray-850 border-r flex-shrink-0 transition-all duration-300 relative ${
              sidebarCollapsed ? 'w-16' : 'w-60'
            }`}
          >
            <div className="p-3 space-y-2">
              {navItems.map(item => (
                <div key={item.id} className="group relative">
                  <button
                    onClick={() => setActivePage(item.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                      activePage === item.id
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    {!sidebarCollapsed && <span>{item.name}</span>}
                  </button>
                  {sidebarCollapsed && (
                    <div className="fixed opacity-0 group-hover:opacity-100 bg-gray-700 text-white text-sm rounded px-2 py-1 pointer-events-none transition-opacity whitespace-nowrap z-50 left-20">
                      {item.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900">
            {/* Dashboard */}
            {activePage === 'dashboard' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Dashboard</h2>

                {/* Chat Window */}
                <div className="border rounded-lg bg-white dark:bg-gray-800 shadow-sm h-60 flex flex-col">
                  <div className="p-4 border-b flex-1 overflow-y-auto font-mono text-sm space-y-1">
                    {chatMessages.slice(-8).map(msg => (
                      <p
                        key={msg.id}
                        className={`mb-1 ${
                          msg.text.includes('Error')
                            ? 'text-red-500'
                            : msg.text.includes('System')
                              ? 'text-blue-500'
                              : 'text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        • {msg.text}
                      </p>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="p-4 border-t flex gap-2">
                    <input
                      type="text"
                      placeholder="Send instruction..."
                      className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                      onKeyPress={e => {
                        if (e.key === 'Enter' && e.target.value) {
                          setChatMessages(m => [
                            ...m,
                            {
                              id: Date.now(),
                              text: `[You] ${e.target.value}`,
                              time: Date.now(),
                            },
                          ]);
                          e.target.value = '';
                        }
                      }}
                    />
                    <button className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      ➤
                    </button>
                  </div>
                </div>

                {/* Agents Grid */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">Agents</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map(agent => (
                      <div
                        key={agent.id}
                        className="border rounded-lg bg-white dark:bg-gray-800 shadow-sm p-4 cursor-pointer transition-all duration-200 hover:shadow-md"
                        onClick={() => toggleAgentExpand(agent.id)}
                      >
                        <h3 className="font-semibold flex items-center gap-2">
                          Agent {agent.id}: {agent.role}
                          <span
                            className={`w-2 h-2 rounded-full block ${
                              agent.status === 'working'
                                ? 'bg-green-500 animate-pulse'
                                : agent.status === 'error'
                                  ? 'bg-red-500'
                                  : 'bg-gray-400'
                            }`}
                          ></span>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {agent.status === 'working'
                            ? 'Working'
                            : agent.status === 'error'
                              ? 'Error'
                              : 'Idle'}
                        </p>

                        <div className="mt-2 text-xs">
                          <p>
                            Queue: {agent.queue.todo} todo,{' '}
                            {agent.queue.inProgress} in progress
                          </p>
                        </div>

                        {agent.currentTask && (
                          <div className="mt-2">
                            <h4 className="text-xs font-medium text-gray-700 dark:text-gray-300">
                              Task:
                            </h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {agent.currentTask}
                            </p>
                          </div>
                        )}

                        {agent.handoff && (
                          <div className="mt-1 text-xs text-orange-500">
                            Handing to: {agent.handoff}
                          </div>
                        )}

                        {/* Expanded View */}
                        {agent.expanded && (
                          <div className="mt-3 pt-3 border-t text-xs">
                            <div className="font-mono space-y-1 h-16 overflow-y-auto">
                              {agent.chat.length === 0 ? (
                                <p className="text-gray-500">No chat history</p>
                              ) : (
                                agent.chat.map((msg, i) => (
                                  <div key={i}>• {msg}</div>
                                ))
                              )}
                            </div>
                            <div className="mt-2 text-gray-500">
                              Done: {agent.queue.done}, Failed:{' '}
                              {agent.queue.failed}
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
            {activePage === 'tasks' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Task Monitor</h2>
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                  <table className="w-full table-auto">
                    <thead className="bg-gray-100 dark:bg-gray-700 text-left text-sm">
                      <tr>
                        <th className="p-3">Task Name</th>
                        <th>Status</th>
                        <th>Agent Role</th>
                        <th>Time Taken</th>
                        <th>Feedback/Error</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {[
                        {
                          name: 'Scrape news sites',
                          status: 'Done',
                          role: 'Researcher',
                          time: '2m 10s',
                          feedback: '—',
                        },
                        {
                          name: 'Draft blog post',
                          status: 'WIP',
                          role: 'Writer',
                          time: '—',
                          feedback: 'Waiting on stats',
                        },
                        {
                          name: 'Review content',
                          status: 'Waiting',
                          role: 'Editor',
                          time: '—',
                          feedback: 'Awaiting approval',
                        },
                        {
                          name: 'Publish article',
                          status: 'To Do',
                          role: 'Publisher',
                          time: '—',
                          feedback: '—',
                        },
                        {
                          name: 'Update metadata',
                          status: 'Error',
                          role: 'Publisher',
                          time: '15s',
                          feedback: 'Auth token expired',
                        },
                      ].map((task, i) => (
                        <tr
                          key={i}
                          className="border-t hover:bg-gray-50 dark:hover:bg-gray-750"
                        >
                          <td className="p-3">{task.name}</td>
                          <td>{task.status}</td>
                          <td>{task.role}</td>
                          <td>{task.time}</td>
                          <td className="text-gray-600 dark:text-gray-300">
                            {task.feedback}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Logs */}
            {activePage === 'logs' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Logs (JSONL)</h2>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                  {logs.slice(-200).map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            )}

            {/* Settings */}
            {activePage === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Max Agents Allowed
                      </label>
                      <input
                        type="number"
                        defaultValue="10"
                        className="w-full p-2 border rounded dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Health Check Interval (ms)
                      </label>
                      <input
                        type="number"
                        defaultValue="10000"
                        className="w-full p-2 border rounded dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Max Retries
                      </label>
                      <input
                        type="number"
                        defaultValue="3"
                        className="w-full p-2 border rounded dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Queue Size
                      </label>
                      <input
                        type="number"
                        defaultValue="3"
                        className="w-full p-2 border rounded dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Process Interval (ms)
                      </label>
                      <input
                        type="number"
                        defaultValue="1000"
                        className="w-full p-2 border rounded dark:bg-gray-700"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Priority Levels
                      </label>
                      <input
                        type="number"
                        defaultValue="10"
                        className="w-full p-2 border rounded dark:bg-gray-700"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">
                      Agent Role Files
                    </h3>
                    <div className="space-y-3">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                        <div key={n} className="flex gap-3 items-center">
                          <span className="w-12">Agent {n}:</span>
                          <input
                            type="file"
                            className="p-1 border rounded text-sm flex-1"
                          />
                          {n <= 2 && (
                            <span className="text-xs text-green-600">
                              Uploaded: role_agent{n}.json
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
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
