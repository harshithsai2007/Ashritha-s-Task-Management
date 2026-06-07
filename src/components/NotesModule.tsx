import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { LearningNote } from "../types";
import { BookOpen, Search, Trash2, AlertTriangle, Filter, StickyNote, Brain, Rocket, Wand2, Terminal, Cloud } from "lucide-react";

interface NotesModuleProps {
  notes: LearningNote[];
  user: "ashritha" | "harshith";
  onDeleteNote: (id: string) => void;
}

const DOMAIN_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  ml:      { label: "Machine Learning", icon: <Brain className="w-3.5 h-3.5" />,   color: "#818CF8" },
  project: { label: "Project",          icon: <Rocket className="w-3.5 h-3.5" />,  color: "#34D399" },
  tools:   { label: "AI Tools",         icon: <Wand2 className="w-3.5 h-3.5" />,   color: "#FBBF24" },
  dsa:     { label: "DSA",              icon: <Terminal className="w-3.5 h-3.5" />, color: "#F472B6" },
  cloud:   { label: "Cloud",            icon: <Cloud className="w-3.5 h-3.5" />,    color: "#38BDF8" },
};

export default function NotesModule({ notes, user, onDeleteNote }: NotesModuleProps) {
  const [search, setSearch] = React.useState("");
  const [filterDomain, setFilterDomain] = React.useState<string>("all");
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const primaryColor = user === "ashritha" ? "#FF1493" : "#EF4444";
  const secondaryColor = user === "ashritha" ? "#22D3EE" : "#DC2626";

  const filtered = notes
    .filter((n) => filterDomain === "all" || n.domain === filterDomain)
    .filter((n) =>
      n.content.toLowerCase().includes(search.toLowerCase()) ||
      n.taskName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const domains = ["all", ...Array.from(new Set(notes.map((n) => n.domain)))];

  return (
    <div className="space-y-6" id="notes-module-container">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 rounded-2xl border border-slate-800"
        style={{ background: "rgba(10,12,22,0.6)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: `${primaryColor}15`, border: `1px solid ${primaryColor}25` }}
          >
            <BookOpen className="h-6 w-6" style={{ color: primaryColor }} />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">Learning Journal</h2>
            <p className="text-xs text-slate-400">
              {notes.length} note{notes.length !== 1 ? "s" : ""} · captured from completed tasks
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-600 outline-none transition-all"
            style={{
              background: "rgba(0,0,0,0.4)",
              border: "1px solid rgba(255,255,255,0.07)",
              caretColor: primaryColor,
            }}
          />
        </div>
      </div>

      {/* Domain filter pills */}
      {notes.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
          {domains.map((d) => {
            const cfg = d === "all" ? null : DOMAIN_CONFIG[d];
            const isActive = filterDomain === d;
            return (
              <button
                key={d}
                onClick={() => setFilterDomain(d)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer"
                style={{
                  background: isActive
                    ? d === "all"
                      ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                      : `${cfg!.color}20`
                    : "rgba(255,255,255,0.04)",
                  border: isActive
                    ? d === "all" ? "none" : `1px solid ${cfg!.color}50`
                    : "1px solid rgba(255,255,255,0.06)",
                  color: isActive
                    ? d === "all" ? "#fff" : cfg!.color
                    : "rgba(255,255,255,0.35)",
                }}
              >
                {cfg && <span>{cfg.icon}</span>}
                {d === "all" ? "All" : cfg?.label ?? d}
              </button>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {notes.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-20 rounded-[24px] border border-white/5 text-center space-y-4"
          style={{ background: "rgba(10,12,22,0.5)" }}
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: `${primaryColor}10`, border: `1px solid ${primaryColor}20` }}
          >
            <StickyNote className="w-7 h-7" style={{ color: `${primaryColor}60` }} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-300 mb-1">No notes yet</p>
            <p className="text-xs text-slate-500 max-w-xs">
              Complete a task in any module — you'll get a prompt to write what you learned. Notes appear here.
            </p>
          </div>
        </motion.div>
      ) : filtered.length === 0 ? (
        <p className="text-center text-xs text-slate-500 py-12">No notes match your search.</p>
      ) : (
        /* Notes grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((note) => {
              const cfg = DOMAIN_CONFIG[note.domain];
              const isExpanded = expandedId === note.id;

              return (
                <motion.div
                  key={note.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="group relative rounded-[20px] p-5 cursor-pointer transition-all"
                  style={{
                    background: "rgba(10, 12, 22, 0.8)",
                    border: `1px solid rgba(255,255,255,0.06)`,
                    boxShadow: isExpanded ? `0 10px 40px ${cfg?.color ?? primaryColor}15` : "none",
                  }}
                  onClick={() => setExpandedId(isExpanded ? null : note.id)}
                >
                  {/* Left accent stripe */}
                  <div
                    className="absolute left-0 top-4 bottom-4 w-0.5 rounded-full"
                    style={{ background: cfg?.color ?? primaryColor }}
                  />

                  {/* Domain badge + time */}
                  <div className="flex items-center justify-between mb-3 pl-3">
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider"
                      style={{
                        background: `${cfg?.color ?? primaryColor}15`,
                        border: `1px solid ${cfg?.color ?? primaryColor}30`,
                        color: cfg?.color ?? primaryColor,
                      }}
                    >
                      {cfg?.icon}
                      {cfg?.label ?? note.domain}
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-white/25 font-mono">{note.timeLabel}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirmDeleteId === note.id) {
                            onDeleteNote(note.id);
                            setConfirmDeleteId(null);
                          } else {
                            setConfirmDeleteId(note.id);
                            setTimeout(() => setConfirmDeleteId(null), 3000);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg transition-all cursor-pointer"
                        style={{
                          background: confirmDeleteId === note.id ? "rgba(239,68,68,0.15)" : "transparent",
                          color: confirmDeleteId === note.id ? "#EF4444" : "rgba(255,255,255,0.3)",
                        }}
                      >
                        {confirmDeleteId === note.id ? (
                          <AlertTriangle className="w-3 h-3" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Task name */}
                  <p className="text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1 pl-3 truncate">
                    {note.taskName}
                  </p>

                  {/* Note content */}
                  <p
                    className="text-sm text-white/80 leading-relaxed pl-3 transition-all"
                    style={{
                      display: isExpanded ? "block" : "-webkit-box",
                      WebkitLineClamp: isExpanded ? undefined : 3,
                      WebkitBoxOrient: "vertical",
                      overflow: isExpanded ? "visible" : "hidden",
                    }}
                  >
                    {note.content}
                  </p>

                  {/* Date footer */}
                  <p className="text-[10px] text-white/20 mt-3 pl-3 font-mono">{note.dateLabel}</p>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
