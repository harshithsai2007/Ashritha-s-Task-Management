/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  LayoutDashboard, 
  Brain, 
  Rocket, 
  Wand2, 
  Terminal, 
  Cloud, 
  Calendar, 
  BarChart3, 
  Award, 
  Settings, 
  Flame, 
  Menu, 
  X,
  Target
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streakCount: number;
  completedTasksCount: number;
  totalTasksCount: number;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  streakCount, 
  completedTasksCount, 
  totalTasksCount 
}: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "ml", label: "Machine Learning", icon: Brain, category: "Domains" },
    { id: "project", label: "AI Project", icon: Rocket, category: "Domains" },
    { id: "challenge", label: "AI Tools", icon: Wand2, category: "Domains" },
    { id: "dsa", label: "DSA Tracker", icon: Terminal, category: "Domains" },
    { id: "cloud", label: "Cloud Learning", icon: Cloud, category: "Domains" },
    { id: "calendar", label: "Calendar", icon: Calendar, category: "Tracking" },
    { id: "analytics", label: "Analytics", icon: BarChart3, category: "Tracking" },
    { id: "achievements", label: "Achievements", icon: Award, category: "Gamification" },
  ];

  const completionPercent = totalTasksCount > 0 
    ? Math.round((completedTasksCount / totalTasksCount) * 100) 
    : 0;

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-lg hover:bg-slate-800 cursor-pointer"
          id="sidebar-mobile-toggle"
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Sidebar Panel */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-full w-64 z-40 flex flex-col justify-between bg-[#111827] border-r border-slate-900 overflow-y-auto transition-transform duration-300 md:transform-none ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        id="main-sidebar-aside"
      >
        <div className="p-6">
          {/* Branded Logo Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Target className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white leading-tight">
                Ashritha
              </h1>
              <span className="text-[10px] text-slate-400 block font-normal leading-tight mt-0.5">
                (hi cutie ~harshith)
              </span>
            </div>
          </div>

          {/* Quick Real Metrics Bar */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-3 bg-slate-950/60 rounded-xl border border-slate-900">
            <div className="flex flex-col items-center justify-center p-2 text-center bg-[#111827]/40 rounded-lg">
              <div className="flex items-center gap-1 text-amber-500 mb-1 font-mono font-bold">
                <Flame className="h-4 w-4 fill-amber-500/20" />
                <span className="text-xs">{streakCount}d</span>
              </div>
              <span className="text-[9px] text-slate-500 font-bold font-mono">STREAK</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2 text-center bg-[#111827]/40 rounded-lg">
              <span className="text-xs font-bold text-cyan-400 font-mono mb-1">{completionPercent}%</span>
              <span className="text-[9px] text-slate-500 font-bold font-mono">DONE</span>
            </div>
          </div>

          {/* Navigation Links Grouped */}
          <nav className="space-y-4">
            {["", "Domains", "Tracking", "Gamification"].map((category) => {
              const items = menuItems.filter((i) => (category ? i.category === category : !i.category));
              if (items.length === 0) return null;

              return (
                <div key={category || "general"} className="space-y-1">
                  {category && (
                    <span className="px-3 text-[9px] uppercase font-mono tracking-widest text-slate-500 font-bold block mb-1">
                      {category}
                    </span>
                  )}
                  {items.map((item) => {
                    const IconComponent = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                      <button
                        key={item.id}
                        id={`nav-item-${item.id}`}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group cursor-pointer ${
                          isActive
                            ? "bg-indigo-600 text-white shadow-indigo-500/15 shadow-lg"
                            : "text-slate-400 hover:text-white hover:bg-[#111827]/80"
                        }`}
                      >
                        <IconComponent
                          className={`h-4 w-4 flex-shrink-0 transition-transform ${
                            isActive ? "scale-105 text-white" : "text-slate-500 group-hover:text-slate-300"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                        {isActive && (
                          <div className="ml-auto w-1 h-1 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </nav>
        </div>

        {/* User Card Profile Footer */}
        <div className="p-4 border-t border-slate-900 bg-slate-950/40">
          <div className="flex items-center gap-3 p-2 bg-[#111827]/40 rounded-xl border border-slate-900">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center font-bold text-white shadow-md text-xs select-none">
              ASH
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-slate-200 truncate">Ashritha</h4>
              <p className="text-[10px] text-indigo-400 font-mono tracking-tight font-semibold truncate leading-none">AI Engineer</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
