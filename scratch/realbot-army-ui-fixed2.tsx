import React, { useState, useEffect, useRef } from "react";

// Modern icon components with improved styling
const Home = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const Send = ({ className = "" }) => (
  <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m22 2-7 20-4-9-9-4z"/>
    <path d="m22 2-11 11"/>
  </svg>
);

const Menu = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <line x1="4" y1="18" x2="20" y2="18"/>
  </svg>
);

const X = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m18 6-12 12"/>
    <path d="m6 6 12 12"/>
  </svg>
);

const Activity = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m22 12-4-4-6 6-4-4-4 4"/>
  </svg>
);

const Users = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="m22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="m16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

const Terminal = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="4,17 10,11 4,5"/>
    <line x1="12" y1="19" x2="20" y2="19"/>
  </svg>
);

const Settings = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3"/>
    <path d="m12 1 2.09 5.26L22 9l-5.26 2.09L14 22l-2.09-5.26L2 15l5.26-2.09L9 2z"/>
  </svg>
);

const AlertTriangle = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/>
    <path d="M12 9v4"/>
    <path d="m12 17 .01 0"/>
  </svg>
);

const CheckCircle = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M9 12l2 2 4-4"/>
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

const Clock = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const ArrowUpRight = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M7 7h10v10"/>
    <path d="M7 17 17 7"/>
  </svg>
);

const Zap = ({ className = "" }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2"/>
  </svg>
);

