/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "motion/react";
import Sidebar from "./components/Sidebar";
import { 
  initialMLTopics, 
  initialProjectMilestones, 
  initialAIToolsDays, 
  initialDSALogs, 
  initialCloudTopics, 
  initialBadges, 
  defaultStreakState 
} from "./data";
import { 
  CareerOSState, 
  MLTopic, 
  ProjectMilestone, 
  FIToolDay, 
  DSALog, 
  CloudTopic, 
  Badge 
} from "./types";
import { 
  ProgressRing, 
  ContributionHeatmap 
} from "./components/Charts";
import { loadStateFromCloud, saveStateToCloud, mongoConnected } from "./lib/supabase";

// Strategic Modules
import MLModule from "./components/MLModule";
import ProjectModule from "./components/ProjectModule";
import ToolsModule from "./components/ToolsModule";
import DSAModule from "./components/DSAModule";
import CloudModule from "./components/CloudModule";

// Lucide icons
import { 
  CheckCircle2, 
  Flame, 
  Target, 
  Sparkles, 
  Info, 
  Calendar, 
  Award,
  Zap,
  TrendingUp,
  Clock,
  Settings,
  Trash2,
  RefreshCw,
  User,
  Check,
  ChevronRight,
  Smile
} from "lucide-react";

export default function App() {
  const [currentUser, setCurrentUser] = React.useState<"ashritha" | "harshith">("ashritha");
  const [activeTab, setActiveTab] = React.useState<string>("dashboard");
  const [isLoading, setIsLoading] = React.useState(true);

  // Default state for Ashritha
  const defaultStateForAshritha: CareerOSState = {
    mlTopics: initialMLTopics,
    projectMilestones: initialProjectMilestones,
    aiToolsDays: initialAIToolsDays,
    dsaLogs: initialDSALogs,
    cloudTopics: initialCloudTopics,
    streakState: defaultStreakState,
    badges: initialBadges,
    preferences: {
      userName: "Ashritha"
    }
  };

  // Default state for Harshith
  const defaultStateForHarshith: CareerOSState = {
    mlTopics: [{ id: "h-ml-1", name: "learn ML", isCompleted: false }],
    projectMilestones: [{ id: "h-pm-1", name: "Daily linkedin post", isCompleted: false }],
    aiToolsDays: [{ id: "h-ait-1", name: "learn n8n", isCompleted: false }],
    dsaLogs: [{ id: "h-dsa-1", name: "daily one leetcode problem(dsa)", isCompleted: false }],
    cloudTopics: [{ id: "h-cloud-1", name: "daily python learning", isCompleted: false }],
    streakState: defaultStreakState,
    badges: initialBadges,
    preferences: {
      userName: "Harshith"
    }
  };

  // Main Persistent State
  const [state, setState] = React.useState<CareerOSState>(defaultStateForAshritha);

  // Load initial state from Supabase / localStorage on mount and poll for real-time updates
  React.useEffect(() => {
    setIsLoading(true);
    const defaultState = currentUser === "ashritha" ? defaultStateForAshritha : defaultStateForHarshith;

    async function fetchState() {
      try {
        const cloudState = await loadStateFromCloud(defaultState, currentUser);
        setState(prev => {
          if (JSON.stringify(prev) !== JSON.stringify(cloudState)) {
            return cloudState;
          }
          return prev;
        });
      } catch (err) {
        console.error("Failed to load journey state:", err);
      }
    }

    async function init() {
      await fetchState();
      setIsLoading(false);
    }
    
    init();

    const interval = setInterval(fetchState, 3000);
    return () => clearInterval(interval);
  }, [currentUser]);

  // Save changes to cloud / local storage
  const handleUpdateState = async (nextState: CareerOSState) => {
    setState(nextState);
    await saveStateToCloud(nextState, currentUser);
  };

  // Mouse spotlight background minimal light tracker
  const [mousePos, setMousePos] = React.useState({ x: -1000, y: -1000 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Live ticking date and clock logic
  const [timeStr, setTimeStr] = React.useState("");
  const [dateStr, setDateStr] = React.useState("");

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }));
      setDateStr(now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric"
      }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // State handlers for each simple domain list
  const handleDeleteMLTopic = (id: string) => {
    const updated = {
      ...state,
      mlTopics: state.mlTopics.filter(t => t.id !== id)
    };
    handleUpdateState(updated);
  };

  const handleAddMLTopic = (newTopic: Omit<MLTopic, "id">) => {
    const topicWithId: MLTopic = {
      ...newTopic,
      id: `ml-${Date.now()}`
    };
    const updated = {
      ...state,
      mlTopics: [...state.mlTopics, topicWithId]
    };
    handleUpdateState(updated);
  };

  const handleUpdateMLTopic = (topic: MLTopic) => {
    const updated = {
      ...state,
      mlTopics: state.mlTopics.map(t => t.id === topic.id ? topic : t)
    };
    handleUpdateState(updated);
  };

  const handleAddMilestone = (newMilestone: Omit<ProjectMilestone, "id">) => {
    const withId: ProjectMilestone = {
      ...newMilestone,
      id: `milestone-${Date.now()}`
    };
    const updated = {
      ...state,
      projectMilestones: [...state.projectMilestones, withId]
    };
    handleUpdateState(updated);
  };

  const handleUpdateMilestone = (milestone: ProjectMilestone) => {
    const updated = {
      ...state,
      projectMilestones: state.projectMilestones.map(m => m.id === milestone.id ? milestone : m)
    };
    handleUpdateState(updated);
  };

  const handleDeleteMilestone = (id: string) => {
    const updated = {
      ...state,
      projectMilestones: state.projectMilestones.filter(m => m.id !== id)
    };
    handleUpdateState(updated);
  };

  const handleAddDay = (newDay: Omit<FIToolDay, "id">) => {
    const withId: FIToolDay = {
      ...newDay,
      id: `tool-${Date.now()}`
    };
    const updated = {
      ...state,
      aiToolsDays: [...state.aiToolsDays, withId]
    };
    handleUpdateState(updated);
  };

  const handleUpdateDay = (day: FIToolDay) => {
    const updated = {
      ...state,
      aiToolsDays: state.aiToolsDays.map(d => d.id === day.id ? day : d)
    };
    handleUpdateState(updated);
  };

  const handleDeleteDay = (id: string) => {
    const updated = {
      ...state,
      aiToolsDays: state.aiToolsDays.filter(d => d.id !== id)
    };
    handleUpdateState(updated);
  };

  const handleAddDSALog = (newLog: Omit<DSALog, "id">) => {
    const withId: DSALog = {
      ...newLog,
      id: `dsa-${Date.now()}`
    };
    const updated = {
      ...state,
      dsaLogs: [withId, ...state.dsaLogs]
    };
    handleUpdateState(updated);
  };

  const handleUpdateDSALog = (log: DSALog) => {
    const updated = {
      ...state,
      dsaLogs: state.dsaLogs.map(l => l.id === log.id ? log : l)
    };
    handleUpdateState(updated);
  };

  const handleDeleteDSALog = (id: string) => {
    const updated = {
      ...state,
      dsaLogs: state.dsaLogs.filter(l => l.id !== id)
    };
    handleUpdateState(updated);
  };

  const handleAddCloudTopic = (newTopic: Omit<CloudTopic, "id">) => {
    const withId: CloudTopic = {
      ...newTopic,
      id: `cloud-${Date.now()}`
    };
    const updated = {
      ...state,
      cloudTopics: [...state.cloudTopics, withId]
    };
    handleUpdateState(updated);
  };

  const handleUpdateCloudTopic = (topic: CloudTopic) => {
    const updated = {
      ...state,
      cloudTopics: state.cloudTopics.map(t => t.id === topic.id ? topic : t)
    };
    handleUpdateState(updated);
  };

  const handleDeleteCloudTopic = (id: string) => {
    const updated = {
      ...state,
      cloudTopics: state.cloudTopics.filter(t => t.id !== id)
    };
    handleUpdateState(updated);
  };

  // REAL COMPUTATIONS ENGINE BASED ENTIRELY ON ACTIVE USER TASKS
  const allTasks = RechartAllTasks();
  function RechartAllTasks() {
    return [
      ...state.mlTopics,
      ...state.projectMilestones,
      ...state.aiToolsDays,
      ...state.dsaLogs,
      ...state.cloudTopics
    ];
  }

  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter(t => t.isCompleted);
  const completedTasksCount = completedTasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  // Streak calculations dynamically based on real list completed dates
  const streakMetrics = React.useMemo(() => {
    const datesCompleted = completedTasks
      .map(t => t.dateCompleted)
      .filter((d): d is string => !!d);

    if (datesCompleted.length === 0) {
      return { current: 0, longest: 0 };
    }

    const uniqueSorted = Array.from(new Set(datesCompleted))
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); // descending order (newest first)

    const todayStr = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const completedToday = uniqueSorted.includes(todayStr);
    const completedYesterday = uniqueSorted.includes(yesterdayStr);

    if (!completedToday && !completedYesterday) {
      return { current: 0, longest: calculateMaxStreak(uniqueSorted) };
    }

    let currentStreak = 0;
    let pivot = completedToday ? new Date() : yesterday;

    while (true) {
      const pivotStr = pivot.toISOString().split("T")[0];
      if (uniqueSorted.includes(pivotStr)) {
        currentStreak++;
        pivot.setDate(pivot.getDate() - 1);
      } else {
        break;
      }
    }

    return { 
      current: currentStreak, 
      longest: Math.max(currentStreak, calculateMaxStreak(uniqueSorted)) 
    };

    function calculateMaxStreak(datesListDesc: string[]): number {
      const ascending = [...datesListDesc].sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
      let maxStr = 1;
      let currStr = 1;
      for (let i = 1; i < ascending.length; i++) {
        const diffTime = new Date(ascending[i]).getTime() - new Date(ascending[i-1]).getTime();
        const diffDays = Math.round(diffTime / 86400000);
        if (diffDays === 1) {
          currStr++;
          if (currStr > maxStr) maxStr = currStr;
        } else if (diffDays > 1) {
          currStr = 1;
        }
      }
      return maxStr;
    }
  }, [completedTasks]);

  const currentStreak = streakMetrics.current;
  const longestStreak = streakMetrics.longest;

  // Tasks Completed Today (derived from date comparison)
  const todayDateStr = new Date().toISOString().split("T")[0];
  const tasksCompletedToday = completedTasks.filter(t => t.dateCompleted === todayDateStr).length;

  // Calendar State & Clicking Actions
  const [selectedCalendarDay, setSelectedCalendarDay] = React.useState<number | null>(null);
  const calendarTasks = React.useMemo(() => {
    if (selectedCalendarDay === null) return [];
    // Standard June 2026 month prefix
    const paddedDay = String(selectedCalendarDay).padStart(2, "0");
    const dayStr = `2026-06-${paddedDay}`;
    return completedTasks.filter(t => t.dateCompleted === dayStr);
  }, [selectedCalendarDay, completedTasks]);

  // Aggregate completion scores per categoric domain
  const mlPercent = state.mlTopics.length > 0 ? (state.mlTopics.filter(t => t.isCompleted).length / state.mlTopics.length) * 100 : 0;
  const projectPercent = state.projectMilestones.length > 0 ? (state.projectMilestones.filter(m => m.isCompleted).length / state.projectMilestones.length) * 100 : 0;
  const toolsPercent = state.aiToolsDays.length > 0 ? (state.aiToolsDays.filter(t => t.isCompleted).length / state.aiToolsDays.length) * 100 : 0;
  const dsaPercent = state.dsaLogs.length > 0 ? (state.dsaLogs.filter(l => l.isCompleted).length / state.dsaLogs.length) * 100 : 0;
  const cloudPercent = state.cloudTopics.length > 0 ? (state.cloudTopics.filter(c => c.isCompleted).length / state.cloudTopics.length) * 100 : 0;

  // Gamification Unlocking Calculations
  const computedBadges = React.useMemo(() => {
    return state.badges.map(badge => {
      let isUnlocked = false;
      const completedCount = completedTasksCount;

      if (badge.id === "b-1" && completedCount >= 1) isUnlocked = true;
      else if (badge.id === "b-2" && completedCount >= 10) isUnlocked = true;
      else if (badge.id === "b-3" && completedCount >= 50) isUnlocked = true;
      else if (badge.id === "b-4" && completedCount >= 100) isUnlocked = true;
      else if (badge.id === "b-5" && currentStreak >= 7) isUnlocked = true;
      else if (badge.id === "b-6" && currentStreak >= 30) isUnlocked = true;
      else if (badge.id === "b-7" && currentStreak >= 100) isUnlocked = true;

      return {
        ...badge,
        unlockedAt: isUnlocked ? (badge.unlockedAt || new Date().toISOString().split("T")[0]) : undefined
      };
    });
  }, [completedTasksCount, currentStreak, state.badges]);

  // Hydrates logs for Heatmap view (using standard 28-day logs)
  const getContributionLogs = () => {
    const logsMap: { [date: string]: number } = {};
    completedTasks.forEach(task => {
      if (task.dateCompleted) {
        logsMap[task.dateCompleted] = (logsMap[task.dateCompleted] || 0) + 1.5;
      }
    });
    return Object.entries(logsMap).map(([date, amount]) => ({ date, amount }));
  };

  // Reset user data confirmation
  const [showConfirmReset, setShowConfirmReset] = React.useState(false);
  const handleResetData = async () => {
    const resetState: CareerOSState = {
      mlTopics: [],
      projectMilestones: [],
      aiToolsDays: [],
      dsaLogs: [],
      cloudTopics: [],
      streakState: defaultStreakState,
      badges: initialBadges,
      preferences: {
        userName: state.preferences?.userName || "Ashritha"
      }
    };
    setState(resetState);
    await saveStateToCloud(resetState);
    setShowConfirmReset(false);
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-[#0B1120] text-slate-100 flex flex-col items-center justify-center font-sans">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin mb-4" />
        <span className="text-xs uppercase tracking-widest text-slate-500 font-bold font-mono">Initializing Ashritha's OS...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0B1120] text-blue-50 overflow-hidden relative font-sans select-none" id="root-app-layout">
      
      {/* Soft spotlight following the mouse smoothly - enhanced light */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300 opacity-100"
        style={{
          background: `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.12), transparent 80%)`,
        }}
      />
      
      
      {/* Sidebar navigation */}
      <Sidebar 
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        streakCount={currentStreak}
        completedTasksCount={completedTasksCount}
        totalTasksCount={totalTasks}
      />

      {/* Main Workspace container */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 min-w-0" id="main-scroll-pane">
        
        {/* Dynamic Nav Tabs with Framer transitions */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12, filter: "blur(2px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(2px)" }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="space-y-8"
          >

            {/* TAB 1: DASHBOARD CHRONICLE */}
            {activeTab === "dashboard" && (
              <div className="space-y-8">
                
                {/* Clean Professional Hero Header with Live Date & Timer */}
                <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 p-6 md:p-8 rounded-[28px] bg-gradient-to-br from-slate-900/40 via-[#111827]/60 to-[#111827]/20 border border-white/5 relative overflow-hidden">
                  <div className="space-y-2 relative z-10">
                    <h1 className="text-3xl font-black md:text-4xl text-white tracking-tight">
                      Good Day, {state.preferences?.userName || "Ashritha"}.
                    </h1>
                    <p className="text-xs text-slate-400 font-medium">
                      Build consistency, register task completions, and review your metrics systematically.
                    </p>
                  </div>

                  {/* Date & Continuously Updating Time Block */}
                  <div className="flex flex-col items-start md:items-end justify-center py-2 px-5 rounded-2xl bg-slate-950/60 border border-white/5 relative z-10 self-start md:self-auto min-w-[200px]">
                    <div className="flex items-center gap-2 text-indigo-400 mb-0.5 font-mono font-bold text-[10px] tracking-widest uppercase">
                      <Clock className="h-3.5 w-3.5" />
                      SYSTEM TIME
                    </div>
                    <span className="text-xl font-bold font-mono text-slate-100 tracking-tight leading-none mb-1 text-left md:text-right w-full">
                      {timeStr || "12:00:00 PM"}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-450 leading-none text-left md:text-right w-full">
                      {dateStr || "Wednesday, June 3, 2026"}
                    </span>
                  </div>
                </header>

                {/* Growth Center Metric Card */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Overall progress visualizer */}
                  <div className="lg:col-span-8 bg-[#111827] rounded-[32px] p-6 md:p-8 border border-white/5 relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="relative z-10 space-y-4 text-center md:text-left">
                      <h2 className="text-[10px] tracking-widest uppercase text-slate-400 font-bold font-mono">Overall Growth Progress</h2>
                      
                      <div className="flex items-baseline justify-center md:justify-start gap-1">
                        <span className="text-8xl md:text-9xl font-black tracking-tighter leading-none text-white">
                          {progressPercentage}
                        </span>
                        <span className="text-3xl font-bold text-cyan-400 tracking-tighter">%</span>
                      </div>

                      <div className="space-y-1.5 w-full md:w-64">
                        <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono font-bold">
                          <span>JOURNAL INDEX</span>
                          <span className="text-indigo-400">{completedTasksCount} / {totalTasks} TASKS</span>
                        </div>
                        <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-900">
                          <div 
                            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="relative shrink-0 select-none">
                      <ProgressRing percent={progressPercentage} size={150} strokeWidth={11} />
                    </div>
                  </div>

                  {/* Clean Numeric Real Metrics Lists */}
                  <div className="lg:col-span-4 grid grid-cols-2 gap-4">
                    
                    <div className="bg-[#111827] rounded-[24px] p-5 border border-white/5 flex flex-col justify-between">
                      <span className="text-[9px] font-mono tracking-widest uppercase text-slate-500 font-black">COMPLETED</span>
                      <div>
                        <span className="text-3xl font-mono font-black text-white">{completedTasksCount}</span>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">Total Tasks Completed</p>
                      </div>
                    </div>

                    <div className="bg-[#111827] rounded-[24px] p-5 border border-white/5 flex flex-col justify-between">
                      <span className="text-[9px] font-mono tracking-widest uppercase text-slate-500 font-black">TOTAL</span>
                      <div>
                        <span className="text-3xl font-mono font-black text-white">{totalTasks}</span>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">Total Added Tasks</p>
                      </div>
                    </div>

                    <div className="bg-[#111827] rounded-[24px] p-5 border border-white/5 flex flex-col justify-between">
                      <span className="text-[9px] font-mono tracking-widest uppercase text-slate-500 font-black">STREAK</span>
                      <div className="flex items-center gap-1">
                        <span className="text-3xl font-mono font-black text-amber-500">{currentStreak}</span>
                        <Flame className="h-5 w-5 text-amber-500 fill-amber-550/20" />
                      </div>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Current Active Streak</p>
                    </div>

                    <div className="bg-[#111827] rounded-[24px] p-5 border border-white/5 flex flex-col justify-between">
                      <span className="text-[9px] font-mono tracking-widest uppercase text-slate-500 font-black">LONGEST</span>
                      <div>
                        <span className="text-3xl font-mono font-black text-indigo-400">{longestStreak}</span>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">Longest Streak Achievement</p>
                      </div>
                    </div>

                  </div>
                </section>

                {/* Strategic Domain Map */}
                <section className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 font-bold">
                      Domain Hub Centers
                    </span>
                    <span className="text-[9px] text-indigo-400 font-mono tracking-wider font-bold">CLICK CARDS TO ACCESS</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                    
                    {[
                      { id: "ml", name: "Machine Learning", pct: mlPercent, color: "from-indigo-500 to-indigo-400", count: state.mlTopics.length },
                      { id: "project", name: "AI Project", pct: projectPercent, color: "from-cyan-500 to-cyan-400", count: state.projectMilestones.length },
                      { id: "challenge", name: "AI Tools", pct: toolsPercent, color: "from-amber-500 to-amber-400", count: state.aiToolsDays.length },
                      { id: "dsa", name: "DSA Tracker", pct: dsaPercent, color: "from-purple-500 to-purple-400", count: state.dsaLogs.length },
                      { id: "cloud", name: "Cloud Learning", pct: cloudPercent, color: "from-sky-500 to-sky-400", count: state.cloudTopics.length }
                    ].map((dom) => (
                      <div 
                        key={dom.id}
                        onClick={() => setActiveTab(dom.id)}
                        className="bg-[#111827] border border-white/5 p-5 rounded-2xl flex flex-col justify-between h-36 cursor-pointer hover:border-indigo-500/20 hover:-translate-y-0.5 hover:bg-slate-900/30 transition-all text-left"
                      >
                        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase">{dom.name}</div>
                        <div>
                          <div className="text-2xl font-black tracking-tight font-mono mb-1 text-slate-100">
                            {dom.count === 0 ? "0%" : `${Math.round(dom.pct)}%`}
                          </div>
                          <div className="text-[9px] text-slate-500 font-mono mb-2 font-bold uppercase">{dom.count} total tasks</div>
                          <div className="h-1 bg-slate-950 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full animate-pulse" style={{ width: `${dom.pct}%` }} />
                          </div>
                        </div>
                      </div>
                    ))}

                  </div>
                </section>

                {/* Bottom Center: Heatmap / Quick list logs */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-6">
                  
                  {/* Today's Completions list */}
                  <div className="lg:col-span-6 bg-[#111827] rounded-[28px] border border-white/5 p-6 space-y-4">
                    <span className="text-[10px] tracking-widest uppercase font-mono font-bold text-slate-400 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                      Completed Today ({tasksCompletedToday})
                    </span>

                    <div className="space-y-2">
                      {completedTasks.filter(t => t.dateCompleted === todayDateStr).length === 0 ? (
                        <p className="text-xs text-slate-500 font-medium py-4">No tasks completed today yet. Build consistency by matching a task!</p>
                      ) : (
                        completedTasks.filter(t => t.dateCompleted === todayDateStr).map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-3 p-3 bg-slate-950/45 border border-slate-900 rounded-xl"
                          >
                            <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                            <span className="text-xs text-slate-350 font-semibold truncate">{task.name}</span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Contributions heatmap */}
                  <div className="lg:col-span-6 bg-[#111827] border border-white/5 rounded-[28px] p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-[10px] font-bold uppercase font-mono text-slate-400 tracking-widest">Consistency Heatmap</span>
                        <span className="text-[9px] font-mono text-slate-500 font-bold">LAST 28 DAYS</span>
                      </div>
                      
                      <ContributionHeatmap dailyLogs={getContributionLogs()} />
                    </div>
                  </div>

                </section>

              </div>
            )}

            {/* TAB-2: DOMAINS ROUTERS */}
            {activeTab === "ml" && (
              <MLModule 
                topics={state.mlTopics} 
                onUpdateTopic={handleUpdateMLTopic} 
                onAddTopic={handleAddMLTopic} 
                onDeleteTopic={handleDeleteMLTopic} 
              />
            )}

            {activeTab === "project" && (
              <ProjectModule 
                milestones={state.projectMilestones} 
                onUpdateMilestone={handleUpdateMilestone} 
                onAddMilestone={handleAddMilestone}
                onDeleteMilestone={handleDeleteMilestone}
              />
            )}

            {activeTab === "challenge" && (
              <ToolsModule 
                days={state.aiToolsDays} 
                onUpdateDay={handleUpdateDay} 
                onAddDay={handleAddDay}
                onDeleteDay={handleDeleteDay}
              />
            )}

            {activeTab === "dsa" && (
              <DSAModule 
                logs={state.dsaLogs} 
                onAddLog={handleAddDSALog} 
                onUpdateLog={handleUpdateDSALog}
                onDeleteLog={handleDeleteDSALog} 
              />
            )}

            {activeTab === "cloud" && (
              <CloudModule 
                topics={state.cloudTopics} 
                onUpdateTopic={handleUpdateCloudTopic} 
                onAddTopic={handleAddCloudTopic} 
                onDeleteTopic={handleDeleteCloudTopic} 
              />
            )}

            {/* TAB-3: MINIMAL CALENDAR VIEW */}
            {activeTab === "calendar" && (
              <div className="space-y-6 text-left">
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                  <h2 className="text-xl font-bold tracking-tight text-white mb-1">Consistency Calendar</h2>
                  <p className="text-xs text-slate-400">View daily efforts mapped continuously. Cell colors deepen as daily completions increase.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Monthly grid */}
                  <div className="lg:col-span-8 bg-[#111827] rounded-3xl p-6 border border-white/5 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-slate-200">June 2026</span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">CLICK A DAY TO VIEW LOGS</span>
                    </div>

                    {/* DOW labels */}
                    <div className="grid grid-cols-7 gap-2.5 text-center text-[10px] font-mono font-bold text-slate-500 uppercase">
                      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>

                    {/* Day blocks */}
                    <div className="grid grid-cols-7 gap-2.5">
                      {/* Empty slots for Monday start in June 2026 (Mon=1, so Monday begins with June 1, vacancy = 0) */}
                      {Array.from({ length: 30 }).map((_, idx) => {
                        const dayNum = idx + 1;
                        const padded = String(dayNum).padStart(2, "0");
                        const dateCode = `2026-06-${padded}`;
                        
                        // Count completions on this day
                        const dayCompletions = completedTasks.filter(t => t.dateCompleted === dateCode).length;

                        let colorStyle = "bg-slate-950 border-slate-900 hover:border-slate-800 text-slate-600";
                        if (dayCompletions === 1) colorStyle = "bg-indigo-950/80 border-indigo-900/50 text-indigo-300";
                        else if (dayCompletions === 2) colorStyle = "bg-indigo-800/80 border-indigo-700/60 text-indigo-100";
                        else if (dayCompletions >= 3) colorStyle = "bg-cyan-500/80 border-cyan-400/50 text-slate-950 font-black shadow-[0_0_8px_rgba(34,211,238,0.25)]";

                        return (
                          <div
                            key={dayNum}
                            onClick={() => setSelectedCalendarDay(dayNum)}
                            className={`aspect-square rounded-xl border flex flex-col justify-between p-2 font-mono text-xs font-semibold cursor-pointer transition-all select-none ${colorStyle} ${
                              selectedCalendarDay === dayNum ? "ring-2 ring-indigo-500 scale-[1.02]" : ""
                            }`}
                          >
                            <span>{dayNum}</span>
                            {dayCompletions > 0 && (
                              <span className="text-[9px] text-right font-bold leading-none bg-black/15 px-1 py-0.5 rounded">
                                +{dayCompletions}
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Day completed tasks listing */}
                  <div className="lg:col-span-4 bg-[#111827] rounded-3xl p-6 border border-white/5 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block mb-3">CONCURRENT COMPLETIONS</span>
                      
                      {selectedCalendarDay === null ? (
                        <div className="text-center py-12 text-slate-500 lg:h-48 flex flex-col items-center justify-center">
                          <Smile className="h-6 w-6 stroke-[1.5] mb-2 text-slate-600" />
                          <p className="text-xs font-semibold">Select a calendar day</p>
                          <p className="text-[10px] max-w-[160px] text-slate-500 mt-1">Click any numbered day in the monthly grid to list completed log items.</p>
                        </div>
                      ) : (
                        <div className="space-y-4 text-left">
                          <h3 className="text-sm font-bold text-white mb-2">June {selectedCalendarDay}, 2026</h3>
                          
                          <div className="space-y-2">
                            {calendarTasks.length === 0 ? (
                              <p className="text-xs text-slate-500 font-semibold">No tasks completed on this date.</p>
                            ) : (
                              calendarTasks.map((t) => (
                                <div key={t.id} className="p-3 bg-slate-950 border border-slate-900 rounded-xl flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                                  <span className="text-xs text-slate-300 font-semibold truncate">{t.name}</span>
                                </div>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB-4: ANALYTICS HUB */}
            {activeTab === "analytics" && (
              <div className="space-y-6 text-left animate-fade-in">
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                  <h2 className="text-xl font-bold tracking-tight text-white mb-1">Analytics Dashboard</h2>
                  <p className="text-xs text-slate-400">Quantitative insights derived 100% from your registered journal achievements.</p>
                </div>

                {/* Primary Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {[
                    { label: "Completed Tasks", val: completedTasksCount, col: "text-slate-100" },
                    { label: "Current Streak", val: `${currentStreak} Days`, col: "text-amber-500" },
                    { label: "Longest Streak", val: `${longestStreak} Days`, col: "text-indigo-400" },
                    { label: "Completion Rate", val: `${progressPercentage}%`, col: "text-cyan-400" },
                    { label: "Most Active Category", val: getMostActiveCategory(), col: "text-emerald-400" },
                    { label: "Most Active Day", val: getMostActiveDay(), col: "text-sky-400" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-[#111827] rounded-2xl p-4 border border-white/5 flex flex-col justify-between">
                      <span className="text-[9px] font-mono tracking-wider font-bold text-slate-500 uppercase">{stat.label}</span>
                      <span className={`text-sm md:text-md font-black tracking-tight mt-2 min-w-0 truncate ${stat.col}`}>{stat.val}</span>
                    </div>
                  ))}
                </div>

                {/* Vector SVG Graphical charts - beautifully designed, bulletproof fallback on empty states */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  
                  {/* Graph 1: Weekly Completions */}
                  <div className="bg-[#111827] rounded-[24px] p-6 border border-white/5 space-y-4">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">
                      Tasks Completed Per Day (Last 7 Days)
                    </span>
                    <div className="h-44 flex items-end gap-2.5 pt-4">
                      {Array.from({ length: 7 }).map((_, i) => {
                        const d = new Date();
                        d.setDate(d.getDate() - (6 - i));
                        const dateStr = d.toISOString().split("T")[0];
                        const dayLabel = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
                        const count = completedTasks.filter(t => t.dateCompleted === dateStr).length;
                        const maxVal = Math.max(1, ...Array.from({ length: 7 }).map((_, idx) => {
                          const deltaDate = new Date();
                          deltaDate.setDate(deltaDate.getDate() - (6 - idx));
                          return completedTasks.filter(t => t.dateCompleted === deltaDate.toISOString().split("T")[0]).length;
                        }));
                        const barPct = (count / maxVal) * 100;

                        return (
                          <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                            <div className="text-[9px] text-slate-400 font-mono font-bold font-bold mb-1">{count > 0 ? count : ""}</div>
                            <div className="w-full bg-slate-950 rounded-lg p-[1px] h-32 flex flex-col justify-end border border-slate-900">
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: `${Math.max(4, barPct)}%` }}
                                transition={{ duration: 0.5, delay: i * 0.05 }}
                                className={`w-full rounded-md bg-gradient-to-t ${count > 0 ? "from-indigo-600 to-cyan-400 shadow-[0_0_8px_rgba(99,102,241,0.2)]" : "from-slate-900 to-slate-800"}`}
                              />
                            </div>
                            <span className="text-[8px] text-slate-500 font-mono font-bold mt-2">{dayLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Graph 2: Analytics Category distribution */}
                  <div className="bg-[#111827] rounded-[24px] p-6 border border-white/5 space-y-4">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">
                      Category Distribution Index
                    </span>
                    <div className="space-y-3 pt-2 h-44 flex flex-col justify-center">
                      {[
                        { name: "Machine Learning", count: state.mlTopics.filter(t => t.isCompleted).length, color: "bg-indigo-500" },
                        { name: "AI Project Road", count: state.projectMilestones.filter(t => t.isCompleted).length, color: "bg-cyan-500" },
                        { name: "AI Tools challenge", count: state.aiToolsDays.filter(t => t.isCompleted).length, color: "bg-amber-500" },
                        { name: "DSA Problem logs", count: state.dsaLogs.filter(t => t.isCompleted).length, color: "bg-purple-500" },
                        { name: "Cloud computing", count: state.cloudTopics.filter(t => t.isCompleted).length, color: "bg-sky-500" },
                      ].map((item, i) => {
                        const totalCompletedAcrossCategories = Math.max(1, completedTasksCount);
                        const percentRatio = Math.round((item.count / totalCompletedAcrossCategories) * 100);

                        return (
                          <div key={i} className="space-y-1">
                            <div className="flex justify-between items-center text-[10px] font-mono">
                              <span className="text-slate-400 font-semibold">{item.name}</span>
                              <span className="text-white font-bold">{item.count} ({percentRatio}%)</span>
                            </div>
                            <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.count > 0 ? percentRatio : 0}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Graph 3: Consistency trend progression */}
                  <div className="bg-[#111827] rounded-[24px] p-6 border border-white/5 space-y-4">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase block">
                      Cumulative Completion Trend
                    </span>
                    
                    <div className="h-44 flex items-end justify-between pt-4 relative">
                      {/* Interactive background guide coordinates */}
                      <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none opacity-10">
                        <div className="border-b border-white" />
                        <div className="border-b border-white" />
                        <div className="border-b border-white" />
                      </div>

                      {/* Line chart values */}
                      <div className="w-full h-32 flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                          <linearGradient id="gradTrend" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                          </linearGradient>
                          {/* area under trend curve */}
                          <path
                            d={generateTrendPath(true)}
                            fill="url(#gradTrend)"
                          />
                          {/* stroke line */}
                          <path
                            d={generateTrendPath(false)}
                            fill="none"
                            stroke="#6366F1"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <div className="absolute bottom-1 w-full flex justify-between px-1 text-[8px] text-slate-500 font-mono font-bold leading-none uppercase">
                        <span>14d ago</span>
                        <span>today</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB-5: ACHIEVEMENTS CENTER */}
            {activeTab === "achievements" && (
              <div className="space-y-6 text-left">
                <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
                  <h2 className="text-xl font-bold tracking-tight text-white mb-1">Achievements Engine</h2>
                  <p className="text-xs text-slate-400">Unlock official growth badges as you build consistency and log tasks.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {computedBadges.map((badge) => {
                    const isUnlocked = badge.unlockedAt !== undefined;

                    return (
                      <div 
                        key={badge.id}
                        className={`p-5 rounded-[24px] border border-white/5 transition-all relative overflow-hidden ${
                          isUnlocked 
                            ? "bg-[#111827] border-indigo-500/10 shadow shadow-indigo-500/5 group hover:border-indigo-500/20" 
                            : "bg-[#111827]/30 border-white/[0.02] opacity-50"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                            isUnlocked ? "bg-indigo-600/15 text-indigo-400" : "bg-slate-950 text-slate-600"
                          }`}>
                            🏆
                          </div>
                          <span className="text-[9px] font-mono font-bold uppercase text-slate-500">
                            {isUnlocked ? "UNLOCKED" : "LOCKED"}
                          </span>
                        </div>

                        <h3 className="text-xs font-bold text-slate-100 mb-1">{badge.name}</h3>
                        <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-3">{badge.description}</p>
                        <div className="text-[9px] text-slate-500 font-mono font-bold uppercase tracking-wider">REQ: {badge.requirement}</div>
                        {isUnlocked && (
                          <div className="absolute bottom-2 right-3 text-[8px] font-mono font-bold tracking-tight text-indigo-400">{badge.unlockedAt}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

    </div>
  );

  // Helper metrics generators
  function getMostActiveCategory(): string {
    const ml = state.mlTopics.filter(t => t.isCompleted).length;
    const proj = state.projectMilestones.filter(t => t.isCompleted).length;
    const tool = state.aiToolsDays.filter(t => t.isCompleted).length;
    const dsa = state.dsaLogs.filter(t => t.isCompleted).length;
    const cloud = state.cloudTopics.filter(t => t.isCompleted).length;

    const max = Math.max(ml, proj, tool, dsa, cloud);
    if (max === 0) return "None yet";
    if (ml === max) return "Machine Learning";
    if (proj === max) return "AI Project";
    if (tool === max) return "AI Tools";
    if (dsa === max) return "DSA Tracker";
    return "Cloud Learning";
  }

  function getMostActiveDay(): string {
    const countsByDay: { [day: string]: number } = {
      Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0, Sunday: 0
    };

    completedTasks.forEach(task => {
      if (task.dateCompleted) {
        const d = new Date(task.dateCompleted);
        const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
        if (dayName in countsByDay) {
          countsByDay[dayName]++;
        }
      }
    });

    const maxVal = Math.max(...Object.values(countsByDay));
    if (maxVal === 0) return "None yet";
    
    return Object.keys(countsByDay).find(day => countsByDay[day] === maxVal) || "None yet";
  }

  function generateTrendPath(closeArea: boolean): string {
    const datapoints: number[] = [];
    const dates: string[] = [];

    // Map 14 days of cumulative completed counts
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split("T")[0];
      dates.push(str);
      
      const countUptoThisDay = completedTasks.filter(t => t.dateCompleted && t.dateCompleted <= str).length;
      datapoints.push(countUptoThisDay);
    }

    const maxVal = Math.max(1, ...datapoints);
    const widthUnit = 100 / 13;
    const heightUnit = 40 / maxVal;

    let path = "";
    datapoints.forEach((val, index) => {
      const x = (index * widthUnit).toFixed(1);
      // SVG Y starts at top (0) so subtract from max height (40)
      const y = (40 - val * heightUnit).toFixed(1);

      if (index === 0) {
        path = `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    if (closeArea) {
      path += " L 100 40 L 0 40 Z";
    }

    return path;
  }
}
