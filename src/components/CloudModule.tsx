/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CloudTopic } from "../types";
import { Cloud, Plus, X, Trash2, CheckCircle2, AlertTriangle } from "lucide-react";

interface CloudModuleProps {
  topics: CloudTopic[];
  onUpdateTopic: (topic: CloudTopic) => void;
  onAddTopic: (topic: Omit<CloudTopic, "id">) => void;
  onDeleteTopic: (id: string) => void;
}

export default function CloudModule({ topics, onUpdateTopic, onAddTopic, onDeleteTopic }: CloudModuleProps) {
  const [isAdding, setIsAdding] = React.useState(false);
  const [taskName, setTaskName] = React.useState("");
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    onAddTopic({
      name: taskName.trim(),
      isCompleted: false
    });

    setTaskName("");
    setIsAdding(false);
  };

  const handleToggleComplete = (topic: CloudTopic) => {
    const nextVal = !topic.isCompleted;
    onUpdateTopic({
      ...topic,
      isCompleted: nextVal,
      dateCompleted: nextVal ? new Date().toISOString().split("T")[0] : undefined
    });
  };

  // Separate active and completed
  const activeTasks = topics.filter((t) => !t.isCompleted);
  const completedTasks = topics.filter((t) => t.isCompleted);

  return (
    <div className="space-y-6" id="cloud-module-panel">
      {/* Premium Module Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-600/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            <Cloud className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Cloud Learning</h2>
            <p className="text-xs text-slate-400">Architect scalable, cloud-native pipelines (AWS, Azure, GCP).</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all font-mono hover:scale-[1.02] shadow-md shadow-sky-600/10"
        >
          <Plus className="h-4 w-4" />
          ADD TASK
        </button>
      </div>

      {topics.length === 0 ? (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-16 bg-[#111827] rounded-[24px] border border-white/5 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800/50 flex items-center justify-center text-slate-600">
            <Cloud className="h-5 w-5" />
          </div>
          <span className="text-sm font-semibold text-slate-450">No tasks added yet.</span>
          <p className="text-xs text-slate-500 max-w-xs">Create your very first Cloud Learning task to start establishing your distributed network systems.</p>
        </div>
      ) : (
        /* Main Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Active Tasks list */}
          <div className="bg-[#111827] rounded-[24px] p-6 border border-white/5 space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              ACTIVE TASKS ({activeTasks.length})
            </span>
            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {activeTasks.length === 0 ? (
                  <p className="text-xs text-slate-650 font-medium">All cloud configurations active and running!</p>
                ) : (
                  activeTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layoutId={`cloud-${task.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-between p-3.5 bg-slate-950/45 hover:bg-slate-950 border border-slate-900 rounded-xl group transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className="w-5 h-5 rounded-md border border-slate-800 hover:border-sky-500/80 cursor-pointer flex items-center justify-center transition-colors shrink-0"
                        >
                          <div className="w-3 h-3 rounded bg-transparent group-hover:bg-sky-600/30 transition-colors" />
                        </button>
                        <span className="text-xs text-slate-200 font-semibold truncate select-none">{task.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (confirmDeleteId === task.id) {
                            onDeleteTopic(task.id);
                            setConfirmDeleteId(null);
                          } else {
                            setConfirmDeleteId(task.id);
                            setTimeout(() => setConfirmDeleteId(null), 3000);
                          }
                        }}
                        className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all cursor-pointer ${
                          confirmDeleteId === task.id
                            ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                            : "hover:bg-slate-900 text-slate-500 hover:text-red-400"
                        }`}
                      >
                        {confirmDeleteId === task.id ? <AlertTriangle className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Completed Tasks list */}
          <div className="bg-[#111827]/60 rounded-[24px] p-6 border border-white/[0.02] space-y-4">
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-500 uppercase">
              PROVISIONED SYSTEMS ({completedTasks.length})
            </span>
            <div className="space-y-2.5">
              <AnimatePresence mode="popLayout">
                {completedTasks.length === 0 ? (
                  <p className="text-xs text-slate-650 font-medium">No cloud systems provisioned yet.</p>
                ) : (
                  completedTasks.map((task) => (
                    <motion.div
                      key={task.id}
                      layoutId={`cloud-${task.id}`}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 0.75, scale: 1 }}
                      className="flex items-center justify-between p-3.5 bg-slate-950/20 border border-slate-900/30 rounded-xl group transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          onClick={() => handleToggleComplete(task)}
                          className="w-5 h-5 rounded-md bg-sky-600/20 border border-sky-500/40 cursor-pointer flex items-center justify-center shrink-0"
                        >
                          <CheckCircle2 className="h-4.5 w-4.5 text-sky-400" />
                        </button>
                        <span className="text-xs text-slate-450 font-semibold line-through truncate select-none">{task.name}</span>
                      </div>
                      <button
                        onClick={() => {
                          if (confirmDeleteId === task.id) {
                            onDeleteTopic(task.id);
                            setConfirmDeleteId(null);
                          } else {
                            setConfirmDeleteId(task.id);
                            setTimeout(() => setConfirmDeleteId(null), 3000);
                          }
                        }}
                        className={`opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all cursor-pointer ${
                          confirmDeleteId === task.id
                            ? "bg-red-500/20 text-red-500 hover:bg-red-500/30"
                            : "hover:bg-slate-900 text-slate-500 hover:text-red-400"
                        }`}
                      >
                        {confirmDeleteId === task.id ? <AlertTriangle className="h-3.5 w-3.5" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      {/* Adding Premium Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111827] border border-white/5 w-full max-w-sm rounded-[24px] p-6 shadow-2xl relative"
            >
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-4">
                <Cloud className="h-5 w-5 text-sky-450" />
                <span className="text-sm font-bold text-white uppercase tracking-wider font-mono">Create Task</span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase block">Task Name</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Learn VPC"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-900 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-sky-500/80 transition-all font-sans"
                  />
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 border border-slate-900 hover:bg-slate-950 text-slate-400 font-semibold py-2.5 rounded-xl text-xs transition-colors font-mono"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-sky-600 hover:bg-sky-750 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors font-mono shadow-md shadow-sky-600/10"
                  >
                    COMMIT
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
