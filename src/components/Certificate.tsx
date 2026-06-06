import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Download, Share2, Award, Flame, Star, Trophy, Zap, Lock } from "lucide-react";
import html2canvas from "html2canvas";

interface CertificateProps {
  user: "ashritha" | "harshith";
  /** The milestone days to DISPLAY (7 / 14 / 21 / 30) */
  milestoneDays: number;
  /** Current real streak – used for the streak counter on the cert */
  currentStreak: number;
  /** If false, Download & Share are locked */
  isEarned: boolean;
  onClose: () => void;
}

interface MilestoneConfig {
  days: number;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  tier: string;
  tierColor: string;
}

const MILESTONES: MilestoneConfig[] = [
  {
    days: 7,
    label: "Week Warrior",
    sublabel: "7 Days of Unstoppable Focus",
    icon: <Flame className="w-10 h-10" />,
    tier: "Bronze",
    tierColor: "#CD7F32",
  },
  {
    days: 14,
    label: "Fortnight Champion",
    sublabel: "14 Days of Relentless Dedication",
    icon: <Zap className="w-10 h-10" />,
    tier: "Silver",
    tierColor: "#C0C0C0",
  },
  {
    days: 21,
    label: "Three-Week Legend",
    sublabel: "21 Days of Legendary Consistency",
    icon: <Star className="w-10 h-10" />,
    tier: "Gold",
    tierColor: "#FFD700",
  },
  {
    days: 30,
    label: "Month Master",
    sublabel: "30 Days of Elite Mastery",
    icon: <Trophy className="w-10 h-10" />,
    tier: "Platinum",
    tierColor: "#E5E4E2",
  },
];

const USER_PROFILES = {
  ashritha: {
    fullName: "Ashritha Tanavarapu",
    avatar: "https://i.pinimg.com/736x/40/14/ba/4014ba3d3a6ecb4b56f7488cd781b4f4.jpg",
    primaryColor: "#FF1493",
    secondaryColor: "#22D3EE",
    bgGradient: "linear-gradient(135deg, #0d0020 0%, #1a0035 30%, #001a2e 70%, #000d1a 100%)",
    glowColor: "rgba(255, 20, 147, 0.4)",
    glowColor2: "rgba(34, 211, 238, 0.3)",
    borderGradient: "linear-gradient(135deg, #FF1493, #22D3EE, #FF1493)",
    theme: "Spider-Gwen Edition",
  },
  harshith: {
    fullName: "Harshith Sai Vanakara",
    avatar: "https://i.pinimg.com/1200x/6a/af/47/6aaf47796dea920c7d50b0ae83b9fa4a.jpg",
    primaryColor: "#EF4444",
    secondaryColor: "#DC2626",
    bgGradient: "linear-gradient(135deg, #0a0000 0%, #1a0000 30%, #0d0000 70%, #050000 100%)",
    glowColor: "rgba(239, 68, 68, 0.5)",
    glowColor2: "rgba(220, 38, 38, 0.3)",
    borderGradient: "linear-gradient(135deg, #EF4444, #991B1B, #EF4444)",
    theme: "Miles Morales Edition",
  },
};

export function getEarnedMilestones(streak: number): number[] {
  return MILESTONES.filter((m) => streak >= m.days).map((m) => m.days);
}