const Bot = ({ className = "" }) => (
  <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 8V4H8"/>
    <rect width="16" height="12" x="4" y="8" rx="2"/>
    <path d="m9 16 0 0"/>
    <path d="m15 16 0 0"/>
  </svg>
);

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      text: "Agent Manager initialized successfully", 
      type: "system",
      timestamp: new Date()
    },
  ]);
  
  const [agents, setAgents] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i + 1,
      name: `Agent-${String(i + 1).padStart(2, '0')}`,
      role: ["Researcher", "Writer", "Editor", "Analyst", "Validator", "Publisher"][i],
      status: ["idle", "working", "idle", "idle", "working", "idle"][i],
      queue: { 
        todo: Math.floor(Math.random() * 4), 
        inProgress: i === 1 || i === 4 ? 1 : 0, 
        done: Math.floor(Math.random() * 8), 
        failed: Math.floor(Math.random() * 2) 
      },
      currentTask: i === 1 ? "Analyzing market trends" : i === 4 ? "Content optimization" : null,
      performance: Math.floor(Math.random() * 30) + 70,
      lastActive: new Date(Date.now() - Math.random() * 3600000),
      handoff: null,
      expanded: false,
    }))
  );

  const chatEndRef = useRef(null);
  const logsEndRef = useRef(null);
  const [logs, setLogs] = useState([
    `{"timestamp":"${new Date().toISOString()}","level":"info","agent":"system","event":"initialization","message":"Agent Manager started"}`,
  ]);

  // Enhanced simulation with more realistic behavior
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prev) => {
        return prev.map((agent) => {
          const roll = Math.random();
          let updated = { ...agent };

          if (roll < 0.03) {
            const statusOptions = agent.status === "working" ? ["working", "idle"] : ["working", "idle", "error"];
            const newStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
            
            if (newStatus !== agent.status) {
              updated.status = newStatus;
              updated.lastActive = new Date();

              if (newStatus === "working") {
                const tasks = [
                  "Data analysis", "Content generation", "Quality review", 
                  "Market research", "Report compilation", "System optimization"
                ];
                updated.currentTask = tasks[Math.floor(Math.random() * tasks.length)];
                updated.queue.inProgress = 1;
                updated.queue.todo = Math.max(0, updated.queue.todo - 1);

                setChatMessages((m) => [
                  ...m,
                  {
                    id: Date.now(),
                    text: `${agent.name} started task: ${updated.currentTask}`,
                    type: "start",
                    timestamp: new Date(),
                  },
                ]);
                
                setLogs((l) => [
                  ...l,
                  `{"timestamp":"${new Date().toISOString()}","level":"info","agent":"${agent.name}","event":"task_start","task":"${updated.currentTask}"}`,
                ]);
              }

              if (newStatus === "error") {
                updated.queue.failed += 1;
                updated.queue.inProgress = 0;
                updated.currentTask = null;
                const errors = ["Authentication failed", "Rate limit exceeded", "Connection timeout", "Data unavailable"];
                const errorMsg = errors[Math.floor(Math.random() * errors.length)];

                setChatMessages((m) => [
                  ...m,
                  {
                    id: Date.now(),
                    text: `${agent.name} encountered error: ${errorMsg}`,
                    type: "error",
                    timestamp: new Date(),
                  },
                ]);
              }

              if (newStatus === "idle" && agent.currentTask) {
                updated.queue.done += 1;
                updated.queue.inProgress = 0;
                updated.performance = Math.min(100, updated.performance + Math.floor(Math.random() * 5));
                
                setChatMessages((m) => [
                  ...m,
                  {
                    id: Date.now(),
                    text: `${agent.name} completed: ${agent.currentTask}`,
                    type: "complete",
                    timestamp: new Date(),
                  },
                ]);
                
                updated.currentTask = null;
              }
            }
          }

          return updated;
        });
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleSendMessage = () => {
    if (chatInput.trim()) {
      setChatMessages((m) => [
        ...m, 
        { 
          id: Date.now(), 
          text: chatInput, 
          type: "user",
          timestamp: new Date() 
        }
      ]);
      setChatInput("");
      
      // Simulate response
      setTimeout(() => {
        setChatMessages((m) => [
          ...m,
          {
            id: Date.now(),
            text: "Command received and distributed to agents",
            type: "system",
            timestamp: new Date()
          }
        ]);
      }, 1000);
    }
  };

  const navItems = [
    { name: "Dashboard", icon: Home, id: "dashboard" },
    { name: "Agents", icon: Users, id: "agents" },
    { name: "Tasks", icon: Activity, id: "tasks" },
    { name: "Logs", icon: Terminal, id: "logs" },
    { name: "Settings", icon: Settings, id: "settings" },
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case "working": 
        return { 
          color: "bg-emerald-500", 
          textColor: "text-emerald-700 dark:text-emerald-300",
          bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
          icon: Zap 
        };
      case "error": 
        return { 
          color: "bg-red-500", 
          textColor: "text-red-700 dark:text-red-300",
          bgColor: "bg-red-50 dark:bg-red-950/30",
          icon: AlertTriangle 
        };
      default: 
        return { 
          color: "bg-slate-400", 
          textColor: "text-slate-700 dark:text-slate-300",
          bgColor: "bg-slate-50 dark:bg-slate-950/30",
          icon: Clock 
        };
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      "Researcher": "from-blue-500 to-cyan-500",
      "Writer": "from-purple-500 to-pink-500", 
      "Editor": "from-amber-500 to-orange-500",
      "Analyst": "from-green-500 to-emerald-500",
      "Validator": "from-indigo-500 to-purple-500",
      "Publisher": "from-rose-500 to-pink-500"
    };
    return colors[role] || "from-gray-500 to-slate-500";
  };

  const formatTime = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case "error": return <AlertTriangle className="text-red-500" />;
      case "complete": return <CheckCircle className="text-emerald-500" />;
      case "start": return <Zap className="text-blue-500" />;
      default: return <Bot className="text-slate-500" />;
    }
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="flex h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
        
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? "w-72" : "w-20"} transition-all duration-300 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col`}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    AgentOS
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Multi-Agent Orchestration
                  </p>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {sidebarOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Status Overview */}
          {sidebarOpen && (
            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">System Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Online</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {agents.filter(a => a.status === "working").length}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Active</div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {agents.reduce((sum, a) => sum + a.queue.todo + a.queue.inProgress, 0)}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">Queue</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activePage === item.id
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <item.icon className={sidebarOpen ? "" : "mx-auto"} />
                  {sidebarOpen && <span className="font-medium">{item.name}</span>}
                </button>
              ))}
            </div>
          </nav>

          {/* Dark Mode Toggle */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="text-lg">{darkMode ? "☀️" : "🌙"}</div>
              {sidebarOpen && (
                <span className="font-medium text-slate-700 dark:text-slate-300">
                  {darkMode ? "Light Mode" : "Dark Mode"}
                </span>
              )}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Header */}
          <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 capitalize">
                  {activePage}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mt-1">
                  {activePage === "dashboard" && "Monitor and control your agent network"}
                  {activePage === "agents" && "Manage individual agent configurations"}
                  {activePage === "tasks" && "Track task execution and performance"}
                  {activePage === "logs" && "System logs and debugging information"}
                  {activePage === "settings" && "System configuration and preferences"}
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {agents.filter(a => a.status === "working").length} Active
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-8">
            
            {/* Dashboard */}
            {activePage === "dashboard" && (
              <div className="space-y-8">
                
                {/* Command Interface */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <div className="border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Command Center</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Send instructions to your agent network</p>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Enter command or instruction..."
                        className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <button
                        onClick={handleSendMessage}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25 flex items-center gap-2"
                      >
                        <Send />
                        Send
                      </button>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="max-h-60 overflow-y-auto border-t border-slate-200 dark:border-slate-800">
                    <div className="p-6 space-y-3">
                      {chatMessages.slice(-6).map((msg, i) => (
                        <div key={i} className="flex items-start gap-3">
                          {getMessageIcon(msg.type)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {msg.type === "user" ? "You" : "System"}
                              </span>
                              <span className="text-xs text-slate-400">
                                {formatTime(msg.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">{msg.text}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                  </div>
                </div>

                {/* Agent Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {agents.map((agent) => {
                    const statusConfig = getStatusConfig(agent.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                      <div
                        key={agent.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 cursor-pointer"
                        onClick={() => setAgents(prev => prev.map(a => a.id === agent.id ? {...a, expanded: !a.expanded} : a))}
                      >
                        <div className="p-6">
                          {/* Agent Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${getRoleColor(agent.role)} flex items-center justify-center text-white font-bold text-sm`}>
                                {agent.name.split('-')[1]}
                              </div>
                              <div>
                                <h4 className="font-semibold text-slate-900 dark:text-slate-100">{agent.name}</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{agent.role}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${statusConfig.color} animate-pulse`}></div>
                              <StatusIcon className={statusConfig.textColor} />
                            </div>
                          </div>

                          {/* Status */}
                          <div className={`px-3 py-2 rounded-lg ${statusConfig.bgColor} mb-4`}>
                            <div className="flex items-center justify-between">
                              <span className={`text-sm font-medium ${statusConfig.textColor} capitalize`}>
                                {agent.status}
                              </span>
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {Math.floor((Date.now() - agent.lastActive) / 60000)}m ago
                              </span>
                            </div>
                            {agent.currentTask && (
                              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 truncate">
                                {agent.currentTask}
                              </p>
                            )}
                          </div>

                          {/* Metrics */}
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {agent.queue.done}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Completed</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                {agent.performance}%
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400">Performance</div>
                            </div>
                          </div>

                          {/* Queue Summary */}
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400">Queue:</span>
                            <div className="flex gap-4">
                              <span className="text-amber-600">Todo: {agent.queue.todo}</span>
                              <span className="text-blue-600">Active: {agent.queue.inProgress}</span>
                              <span className="text-red-600">Failed: {agent.queue.failed}</span>
                            </div>
                          </div>

                          {/* Performance Bar */}
                          <div className="mt-4">
                            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h