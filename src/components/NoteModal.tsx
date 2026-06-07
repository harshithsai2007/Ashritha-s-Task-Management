import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { BookOpen, X, Sparkles, ArrowRight } from "lucide-react";

interface NoteModalProps {
  taskName: string;
  domain: string;
  user: "ashritha" | "harshith";
  onSave: (note: string) => void;
  onSkip: () => void;
}

const DOMAIN_LABELS: Record<string, string> = {
  ml: "Machine Learning",
  project: "Project",
  tools: "AI Tools",
  dsa: "DSA",
  cloud: "Cloud",
};

const PROMPTS = [
  "What did you learn from this?",
  "Any key insight worth remembering?",
  "What would you do differently next time?",
  "Summarize what you just accomplished.",
  "Any concept that surprised you?",
];

export default function NoteModal({ taskName, domain, user, onSave, onSkip }: NoteModalProps) {
  const [note, setNote] = React.useState("");
  const prompt = React.useMemo(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)], []);

  const primaryColor = user === "ashritha" ? "#FF1493" : "#EF4444";
  const secondaryColor = user === "ashritha" ? "#22D3EE" : "#DC2626";

  const handleSave = () => {
    if (note.trim()) onSave(note.trim());
    else onSkip();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[300] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(10px)" }}
        onClick={onSkip}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ type: "spring", stiffness: 300, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md relative"
        >
          {/* Card */}
          <div
            className="rounded-[28px] overflow-hidden"
            style={{
              background: "rgba(10, 12, 22, 0.97)",
              border: `1px solid ${primaryColor}30`,
              boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${primaryColor}15`,
            }}
          >
            {/* Top accent bar */}
            <div
              className="h-0.5 w-full"
              style={{ background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor}, ${primaryColor})` }}
            />

            <div className="p-7">
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${primaryColor}15`, border: `1px solid ${primaryColor}30` }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color: primaryColor }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
                      {DOMAIN_LABELS[domain] || domain} · Task Complete
                    </p>
                    <p className="text-sm font-black text-white leading-tight mt-0.5 line-clamp-1">{taskName}</p>
                  </div>
                </div>
                <button
                  onClick={onSkip}
                  className="text-white/25 hover:text-white/60 transition-colors mt-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Prompt */}
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-2xl mb-4"
                style={{ background: `${primaryColor}08`, border: `1px solid ${primaryColor}18` }}
              >
                <Sparkles className="w-3.5 h-3.5 flex-shrink-0" style={{ color: primaryColor }} />
                <p className="text-xs font-semibold italic" style={{ color: `${primaryColor}cc` }}>
                  "{prompt}"
                </p>
              </div>

              {/* Textarea */}
              <textarea
                autoFocus
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Write your thoughts, insights, or what you learned... (optional)"
                rows={4}
                className="w-full rounded-2xl px-4 py-3.5 text-sm text-white placeholder-slate-600 outline-none resize-none transition-all font-sans leading-relaxed"
                style={{
                  background: "rgba(0,0,0,0.4)",
                  border: `1px solid rgba(255,255,255,0.07)`,
                  caretColor: primaryColor,
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) handleSave();
                  if (e.key === "Escape") onSkip();
                }}
              />
              <p className="text-[10px] text-white/20 mt-1.5 ml-1">Ctrl+Enter to save · Esc to skip</p>

              {/* Buttons */}
              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={onSkip}
                  className="px-5 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  Skip
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white cursor-pointer transition-all"
                  style={{
                    background: note.trim()
                      ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                      : "rgba(255,255,255,0.06)",
                    color: note.trim() ? "#fff" : "rgba(255,255,255,0.3)",
                    boxShadow: note.trim() ? `0 6px 20px ${primaryColor}35` : "none",
                    border: note.trim() ? "none" : "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  {note.trim() ? (
                    <>Save to Journal <ArrowRight className="w-4 h-4" /></>
                  ) : (
                    "Skip & Complete"
                  )}
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
