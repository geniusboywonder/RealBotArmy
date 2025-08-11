import React, { useState } from "react";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: "🏠", id: "dashboard" },
    { name: "Tasks", icon: "✅", id: "tasks" },
    { name: "Logs", icon: "📜", id: "logs" },
    { name: "Settings", icon: "⚙️", id: "settings" },
  ];

  return (
    <div className={`flex flex-col h-screen ${darkMode ? "dark" : ""}`}>
      <div className="dark:bg-gray-900 dark:text-white min-h-screen transition-colors duration-300">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-semibold">Agent Manager</h1>
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span>
                Running
              </span>
              <span>Active Agents: 4/10</span>
              <span>Task Queue: 5/∞</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              ◀▶
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 text-sm"
            >
              {darkMode ? "Light" : "Dark"}
            </button>
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <nav
            className={`bg-gray-50 dark:bg-gray-850 border-r flex-shrink-0 transition-all duration-300 ${
              sidebarCollapsed ? "w-16" : "w-60"
            }`}
          >
            <div className="p-3 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors group ${
                    activePage === item.id
                      ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </button>
              ))}
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-y-auto bg-gray-100 dark:bg-gray-900">
            {/* Dashboard */}
            {activePage === "dashboard" && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">Dashboard</h2>

                {/* Chat Window */}
                <div className="border rounded-lg bg-white dark:bg-gray-800 shadow-sm h-60 flex flex-col">
                  <div className="p-4 border-b flex-1 overflow-y-auto font-mono text-sm">
                    <p className="text-gray-600 dark:text-gray-300 mb-2">• [Agent 3] Needs clarification on task X</p>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">• [System] Agent 1 completed task "Fetch Data"</p>
                    <p className="text-gray-600 dark:text-gray-300">• [Agent 2] Handing off to Agent 4</p>
                  </div>
                  <div className="p-4 border-t flex gap-2">
                    <input
                      type="text"
                      placeholder="Send instruction..."
                      className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
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
                    {[1, 2, 3, 4, 5, 6].map((id) => (
                      <div key={id} className="border rounded-lg bg-white dark:bg-gray-800 shadow-sm p-4">
                        <h3 className="font-semibold">
                          Agent {id}: Researcher{" "}
                          <span className="w-2 h-2 bg-green-500 rounded-full inline-block ml-1"></span>
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Role: Gathers and summarizes data</p>
                        <div className="mt-3 text-xs">
                          <p>Queue: To Do(2) | In Progress(1)</p>
                        </div>
                        <div className="mt-3">
                          <h4 className="text-sm font-medium">Current Task:</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">Summarize latest trends</p>
                        </div>
                        <div className="mt-3 h-16 overflow-y-auto border-t pt-1 text-xs font-mono">
                          • Starting task...<br />
                          • Found 3 sources
                        </div>
                        <div className="mt-2 text-xs text-gray-500">Handed off to: Writer</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tasks */}
            {activePage === "tasks" && (
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
                        { name: "Scrape news sites", status: "Done", role: "Researcher", time: "2m 10s", feedback: "—" },
                        { name: "Draft blog post", status: "WIP", role: "Writer", time: "—", feedback: "Waiting on stats" },
                        { name: "Review content", status: "Waiting", role: "Editor", time: "—", feedback: "Awaiting approval" },
                        { name: "Publish article", status: "To Do", role: "Publisher", time: "—", feedback: "—" },
                        { name: "Update metadata", status: "Error", role: "Publisher", time: "15s", feedback: "Auth token expired" },
                      ].map((task, i) => (
                        <tr key={i} className="border-t hover:bg-gray-50 dark:hover:bg-gray-750">
                          <td className="p-3">{task.name}</td>
                          <td>{task.status}</td>
                          <td>{task.role}</td>
                          <td>{task.time}</td>
                          <td className="text-gray-600 dark:text-gray-300">{task.feedback}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Logs */}
            {activePage === "logs" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Logs (JSONL)</h2>
                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
{`{"agent":"Researcher","task":"scrape","level":"info","msg":"Started scraping...","ts":"2025-04-05T10:00:00Z"}
{"agent":"Writer","task":"draft","level":"warn","msg":"Missing conclusion section","ts":"2025-04-05T10:02:15Z"}
{"agent":"Publisher","task":"publish","level":"error","msg":"Auth failed","ts":"2025-04-05T10:05:30Z"}
{"agent":"Editor","task":"review","level":"info","msg":"Approved draft","ts":"2025-04-05T10:07:00Z"}
{"agent":"Researcher","task":"fetch","level":"info","msg":"Received handoff from Writer","ts":"2025-04-05T10:08:12Z"}
{"agent":"System","task":"health","level":"info","msg":"All agents responsive","ts":"2025-04-05T10:10:00Z"}`}
                </div>
              </div>
            )}

            {/* Settings */}
            {activePage === "settings" && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Settings</h2>
                <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-1">Max Agents Allowed</label>
                      <input type="number" defaultValue="10" className="w-full p-2 border rounded dark:bg-gray-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Health Check Interval (ms)</label>
                      <input type="number" defaultValue="10000" className="w-full p-2 border rounded dark:bg-gray-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Max Retries</label>
                      <input type="number" defaultValue="3" className="w-full p-2 border rounded dark:bg-gray-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Queue Size</label>
                      <input type="number" defaultValue="3" className="w-full p-2 border rounded dark:bg-gray-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Process Interval (ms)</label>
                      <input type="number" defaultValue="1000" className="w-full p-2 border rounded dark:bg-gray-700" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Priority Levels</label>
                      <input type="number" defaultValue="10" className="w-full p-2 border rounded dark:bg-gray-700" />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Agent Role Files</h3>
                    <div className="space-y-3">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <div key={n} className="flex gap-3 items-center">
                          <span className="w-12">Agent {n}:</span>
                          <input type="file" className="p-1 border rounded text-sm flex-1" />
                          {n <= 2 && (
                            <span className="text-xs text-green-600">Uploaded: role_agent{n}.json</span>
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