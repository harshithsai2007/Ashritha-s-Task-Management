/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, ArrowLeft, User, Shield } from "lucide-react";

interface LoginProps {
  onLogin: (user: "ashritha" | "harshith") => void;
}

const CREDENTIALS: Record<string, { password: string; user: "ashritha" | "harshith" }> = {
  ashritha22: { password: "22may2007", user: "ashritha" },
  harshith22: { password: "22may2007", user: "harshith" },
};

export default function Login({ onLogin }: LoginProps) {
  const [selectedProfile, setSelectedProfile] = React.useState<string | null>(null);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isShaking, setIsShaking] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;

    const cred = CREDENTIALS[selectedProfile];
    if (cred && password === cred.password) {
      onLogin(cred.user);
    } else {
      setError("Incorrect password");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setError(""), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/5 rounded-full blur-3xl" />
      </div>

      <AnimatePresence mode="wait">
        {!selectedProfile ? (
          /* Profile Selection Screen */
          <motion.div
            key="profiles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 text-center"
          >
            {/* Header */}
            <div className="mb-10">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-indigo-600/15 border border-indigo-500/20 flex items-center justify-center">
                <Shield className="h-7 w-7 text-indigo-400" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight mb-2">
                Welcome Back
              </h1>
              <p className="text-sm text-slate-400">
                Choose your profile to continue
              </p>
            </div>

            {/* Profile Cards */}
            <div className="flex gap-6">
              {/* Ashritha Profile Card */}
              <motion.button
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProfile("ashritha22")}
                className="group w-52 p-6 rounded-3xl bg-[#111827] border border-white/5 hover:border-indigo-500/30 transition-all duration-300 cursor-pointer text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                  <span className="text-2xl font-black text-white select-none">A</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">ashritha22</h3>
                <p className="text-[11px] text-slate-400 font-medium">AI Engineer</p>
                <div className="mt-4 py-1.5 px-4 rounded-full bg-indigo-600/10 border border-indigo-500/15 text-indigo-400 text-[10px] font-bold uppercase tracking-widest">
                  Select
                </div>
              </motion.button>

              {/* Harshith Profile Card */}
              <motion.button
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProfile("harshith22")}
                className="group w-52 p-6 rounded-3xl bg-[#111827] border border-white/5 hover:border-cyan-500/30 transition-all duration-300 cursor-pointer text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-shadow">
                  <span className="text-2xl font-black text-white select-none">H</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">harshith22</h3>
                <p className="text-[11px] text-slate-400 font-medium">System Architect</p>
                <div className="mt-4 py-1.5 px-4 rounded-full bg-cyan-600/10 border border-cyan-500/15 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
                  Select
                </div>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* Password Entry Screen */
          <motion.div
            key="password"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm"
          >
            <form onSubmit={handleSubmit} className="text-center">
              {/* Back button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedProfile(null);
                  setPassword("");
                  setError("");
                }}
                className="absolute -top-12 left-0 flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to profiles
              </button>

              {/* Avatar */}
              <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center shadow-lg ${
                selectedProfile === "ashritha22"
                  ? "bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500 shadow-purple-500/20"
                  : "bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-500 shadow-cyan-500/20"
              }`}>
                <span className="text-2xl font-black text-white select-none">
                  {selectedProfile === "ashritha22" ? "A" : "H"}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white mb-1">{selectedProfile}</h2>
              <p className="text-xs text-slate-400 mb-8">Enter your password to continue</p>

              {/* Password input */}
              <motion.div
                animate={isShaking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="relative mb-4">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Password"
                    autoFocus
                    className="w-full py-3.5 pl-11 pr-4 rounded-2xl bg-[#111827] border border-white/10 text-white text-sm placeholder-slate-500 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                    id="login-password-input"
                  />
                </div>
              </motion.div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-red-400 text-xs mb-4 font-medium"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold tracking-wide transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 cursor-pointer"
                id="login-submit-button"
              >
                Sign In
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