export default function Certificate({
  user,
  milestoneDays,
  currentStreak,
  isEarned,
  onClose,
}: CertificateProps) {
  const profile = USER_PROFILES[user];
  const milestone = MILESTONES.find((m) => m.days === milestoneDays);
  const certRef = React.useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = React.useState(false);
  const [showLockHint, setShowLockHint] = React.useState(false);

  if (!milestone) return null;

  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const daysLeft = milestone.days - currentStreak;

  const handleDownload = async () => {
    if (!isEarned || !certRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 3,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });
      const link = document.createElement("a");
      link.download = `${user}-${milestone.days}day-streak-certificate.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (e) {
      console.error("Download failed", e);
    }
    setDownloading(false);
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.88)", backdropFilter: "blur(14px)" }}
        onClick={onClose}
      >
        {/* Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:scale-110 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* ── THE CERTIFICATE ── */}
          <div
            ref={certRef}
            className="relative overflow-hidden rounded-[24px]"
            style={{
              background: profile.bgGradient,
              filter: isEarned ? "none" : "grayscale(0.35) brightness(0.82)",
            }}
          >
            {/* Unearned frosted lock overlay */}
            {!isEarned && (
              <div
                className="absolute inset-0 z-20 flex flex-col items-center justify-center rounded-[24px] pointer-events-none"
                style={{ background: "rgba(0,0,0,0.38)", backdropFilter: "blur(1.5px)" }}
              >
                <div
                  className="flex flex-col items-center gap-3 px-8 py-6 rounded-2xl"
                  style={{
                    background: "rgba(10,10,20,0.72)",
                    border: `1px solid ${profile.primaryColor}30`,
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <Lock className="w-8 h-8 text-white/40" />
                  <p className="text-sm font-black text-white/70 text-center">
                    {daysLeft > 0
                      ? `${daysLeft} more day${daysLeft > 1 ? "s" : ""} to unlock`
                      : "Keep going — almost there!"}
                  </p>
                  <p className="text-[10px] text-white/30 text-center uppercase tracking-widest">
                    Complete a {milestone.days}-day streak to earn this
                  </p>
                </div>
              </div>
            )}

            {/* Animated background orbs */}
            <div className="absolute inset-0 pointer-events-none">
              <div
                className="absolute -top-20 -left-20 w-80 h-80 rounded-full opacity-30 blur-[80px]"
                style={{ background: profile.glowColor }}
              />
              <div
                className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-30 blur-[80px]"
                style={{ background: profile.glowColor2 }}
              />
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-10 blur-[100px]"
                style={{ background: profile.primaryColor }}
              />
              {/* Grid */}
              <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="cert-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cert-grid)" />
              </svg>
              {/* Diagonal shimmer */}
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute opacity-[0.03]"
                  style={{
                    top: `${i * 18}%`,
                    left: "-10%",
                    width: "120%",
                    height: "1px",
                    background: `linear-gradient(90deg, transparent, ${profile.primaryColor}, transparent)`,
                    transform: "rotate(-8deg)",
                  }}
                />
              ))}
            </div>

            {/* Outer glowing border */}
            <div
              className="absolute inset-0 rounded-[24px] pointer-events-none"
              style={{
                padding: "1.5px",
                background: profile.borderGradient,
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
            />

            {/* Certificate content */}
            <div className="relative z-10 p-10">
              {/* Header band */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: `${profile.primaryColor}22`, border: `1px solid ${profile.primaryColor}44` }}
                  >
                    <Award className="w-5 h-5" style={{ color: profile.primaryColor }} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">Certificate of Achievement</p>
                    <p className="text-xs font-semibold" style={{ color: profile.primaryColor }}>
                      {profile.theme}
                    </p>
                  </div>
                </div>
                <div
                  className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest"
                  style={{
                    background: `${milestone.tierColor}15`,
                    border: `1px solid ${milestone.tierColor}50`,
                    color: milestone.tierColor,
                    textShadow: `0 0 10px ${milestone.tierColor}`,
                  }}
                >
                  {milestone.tier}
                </div>
              </div>

              {/* Main content */}
              <div className="text-center mb-8">
                <div className="relative inline-flex mb-6">
                  <div
                    className="w-24 h-24 rounded-full flex items-center justify-center relative"
                    style={{
                      background: `radial-gradient(circle, ${profile.primaryColor}30 0%, ${profile.primaryColor}08 100%)`,
                      border: `2px solid ${profile.primaryColor}40`,
                      boxShadow: isEarned
                        ? `0 0 40px ${profile.primaryColor}40, 0 0 80px ${profile.primaryColor}20`
                        : "none",
                    }}
                  >
                    <span style={{ color: profile.primaryColor }}>{milestone.icon}</span>
                  </div>
                  <div
                    className="absolute inset-[-6px] rounded-full opacity-60"
                    style={{ border: `1px dashed ${profile.secondaryColor}60` }}
                  />
                  <div
                    className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                    style={{
                      background: `linear-gradient(135deg, ${profile.primaryColor}, ${profile.secondaryColor})`,
                      boxShadow: isEarned ? `0 4px 15px ${profile.primaryColor}60` : "none",
                      color: "#fff",
                    }}
                  >
                    {milestone.days}
                  </div>
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40 mb-3">
                  This Certificate is Proudly Presented to
                </p>

                <div className="flex items-center justify-center gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0"
                    style={{
                      border: `2px solid ${profile.primaryColor}60`,
                      boxShadow: isEarned ? `0 0 20px ${profile.primaryColor}40` : "none",
                    }}
                  >
                    <img src={profile.avatar} alt={profile.fullName} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <h1
                      className="text-3xl font-black leading-tight"
                      style={{
                        background: `linear-gradient(135deg, #fff 0%, ${profile.primaryColor} 50%, ${profile.secondaryColor} 100%)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        fontFamily: "'Playfair Display', serif",
                        textShadow: "none",
                      }}
                    >
                      {profile.fullName}
                    </h1>
                    <p className="text-xs text-white/40 font-medium mt-0.5">@{user}22</p>
                  </div>
                </div>

                <div
                  className="inline-block px-8 py-3 rounded-2xl mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${profile.primaryColor}15, ${profile.secondaryColor}10)`,
                    border: `1px solid ${profile.primaryColor}30`,
                  }}
                >
                  <h2
                    className="text-2xl font-black uppercase tracking-wide"
                    style={{ color: profile.primaryColor, textShadow: isEarned ? `0 0 20px ${profile.primaryColor}60` : "none" }}
                  >
                    {milestone.label}
                  </h2>
                </div>

                <p className="text-sm text-white/50 font-medium">{milestone.sublabel}</p>
              </div>

              {/* Divider */}
              <div
                className="h-px w-full mb-6 opacity-30"
                style={{
                  background: `linear-gradient(90deg, transparent, ${profile.primaryColor}, ${profile.secondaryColor}, ${profile.primaryColor}, transparent)`,
                }}
              />

              {/* Footer row */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">Date Earned</p>
                  <p className="text-xs font-semibold text-white/60">
                    {isEarned ? dateStr : "Not yet earned"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">Streak</p>
                  <div className="flex items-center gap-1.5">
                    <Flame className="w-4 h-4" style={{ color: profile.primaryColor }} />
                    <span className="text-xl font-black" style={{ color: profile.primaryColor }}>
                      {isEarned ? milestone.days : currentStreak}
                    </span>
                    <span className="text-xs text-white/40 font-medium">days</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">Platform</p>
                  <p className="text-xs font-semibold text-white/60">Task Chronicle</p>
                </div>
              </div>

              <p className="text-center text-[9px] text-white/15 mt-5 uppercase tracking-[0.3em]">
                Verified Achievement · Task Chronicle · Spider-Verse Edition
              </p>
            </div>
          </div>

          {/* ── Action buttons ── */}
          <div className="flex items-center gap-3 mt-4" onMouseLeave={() => setShowLockHint(false)}>
            {/* Download */}
            <div className="relative flex-1" onMouseEnter={() => !isEarned && setShowLockHint(true)}>
              <motion.button
                whileHover={isEarned ? { scale: 1.03 } : {}}
                whileTap={isEarned ? { scale: 0.97 } : {}}
                onClick={handleDownload}
                disabled={!isEarned || downloading}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all"
                style={{
                  background: isEarned
                    ? `linear-gradient(135deg, ${profile.primaryColor}, ${profile.secondaryColor})`
                    : "rgba(255,255,255,0.05)",
                  boxShadow: isEarned ? `0 8px 25px ${profile.primaryColor}40` : "none",
                  color: isEarned ? "#fff" : "rgba(255,255,255,0.25)",
                  cursor: isEarned ? "pointer" : "not-allowed",
                  border: isEarned ? "none" : "1px solid rgba(255,255,255,0.08)",
                  opacity: downloading ? 0.7 : 1,
                }}
              >
                {isEarned ? (
                  <Download className="w-4 h-4" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                {downloading ? "Generating..." : isEarned ? "Download Certificate" : "Download Locked"}
              </motion.button>
            </div>

            {/* Share */}
            <div className="relative" onMouseEnter={() => !isEarned && setShowLockHint(true)}>
              <motion.button
                whileHover={isEarned ? { scale: 1.03 } : {}}
                whileTap={isEarned ? { scale: 0.97 } : {}}
                onClick={isEarned ? handleDownload : undefined}
                disabled={!isEarned}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: isEarned ? `1px solid ${profile.primaryColor}30` : "1px solid rgba(255,255,255,0.06)",
                  color: isEarned ? profile.primaryColor : "rgba(255,255,255,0.2)",
                  cursor: isEarned ? "pointer" : "not-allowed",
                }}
              >
                {isEarned ? <Share2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                Share
              </motion.button>
            </div>
          </div>

          {/* Lock hint */}
          <AnimatePresence>
            {showLockHint && !isEarned && (
              <motion.p
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-center text-xs font-semibold mt-2"
                style={{ color: profile.primaryColor }}
              >
                🔒 Complete a {milestone.days}-day streak to unlock download & share
              </motion.p>
            )}
          </AnimatePresence>

          {isEarned && (
            <p className="text-center text-xs text-white/25 mt-2">
              Download and share on LinkedIn, Instagram, or Twitter 🕷️
            </p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Milestone Toast Notification ─────────────────────────────────────────────
interface MilestoneToastProps {
  user: "ashritha" | "harshith";
  days: number;
  onView: () => void;
  onDismiss: () => void;
}

export function MilestoneToast({ user, days, onView, onDismiss }: MilestoneToastProps) {
  const profile = USER_PROFILES[user];
  const milestone = MILESTONES.find((m) => m.days === days);
  if (!milestone) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="fixed bottom-6 right-6 z-[150] max-w-sm w-full rounded-2xl overflow-hidden"
      style={{
        background: "rgba(10, 10, 20, 0.95)",
        border: `1px solid ${profile.primaryColor}40`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.6), 0 0 30px ${profile.primaryColor}20`,
        backdropFilter: "blur(20px)",
      }}
    >
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${profile.primaryColor}, ${profile.secondaryColor})` }} />
      <div className="p-5 flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: `${profile.primaryColor}18`,
            border: `1px solid ${profile.primaryColor}35`,
            boxShadow: `0 0 20px ${profile.primaryColor}25`,
            color: profile.primaryColor,
          }}
        >
          {milestone.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: profile.primaryColor }}>
            🎉 Milestone Unlocked!
          </p>
          <p className="text-sm font-black text-white truncate">{milestone.label}</p>
          <p className="text-xs text-white/40">{milestone.days} day streak · Your certificate is ready</p>
        </div>
        <button onClick={onDismiss} className="text-white/30 hover:text-white/60 transition-colors flex-shrink-0">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="px-5 pb-4 flex gap-2">
        <button
          onClick={onView}
          className="flex-1 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer"
          style={{ background: `linear-gradient(135deg, ${profile.primaryColor}, ${profile.secondaryColor})` }}
        >
          View & Download Certificate
        </button>
        <button
          onClick={onDismiss}
          className="px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)" }}
        >
          Later
        </button>
      </div>
    </motion.div>
  );
}
